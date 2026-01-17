import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Brain, 
  FileText, 
  Search,
  Sparkles,
  FileCheck,
  FilePlus,
  MessageSquare,
  Wand2,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";

interface DocumentsAIPanelProps {
  documentsCount: number;
  draftCount: number;
  publishedCount: number;
}

export function DocumentsAIPanel({ documentsCount, draftCount, publishedCount }: DocumentsAIPanelProps) {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {/* AI Document Coach Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Brain className="w-5 h-5 text-primary" />
                Document Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {documentsCount === 0 
                  ? "Create documents to get AI-powered content assistance."
                  : `Managing ${documentsCount} documents with AI assistance.`}
              </p>
              <Button size="sm" className="w-full" variant="sage">
                <Wand2 className="w-4 h-4 mr-2" />
                Generate with AI
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <Separator />

        {/* Document Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <FileText className="w-4 h-4 text-sage" />
                Document Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <div className="text-lg font-semibold">{documentsCount}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <div className="text-lg font-semibold text-warm-foreground">{draftCount}</div>
                  <div className="text-xs text-muted-foreground">Drafts</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <div className="text-lg font-semibold text-sage">{publishedCount}</div>
                  <div className="text-xs text-muted-foreground">Published</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Smart Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Search className="w-4 h-4 text-primary" />
                Semantic Search
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Search by meaning, not just keywords. Find content across all your documents.
              </p>
              <div className="flex items-start gap-2 p-2 rounded-lg bg-sage/10 border border-sage/20">
                <MessageSquare className="w-4 h-4 text-sage mt-0.5 flex-shrink-0" />
                <div className="text-xs">
                  <p className="font-medium text-sage">Ask Questions</p>
                  <p className="text-muted-foreground">"What's our go-to-market strategy?"</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Document Generation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <FilePlus className="w-4 h-4 text-warm-foreground" />
                AI Document Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Generate professional documents based on your startup profile:
              </p>
              <div className="space-y-1">
                <Button variant="ghost" size="sm" className="w-full justify-start text-xs h-8">
                  <Sparkles className="w-3 h-3 mr-2" />
                  Pitch Deck
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-xs h-8">
                  <Sparkles className="w-3 h-3 mr-2" />
                  Executive Summary
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-xs h-8">
                  <Sparkles className="w-3 h-3 mr-2" />
                  Investment Memo
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <FileCheck className="w-4 h-4 text-muted-foreground" />
                Content Quality
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-muted-foreground">
                AI analysis of your documents:
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2 p-2 rounded-lg bg-muted">
                  <CheckCircle2 className="w-4 h-4 text-sage mt-0.5 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-medium">Investor Readiness</p>
                    <p className="text-muted-foreground">Check if documents are ready for investors.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 rounded-lg bg-muted">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-medium">Consistency Check</p>
                    <p className="text-muted-foreground">Ensure messaging is consistent across docs.</p>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full text-xs mt-2">
                Analyze My Documents
                <ArrowRight className="w-3 h-3 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </ScrollArea>
  );
}
