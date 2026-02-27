import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { DEV_BYPASS_AUTH, DEV_MOCK_USER_ID } from '@/lib/devConfig';
import { setReturnPathOnce } from '@/lib/authReturnPath';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  org_id: string | null;
  role: string | null;
  onboarding_completed: boolean | null;
  preferences: Record<string, unknown> | null;
  created_at: string | null;
  updated_at: string | null;
}

interface UserRole {
  role: 'admin' | 'moderator' | 'user';
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  userRole: UserRole | null;
  loading: boolean;
  signInWithGoogle: (returnPath?: string) => Promise<void>;
  signInWithLinkedIn: (returnPath?: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isModerator: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (DEV_BYPASS_AUTH) {
      const mockUser = {
        id: DEV_MOCK_USER_ID,
        email: 'dev-bypass@startupai.dev',
        app_metadata: {},
        user_metadata: { full_name: 'Dev Bypass User' },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as User;

      setUser(mockUser);
      setProfile({
        id: DEV_MOCK_USER_ID,
        email: 'dev-bypass@startupai.dev',
        full_name: 'Dev Bypass User',
        avatar_url: null,
        org_id: 'default-org',
        role: 'admin',
        onboarding_completed: true,
        preferences: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      setUserRole({ role: 'admin' });
      setLoading(false);
      return;
    }

    // Single listener handles all auth events (INITIAL_SESSION fires on mount)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (event === 'SIGNED_OUT') {
          setProfile(null);
          setUserRole(null);
        } else if (event === 'TOKEN_REFRESHED') {
          // Token refreshed — session/user already up-to-date, skip DB fetch
        } else if (session?.user) {
          // INITIAL_SESSION, SIGNED_IN, USER_UPDATED — fetch profile + role
          await fetchUserData(session.user.id);
        } else {
          setProfile(null);
          setUserRole(null);
        }

        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch profile and role in parallel
      const [profileResult, roleResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single(),
        supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .order('created_at', { ascending: true })
          .limit(1)
          .single()
      ]);

      if (profileResult.data) {
        setProfile(profileResult.data as Profile);
      }

      if (roleResult.data) {
        setUserRole({ role: roleResult.data.role as 'admin' | 'moderator' | 'user' });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const signInWithGoogle = async (returnPath?: string) => {
    // Store return path in sessionStorage — AuthCallback reads it via getReturnPath()
    // Do NOT append ?next= to redirectTo — query params break Supabase allowlist matching
    if (returnPath) setReturnPathOnce(returnPath);
    const redirectTo = window.location.origin + '/auth/callback';
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });

    if (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signInWithLinkedIn = async (returnPath?: string) => {
    // Store return path in sessionStorage — AuthCallback reads it via getReturnPath()
    // Do NOT append ?next= to redirectTo — query params break Supabase allowlist matching
    if (returnPath) setReturnPathOnce(returnPath);
    const redirectTo = window.location.origin + '/auth/callback';
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
      options: { redirectTo },
    });

    if (error) {
      console.error('Error signing in with LinkedIn:', error);
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
    // Clear app-level sessionStorage to prevent stale data on next sign-in
    sessionStorage.removeItem('auth:returnPath');
    sessionStorage.removeItem('pendingIdea');
    setUser(null);
    setSession(null);
    setProfile(null);
    setUserRole(null);
  };

  const isAdmin = userRole?.role === 'admin';
  const isModerator = userRole?.role === 'moderator' || isAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        userRole,
        loading,
        signInWithGoogle,
        signInWithLinkedIn,
        signOut,
        isAdmin,
        isModerator,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
