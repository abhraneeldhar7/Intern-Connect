import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getInternshipById } from '@/lib/actions/internshipActions';
import { getMyApplications } from '@/lib/actions/applicationActions';
import InternshipDetailClient from './InternshipDetailClient';

export default async function InternshipDetailPage({ params }: { params: { id: string } }) {
  const result = await getInternshipById(params.id);

  if (!result.success || !result.data) {
    redirect('/internships');
  }

  const session = await auth();
  let hasApplied = false;
  let applicationId = null;

  if (session && (session.user as any)?.role === 'applicant') {
    const applicationsResult = await getMyApplications();
    if (applicationsResult.success && applicationsResult.data) {
      const application = applicationsResult.data.find(
        (app: any) => (app.internshipId?._id || app.internshipId?.id) === params.id
      );
      if (application) {
        hasApplied = true;
        applicationId = application.id;
      }
    }
  }

  return (
    <InternshipDetailClient
      internship={result.data}
      hasApplied={hasApplied}
      applicationId={applicationId}
      isApplicant={session && (session.user as any)?.role === 'applicant'}
    />
  );
}

