'use server';

import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';
import connectDB from '../db';
import type { IInternship } from '../models/Internship';
import { auth } from '@/lib/auth';
import { ActionResult } from './userActions';

export interface InternshipInput {
  title: string;
  description: string;
  company: string;
  stipend: number;
  location: string;
  type: 'remote' | 'onsite' | 'hybrid';
  openings: number;
  skills: string[];
}

export async function createInternship(data: InternshipInput): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: 'Not authenticated' };
    }

    const userRole = (session.user as any).role;
    if (userRole !== 'admin') {
      return { success: false, error: 'Unauthorized. Admin access required.' };
    }

    const { db } = await connectDB();
    const now = new Date();

    const result = await db.collection('internships').insertOne({
      ...data,
      createdBy: new ObjectId((session.user as any).id),
      createdAt: now,
      updatedAt: now,
    });

    const internship = await db.collection('internships').findOne({ _id: result.insertedId });

    revalidatePath('/dashboard/admin');
    revalidatePath('/internships');

    return {
      success: true,
      data: {
        id: internship!._id.toString(),
        ...internship,
        _id: undefined,
      },
    };
  } catch (error: any) {
    console.error('Create internship error:', error);
    return { success: false, error: error.message || 'Failed to create internship' };
  }
}

export async function updateInternship(
  id: string,
  data: Partial<InternshipInput>
): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: 'Not authenticated' };
    }

    const userRole = (session.user as any).role;
    if (userRole !== 'admin') {
      return { success: false, error: 'Unauthorized. Admin access required.' };
    }

    const { db } = await connectDB();

    const internship = await db.collection('internships').findOne({ _id: new ObjectId(id) });
    if (!internship) {
      return { success: false, error: 'Internship not found' };
    }

    if (internship.createdBy.toString() !== (session.user as any).id) {
      return { success: false, error: 'Unauthorized. You can only edit your own internships.' };
    }

    const updated = await db.collection('internships').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    revalidatePath('/dashboard/admin');
    revalidatePath(`/internships/${id}`);

    return {
      success: true,
      data: {
        id: updated!._id.toString(),
        ...updated!,
        _id: undefined,
      },
    };
  } catch (error: any) {
    console.error('Update internship error:', error);
    return { success: false, error: error.message || 'Failed to update internship' };
  }
}

export async function deleteInternship(id: string): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: 'Not authenticated' };
    }

    const userRole = (session.user as any).role;
    if (userRole !== 'admin') {
      return { success: false, error: 'Unauthorized. Admin access required.' };
    }

    const { db } = await connectDB();

    const internship = await db.collection('internships').findOne({ _id: new ObjectId(id) });
    if (!internship) {
      return { success: false, error: 'Internship not found' };
    }

    if (internship.createdBy.toString() !== (session.user as any).id) {
      return { success: false, error: 'Unauthorized. You can only delete your own internships.' };
    }

    await db.collection('applications').deleteMany({ internshipId: new ObjectId(id) });
    await db.collection('internships').deleteOne({ _id: new ObjectId(id) });

    revalidatePath('/dashboard/admin');
    revalidatePath('/internships');

    return { success: true };
  } catch (error: any) {
    console.error('Delete internship error:', error);
    return { success: false, error: error.message || 'Failed to delete internship' };
  }
}

export async function getAllInternships(filters?: {
  search?: string;
  location?: string;
  type?: string;
  minStipend?: number;
  skills?: string[];
}): Promise<ActionResult> {
  try {
    const { db } = await connectDB();

    let query: any = {};

    if (filters?.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
        { company: { $regex: filters.search, $options: 'i' } },
      ];
    }

    if (filters?.location) {
      query.location = { $regex: filters.location, $options: 'i' };
    }

    if (filters?.type) {
      query.type = filters.type;
    }

    if (filters?.minStipend) {
      query.stipend = { $gte: filters.minStipend };
    }

    if (filters?.skills && filters.skills.length > 0) {
      query.skills = { $in: filters.skills };
    }

    const internships = await db.collection('internships')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    // Populate createdBy field
    const internshipsWithUsers = await Promise.all(
      internships.map(async (internship) => {
        const user = await db.collection('users').findOne(
          { _id: internship.createdBy },
          { projection: { name: 1, email: 1 } }
        );
        return {
          id: internship._id.toString(),
          ...internship,
          createdBy: user ? {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
          } : internship.createdBy,
          _id: undefined,
        };
      })
    );

    return {
      success: true,
      data: internshipsWithUsers,
    };
  } catch (error: any) {
    console.error('Get all internships error:', error);
    return { success: false, error: error.message || 'Failed to fetch internships' };
  }
}

export async function getInternshipById(id: string): Promise<ActionResult> {
  try {
    const { db } = await connectDB();

    const internship = await db.collection('internships').findOne({ _id: new ObjectId(id) });

    if (!internship) {
      return { success: false, error: 'Internship not found' };
    }

    // Populate createdBy field
    const user = await db.collection('users').findOne(
      { _id: internship.createdBy },
      { projection: { name: 1, email: 1 } }
    );

    return {
      success: true,
      data: {
        id: internship._id.toString(),
        ...internship,
        createdBy: user ? {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
        } : internship.createdBy,
        _id: undefined,
      },
    };
  } catch (error: any) {
    console.error('Get internship by id error:', error);
    return { success: false, error: error.message || 'Failed to fetch internship' };
  }
}

