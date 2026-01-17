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
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

interface CRMAIPanelProps {
  contactsCount: number;
  dealsCount: number;
  totalDealValue?: number;
}

export function CRMAIPanel({ contactsCount, dealsCount, totalDealValue = 0 }: CRMAIPanelProps) {
  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

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
              <Button size="sm" className="w-full" variant="sage">
                <Sparkles className="w-4 h-4 mr-2" />
                Get AI Insights
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <Separator />

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
              
              <div className="flex items-start gap-2 p-2 rounded-lg bg-sage/10 border border-sage/20">
                <UserCheck className="w-4 h-4 text-sage mt-0.5 flex-shrink-0" />
                <div className="text-xs">
                  <p className="font-medium text-sage">Engagement Tip</p>
                  <p className="text-muted-foreground">Reach out to contacts you haven't spoken to recently.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

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
