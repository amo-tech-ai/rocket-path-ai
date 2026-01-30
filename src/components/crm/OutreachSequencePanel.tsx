/**
 * Outreach Sequence Panel
 * Email templates and automated follow-up tracking for investor outreach
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Sparkles,
  Calendar,
  ArrowRight,
  RefreshCw,
  Plus,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  stage: 'initial' | 'follow_up_1' | 'follow_up_2' | 'follow_up_3' | 'meeting_request';
  dayDelay: number;
}

interface OutreachSequence {
  id: string;
  contactId: string;
  contactName: string;
  contactEmail: string;
  currentStage: number;
  status: 'active' | 'paused' | 'completed' | 'responded';
  startedAt: string;
  nextEmailAt?: string;
  emails: OutreachEmail[];
}

interface OutreachEmail {
  id: string;
  stage: string;
  subject: string;
  sentAt?: string;
  openedAt?: string;
  repliedAt?: string;
  status: 'scheduled' | 'sent' | 'opened' | 'replied' | 'bounced';
}

const DEFAULT_TEMPLATES: EmailTemplate[] = [
  {
    id: '1',
    name: 'Initial Outreach',
    stage: 'initial',
    dayDelay: 0,
    subject: 'Quick intro: {{startup_name}} - {{one_liner}}',
    body: `Hi {{investor_name}},

I'm {{founder_name}}, founder of {{startup_name}}. We're {{one_liner}}.

{{traction_highlight}}

I noticed your investment in {{portfolio_company}} and believe our approach to {{problem}} aligns with your thesis.

Would you have 15 minutes this week for a quick call?

Best,
{{founder_name}}`
  },
  {
    id: '2',
    name: 'Follow-up 1 (Day 3)',
    stage: 'follow_up_1',
    dayDelay: 3,
    subject: 'Re: Quick intro: {{startup_name}}',
    body: `Hi {{investor_name}},

Following up on my note from {{days_ago}}. 

Since then, we've {{recent_milestone}}.

Happy to share our deck or jump on a quick call at your convenience.

Best,
{{founder_name}}`
  },
  {
    id: '3',
    name: 'Follow-up 2 (Day 7)',
    stage: 'follow_up_2',
    dayDelay: 7,
    subject: 'Re: {{startup_name}} - Quick update',
    body: `Hi {{investor_name}},

Quick update: {{recent_news}}.

I'd love to get your perspective on our space. Even a 10-minute call would be valuable.

Best,
{{founder_name}}`
  },
  {
    id: '4',
    name: 'Final Follow-up (Day 14)',
    stage: 'follow_up_3',
    dayDelay: 14,
    subject: 'Last note: {{startup_name}}',
    body: `Hi {{investor_name}},

I'll keep this brief - I understand you're busy.

If {{startup_name}} isn't a fit right now, no worries at all. If timing changes, I'd love to reconnect.

Either way, I appreciate your time.

Best,
{{founder_name}}`
  },
  {
    id: '5',
    name: 'Meeting Request',
    stage: 'meeting_request',
    dayDelay: 0,
    subject: '{{startup_name}} x {{investor_firm}} - Meeting Request',
    body: `Hi {{investor_name}},

Thank you for your interest in {{startup_name}}!

I'd love to schedule a 30-minute call to walk through our deck and answer any questions.

Here are a few times that work for me:
- [Time 1]
- [Time 2]  
- [Time 3]

Alternatively, feel free to grab time on my calendar: [calendar_link]

Looking forward to connecting!

Best,
{{founder_name}}`
  }
];

interface OutreachSequencePanelProps {
  startupId?: string;
  selectedContact?: {
    id: string;
    name: string;
    email?: string;
    company?: string;
  } | null;
}

export function OutreachSequencePanel({ startupId, selectedContact }: OutreachSequencePanelProps) {
  const [templates, setTemplates] = useState<EmailTemplate[]>(DEFAULT_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [generatedEmail, setGeneratedEmail] = useState<{ subject: string; body: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSequences, setActiveSequences] = useState<OutreachSequence[]>([]);
  const { toast } = useToast();

  const generatePersonalizedEmail = async (template: EmailTemplate) => {
    if (!startupId || !selectedContact) {
      toast({
        title: 'Select a contact',
        description: 'Please select a contact to personalize the email.',
        variant: 'destructive'
      });
      return;
    }

    setIsGenerating(true);
    setSelectedTemplate(template);

    try {
      const { data, error } = await supabase.functions.invoke('crm-agent', {
        body: {
          action: 'generate_outreach_email',
          startup_id: startupId,
          contact_id: selectedContact.id,
          template: {
            subject: template.subject,
            body: template.body
          }
        }
      });

      if (error) throw error;

      setGeneratedEmail({
        subject: data.subject || template.subject,
        body: data.body || template.body
      });

      toast({
        title: 'Email generated',
        description: 'Personalized email ready. Review and copy.'
      });
    } catch (error) {
      console.error('Failed to generate email:', error);
      // Fallback to template with basic substitution
      setGeneratedEmail({
        subject: template.subject.replace('{{startup_name}}', 'Your Startup'),
        body: template.body
          .replace(/\{\{investor_name\}\}/g, selectedContact?.name || 'there')
          .replace(/\{\{startup_name\}\}/g, 'Your Startup')
          .replace(/\{\{founder_name\}\}/g, 'Founder')
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard' });
  };

  const startSequence = () => {
    if (!selectedContact?.email) {
      toast({
        title: 'Email required',
        description: 'Contact needs an email to start outreach sequence.',
        variant: 'destructive'
      });
      return;
    }

    const newSequence: OutreachSequence = {
      id: crypto.randomUUID(),
      contactId: selectedContact.id,
      contactName: selectedContact.name,
      contactEmail: selectedContact.email,
      currentStage: 0,
      status: 'active',
      startedAt: new Date().toISOString(),
      nextEmailAt: new Date().toISOString(),
      emails: templates.slice(0, 4).map((t, idx) => ({
        id: crypto.randomUUID(),
        stage: t.stage,
        subject: t.subject,
        status: idx === 0 ? 'scheduled' : 'scheduled'
      }))
    };

    setActiveSequences(prev => [...prev, newSequence]);
    toast({
      title: 'Sequence started',
      description: `Outreach sequence started for ${selectedContact.name}`
    });
  };

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="templates" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4 grid grid-cols-2">
          <TabsTrigger value="templates">
            <Mail className="w-4 h-4 mr-1.5" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="sequences">
            <Zap className="w-4 h-4 mr-1.5" />
            Sequences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="flex-1 p-4 space-y-4">
          {/* Contact Context */}
          {selectedContact ? (
            <Card className="bg-muted/30">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{selectedContact.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedContact.email || 'No email'}
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={startSequence}
                    disabled={!selectedContact.email}
                  >
                    <Zap className="w-3.5 h-3.5 mr-1" />
                    Start Sequence
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-muted/30">
              <CardContent className="p-4 text-center">
                <Mail className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Select a contact to personalize emails
                </p>
              </CardContent>
            </Card>
          )}

          {/* Template List */}
          <ScrollArea className="flex-1">
            <div className="space-y-2">
              {templates.map((template) => (
                <motion.div
                  key={template.id}
                  whileHover={{ scale: 1.01 }}
                  className="cursor-pointer"
                  onClick={() => generatePersonalizedEmail(template)}
                >
                  <Card className={`transition-colors hover:bg-muted/50 ${
                    selectedTemplate?.id === template.id ? 'ring-2 ring-primary' : ''
                  }`}>
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm truncate">
                              {template.name}
                            </span>
                            {template.dayDelay > 0 && (
                              <Badge variant="outline" className="text-xs shrink-0">
                                <Clock className="w-3 h-3 mr-1" />
                                Day {template.dayDelay}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {template.subject}
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          disabled={isGenerating}
                        >
                          {isGenerating && selectedTemplate?.id === template.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Sparkles className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </ScrollArea>

          {/* Generated Email Preview */}
          <AnimatePresence>
            {generatedEmail && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader className="p-3 pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">Generated Email</CardTitle>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => copyToClipboard(generatedEmail.subject)}
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0 space-y-2">
                    <div>
                      <Label className="text-xs">Subject</Label>
                      <Input 
                        value={generatedEmail.subject}
                        onChange={(e) => setGeneratedEmail(prev => 
                          prev ? { ...prev, subject: e.target.value } : null
                        )}
                        className="text-sm h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Body</Label>
                      <Textarea 
                        value={generatedEmail.body}
                        onChange={(e) => setGeneratedEmail(prev => 
                          prev ? { ...prev, body: e.target.value } : null
                        )}
                        className="text-sm min-h-[150px] resize-none"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => copyToClipboard(`Subject: ${generatedEmail.subject}\n\n${generatedEmail.body}`)}
                      >
                        <Copy className="w-3.5 h-3.5 mr-1.5" />
                        Copy All
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          window.open(`mailto:${selectedContact?.email}?subject=${encodeURIComponent(generatedEmail.subject)}&body=${encodeURIComponent(generatedEmail.body)}`);
                        }}
                        disabled={!selectedContact?.email}
                      >
                        <Send className="w-3.5 h-3.5 mr-1.5" />
                        Open in Email
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="sequences" className="flex-1 p-4">
          <ScrollArea className="h-full">
            {activeSequences.length === 0 ? (
              <Card className="bg-muted/30">
                <CardContent className="p-6 text-center">
                  <Zap className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                  <h4 className="font-medium mb-1">No Active Sequences</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start an outreach sequence to track follow-ups automatically
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      if (selectedContact) startSequence();
                    }}
                    disabled={!selectedContact}
                  >
                    <Plus className="w-4 h-4 mr-1.5" />
                    Start First Sequence
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {activeSequences.map((sequence) => (
                  <Card key={sequence.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium">{sequence.contactName}</p>
                          <p className="text-xs text-muted-foreground">{sequence.contactEmail}</p>
                        </div>
                        <Badge variant={
                          sequence.status === 'active' ? 'default' :
                          sequence.status === 'responded' ? 'secondary' : 'outline'
                        }>
                          {sequence.status === 'active' && <Clock className="w-3 h-3 mr-1" />}
                          {sequence.status === 'responded' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {sequence.status}
                        </Badge>
                      </div>
                      
                      {/* Sequence Progress */}
                      <div className="flex items-center gap-1">
                        {sequence.emails.map((email, idx) => (
                          <div key={email.id} className="flex items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                              email.status === 'sent' || email.status === 'opened' || email.status === 'replied'
                                ? 'bg-primary text-primary-foreground'
                                : email.status === 'scheduled' && idx === sequence.currentStage
                                  ? 'bg-primary/20 text-primary border-2 border-primary'
                                  : 'bg-muted text-muted-foreground'
                            }`}>
                              {email.status === 'replied' ? (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              ) : (
                                idx + 1
                              )}
                            </div>
                            {idx < sequence.emails.length - 1 && (
                              <ArrowRight className="w-4 h-4 text-muted-foreground mx-0.5" />
                            )}
                          </div>
                        ))}
                      </div>

                      {sequence.nextEmailAt && sequence.status === 'active' && (
                        <p className="text-xs text-muted-foreground mt-2">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          Next email: {new Date(sequence.nextEmailAt).toLocaleDateString()}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default OutreachSequencePanel;
