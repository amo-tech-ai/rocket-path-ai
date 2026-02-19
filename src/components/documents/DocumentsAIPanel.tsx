import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
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
  CheckCircle2,
  Loader2,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  useGenerateDocument, 
  useSearchDocuments, 
  type DocumentTemplate,
  type SearchResult 
} from "@/hooks/useDocumentsAgent";

interface DocumentsAIPanelProps {
  documentsCount: number;
  draftCount: number;
  publishedCount: number;
  startupId?: string;
  onDocumentGenerated?: () => void;
}

const TEMPLATES: { id: DocumentTemplate; label: string; description: string }[] = [
  { id: 'executive_summary', label: 'Executive Summary', description: 'One-page company overview' },
  { id: 'one_pager', label: 'One Pager', description: 'Quick investor snapshot' },
  { id: 'investment_memo', label: 'Investment Memo', description: 'Detailed investment analysis' },
  { id: 'pitch_script', label: 'Pitch Script', description: 'Verbal presentation guide' },
];

export function DocumentsAIPanel({ 
  documentsCount, 
  draftCount, 
  publishedCount,
  startupId,
  onDocumentGenerated 
}: DocumentsAIPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  
  const generateDocument = useGenerateDocument();
  const searchDocuments = useSearchDocuments();

  const handleGenerateDocument = async (template: DocumentTemplate) => {
    if (!startupId) return;
    
    const result = await generateDocument.mutateAsync({
      startupId,
      template,
    });
    
    if (result.success) {
      onDocumentGenerated?.();
    }
  };

  const handleSearch = async () => {
    if (!startupId || !searchQuery.trim()) return;
    
    const result = await searchDocuments.mutateAsync({
      startupId,
      query: searchQuery,
    });
    
    if (result.success) {
      setSearchResults(result);
    }
  };

  const isGenerating = generateDocument.isPending;
  const isSearching = searchDocuments.isPending;

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
              <Button 
                size="sm" 
                className="w-full" 
                variant="sage"
                onClick={() => handleGenerateDocument('executive_summary')}
                disabled={isGenerating || !startupId}
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Wand2 className="w-4 h-4 mr-2" />
                )}
                Generate Executive Summary
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

        {/* Semantic Search */}
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
              <div className="flex gap-2">
                <Input
                  placeholder="Ask a question..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="text-xs"
                />
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleSearch}
                  disabled={isSearching || !searchQuery.trim()}
                >
                  {isSearching ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </Button>
              </div>
              
              {/* Search Results */}
              {searchResults?.success && searchResults.results && searchResults.results.length > 0 && (
                <div className="space-y-2 pt-2 border-t">
                  <p className="text-xs font-medium">{searchResults.total_count} results found</p>
                  {searchResults.results.slice(0, 3).map((result, i) => (
                    <div key={i} className="p-2 rounded-lg bg-muted/50 text-xs">
                      <p className="font-medium">{result.title}</p>
                      <p className="text-muted-foreground line-clamp-2">{result.snippet}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {searchResults?.success && searchResults.results?.length === 0 && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                  <AlertCircle className="w-4 h-4" />
                  No results found
                </div>
              )}
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
                {TEMPLATES.map((template) => (
                  <Button 
                    key={template.id}
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-xs h-8"
                    onClick={() => handleGenerateDocument(template.id)}
                    disabled={isGenerating || !startupId}
                  >
                    <Sparkles className="w-3 h-3 mr-2" />
                    {template.label}
                  </Button>
                ))}
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
              <Button variant="outline" size="sm" className="w-full text-xs mt-2" disabled={documentsCount === 0}>
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
