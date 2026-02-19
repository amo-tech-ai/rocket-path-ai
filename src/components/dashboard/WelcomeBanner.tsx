import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  X,
  Rocket,
  FileText,
  Users,
  TrendingUp,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

interface WelcomeBannerProps {
  startupName: string;
  founderName: string;
  profileStrength: number;
  stage: string;
  industry: string;
  tractionData: {
    mrr?: number;
    users?: number;
    growthRate?: number;
  };
  tasks: {
    total: number;
    pending: number;
  };
  onDismiss?: () => void;
}

const STORAGE_KEY = "startupai_welcome_dismissed";

export function WelcomeBanner({
  startupName,
  founderName,
  profileStrength,
  stage,
  industry,
  tractionData,
  tasks,
  onDismiss,
}: WelcomeBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Check if banner was previously dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) {
      setIsDismissed(true);
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(STORAGE_KEY, "true");
    setTimeout(() => {
      setIsDismissed(true);
      onDismiss?.();
    }, 300);
  };

  // Format stage for display
  const formatStage = (s: string) => {
    const stageMap: Record<string, string> = {
      idea: "Idea Stage",
      pre_seed: "Pre-Seed",
      seed: "Seed",
      series_a: "Series A",
      series_b: "Series B",
      series_c: "Series C",
      growth: "Growth",
      public: "Public",
    };
    return stageMap[s] || s;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount}`;
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-background to-sage/5">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-sage/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

            {/* Dismiss button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 h-8 w-8 text-muted-foreground hover:text-foreground z-10"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="relative p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    Welcome to StartupAI, {startupName}!
                    <Badge variant="secondary" className="ml-2">
                      {formatStage(stage)}
                    </Badge>
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    Your startup command center is ready, {founderName}. Let's build something amazing.
                  </p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Profile Strength */}
                <div className="bg-card/50 rounded-lg p-4 border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Profile Strength</span>
                    <CheckCircle2 className={`h-4 w-4 ${profileStrength >= 70 ? 'text-status-success' : 'text-status-warning'}`} />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{profileStrength}%</div>
                  <Progress value={profileStrength} className="h-1.5 mt-2" />
                </div>

                {/* Industry */}
                <div className="bg-card/50 rounded-lg p-4 border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Industry</span>
                    <Rocket className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-lg font-semibold text-foreground capitalize">
                    {industry?.replace(/_/g, " ") || "Not set"}
                  </div>
                </div>

                {/* MRR / Users */}
                <div className="bg-card/50 rounded-lg p-4 border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      {tractionData.mrr ? "MRR" : "Users"}
                    </span>
                    <TrendingUp className="h-4 w-4 text-status-success" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {tractionData.mrr
                      ? formatCurrency(tractionData.mrr)
                      : tractionData.users?.toLocaleString() || "0"
                    }
                  </div>
                </div>

                {/* Tasks */}
                <div className="bg-card/50 rounded-lg p-4 border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Tasks Ready</span>
                    <FileText className="h-4 w-4 text-status-info" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{tasks.total}</div>
                  <p className="text-xs text-muted-foreground">{tasks.pending} pending</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3">
                <Link to="/lean-canvas">
                  <Button className="gap-2">
                    <FileText className="h-4 w-4" />
                    Generate Lean Canvas
                  </Button>
                </Link>
                <Link to="/app/pitch-deck/new">
                  <Button variant="outline" className="gap-2">
                    <Rocket className="h-4 w-4" />
                    Create Pitch Deck
                  </Button>
                </Link>
                <Link to="/investors">
                  <Button variant="outline" className="gap-2">
                    <Users className="h-4 w-4" />
                    Find Investors
                  </Button>
                </Link>
                <Link to="/tasks">
                  <Button variant="ghost" className="gap-2">
                    View All Tasks
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* Dismiss hint */}
              <p className="text-xs text-muted-foreground text-center">
                This welcome message will disappear once dismissed. You can always find your startup info in the sidebar.
              </p>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook to check if this is a first visit after onboarding
export function useFirstVisitAfterOnboarding(
  onboardingCompleted: boolean | null | undefined,
  startupId: string | undefined
): boolean {
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    if (onboardingCompleted && startupId) {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      setIsFirstVisit(!dismissed);
    }
  }, [onboardingCompleted, startupId]);

  return isFirstVisit;
}
