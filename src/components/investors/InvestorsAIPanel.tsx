import { useState } from "react";
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
  DollarSign,
  Loader2,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  FileText
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  useDiscoverInvestors, 
  useAnalyzePipeline as useInvestorPipelineAnalysis,
  useGenerateReport,
  type PipelineAnalysis as InvestorPipelineAnalysis,
  type FundraisingReport
} from "@/hooks/useInvestorAgent";

interface InvestorsAIPanelProps {
  investorsCount: number;
  interestedCount: number;
  meetingCount: number;
  targetRaise?: number;
  currentRaised?: number;
  startupId?: string;
}

export function InvestorsAIPanel({ 
  investorsCount, 
  interestedCount, 
  meetingCount,
  targetRaise = 0,
  currentRaised = 0,
  startupId
}: InvestorsAIPanelProps) {
  const progressPercent = targetRaise > 0 ? Math.round((currentRaised / targetRaise) * 100) : 0;

  // State for AI results
  const [pipelineAnalysis, setPipelineAnalysis] = useState<InvestorPipelineAnalysis | null>(null);
  const [fundraisingReport, setFundraisingReport] = useState<FundraisingReport | null>(null);
  
  // Hooks
  const discoverInvestors = useDiscoverInvestors();
  const analyzePipeline = useInvestorPipelineAnalysis();
  const generateReport = useGenerateReport();

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  const handleDiscoverInvestors = async () => {
    if (!startupId) return;
    await discoverInvestors.mutateAsync({ startupId });
  };

  const handleAnalyzePipeline = async () => {
    if (!startupId) return;
    const result = await analyzePipeline.mutateAsync({ startupId });
    if (result.success) {
      setPipelineAnalysis(result);
    }
  };

  const handleGenerateReport = async () => {
    if (!startupId) return;
    const result = await generateReport.mutateAsync({ startupId });
    if (result.success) {
      setFundraisingReport(result);
    }
  };

  const isLoading = discoverInvestors.isPending || analyzePipeline.isPending || generateReport.isPending;

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
              <Button 
                size="sm" 
                className="w-full" 
                variant="sage"
                onClick={handleDiscoverInvestors}
                disabled={isLoading || !startupId}
              >
                {discoverInvestors.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
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
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs mt-3"
                onClick={handleAnalyzePipeline}
                disabled={isLoading || !startupId}
              >
                {analyzePipeline.isPending ? (
                  <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                ) : (
                  <BarChart3 className="w-3 h-3 mr-2" />
                )}
                Analyze Pipeline Health
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pipeline Analysis Results */}
        {pipelineAnalysis?.success && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-sage/30 bg-sage/5">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <BarChart3 className="w-4 h-4 text-sage" />
                  Pipeline Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Health Score:</span>
                  <Badge 
                    variant="outline" 
                    className={
                      pipelineAnalysis.health_score >= 70 ? 'border-sage text-sage' :
                      pipelineAnalysis.health_score >= 40 ? 'border-amber-500 text-amber-600' :
                      'border-red-500 text-red-600'
                    }
                  >
                    {pipelineAnalysis.health_score}/100
                  </Badge>
                </div>
                
                <p className="text-xs text-muted-foreground">{pipelineAnalysis.summary}</p>
                
                {pipelineAnalysis.bottlenecks && pipelineAnalysis.bottlenecks.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-amber-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Bottlenecks:
                    </p>
                    {pipelineAnalysis.bottlenecks.slice(0, 2).map((b, i) => (
                      <p key={i} className="text-xs text-muted-foreground pl-4">• {b}</p>
                    ))}
                  </div>
                )}
                
                {pipelineAnalysis.wins && pipelineAnalysis.wins.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-sage flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Wins:
                    </p>
                    {pipelineAnalysis.wins.slice(0, 2).map((w, i) => (
                      <p key={i} className="text-xs text-muted-foreground pl-4">• {w}</p>
                    ))}
                  </div>
                )}
                
                {pipelineAnalysis.recommendations && pipelineAnalysis.recommendations.length > 0 && (
                  <div className="space-y-1 pt-2 border-t">
                    <p className="text-xs font-medium">Top Recommendations:</p>
                    {pipelineAnalysis.recommendations.slice(0, 3).map((r, i) => (
                      <div key={i} className="flex items-start gap-2 p-1">
                        <Badge variant="outline" className="text-[10px] shrink-0">
                          {r.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{r.action}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

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

        {/* Fundraising Report */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <FileText className="w-4 h-4 text-muted-foreground" />
                Weekly Report
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Generate a comprehensive fundraising status report:
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs"
                onClick={handleGenerateReport}
                disabled={isLoading || !startupId || investorsCount === 0}
              >
                {generateReport.isPending ? (
                  <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                ) : (
                  <FileText className="w-3 h-3 mr-2" />
                )}
                Generate Report
              </Button>
              
              {/* Report Results */}
              {fundraisingReport?.success && (
                <div className="mt-3 p-3 rounded-lg bg-muted/50 space-y-2">
                  <p className="text-xs font-medium">Executive Summary</p>
                  <p className="text-xs text-muted-foreground">
                    {fundraisingReport.executive_summary}
                  </p>
                  
                  {fundraisingReport.this_week_priorities && fundraisingReport.this_week_priorities.length > 0 && (
                    <div className="pt-2 border-t space-y-1">
                      <p className="text-xs font-medium">This Week's Priorities:</p>
                      {fundraisingReport.this_week_priorities.slice(0, 3).map((p, i) => (
                        <p key={i} className="text-xs text-muted-foreground">• {p}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </ScrollArea>
  );
}
