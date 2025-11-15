'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, ExternalLink, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface ApplicationCardProps {
  application: {
    id: string;
    status: 'pending' | 'accepted' | 'rejected';
    resumeUrl: string;
    createdAt?: string | Date;
    internshipId?: any;
    userId?: any;
  };
  showActions?: boolean;
  onWithdraw?: () => void;
  onUpdateStatus?: (status: 'accepted' | 'rejected') => void;
  isAdmin?: boolean;
}

export default function ApplicationCard({
  application,
  showActions = false,
  onWithdraw,
  onUpdateStatus,
  isAdmin = false,
}: ApplicationCardProps) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    accepted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  const internship = application.internshipId;
  const user = application.userId;

  return (
    <Card className="hover:shadow-md transition-shadow animate-fade-in">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-1">
            {isAdmin && user ? (
              <>
                <CardTitle className="text-lg">{user.name || user.email}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </>
            ) : internship ? (
              <>
                <CardTitle className="text-lg">{internship.title}</CardTitle>
                <CardDescription>{internship.company}</CardDescription>
              </>
            ) : (
              <CardTitle className="text-lg">Application</CardTitle>
            )}
          </div>
          <Badge className={statusColors[application.status]}>
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {internship && !isAdmin && (
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              <span className="font-medium">Location:</span> {internship.location}
            </p>
            <p className="text-muted-foreground">
              <span className="font-medium">Stipend:</span> ₹{internship.stipend?.toLocaleString()}/mo
            </p>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            Applied {application.createdAt ? formatDistanceToNow(new Date(application.createdAt), { addSuffix: true }) : 'recently'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <a
            href={application.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View Resume
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-4">
        {internship && (
          <Link href={`/internships/${internship._id || internship.id}`}>
            <Button variant="ghost" size="sm">
              View Internship
            </Button>
          </Link>
        )}
        {showActions && (
          <div className="flex items-center gap-2 ml-auto">
            {isAdmin && onUpdateStatus && application.status === 'pending' && (
              <>
                <Button
                  onClick={() => onUpdateStatus('accepted')}
                  size="sm"
                  variant="outline"
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  Accept
                </Button>
                <Button
                  onClick={() => onUpdateStatus('rejected')}
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Reject
                </Button>
              </>
            )}
            {!isAdmin && onWithdraw && application.status === 'pending' && (
              <Button
                onClick={onWithdraw}
                size="sm"
                variant="destructive"
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Withdraw
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

