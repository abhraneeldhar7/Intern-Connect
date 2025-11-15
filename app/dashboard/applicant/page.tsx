import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import ApplicantDashboardClient from './ApplicantDashboardClient';
import { getAllInternships } from '@/lib/actions/internshipActions';
import { getMyApplications } from '@/lib/actions/applicationActions';

export default async function ApplicantDashboardPage() {
  const session = await auth();

  if (!session || (session.user as any)?.role !== 'applicant') {
    redirect('/login');
  }

  const internshipsResult = await getAllInternships();
  const applicationsResult = await getMyApplications();

  const internships = internshipsResult.success ? internshipsResult.data || [] : [];
  const applications = applicationsResult.success ? applicationsResult.data || [] : [];

  const serializedInternships = JSON.parse(JSON.stringify(internships));
  const serializedApplications = JSON.parse(JSON.stringify(applications));

  return (
    <ApplicantDashboardClient
      internships={serializedInternships}
      applications={serializedApplications}
    />
  );
}

