import { auth } from './auth';

export async function getAuthSession() {
  return await auth();
}

export async function requireAuth() {
  const session = await getAuthSession();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  if ((session.user as any)?.role !== 'admin') {
    throw new Error('Forbidden: Admin access required');
  }
  return session;
}

export async function requireApplicant() {
  const session = await requireAuth();
  if ((session.user as any)?.role !== 'applicant') {
    throw new Error('Forbidden: Applicant access required');
  }
  return session;
}

