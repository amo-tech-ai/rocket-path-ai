import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Brain, 
  TrendingUp, 
  Users,
  Target,
  Presentation,
  Search,
  Handshake,
  Sparkles,
  ArrowRight,
  DollarSign
} from "lucide-react";
import { motion } from "framer-motion";

interface InvestorsAIPanelProps {
  investorsCount: number;
  interestedCount: number;
  meetingCount: number;
  targetRaise?: number;
  currentRaised?: number;
}

export function InvestorsAIPanel({ 
  investorsCount, 
  interestedCount, 
  meetingCount,
  targetRaise = 0,
  currentRaised = 0
}: InvestorsAIPanelProps) {
  const progressPercent = targetRaise > 0 ? Math.round((currentRaised / targetRaise) * 100) : 0;

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {/* AI Investor Coach Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Brain className="w-5 h-5 text-primary" />
                Fundraising Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {investorsCount === 0 
                  ? "Add investors to your pipeline to get AI matching recommendations."
                  : `Tracking ${investorsCount} investors with ${interestedCount} showing interest.`}
              </p>
              <Button size="sm" className="w-full" variant="sage">
                <Sparkles className="w-4 h-4 mr-2" />
                Find Matching Investors
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <Separator />

        {/* Fundraising Progress */}
        {targetRaise > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <DollarSign className="w-4 h-4 text-sage" />
                  Raise Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-sage">{formatCurrency(currentRaised)}</span>
                  <span className="text-sm text-muted-foreground">of {formatCurrency(targetRaise)}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-sage h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(progressPercent, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-center text-muted-foreground">
                  {progressPercent}% of target raised
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Pipeline Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <TrendingUp className="w-4 h-4 text-primary" />
                Pipeline Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <div className="text-lg font-semibold">{investorsCount}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <div className="text-lg font-semibold text-sage">{interestedCount}</div>
                  <div className="text-xs text-muted-foreground">Interested</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <div className="text-lg font-semibold text-primary">{meetingCount}</div>
                  <div className="text-xs text-muted-foreground">Meetings</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Investor Matching */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Target className="w-4 h-4 text-warm-foreground" />
                AI Investor Matching
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Find investors that match your stage, industry, and goals:
              </p>
              <div className="flex items-start gap-2 p-2 rounded-lg bg-sage/10 border border-sage/20">
                <Search className="w-4 h-4 text-sage mt-0.5 flex-shrink-0" />
                <div className="text-xs">
                  <p className="font-medium text-sage">Portfolio Fit Analysis</p>
                  <p className="text-muted-foreground">We analyze investor portfolios to find synergies.</p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-2 rounded-lg bg-muted">
                <Handshake className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-xs">
                  <p className="font-medium">Warm Intros</p>
                  <p className="text-muted-foreground">Identify mutual connections for introductions.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pitch Optimization */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Presentation className="w-4 h-4 text-muted-foreground" />
                Pitch Optimization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-muted-foreground">
                AI tips to improve your investor pitch:
              </p>
              <div className="space-y-1">
                <Button variant="ghost" size="sm" className="w-full justify-start text-xs h-8">
                  <Presentation className="w-3 h-3 mr-2" />
                  Deck Review & Feedback
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-xs h-8">
                  <Users className="w-3 h-3 mr-2" />
                  Investor-Specific Tailoring
                </Button>
              </div>
              <Button variant="outline" size="sm" className="w-full text-xs mt-2">
                Optimize My Pitch
                <ArrowRight className="w-3 h-3 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </ScrollArea>
  );
}
