/**
 * OnboardingComplete Page
 *
 * Celebration interstitial shown after wizard completion.
 * Fetches completion data and displays WizardCompletionBridge.
 */

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { WizardCompletionBridge, CompletionBridgeData } from '@/components/onboarding/WizardCompletionBridge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { STORAGE_KEYS, GUIDED_MODE_STATES, UNLOCKED_MODULES } from '@/lib/onboardingConstants';
import { getReturnPath, clearReturnPath } from '@/lib/authReturnPath';

export default function OnboardingComplete() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session');
  const [completionData, setCompletionData] = useState<CompletionBridgeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCompletionData() {
      if (!user) {
        setError('Please sign in to continue');
        setIsLoading(false);
        return;
      }

      try {
        // Fetch session data (may be null if sessionId not provided)
        let session = null;
        if (sessionId) {
          const { data } = await supabase
            .from('wizard_sessions')
            .select('*')
            .eq('id', sessionId)
            .single();
          session = data;
        }

        // Fetch most recent startup for this user
        const { data: startup, error: startupError } = await supabase
          .from('startups')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (startupError || !startup) {
          // Fallback: redirect to dashboard if no startup found
          console.warn('No startup found, redirecting to dashboard');
          navigate('/dashboard', { replace: true });
          return;
        }

        // Count tasks generated during onboarding
        const { count: taskCount } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('startup_id', startup.id);

        // Extract investor score - handle both object and number formats
        const investorScore = typeof session?.investor_score === 'object'
          ? session.investor_score?.total || 55
          : session?.investor_score || 55;

        // Build completion data with fallbacks
        setCompletionData({
          startupName: startup.name || session?.form_data?.company_name || 'Your Startup',
          profileStrength: session?.profile_strength || startup.profile_strength || 75,
          investorScore,
          tasksGenerated: taskCount || 3,
          industry: startup.industry || session?.form_data?.industry?.[0] || 'Technology',
          stage: startup.stage || session?.form_data?.stage || 'Pre-seed',
          businessModel: session?.form_data?.business_model || ['B2B'],
          modulesUnlocked: [...UNLOCKED_MODULES],
        });
      } catch (err) {
        console.error('Error fetching completion data:', err);
        setError('Failed to load your startup data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchCompletionData();
  }, [user, sessionId, navigate]);

  const handleContinue = () => {
    const returnPath = getReturnPath();
    clearReturnPath();
    localStorage.setItem(STORAGE_KEYS.FIRST_DASHBOARD, GUIDED_MODE_STATES.PENDING);
    navigate(returnPath || '/dashboard?first=true', { replace: true });
  };

  const handleViewProfile = () => {
    clearReturnPath();
    localStorage.setItem(STORAGE_KEYS.FIRST_DASHBOARD, GUIDED_MODE_STATES.PENDING);
    navigate('/company-profile', { replace: true });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gradient-to-br from-sage-50 via-white to-warm-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading your startup data...</p>
      </div>
    );
  }

  // Error state
  if (error || !completionData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gradient-to-br from-sage-50 via-white to-warm-50">
        <p className="text-destructive">{error || 'Something went wrong'}</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-primary underline hover:no-underline"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <WizardCompletionBridge
      data={completionData}
      onContinue={handleContinue}
      onViewProfile={handleViewProfile}
    />
  );
}
