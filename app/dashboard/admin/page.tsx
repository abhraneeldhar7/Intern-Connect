import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import AdminDashboardClient from './AdminDashboardClient';
import { getAllInternships } from '@/lib/actions/internshipActions';
import { adminGetAllApplications } from '@/lib/actions/applicationActions';
import connectDB from '@/lib/db';
import Internship from '@/lib/models/Internship';
import Application from '@/lib/models/Application';

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session || (session.user as any)?.role !== 'admin') {
    redirect('/login');
  }

  await connectDB();

  // Get stats
  const [totalInternships, totalApplications, acceptedApplications, rejectedApplications] = await Promise.all([
    Internship.countDocuments(),
    Application.countDocuments(),
    Application.countDocuments({ status: 'accepted' }),
    Application.countDocuments({ status: 'rejected' }),
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

