'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Briefcase, DollarSign, Calendar, Bookmark } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { toggleBookmark } from '@/lib/actions/bookmarkActions';
import { useToast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';

interface InternshipCardProps {
  internship: {
    id: string;
    title: string;
    description: string;
    company: string;
    location: string;
    type: 'remote' | 'onsite' | 'hybrid';
    stipend: number;
    skills: string[];
    createdAt?: string | Date;
    openings?: number;
  };
  showActions?: boolean;
  onApply?: () => void;
  hasApplied?: boolean;
  isBookmarked?: boolean;
  showBookmark?: boolean;
}

export default function InternshipCard({
  internship,
  showActions = false,
  onApply,
  hasApplied = false,
  isBookmarked: initialBookmarked = false,
  showBookmark = true,
}: InternshipCardProps) {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isToggling, setIsToggling] = useState(false);

  const typeColors = {
    remote: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    onsite: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    hybrid: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast({
        title: 'Error',
        description: 'Please sign in to bookmark internships',
        variant: 'destructive',
      });
      return;
    }

    setIsToggling(true);
    const result = await toggleBookmark(internship.id);
    setIsToggling(false);

    if (result.success) {
      setIsBookmarked(result.data?.isBookmarked || false);
      toast({
        title: result.data?.isBookmarked ? 'Bookmarked' : 'Removed from bookmarks',
        description: result.data?.isBookmarked
          ? 'Internship added to your bookmarks'
          : 'Internship removed from your bookmarks',
      });
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to update bookmark',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
              {internship.title}
            </CardTitle>
            <CardDescription className="text-base font-semibold text-foreground">
              {internship.company}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={typeColors[internship.type]}>{internship.type}</Badge>
            {showBookmark && session && (session.user as any)?.role === 'applicant' && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleBookmark}
                disabled={isToggling}
              >
                <Bookmark
                  className={`h-4 w-4 ${isBookmarked ? 'fill-primary text-primary' : ''}`}
                />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">{internship.description}</p>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            <span>{internship.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <DollarSign className="h-4 w-4" />
            <span>₹{internship.stipend.toLocaleString()}/mo</span>
          </div>
          {internship.openings && (
            <div className="flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" />
              <span>{internship.openings} openings</span>
            </div>
          )}
          {internship.createdAt && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{formatDistanceToNow(new Date(internship.createdAt), { addSuffix: true })}</span>
            </div>
          )}
        </div>

        {internship.skills && internship.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {internship.skills.slice(0, 4).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {internship.skills.length > 4 && (
              <Badge variant="secondary" className="text-xs">
                +{internship.skills.length - 4} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-4">
        <Link href={`/internships/${internship.id}`}>
          <Button variant="ghost" size="sm">
            View Details
          </Button>
        </Link>
        {showActions && (
          <Button
            onClick={onApply}
            disabled={hasApplied}
            size="sm"
            className="min-w-[100px]"
          >
            {hasApplied ? 'Applied' : 'Apply Now'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

