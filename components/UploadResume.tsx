'use client';

import { useState } from 'react';
import { UploadButton } from '@uploadthing/react';
import { useToast } from '@/components/ui/use-toast';
import { FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UploadResumeProps {
  onUploadComplete: (url: string) => void;
  currentUrl?: string;
}

export default function UploadResume({ onUploadComplete, currentUrl }: UploadResumeProps) {
  const { toast } = useToast();
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(currentUrl || null);

  return (
    <div className="space-y-4">
      {uploadedUrl ? (
        <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Resume uploaded</p>
              <a
                href={uploadedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                View resume
              </a>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setUploadedUrl(null);
              onUploadComplete('');
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <UploadButton
          endpoint="resumeUploader"
          onClientUploadComplete={(res) => {
            if (res && res[0]) {
              const url = res[0].url;
              setUploadedUrl(url);
              onUploadComplete(url);
              toast({
                title: 'Success',
                description: 'Resume uploaded successfully!',
              });
            }
          }}
          onUploadError={(error: Error) => {
            toast({
              title: 'Error',
              description: error.message || 'Failed to upload resume',
              variant: 'destructive',
            });
          }}
          appearance={{
            button: "ut-ready:bg-primary ut-uploading:cursor-not-allowed rounded-r-none bg-primary text-primary-foreground after:bg-primary/80",
            allowedContent: "hidden",
          }}
        />
      )}
      <p className="text-xs text-muted-foreground">
        Upload your resume as a PDF file (max 4MB)
      </p>
    </div>
  );
}

