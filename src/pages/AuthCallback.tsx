/**
 * OAuth Callback Handler
 *
 * Handles the redirect from OAuth providers (Google, LinkedIn).
 * Parse `next` synchronously on mount (before async) — URL can be consumed.
 *
 * @see tasks/data/auth-setup/03-auth-setup-checklist.md
 */

import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { getReturnPath, clearReturnPath, isValidReturnPath } from '@/lib/authReturnPath';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  // Parse next synchronously on mount — do not defer (Supabase/React can consume URL)
  const next = useMemo(() => {
    const raw =
      getReturnPath() ||
      searchParams.get('next') ||
      '/dashboard';
    return isValidReturnPath(raw) ? raw : '/dashboard';
  }, [searchParams]);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (errorParam) {
      console.error('[AuthCallback] OAuth error:', errorParam, errorDescription);
      setError(errorDescription || errorParam);
      return;
    }

    const redirect = (target: string) => {
      clearReturnPath();
      navigate(target, { replace: true });
    };

    let handled = false;

    const handleSession = async (session: { user: { id: string } } | null) => {
      if (!session?.user || handled) return;
      handled = true;

      const pendingIdea = sessionStorage.getItem('pendingIdea');
      if (pendingIdea) {
        // Idea from home page hero — send straight to validator.
        // pendingIdea stays in sessionStorage so ValidateIdea can read it.
        redirect('/validate?hasIdea=true');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profile?.onboarding_completed) {
        redirect(next);
      } else {
        navigate('/onboarding', { replace: true });
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
          handleSession(session);
        }
      }
    );

    // Timeout: if auth state change never fires (PKCE exchange fails, network issue),
    // redirect to login after 15s so user isn't stuck forever
    const timeout = setTimeout(() => {
      if (!handled) {
        console.warn('[AuthCallback] Auth exchange timed out after 15s');
        navigate('/login', { replace: true });
      }
    }, 15_000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [navigate, searchParams, next]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <span className="text-destructive text-xl">!</span>
          </div>
          <h1 className="text-xl font-semibold">Authentication Error</h1>
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="text-primary hover:underline"
          >
            Return to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}
