declare module 'next-auth/react' {
  import { Session } from 'next-auth';
  
  export function useSession(): {
    data: Session | null;
    status: 'loading' | 'authenticated' | 'unauthenticated';
  };
  
  export function signIn(
    provider?: string,
    options?: {
      email?: string;
      password?: string;
      redirect?: boolean;
    }
  ): Promise<any>;
  
  export function signOut(options?: { callbackUrl?: string }): Promise<void>;
  
  export function SessionProvider({ children }: { children: React.ReactNode }): JSX.Element;
}

