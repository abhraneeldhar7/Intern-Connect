'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import connectDB from '../db';
import User from '../models/User';
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
    await connectDB();

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return { success: false, error: 'User with this email already exists' };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
    });

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

    await connectDB();
    const user = await User.findById((session.user as any).id).select('-password');

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

    await connectDB();

    const updateData: any = { name };
    if (email && email !== session.user.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return { success: false, error: 'Email already in use' };
      }
      updateData.email = email.toLowerCase();
    }

    const user = await User.findByIdAndUpdate(
      (session.user as any).id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    revalidatePath('/dashboard');
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
    console.error('Update profile error:', error);
    return { success: false, error: error.message || 'Failed to update profile' };
  }
}

