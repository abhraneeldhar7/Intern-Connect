export enum UserRole {
  STUDENT = 'student',
  COMPANY = 'company'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  // Student specific
  university?: string;
  skills?: string[];
  resumeUrl?: string;
  // Company specific
  companyName?: string;
  industry?: string;
  description?: string;
}

export enum ApplicationStatus {
  PENDING = 'pending',
  SHORTLISTED = 'shortlisted',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected'
}

export interface Internship {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  location: string;
  type: 'Remote' | 'On-site' | 'Hybrid';
  description: string;
  requirements: string[];
  salary: string;
  postedDate: string;
  applicantsCount: number;
  status: 'active' | 'closed';
}

export interface Application {
  id: string;
  internshipId: string;
  studentId: string;
  studentName: string; // Denormalized for easier display
  internshipTitle: string;
  companyName: string;
  status: ApplicationStatus;
  appliedDate: string;
  coverLetter?: string;
}