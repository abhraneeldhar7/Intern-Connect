'use server';

import { revalidatePath } from 'next/cache';
import connectDB from '../db';
import Application from '../models/Application';
import Internship from '../models/Internship';
import { auth } from '@/lib/auth';
import { ActionResult } from './userActions';

export async function submitApplication(
  internshipId: string,
  resumeUrl: string
): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: 'Not authenticated' };
    }

    const userRole = (session.user as any).role;
    if (userRole !== 'applicant') {
      return { success: false, error: 'Only applicants can submit applications' };
    }

    await connectDB();

    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return { success: false, error: 'Internship not found' };
    }

    const existingApplication = await Application.findOne({
      internshipId,
      userId: (session.user as any).id,
    });

    if (existingApplication) {
      return { success: false, error: 'You have already applied for this internship' };
    }

    const application = await Application.create({
      internshipId,
      userId: (session.user as any).id,
      resumeUrl,
      status: 'pending',
    });

    revalidatePath('/dashboard/applicant');
    revalidatePath(`/internships/${internshipId}`);

    return {
      success: true,
      data: {
        id: application._id.toString(),
        ...application.toObject(),
      },
    };
  } catch (error: any) {
    console.error('Submit application error:', error);
    if (error.code === 11000) {
      return { success: false, error: 'You have already applied for this internship' };
    }
    return { success: false, error: error.message || 'Failed to submit application' };
  }
}

export async function withdrawApplication(id: string): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: 'Not authenticated' };
    }

    await connectDB();

    const application = await Application.findById(id);
    if (!application) {
      return { success: false, error: 'Application not found' };
    }

    if (application.userId.toString() !== (session.user as any).id) {
      return { success: false, error: 'Unauthorized' };
    }

    if (application.status !== 'pending') {
      return { success: false, error: 'Cannot withdraw a processed application' };
    }

    await Application.findByIdAndDelete(id);

    revalidatePath('/dashboard/applicant');

    return { success: true };
  } catch (error: any) {
    console.error('Withdraw application error:', error);
    return { success: false, error: error.message || 'Failed to withdraw application' };
  }
}

export async function getMyApplications(): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: 'Not authenticated' };
    }

    await connectDB();

    const applications = await Application.find({
      userId: (session.user as any).id,
    })
      .populate('internshipId')
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      data: applications.map((app) => ({
        id: app._id.toString(),
        ...app,
        _id: undefined,
        __v: undefined,
      })),
    };
  } catch (error: any) {
    console.error('Get my applications error:', error);
    return { success: false, error: error.message || 'Failed to fetch applications' };
  }
}

export async function adminGetAllApplications(): Promise<ActionResult> {
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

    const applications = await Application.find({})
      .populate('internshipId')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      data: applications.map((app) => ({
        id: app._id.toString(),
        ...app,
        _id: undefined,
        __v: undefined,
      })),
    };
  } catch (error: any) {
    console.error('Admin get all applications error:', error);
    return { success: false, error: error.message || 'Failed to fetch applications' };
  }
}

export async function updateApplicationStatus(
  id: string,
  status: 'pending' | 'accepted' | 'rejected'
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

    const application = await Application.findById(id).populate('internshipId');
    if (!application) {
      return { success: false, error: 'Application not found' };
    }

    const internship = application.internshipId as any;
    if (internship.createdBy.toString() !== (session.user as any).id) {
      return {
        success: false,
        error: 'Unauthorized. You can only update applications for your own internships.',
      };
    }

    const updated = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('internshipId')
      .populate('userId', 'name email')
      .lean();

    revalidatePath('/dashboard/admin');

    return {
      success: true,
      data: {
        id: updated!._id.toString(),
        ...updated!,
        _id: undefined,
        __v: undefined,
      },
    };
  } catch (error: any) {
    console.error('Update application status error:', error);
    return { success: false, error: error.message || 'Failed to update application status' };
  }
}

