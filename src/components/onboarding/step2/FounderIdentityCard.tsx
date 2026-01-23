import { useState } from 'react';
import { Users, Sparkles, Loader2, Briefcase, GraduationCap, Award, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { WizardFormData, Founder } from '@/hooks/useWizardSession';
import { cn } from '@/lib/utils';

interface FounderIdentityCardProps {
  data: WizardFormData;
  onUpdate: (updates: Partial<WizardFormData>) => void;
  onEnhanceFounder: (founderId: string, linkedinUrl: string) => Promise<void>;
  isEnrichingFounder: boolean;
}

interface FounderSignal {
  label: string;
  level: 'high' | 'medium' | 'low';
}

function getFounderSignals(founder: Founder): FounderSignal[] {
  const signals: FounderSignal[] = [];
  // Mock signals based on available data
  if (founder.role?.toLowerCase().includes('ceo') || founder.role?.toLowerCase().includes('founder')) {
    signals.push({ label: 'Founder-Market Fit', level: 'high' });
  }
  if (founder.enriched) {
    signals.push({ label: 'Domain Expertise', level: 'high' });
  }
  return signals;
}

export function FounderIdentityCard({
  data,
  onUpdate,
  onEnhanceFounder,
  isEnrichingFounder,
}: FounderIdentityCardProps) {
  const founders = data.founders || [];

  if (founders.length === 0) {
    return (
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Founder Identity & Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No founders added yet. Add founders in Step 1 to see their profiles analyzed here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          Founder Identity & Experience
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {founders.map((founder) => {
          const signals = getFounderSignals(founder);
          
          return (
            <div 
              key={founder.id} 
              className="p-4 bg-accent/20 rounded-lg border border-border/30"
            >
              <div className="flex items-start gap-4">
                <Avatar className="h-14 w-14 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {founder.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold">{founder.name}</h4>
                      <p className="text-sm text-primary">{founder.role}</p>
                      {founder.linkedin_url && (
                        <a 
                          href={founder.linkedin_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mt-1"
                        >
                          LinkedIn <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                    
                    {founder.linkedin_url && !founder.enriched && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs gap-1"
                        onClick={() => onEnhanceFounder(founder.id, founder.linkedin_url!)}
                        disabled={isEnrichingFounder}
                      >
                        {isEnrichingFounder ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Sparkles className="h-3 w-3" />
                        )}
                        Enrich Profile
                      </Button>
                    )}
                  </div>
                  
                  {/* Founder Signals */}
                  {signals.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        Founder Signals
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {signals.map((signal) => (
                          <Badge 
                            key={signal.label}
                            variant="outline"
                            className={cn(
                              'text-xs',
                              signal.level === 'high' && 'bg-primary/10 text-primary border-primary/30',
                              signal.level === 'medium' && 'bg-accent text-accent-foreground',
                              signal.level === 'low' && 'bg-muted text-muted-foreground'
                            )}
                          >
                            {signal.label}: <span className="capitalize ml-1 font-semibold">{signal.level}</span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Experience Summary - Mock Data */}
                  {founder.enriched && (
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/30">
                      <div>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Experience Summary
                        </span>
                        <div className="mt-1 space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Briefcase className="h-3 w-3 text-muted-foreground" />
                            <span><strong>Product Lead</strong> @ Adobe</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Briefcase className="h-3 w-3 text-muted-foreground" />
                            <span><strong>Senior PM</strong> @ Figma</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Education
                        </span>
                        <div className="mt-1 flex items-center gap-2 text-sm">
                          <GraduationCap className="h-3 w-3 text-muted-foreground" />
                          <span>Stanford University, BS Computer Science</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export default FounderIdentityCard;
