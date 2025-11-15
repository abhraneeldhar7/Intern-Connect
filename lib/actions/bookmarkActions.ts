'use server';

import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';
import connectDB from '../db';
import { auth } from '@/lib/auth';
import { ActionResult } from './userActions';

export async function toggleBookmark(internshipId: string): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: 'Not authenticated' };
    }

    const userRole = (session.user as any).role;
    if (userRole !== 'applicant') {
      return { success: false, error: 'Only applicants can bookmark internships' };
    }

    const { db } = await connectDB();

    const user = await db.collection('users').findOne({ _id: new ObjectId((session.user as any).id) });
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const bookmarks = (user.bookmarks || []).map((id: any) => id.toString());
    const isBookmarked = bookmarks.includes(internshipId);

    if (isBookmarked) {
      await db.collection('users').updateOne(
        { _id: new ObjectId((session.user as any).id) },
        { 
          $set: { 
            bookmarks: bookmarks
              .filter((id: string) => id !== internshipId)
              .map((id: string) => new ObjectId(id)),
            updatedAt: new Date()
          } 
        }
      );
    } else {
      await db.collection('users').updateOne(
        { _id: new ObjectId((session.user as any).id) },
        { 
          $set: { 
            bookmarks: [...bookmarks.map((id: string) => new ObjectId(id)), new ObjectId(internshipId)],
            updatedAt: new Date()
          } 
        }
      );
    }

    revalidatePath('/internships');
    revalidatePath('/dashboard/applicant');

    return {
      success: true,
      data: {
        isBookmarked: !isBookmarked,
      },
    };
  } catch (error: any) {
    console.error('Toggle bookmark error:', error);
    return { success: false, error: error.message || 'Failed to toggle bookmark' };
  }
}

export async function getBookmarkedInternships(): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { db } = await connectDB();

    const user = await db.collection('users').findOne({ _id: new ObjectId((session.user as any).id) });
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const bookmarkIds = (user.bookmarks || []).map((id: any) => new ObjectId(id));
    const internships = await db.collection('internships')
      .find({ _id: { $in: bookmarkIds } })
      .toArray();

    const bookmarks = internships.map((internship) => ({
      id: internship._id.toString(),
      ...internship,
      _id: undefined,
    }));

    return {
      success: true,
      data: bookmarks,
    };
  } catch (error: any) {
    console.error('Get bookmarked internships error:', error);
    return { success: false, error: error.message || 'Failed to get bookmarks' };
  }
}

export async function isBookmarked(internshipId: string): Promise<ActionResult<boolean>> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: true, data: false };
    }

    const { db } = await connectDB();

    const user = await db.collection('users').findOne({ _id: new ObjectId((session.user as any).id) });
    if (!user) {
      return { success: true, data: false };
    }

    const bookmarks = (user.bookmarks || []).map((id: any) => id.toString());
    const isBookmarked = bookmarks.includes(internshipId);

    return {
      success: true,
      data: isBookmarked,
    };
  } catch (error: any) {
    console.error('Check bookmark error:', error);
    return { success: true, data: false };
  }
}

