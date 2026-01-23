import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Globe, Linkedin, Database, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { WizardFormData } from '@/hooks/useWizardSession';

interface ResearchQueriesCardProps {
  data: WizardFormData;
}

interface Query {
  query: string;
  source: string;
  icon: React.ReactNode;
}

export function ResearchQueriesCard({ data }: ResearchQueriesCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const queries: Query[] = [
    { query: `"${data.company_name || 'Company'}" competitors SaaS`, source: 'Google Search', icon: <Globe className="h-3 w-3" /> },
    { query: `${data.industry || 'Marketing'} technology market trends 2024`, source: 'Google Search', icon: <Globe className="h-3 w-3" /> },
    { query: data.website_url || 'website', source: 'URL Context', icon: <Globe className="h-3 w-3 text-primary" /> },
    { query: 'Founder LinkedIn profiles', source: 'LinkedIn', icon: <Linkedin className="h-3 w-3" /> },
    { query: 'Company funding rounds', source: 'Crunchbase', icon: <Database className="h-3 w-3" /> },
  ];

  const dataSources = [
    { name: 'Website', icon: <Globe className="h-3 w-3" /> },
    { name: 'LinkedIn', icon: <Linkedin className="h-3 w-3" /> },
    { name: 'Crunchbase', icon: <Database className="h-3 w-3" /> },
    { name: 'Reviews', icon: <Star className="h-3 w-3" /> },
  ];

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-border/50">
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-3 cursor-pointer hover:bg-accent/30 transition-colors rounded-t-lg">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" />
                Research Queries Used
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  System Log
                </Badge>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-4">
            {/* Queries */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Queries Executed
              </span>
              <div className="space-y-1.5">
                {queries.map((q, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm p-2 bg-muted/30 rounded">
                    {q.icon}
                    <span className="font-mono text-xs flex-1 truncate">{q.query}</span>
                    <Badge variant="secondary" className="text-[10px]">{q.source}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Sources */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Data Sources Consulted
              </span>
              <div className="flex flex-wrap gap-2">
                {dataSources.map((source) => (
                  <Badge 
                    key={source.name} 
                    variant="outline" 
                    className="text-xs flex items-center gap-1"
                  >
                    {source.icon}
                    {source.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

export default ResearchQueriesCard;
