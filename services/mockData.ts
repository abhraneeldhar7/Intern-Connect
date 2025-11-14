import { User, UserRole, Internship, Application, ApplicationStatus } from '../types';

// Initial Seed Data
const INITIAL_USERS: User[] = [
  {
    id: 's1',
    name: 'Alex Johnson',
    email: 'alex@student.com',
    role: UserRole.STUDENT,
    university: 'Tech University',
    skills: ['React', 'TypeScript', 'Node.js'],
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
  },
  {
    id: 'c1',
    name: 'TechCorp Recruiter',
    email: 'jobs@techcorp.com',
    role: UserRole.COMPANY,
    companyName: 'TechCorp Inc.',
    industry: 'Software',
    description: 'Leading software solutions provider.',
    avatarUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=TechCorp'
  }
];

const INITIAL_INTERNSHIPS: Internship[] = [
  {
    id: 'i1',
    companyId: 'c1',
    companyName: 'TechCorp Inc.',
    title: 'Frontend Engineering Intern',
    location: 'San Francisco, CA',
    type: 'Hybrid',
    description: 'Join our frontend team to build modern web applications using React.',
    requirements: ['React', 'CSS', 'Git'],
    salary: '$30/hr',
    postedDate: '2023-10-25',
    applicantsCount: 1,
    status: 'active'
  },
  {
    id: 'i2',
    companyId: 'c1',
    companyName: 'TechCorp Inc.',
    title: 'Product Design Intern',
    location: 'Remote',
    type: 'Remote',
    description: 'Help design the next generation of user interfaces.',
    requirements: ['Figma', 'UI/UX Principles'],
    salary: '$25/hr',
    postedDate: '2023-10-20',
    applicantsCount: 0,
    status: 'active'
  },
  {
    id: 'i3',
    companyId: 'c2',
    companyName: 'GreenEnergy Co.',
    title: 'Data Analyst Intern',
    location: 'Austin, TX',
    type: 'On-site',
    description: 'Analyze energy consumption data to optimize sustainability.',
    requirements: ['Python', 'SQL', 'Tableau'],
    salary: '$28/hr',
    postedDate: '2023-10-28',
    applicantsCount: 0,
    status: 'active'
  }
];

const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'a1',
    internshipId: 'i1',
    studentId: 's1',
    studentName: 'Alex Johnson',
    internshipTitle: 'Frontend Engineering Intern',
    companyName: 'TechCorp Inc.',
    status: ApplicationStatus.PENDING,
    appliedDate: '2023-10-26',
    coverLetter: 'I am very excited about this opportunity...'
  }
];

// Helper to simulate DB connection and persistence
const loadData = (key: string, initial: any) => {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : initial;
};

const saveData = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- USERS CRUD ---

export const mockAuth = (email: string, role: UserRole): User | null => {
  const users: User[] = loadData('db_users', INITIAL_USERS);
  const user = users.find(u => u.email === email && u.role === role);
  
  if (user) return user;
  
  // Auto-register functionality
  const newUser: User = {
    id: Math.random().toString(36).substr(2, 9),
    name: role === UserRole.STUDENT ? 'New Student' : 'New Company',
    email,
    role,
    companyName: role === UserRole.COMPANY ? 'My Company' : undefined,
    university: role === UserRole.STUDENT ? 'My University' : undefined,
    skills: [],
    avatarUrl: `https://api.dicebear.com/7.x/${role === UserRole.STUDENT ? 'avataaars' : 'shapes'}/svg?seed=${Math.random()}`
  };
  
  users.push(newUser);
  saveData('db_users', users);
  return newUser;
};

export const updateUserProfile = (userId: string, updates: Partial<User>): User | null => {
  const users: User[] = loadData('db_users', INITIAL_USERS);
  const index = users.findIndex(u => u.id === userId);
  
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    saveData('db_users', users);
    // Update session user in localStorage if it matches
    const sessionUser = JSON.parse(localStorage.getItem('internconnect_user') || '{}');
    if (sessionUser.id === userId) {
      localStorage.setItem('internconnect_user', JSON.stringify(users[index]));
    }
    return users[index];
  }
  return null;
};

// --- INTERNSHIPS CRUD ---

export const getInternships = (): Internship[] => {
  return loadData('db_internships', INITIAL_INTERNSHIPS);
};

export const getCompanyInternships = (companyId: string): Internship[] => {
  const internships: Internship[] = loadData('db_internships', INITIAL_INTERNSHIPS);
  return internships.filter(i => i.companyId === companyId);
};

export const createInternship = (internship: Omit<Internship, 'id' | 'applicantsCount' | 'postedDate' | 'status'>): Internship => {
  const internships: Internship[] = loadData('db_internships', INITIAL_INTERNSHIPS);
  
  const newInternship: Internship = {
    ...internship,
    id: Math.random().toString(36).substr(2, 9),
    applicantsCount: 0,
    postedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    status: 'active'
  };
  
  internships.unshift(newInternship);
  saveData('db_internships', internships);
  return newInternship;
};

export const deleteInternship = (id: string): void => {
  const internships: Internship[] = loadData('db_internships', INITIAL_INTERNSHIPS);
  const filtered = internships.filter(i => i.id !== id);
  saveData('db_internships', filtered);
};

// --- APPLICATIONS CRUD ---

export const getStudentApplications = (studentId: string): Application[] => {
  const applications: Application[] = loadData('db_applications', INITIAL_APPLICATIONS);
  return applications.filter(a => a.studentId === studentId);
};

export const getCompanyApplications = (companyId: string): Application[] => {
  const internships = getCompanyInternships(companyId);
  const internshipIds = internships.map(i => i.id);
  const applications: Application[] = loadData('db_applications', INITIAL_APPLICATIONS);
  
  return applications.filter(a => internshipIds.includes(a.internshipId));
};

export const applyToInternship = (student: User, internship: Internship): Application => {
  const applications: Application[] = loadData('db_applications', INITIAL_APPLICATIONS);
  const internships: Internship[] = loadData('db_internships', INITIAL_INTERNSHIPS);

  const newApp: Application = {
    id: Math.random().toString(36).substr(2, 9),
    internshipId: internship.id,
    studentId: student.id,
    studentName: student.name,
    internshipTitle: internship.title,
    companyName: internship.companyName,
    status: ApplicationStatus.PENDING,
    appliedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  };
  
  applications.push(newApp);
  saveData('db_applications', applications);

  // Increment applicant count
  const intIndex = internships.findIndex(i => i.id === internship.id);
  if (intIndex > -1) {
    internships[intIndex].applicantsCount = (internships[intIndex].applicantsCount || 0) + 1;
    saveData('db_internships', internships);
  }
  
  return newApp;
};

export const withdrawApplication = (applicationId: string): void => {
  let applications: Application[] = loadData('db_applications', INITIAL_APPLICATIONS);
  const app = applications.find(a => a.id === applicationId);
  
  // Decrement count if application exists
  if (app) {
    const internships: Internship[] = loadData('db_internships', INITIAL_INTERNSHIPS);
    const intIndex = internships.findIndex(i => i.id === app.internshipId);
    if (intIndex > -1 && internships[intIndex].applicantsCount > 0) {
      internships[intIndex].applicantsCount--;
      saveData('db_internships', internships);
    }
  }

  applications = applications.filter(a => a.id !== applicationId);
  saveData('db_applications', applications);
};

export const updateApplicationStatus = (appId: string, status: ApplicationStatus): void => {
  const applications: Application[] = loadData('db_applications', INITIAL_APPLICATIONS);
  const index = applications.findIndex(a => a.id === appId);
  
  if (index !== -1) {
    applications[index].status = status;
    saveData('db_applications', applications);
  }
};