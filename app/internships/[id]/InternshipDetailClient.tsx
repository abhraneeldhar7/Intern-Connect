'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { MapPin, Briefcase, DollarSign, Calendar, Users, FileText } from 'lucide-react';
import { submitApplication } from '@/lib/actions/applicationActions';
import { formatDistanceToNow } from 'date-fns';
import UploadResume from '@/components/UploadResume';

interface InternshipDetailClientProps {
  internship: any;
  hasApplied: boolean;
  applicationId: string | null;
  isApplicant: boolean;
}

export default function InternshipDetailClient({
  internship,
  hasApplied,
  applicationId,
  isApplicant,
}: InternshipDetailClientProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResumeUpload = (url: string) => {
    setResumeUrl(url);
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeUrl.trim()) {
      toast({
        title: 'Error',
        description: 'Please upload your resume',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    const result = await submitApplication(internship.id, resumeUrl);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: 'Success',
        description: 'Application submitted successfully!',
      });
      setIsDialogOpen(false);
      setResumeUrl('');
      router.refresh();
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to submit application',
        variant: 'destructive',
      });
    }
  };

  const typeColors = {
    remote: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    onsite: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    hybrid: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  };

  return (
    <div className="container py-8 px-4 max-w-4xl">
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{internship.title}</h1>
              <Badge className={typeColors[internship.type]}>{internship.type}</Badge>
            </div>
            <p className="text-xl text-muted-foreground">{internship.company}</p>
          </div>
          {isApplicant && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button disabled={hasApplied} size="lg">
                  {hasApplied ? 'Applied' : 'Apply Now'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Apply for {internship.title}</DialogTitle>
                  <DialogDescription>
                    Please provide a link to your resume (Google Drive, Dropbox, or any public URL)
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleApply}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Upload Resume</Label>
                      <UploadResume onUploadComplete={handleResumeUpload} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="resume-url">Or paste resume URL</Label>
                      <Input
                        id="resume-url"
                        type="url"
                        placeholder="https://drive.google.com/..."
                        value={resumeUrl}
                        onChange={(e) => setResumeUrl(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading || !resumeUrl.trim()}>
                      {isLoading ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{internship.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Stipend</p>
                  <p className="font-medium">₹{internship.stipend.toLocaleString()}/month</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Openings</p>
                  <p className="font-medium">{internship.openings}</p>
                </div>
              </div>
              {internship.createdAt && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Posted</p>
                    <p className="font-medium">
                      {formatDistanceToNow(new Date(internship.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-muted-foreground">{internship.description}</p>
          </CardContent>
        </Card>

        {internship.skills && internship.skills.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Required Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {internship.skills.map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4">
          <Link href="/internships">
            <Button variant="outline">Back to Internships</Button>
          </Link>
          {isApplicant && hasApplied && (
            <Link href="/dashboard/applicant">
              <Button>View My Applications</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

