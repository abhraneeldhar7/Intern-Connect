'use server';

import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';
import connectDB from '../db';
import type { IApplication } from '../models/Application';
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

    const { db } = await connectDB();

    const internship = await db.collection('internships').findOne({ _id: new ObjectId(internshipId) });
    if (!internship) {
      return { success: false, error: 'Internship not found' };
    }

    const existingApplication = await db.collection('applications').findOne({
      internshipId: new ObjectId(internshipId),
      userId: new ObjectId((session.user as any).id),
    });

    if (existingApplication) {
      return { success: false, error: 'You have already applied for this internship' };
    }

    const now = new Date();
    const result = await db.collection('applications').insertOne({
      internshipId: new ObjectId(internshipId),
      userId: new ObjectId((session.user as any).id),
      resumeUrl,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    });

    const application = await db.collection('applications').findOne({ _id: result.insertedId });

    revalidatePath('/dashboard/applicant');
    revalidatePath(`/internships/${internshipId}`);

    return {
      success: true,
      data: {
        id: application!._id.toString(),
        ...application!,
        _id: undefined,
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

    const { db } = await connectDB();

    const application = await db.collection('applications').findOne({ _id: new ObjectId(id) });
    if (!application) {
      return { success: false, error: 'Application not found' };
    }

    if (application.userId.toString() !== (session.user as any).id) {
      return { success: false, error: 'Unauthorized' };
    }

    if (application.status !== 'pending') {
      return { success: false, error: 'Cannot withdraw a processed application' };
    }

    await db.collection('applications').deleteOne({ _id: new ObjectId(id) });

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

    const { db } = await connectDB();

    const applications = await db.collection('applications')
      .find({ userId: new ObjectId((session.user as any).id) })
      .sort({ createdAt: -1 })
      .toArray();

    // Populate internshipId field
    const applicationsWithInternships = await Promise.all(
      applications.map(async (app) => {
        const internship = await db.collection('internships').findOne({ _id: app.internshipId });
        return {
          id: app._id.toString(),
          ...app,
          internshipId: internship || app.internshipId,
          _id: undefined,
        };
      })
    );

    return {
      success: true,
      data: applicationsWithInternships,
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

    const { db } = await connectDB();

    const applications = await db.collection('applications')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Populate internshipId and userId fields
    const applicationsWithPopulated = await Promise.all(
      applications.map(async (app) => {
        const internship = await db.collection('internships').findOne({ _id: app.internshipId });
        const user = await db.collection('users').findOne(
          { _id: app.userId },
          { projection: { name: 1, email: 1 } }
        );
        return {
          id: app._id.toString(),
          ...app,
          internshipId: internship || app.internshipId,
          userId: user ? {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
          } : app.userId,
          _id: undefined,
        };
      })
    );

    return {
      success: true,
      data: applicationsWithPopulated,
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

    const { db } = await connectDB();

    const application = await db.collection('applications').findOne({ _id: new ObjectId(id) });
    if (!application) {
      return { success: false, error: 'Application not found' };
    }

    const internship = await db.collection('internships').findOne({ _id: application.internshipId });
    if (!internship) {
      return { success: false, error: 'Internship not found' };
    }

    if (internship.createdBy.toString() !== (session.user as any).id) {
      return {
        success: false,
        error: 'Unauthorized. You can only update applications for your own internships.',
      };
    }

    const updated = await db.collection('applications').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    // Populate internshipId and userId
    const populatedInternship = await db.collection('internships').findOne({ _id: updated!.internshipId });
    const populatedUser = await db.collection('users').findOne(
      { _id: updated!.userId },
      { projection: { name: 1, email: 1 } }
    );

    revalidatePath('/dashboard/admin');

    return {
      success: true,
      data: {
        id: updated!._id.toString(),
        ...updated!,
        internshipId: populatedInternship || updated!.internshipId,
        userId: populatedUser ? {
          _id: populatedUser._id.toString(),
          name: populatedUser.name,
          email: populatedUser.email,
        } : updated!.userId,
        _id: undefined,
      },
    };
  } catch (error: any) {
    console.error('Update application status error:', error);
    return { success: false, error: error.message || 'Failed to update application status' };
  }
}

