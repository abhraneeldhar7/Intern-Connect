'use server';

import { revalidatePath } from 'next/cache';
import connectDB from '../db';
import User from '../models/User';
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

    await connectDB();

    const user = await User.findById((session.user as any).id);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const bookmarks = user.bookmarks || [];
    const isBookmarked = bookmarks.some(
      (id: any) => id.toString() === internshipId
    );

    if (isBookmarked) {
      user.bookmarks = bookmarks.filter(
        (id: any) => id.toString() !== internshipId
      );
    } else {
      user.bookmarks = [...bookmarks, internshipId];
    }

    await user.save();

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

    await connectDB();

    const user = await User.findById((session.user as any).id).populate('bookmarks');
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const bookmarks = (user.bookmarks || []).map((internship: any) => ({
      id: internship._id.toString(),
      ...internship.toObject(),
      _id: undefined,
      __v: undefined,
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

    await connectDB();

    const user = await User.findById((session.user as any).id);
    if (!user) {
      return { success: true, data: false };
    }

    const bookmarks = user.bookmarks || [];
    const isBookmarked = bookmarks.some(
      (id: any) => id.toString() === internshipId
    );

    return {
      success: true,
      data: isBookmarked,
    };
  } catch (error: any) {
    console.error('Check bookmark error:', error);
    return { success: true, data: false };
  }
}

