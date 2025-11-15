import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import AdminDashboardClient from './AdminDashboardClient';
import { getAllInternships } from '@/lib/actions/internshipActions';
import { adminGetAllApplications } from '@/lib/actions/applicationActions';
import connectDB from '@/lib/db';

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session || (session.user as any)?.role !== 'admin') {
    redirect('/login');
  }

  const { db } = await connectDB();

  // Get stats
  const [totalInternships, totalApplications, acceptedApplications, rejectedApplications] = await Promise.all([
    db.collection('internships').countDocuments(),
    db.collection('applications').countDocuments(),
    db.collection('applications').countDocuments({ status: 'accepted' }),
    db.collection('applications').countDocuments({ status: 'rejected' }),
  ]);

  const stats = {
    totalInternships,
    totalApplications,
    acceptedApplications,
    rejectedApplications,
    pendingApplications: totalApplications - acceptedApplications - rejectedApplications,
  };

  // Get recent internships and applications
  const internshipsResult = await getAllInternships();
  const applicationsResult = await adminGetAllApplications();

  const internships = internshipsResult.success ? internshipsResult.data || [] : [];
  const applications = applicationsResult.success ? applicationsResult.data || [] : [];

  const serializedStats = JSON.parse(JSON.stringify(stats));
  const serializedInternships = JSON.parse(JSON.stringify(internships));
  const serializedApplications = JSON.parse(JSON.stringify(applications));

  return (
    <AdminDashboardClient
      stats={serializedStats}
      internships={serializedInternships}
      applications={serializedApplications}
    />
  );
}

