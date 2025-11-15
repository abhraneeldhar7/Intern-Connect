'use client';

export function UploadThingProvider({ children }: { children: React.ReactNode }) {
  // UploadThing doesn't require a provider in newer versions
  return <>{children}</>;
}

