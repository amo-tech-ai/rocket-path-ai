import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { DEV_BYPASS_AUTH, DEV_MOCK_USER_ID } from '@/lib/devConfig';

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
  signInWithGoogle: () => Promise<void>;
  signInWithLinkedIn: () => Promise<void>;
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

    // Set up auth state listener BEFORE checking session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Defer profile/role fetch to avoid blocking auth state update
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setUserRole(null);
        }

        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchUserData(session.user.id);
      }

      setLoading(false);
    });

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

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/auth/callback',
      },
    });

    if (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signInWithLinkedIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
      options: {
        redirectTo: window.location.origin + '/auth/callback',
      },
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
