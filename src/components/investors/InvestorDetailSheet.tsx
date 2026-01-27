import { useState } from 'react';
import { format } from 'date-fns';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building2,
  Mail,
  Phone,
  Linkedin,
  Globe,
  Calendar,
  DollarSign,
  Star,
  Edit,
  Trash2,
  ExternalLink,
  Brain,
  Target,
  MessageSquare,
  Users,
  Loader2,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Investor, INVESTOR_STATUSES, INVESTOR_TYPES, INVESTOR_PRIORITIES, useDeleteInvestor } from '@/hooks/useInvestors';
import { 
  useAnalyzeInvestorFit, 
  usePrepareMeeting, 
  useGenerateOutreach,
  type FitAnalysis,
  type MeetingPrep,
  type OutreachResult
} from '@/hooks/useInvestorAgent';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface InvestorDetailSheetProps {
  investor: Investor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  startupId?: string;
}

function formatCheckSize(min: number | null, max: number | null) {
  const formatAmount = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
    return `$${num}`;
  };

  if (min && max) {
    return `${formatAmount(min)} - ${formatAmount(max)}`;
  }
  if (min) return `${formatAmount(min)}+`;
  if (max) return `Up to ${formatAmount(max)}`;
  return 'Not specified';
}

export function InvestorDetailSheet({ investor, open, onOpenChange, onEdit, startupId }: InvestorDetailSheetProps) {
  const deleteInvestor = useDeleteInvestor();
  
  // AI Hooks
  const analyzeInvestorFit = useAnalyzeInvestorFit();
  const prepareMeeting = usePrepareMeeting();
  const generateOutreach = useGenerateOutreach();
  
  // AI Results State
  const [fitAnalysis, setFitAnalysis] = useState<FitAnalysis | null>(null);
  const [meetingPrep, setMeetingPrep] = useState<MeetingPrep | null>(null);
  const [outreach, setOutreach] = useState<OutreachResult | null>(null);

  if (!investor) return null;

  const status = INVESTOR_STATUSES.find(s => s.value === investor.status);
  const type = INVESTOR_TYPES.find(t => t.value === investor.type);
  const priority = INVESTOR_PRIORITIES.find(p => p.value === investor.priority);

  const handleDelete = async () => {
    await deleteInvestor.mutateAsync(investor.id);
    onOpenChange(false);
  };

  const handleAnalyzeFit = async () => {
    if (!startupId) return;
    const result = await analyzeInvestorFit.mutateAsync({ 
      startupId, 
      investorId: investor.id 
    });
    if (result.success) {
      setFitAnalysis(result);
    }
  };

  const handlePrepareMeeting = async () => {
    if (!startupId) return;
    const result = await prepareMeeting.mutateAsync({ 
      startupId, 
      investorId: investor.id 
    });
    if (result.success) {
      setMeetingPrep(result);
    }
  };

  const handleGenerateOutreach = async (type: 'cold' | 'warm' | 'follow_up') => {
    if (!startupId) return;
    const result = await generateOutreach.mutateAsync({ 
      startupId, 
      investorId: investor.id,
      outreachType: type
    });
    if (result.success) {
      setOutreach(result);
    }
  };

  const isLoading = analyzeInvestorFit.isPending || prepareMeeting.isPending || generateOutreach.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-hidden p-0">
        <SheetHeader className="p-6 pb-4 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {investor.priority === 'top' && (
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              )}
              <SheetTitle className="text-xl">{investor.name}</SheetTitle>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={onEdit}>
                <Edit className="w-4 h-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Investor</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete {investor.name}? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {investor.firm_name && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="w-4 h-4" />
              <span>{investor.firm_name}</span>
              {investor.title && <span>• {investor.title}</span>}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Badge className={status?.color}>{status?.label || 'Unknown'}</Badge>
            {type && <Badge variant="secondary">{type.label}</Badge>}
            <Badge variant="outline" className={priority?.color}>{priority?.label} Priority</Badge>
          </div>
        </SheetHeader>

        <Tabs defaultValue="details" className="h-[calc(100vh-180px)]">
          <TabsList className="w-full justify-start px-6 rounded-none border-b bg-transparent">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="ai">AI Intelligence</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-full">
            <TabsContent value="details" className="p-6 mt-0 space-y-6">
              {/* Contact Info */}
              <div className="space-y-3">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Contact
                </h3>
                <div className="space-y-2">
                  {investor.email && (
                    <a 
                      href={`mailto:${investor.email}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{investor.email}</span>
                      <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
                    </a>
                  )}
                  {investor.phone && (
                    <a 
                      href={`tel:${investor.phone}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{investor.phone}</span>
                    </a>
                  )}
                  {investor.linkedin_url && (
                    <a 
                      href={investor.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Linkedin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">LinkedIn Profile</span>
                      <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
                    </a>
                  )}
                  {investor.website_url && (
                    <a 
                      href={investor.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Website</span>
                      <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
                    </a>
                  )}
                </div>
              </div>

              <Separator />

              {/* Investment Details */}
              <div className="space-y-3">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Investment Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-xs">Check Size</span>
                    </div>
                    <p className="font-medium">
                      {formatCheckSize(investor.check_size_min, investor.check_size_max)}
                    </p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs">Meetings</span>
                    </div>
                    <p className="font-medium">{investor.meetings_count || 0}</p>
                  </div>
                </div>

                {investor.investment_focus && investor.investment_focus.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Investment Focus</p>
                    <div className="flex flex-wrap gap-1">
                      {investor.investment_focus.map((focus, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {focus}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {investor.stage_focus && investor.stage_focus.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Stage Focus</p>
                    <div className="flex flex-wrap gap-1">
                      {investor.stage_focus.map((stage, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {stage.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Timeline */}
              <div className="space-y-3">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Timeline
                </h3>
                <div className="space-y-2 text-sm">
                  {investor.first_contact_date && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">First Contact</span>
                      <span>{format(new Date(investor.first_contact_date), 'MMM d, yyyy')}</span>
                    </div>
                  )}
                  {investor.last_contact_date && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Contact</span>
                      <span>{format(new Date(investor.last_contact_date), 'MMM d, yyyy')}</span>
                    </div>
                  )}
                  {investor.next_follow_up && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Next Follow-up</span>
                      <span className="text-primary font-medium">
                        {format(new Date(investor.next_follow_up), 'MMM d, yyyy')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {investor.warm_intro_from && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                      Introduction
                    </h3>
                    <p className="text-sm">
                      <span className="font-medium">Warm intro from:</span> {investor.warm_intro_from}
                    </p>
                  </div>
                </>
              )}

              {investor.notes && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                      Notes
                    </h3>
                    <p className="text-sm whitespace-pre-wrap">{investor.notes}</p>
                  </div>
                </>
              )}

              {investor.tags && investor.tags.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {investor.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="ai" className="p-6 mt-0 space-y-4">
              {/* AI Actions */}
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Brain className="w-5 h-5 text-primary" />
                    AI Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Get AI-powered insights for this investor.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={handleAnalyzeFit}
                      disabled={isLoading || !startupId}
                    >
                      {analyzeInvestorFit.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Target className="w-4 h-4 mr-2" />
                      )}
                      Fit Analysis
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={handlePrepareMeeting}
                      disabled={isLoading || !startupId}
                    >
                      {prepareMeeting.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Users className="w-4 h-4 mr-2" />
                      )}
                      Meeting Prep
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleGenerateOutreach('cold')}
                      disabled={isLoading || !startupId}
                    >
                      {generateOutreach.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <MessageSquare className="w-4 h-4 mr-2" />
                      )}
                      Draft Outreach
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Fit Analysis Results */}
              {fitAnalysis?.success && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                      <Target className="w-4 h-4 text-sage" />
                      Investor Fit Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl font-bold text-sage">{fitAnalysis.overall_score}</div>
                      <span className="text-sm text-muted-foreground">/100</span>
                    </div>
                    
                    {fitAnalysis.strengths && fitAnalysis.strengths.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-sage flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Strengths
                        </p>
                        {fitAnalysis.strengths.slice(0, 3).map((s, i) => (
                          <p key={i} className="text-xs text-muted-foreground pl-4">• {s}</p>
                        ))}
                      </div>
                    )}
                    
                    {fitAnalysis.concerns && fitAnalysis.concerns.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-amber-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Concerns
                        </p>
                        {fitAnalysis.concerns.slice(0, 3).map((c, i) => (
                          <p key={i} className="text-xs text-muted-foreground pl-4">• {c}</p>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-xs text-muted-foreground pt-2 border-t">
                      <span className="font-medium">Recommendation:</span> {fitAnalysis.recommendation}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Meeting Prep Results */}
              {meetingPrep?.success && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                      <Users className="w-4 h-4 text-primary" />
                      Meeting Preparation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {meetingPrep.key_talking_points && meetingPrep.key_talking_points.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium">Key Talking Points</p>
                        {meetingPrep.key_talking_points.slice(0, 4).map((point, i) => (
                          <p key={i} className="text-xs text-muted-foreground">• {point}</p>
                        ))}
                      </div>
                    )}
                    
                    {meetingPrep.questions_to_expect && meetingPrep.questions_to_expect.length > 0 && (
                      <div className="space-y-1 pt-2 border-t">
                        <p className="text-xs font-medium">Expect These Questions</p>
                        {meetingPrep.questions_to_expect.slice(0, 3).map((q, i) => (
                          <div key={i} className="text-xs">
                            <p className="font-medium text-muted-foreground">Q: {q.question}</p>
                            <p className="text-muted-foreground/80 pl-4">A: {q.suggested_answer}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {meetingPrep.questions_to_ask && meetingPrep.questions_to_ask.length > 0 && (
                      <div className="space-y-1 pt-2 border-t">
                        <p className="text-xs font-medium">Questions to Ask Them</p>
                        {meetingPrep.questions_to_ask.slice(0, 3).map((q, i) => (
                          <p key={i} className="text-xs text-muted-foreground">• {q}</p>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Outreach Results */}
              {outreach?.success && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                      <MessageSquare className="w-4 h-4 text-warm-foreground" />
                      Outreach Email
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {outreach.subject_lines && outreach.subject_lines.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium">Subject Lines</p>
                        {outreach.subject_lines.map((subject, i) => (
                          <p key={i} className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                            {subject}
                          </p>
                        ))}
                      </div>
                    )}
                    
                    {outreach.email_body && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium">Email Body</p>
                        <div className="text-xs text-muted-foreground bg-muted p-3 rounded whitespace-pre-wrap max-h-48 overflow-y-auto">
                          {outreach.email_body}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleGenerateOutreach('warm')}
                        disabled={isLoading}
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        Warm Intro
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleGenerateOutreach('follow_up')}
                        disabled={isLoading}
                      >
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Follow-up
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Empty State */}
              {!fitAnalysis && !meetingPrep && !outreach && (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">Click an action above to get AI insights</p>
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
