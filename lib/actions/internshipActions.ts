'use server';

import { revalidatePath } from 'next/cache';
import connectDB from '../db';
import Internship from '../models/Internship';
import Application from '../models/Application';
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

    await connectDB();

    const internship = await Internship.create({
      ...data,
      createdBy: (session.user as any).id,
    });

    revalidatePath('/dashboard/admin');
    revalidatePath('/internships');

    return {
      success: true,
      data: {
        id: internship._id.toString(),
        ...internship.toObject(),
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

    await connectDB();

    const internship = await Internship.findById(id);
    if (!internship) {
      return { success: false, error: 'Internship not found' };
    }

    if (internship.createdBy.toString() !== (session.user as any).id) {
      return { success: false, error: 'Unauthorized. You can only edit your own internships.' };
    }

    const updated = await Internship.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    revalidatePath('/dashboard/admin');
    revalidatePath(`/internships/${id}`);

    return {
      success: true,
      data: {
        id: updated!._id.toString(),
        ...updated!.toObject(),
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

    await connectDB();

    const internship = await Internship.findById(id);
    if (!internship) {
      return { success: false, error: 'Internship not found' };
    }

    if (internship.createdBy.toString() !== (session.user as any).id) {
      return { success: false, error: 'Unauthorized. You can only delete your own internships.' };
    }

    await Application.deleteMany({ internshipId: id });
    await Internship.findByIdAndDelete(id);

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
    await connectDB();

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

    const internships = await Internship.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      data: internships.map((internship) => ({
        id: internship._id.toString(),
        ...internship,
        _id: undefined,
        __v: undefined,
      })),
    };
  } catch (error: any) {
    console.error('Get all internships error:', error);
    return { success: false, error: error.message || 'Failed to fetch internships' };
  }
}

export async function getInternshipById(id: string): Promise<ActionResult> {
  try {
    await connectDB();

    const internship = await Internship.findById(id)
      .populate('createdBy', 'name email')
      .lean();

    if (!internship) {
      return { success: false, error: 'Internship not found' };
    }

    return {
      success: true,
      data: {
        id: internship._id.toString(),
        ...internship,
        _id: undefined,
        __v: undefined,
      },
    };
  } catch (error: any) {
    console.error('Get internship by id error:', error);
    return { success: false, error: error.message || 'Failed to fetch internship' };
  }
}

