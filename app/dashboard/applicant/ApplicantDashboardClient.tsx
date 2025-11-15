'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { FileText, Briefcase, CheckCircle2, Clock, XCircle } from 'lucide-react';
import ApplicationCard from '@/components/ApplicationCard';
import InternshipCard from '@/components/InternshipCard';
import { withdrawApplication } from '@/lib/actions/applicationActions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import ProfileDialog from './ProfileDialog';
import { Settings } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface ApplicantDashboardClientProps {
  internships: any[];
  applications: any[];
}

export default function ApplicantDashboardClient({
  internships,
  applications,
}: ApplicantDashboardClientProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { data: session } = useSession();
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

  const handleWithdraw = async (id: string) => {
    if (!confirm('Are you sure you want to withdraw this application?')) return;

    const result = await withdrawApplication(id);
    if (result.success) {
      toast({
        title: 'Success',
        description: 'Application withdrawn successfully!',
      });
      router.refresh();
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to withdraw application',
        variant: 'destructive',
      });
    }
  };

  const pendingCount = applications.filter((app) => app.status === 'pending').length;
  const acceptedCount = applications.filter((app) => app.status === 'accepted').length;
  const rejectedCount = applications.filter((app) => app.status === 'rejected').length;

  // Get recommended internships (not applied to)
  const appliedInternshipIds = new Set(applications.map((app) => app.internshipId?._id || app.internshipId?.id));
  const recommendedInternships = internships
    .filter((internship) => !appliedInternshipIds.has(internship.id))
    .slice(0, 6);

  return (
    <div className="container py-8 px-4 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-muted-foreground">Track your applications and discover opportunities</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setIsProfileDialogOpen(true)}
          className="gap-2"
        >
          <Settings className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <ProfileDialog
        open={isProfileDialogOpen}
        onOpenChange={setIsProfileDialogOpen}
        initialData={
          session?.user
            ? {
                name: session.user.name || '',
                email: session.user.email || '',
              }
            : undefined
        }
      />

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{acceptedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* My Applications */}
      <Card>
        <CardHeader>
          <CardTitle>My Applications</CardTitle>
          <CardDescription>Track the status of your internship applications</CardDescription>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <p className="text-muted-foreground">You haven't applied to any internships yet.</p>
              <Link href="/internships">
                <Button>Browse Internships</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  showActions
                  onWithdraw={() => handleWithdraw(application.id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommended Internships */}
      {recommendedInternships.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommended for You</CardTitle>
            <CardDescription>Discover new opportunities that match your interests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recommendedInternships.map((internship) => (
                <InternshipCard key={internship.id} internship={internship} />
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link href="/internships">
                <Button variant="outline">View All Internships</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

