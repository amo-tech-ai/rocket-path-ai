import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Edit,
  Trash2,
  Download,
  Sparkles,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Wand2,
  ClipboardList,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { 
  useAnalyzeDocument, 
  useImproveSection,
  useSummarizeDocument,
  type DocumentAnalysis 
} from "@/hooks/useDocumentsAgent";
import type { Document } from "@/hooks/useDocuments";

interface DocumentDetailSheetProps {
  document: Document | null;
  startupId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  in_review: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  archived: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

export function DocumentDetailSheet({
  document,
  startupId,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: DocumentDetailSheetProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [summary, setSummary] = useState<string | null>(null);

  const analyzeDocument = useAnalyzeDocument();
  const summarizeDocument = useSummarizeDocument();
  const improveSection = useImproveSection();

  if (!document) return null;

  const handleAnalyze = async () => {
    if (!startupId) return;
    
    const result = await analyzeDocument.mutateAsync({
      startupId,
      documentId: document.id,
    });
    
    if (result.success) {
      setAnalysis(result);
    }
  };

  const handleSummarize = async () => {
    if (!startupId) return;
    
    const result = await summarizeDocument.mutateAsync({
      startupId,
      documentId: document.id,
    });
    
    if (result.success && result.summary) {
      setSummary(result.summary);
    }
  };

  const handleImproveContent = async () => {
    if (!startupId || !document.content) return;
    
    await improveSection.mutateAsync({
      startupId,
      documentId: document.id,
      sectionName: "main",
      currentContent: document.content,
      improvementGoal: "clarity",
    });
  };

  const isAnalyzing = analyzeDocument.isPending;
  const isSummarizing = summarizeDocument.isPending;
  const isImproving = improveSection.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-hidden flex flex-col">
        <SheetHeader className="flex-shrink-0">
          <div className="flex items-start justify-between pr-8">
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-lg font-semibold truncate">
                {document.title}
              </SheetTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="capitalize">
                  {document.type.replace(/_/g, " ")}
                </Badge>
                <Badge className={statusColors[document.status || "draft"]}>
                  {document.status || "draft"}
                </Badge>
              </div>
            </div>
          </div>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0 mt-4">
          <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 mt-4">
            <TabsContent value="overview" className="m-0 space-y-4">
              {/* Document Info */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Document Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span>{format(new Date(document.created_at || new Date()), "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Updated</span>
                    <span>{format(new Date(document.updated_at || new Date()), "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Version</span>
                    <span>v{document.version || 1}</span>
                  </div>
                  {document.ai_generated && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Source</span>
                      <Badge variant="secondary" className="text-xs">
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI Generated
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Content Preview */}
              {document.content && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Content Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-6 whitespace-pre-wrap">
                      {document.content}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Summary */}
              {summary && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-primary/20 bg-primary/5">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <ClipboardList className="w-4 h-4 text-primary" />
                        AI Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{summary}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="analysis" className="m-0 space-y-4">
              {!analysis ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">Analyze Document</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get AI-powered quality scores and improvement suggestions
                    </p>
                    <Button onClick={handleAnalyze} disabled={isAnalyzing || !startupId}>
                      {isAnalyzing ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4 mr-2" />
                      )}
                      Analyze Now
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    {/* Overall Score */}
                    {analysis.scores && (
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
                            <Badge variant={analysis.scores.overall >= 80 ? "default" : analysis.scores.overall >= 60 ? "secondary" : "outline"}>
                              {analysis.scores.overall}/100
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Clarity</span>
                              <span>{analysis.scores.clarity}%</span>
                            </div>
                            <Progress value={analysis.scores.clarity} className="h-2" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Completeness</span>
                              <span>{analysis.scores.completeness}%</span>
                            </div>
                            <Progress value={analysis.scores.completeness} className="h-2" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Persuasiveness</span>
                              <span>{analysis.scores.persuasiveness}%</span>
                            </div>
                            <Progress value={analysis.scores.persuasiveness} className="h-2" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Investor Readiness</span>
                              <span>{analysis.scores.investor_readiness}%</span>
                            </div>
                            <Progress value={analysis.scores.investor_readiness} className="h-2" />
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Strengths */}
                    {analysis.strengths && analysis.strengths.length > 0 && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-sage" />
                            Strengths
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {analysis.strengths.map((strength, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <TrendingUp className="w-4 h-4 text-sage mt-0.5 flex-shrink-0" />
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {/* Weaknesses */}
                    {analysis.weaknesses && analysis.weaknesses.length > 0 && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-warm-foreground" />
                            Areas to Improve
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {analysis.weaknesses.map((weakness, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <AlertTriangle className="w-4 h-4 text-warm-foreground mt-0.5 flex-shrink-0" />
                                {weakness}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {/* Suggestions */}
                    {analysis.suggestions && analysis.suggestions.length > 0 && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            Suggestions
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {analysis.suggestions.map((suggestion, i) => (
                              <li key={i} className="text-sm p-2 rounded-lg bg-muted">
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
                      Re-analyze
                    </Button>
                  </motion.div>
                </AnimatePresence>
              )}
            </TabsContent>

            <TabsContent value="actions" className="m-0 space-y-4">
              {/* AI Actions */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    AI Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleSummarize}
                    disabled={isSummarizing || !startupId}
                  >
                    {isSummarizing ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <ClipboardList className="w-4 h-4 mr-2" />
                    )}
                    Generate Summary
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !startupId}
                  >
                    {isAnalyzing ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Target className="w-4 h-4 mr-2" />
                    )}
                    Analyze Quality
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleImproveContent}
                    disabled={isImproving || !startupId || !document.content}
                  >
                    {isImproving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Wand2 className="w-4 h-4 mr-2" />
                    )}
                    Improve Content
                  </Button>
                </CardContent>
              </Card>

              <Separator />

              {/* Standard Actions */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Document Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={onEdit}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Document
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    disabled
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-destructive hover:text-destructive"
                    onClick={onDelete}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Document
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
