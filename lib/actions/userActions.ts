'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import connectDB from '../db';
import type { IUser } from '../models/User';
import { auth } from '@/lib/auth';

export interface ActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
  role: 'admin' | 'applicant' = 'applicant'
): Promise<ActionResult> {
  try {
    const { db } = await connectDB();

    const existingUser = await db.collection('users').findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return { success: false, error: 'User with this email already exists' };
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const now = new Date();

    const result = await db.collection('users').insertOne({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      bookmarks: [],
      createdAt: now,
      updatedAt: now,
    });

    return {
      success: true,
      data: {
        id: result.insertedId.toString(),
        name,
        email: email.toLowerCase(),
        role,
      },
    };
  } catch (error: any) {
    console.error('Register error:', error);
    return { success: false, error: error.message || 'Failed to register user' };
  }
}

export async function getCurrentUser(): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { db } = await connectDB();
    const user = await db.collection('users').findOne(
      { _id: new ObjectId((session.user as any).id) },
      { projection: { password: 0 } }
    );

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    return {
      success: true,
      data: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error: any) {
    console.error('Get current user error:', error);
    return { success: false, error: error.message || 'Failed to get user' };
  }
}

export async function updateUserProfile(
  name: string,
  email?: string
): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { db } = await connectDB();

    const updateData: any = { name, updatedAt: new Date() };
    if (email && email !== session.user.email) {
      const existingUser = await db.collection('users').findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return { success: false, error: 'Email already in use' };
      }
      updateData.email = email.toLowerCase();
    }

    const result = await db.collection('users').findOneAndUpdate(
      { _id: new ObjectId((session.user as any).id) },
      { $set: updateData },
      { returnDocument: 'after', projection: { password: 0 } }
    );

    if (!result) {
      return { success: false, error: 'User not found' };
    }

    revalidatePath('/dashboard');
    return {
      success: true,
      data: {
        id: result._id.toString(),
        name: result.name,
        email: result.email,
        role: result.role,
      },
    };
  } catch (error: any) {
    console.error('Update profile error:', error);
    return { success: false, error: error.message || 'Failed to update profile' };
  }
}

