import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Brain, 
  Users, 
  TrendingUp, 
  Mail,
  Handshake,
  MessageSquare,
  UserCheck,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Loader2,
  BarChart3
} from "lucide-react";
import { motion } from "framer-motion";
import { useAnalyzePipeline, useSuggestFollowUps, type PipelineAnalysis, type FollowUpSuggestion } from "@/hooks/useCRMAgent";

interface CRMAIPanelProps {
  contactsCount: number;
  dealsCount: number;
  totalDealValue?: number;
  startupId?: string;
}

export function CRMAIPanel({ contactsCount, dealsCount, totalDealValue = 0, startupId }: CRMAIPanelProps) {
  const [pipelineAnalysis, setPipelineAnalysis] = useState<PipelineAnalysis | null>(null);
  const [followUps, setFollowUps] = useState<FollowUpSuggestion | null>(null);
  
  const analyzePipeline = useAnalyzePipeline();
  const suggestFollowUps = useSuggestFollowUps();

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  const handleGetInsights = async () => {
    if (!startupId) return;
    
    const result = await analyzePipeline.mutateAsync({ startupId });
    if (result.success) {
      setPipelineAnalysis(result);
    }
  };

  const handleGetFollowUps = async () => {
    if (!startupId) return;
    
    const result = await suggestFollowUps.mutateAsync({ startupId });
    if (result.success) {
      setFollowUps(result);
    }
  };

  const isAnalyzing = analyzePipeline.isPending || suggestFollowUps.isPending;

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {/* AI Relationship Coach Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Brain className="w-5 h-5 text-primary" />
                Relationship Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {contactsCount === 0 
                  ? "Add contacts to get AI-powered relationship insights."
                  : `Managing ${contactsCount} relationships with ${dealsCount} active deals.`}
              </p>
              <Button 
                size="sm" 
                className="w-full" 
                variant="sage"
                onClick={handleGetInsights}
                disabled={isAnalyzing || !startupId}
              >
                {isAnalyzing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                Get AI Insights
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <Separator />

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
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-2 rounded-lg bg-background">
                    <div className="text-lg font-semibold">{pipelineAnalysis.total_deals || 0}</div>
                    <div className="text-xs text-muted-foreground">Deals</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-background">
                    <div className="text-lg font-semibold text-sage">
                      {formatCurrency(pipelineAnalysis.weighted_value || 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Weighted</div>
                  </div>
                </div>
                
                {pipelineAnalysis.bottlenecks && pipelineAnalysis.bottlenecks.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-amber-600">Bottlenecks:</p>
                    {pipelineAnalysis.bottlenecks.map((b, i) => (
                      <p key={i} className="text-xs text-muted-foreground">• {b}</p>
                    ))}
                  </div>
                )}
                
                {pipelineAnalysis.recommendations && pipelineAnalysis.recommendations.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-sage">Recommendations:</p>
                    {pipelineAnalysis.recommendations.slice(0, 3).map((r, i) => (
                      <p key={i} className="text-xs text-muted-foreground">• {r}</p>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Contact Insights */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Users className="w-4 h-4 text-sage" />
                Contact Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <div className="text-lg font-semibold">{contactsCount}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <div className="text-lg font-semibold text-sage">{dealsCount}</div>
                  <div className="text-xs text-muted-foreground">Deals</div>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs"
                onClick={handleGetFollowUps}
                disabled={isAnalyzing || !startupId}
              >
                {suggestFollowUps.isPending ? (
                  <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                ) : (
                  <UserCheck className="w-3 h-3 mr-2" />
                )}
                Find Follow-up Opportunities
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Follow-up Suggestions */}
        {followUps?.success && followUps.suggestions && followUps.suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <UserCheck className="w-4 h-4 text-amber-500" />
                  Follow-up Needed ({followUps.suggestions.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {followUps.suggestions.slice(0, 5).map((suggestion, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
                    <Badge 
                      variant="outline" 
                      className={
                        suggestion.priority === 'high' ? 'border-red-500 text-red-600' :
                        suggestion.priority === 'medium' ? 'border-amber-500 text-amber-600' :
                        'border-muted-foreground'
                      }
                    >
                      {suggestion.priority}
                    </Badge>
                    <div className="flex-1 text-xs">
                      <p className="font-medium">{suggestion.contact_name}</p>
                      <p className="text-muted-foreground">{suggestion.reason}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Deal Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <TrendingUp className="w-4 h-4 text-warm-foreground" />
                Deal Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {totalDealValue > 0 && (
                <div className="p-3 rounded-lg bg-gradient-to-r from-sage/20 to-transparent border border-sage/30">
                  <div className="text-xs text-muted-foreground">Pipeline Value</div>
                  <div className="text-xl font-semibold text-sage">{formatCurrency(totalDealValue)}</div>
                </div>
              )}
              
              {dealsCount > 0 ? (
                <div className="flex items-start gap-2 p-2 rounded-lg bg-muted">
                  <Handshake className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-medium">Next Steps</p>
                    <p className="text-muted-foreground">Follow up on deals in negotiation stage.</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2 p-2 rounded-lg bg-muted">
                  <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-medium">No Active Deals</p>
                    <p className="text-muted-foreground">Create deals to track your pipeline.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Email Draft Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Mail className="w-4 h-4 text-muted-foreground" />
                Email Templates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-muted-foreground">
                AI-powered email templates for your outreach:
              </p>
              <div className="space-y-1">
                <Button variant="ghost" size="sm" className="w-full justify-start text-xs h-8">
                  <MessageSquare className="w-3 h-3 mr-2" />
                  Introduction Email
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-xs h-8">
                  <MessageSquare className="w-3 h-3 mr-2" />
                  Follow-up Template
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-xs h-8">
                  <MessageSquare className="w-3 h-3 mr-2" />
                  Meeting Request
                </Button>
              </div>
              <Button variant="outline" size="sm" className="w-full text-xs mt-2">
                Generate Custom Email
                <ArrowRight className="w-3 h-3 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </ScrollArea>
  );
}
