/**
 * WizardCompletionBridge Component
 *
 * Celebration interstitial shown after wizard completion.
 * Shows achievements, profile strength, and auto-redirects to dashboard.
 */

import { useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Sparkles, Target, ListTodo, Unlock } from 'lucide-react';
import { COMPLETION_BRIDGE_COUNTDOWN } from '@/lib/onboardingConstants';

export interface CompletionBridgeData {
  startupName: string;
  profileStrength: number;
  investorScore: number;
  tasksGenerated: number;
  industry: string;
  stage: string;
  businessModel: string[];
  modulesUnlocked: string[];
}

interface WizardCompletionBridgeProps {
  data: CompletionBridgeData;
  onContinue: () => void;
  onViewProfile: () => void;
}

export function WizardCompletionBridge({
  data,
  onContinue,
  onViewProfile,
}: WizardCompletionBridgeProps) {
  const [countdown, setCountdown] = useState(COMPLETION_BRIDGE_COUNTDOWN);
  const [autoRedirect, setAutoRedirect] = useState(true);

  // Trigger confetti celebration on mount
  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      // Left side confetti
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#10b981', '#6366f1', '#f59e0b'],
      });
      // Right side confetti
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#10b981', '#6366f1', '#f59e0b'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  // Countdown timer for auto-redirect
  useEffect(() => {
    if (!autoRedirect) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onContinue();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRedirect, onContinue]);

  const cancelAutoRedirect = useCallback(() => {
    setAutoRedirect(false);
  }, []);

  const achievements = [
    { icon: CheckCircle, label: 'Profile Created', done: true },
    { icon: Target, label: `Score: ${data.investorScore}/100`, done: true },
    { icon: ListTodo, label: `${data.tasksGenerated} Tasks`, done: true },
    { icon: Unlock, label: `${data.modulesUnlocked.length} Modules`, done: true },
  ];

  // Format stage for display
  const formatStage = (stage: string) => {
    const stageMap: Record<string, string> = {
      idea: 'Idea',
      pre_seed: 'Pre-seed',
      seed: 'Seed',
      series_a: 'Series A',
      series_b: 'Series B',
      growth: 'Growth',
    };
    return stageMap[stage.toLowerCase()] || stage;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-warm-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Sparkles className="h-16 w-16 text-primary animate-pulse" />
          </div>
          <h1 className="text-3xl font-display font-bold text-dark-900">
            You're All Set, {data.startupName}!
          </h1>
          <p className="text-lg text-muted-foreground">
            Your startup command center is ready.
          </p>
        </div>

        {/* Achievements Card */}
        <Card className="border-2 border-sage-200">
          <CardContent className="p-8">
            {/* Achievement Icons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {achievements.map((item, index) => (
                <div key={index} className="flex flex-col items-center text-center space-y-2">
                  <div className="p-3 rounded-full bg-primary/10">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Profile Strength */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Profile Strength</span>
                <span className="font-medium">{data.profileStrength}%</span>
              </div>
              <Progress value={data.profileStrength} className="h-2" />
            </div>

            {/* Meta Info */}
            <div className="mt-6 pt-6 border-t border-sage-200 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span><strong>Industry:</strong> {data.industry?.replace(/_/g, ' ')}</span>
              <span className="hidden md:inline">•</span>
              <span><strong>Stage:</strong> {formatStage(data.stage)}</span>
              <span className="hidden md:inline">•</span>
              <span><strong>Model:</strong> {data.businessModel.join(', ')}</span>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={onContinue} className="px-8">
            Go to My Dashboard
          </Button>
          <Button size="lg" variant="outline" onClick={onViewProfile}>
            View Startup Profile
          </Button>
        </div>

        {/* Auto-redirect countdown */}
        {autoRedirect && (
          <p className="text-center text-sm text-muted-foreground">
            Redirecting to dashboard in {countdown}s...{' '}
            <button
              onClick={cancelAutoRedirect}
              className="text-primary underline hover:no-underline"
            >
              Cancel
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

export default WizardCompletionBridge;
