import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: 'admin' | 'applicant';
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'applicant';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'admin' | 'applicant';
  }
}

