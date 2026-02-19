import { Pencil, ChevronDown, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { WizardFormData } from '@/hooks/useWizardSession';

interface CompanyDetailsCardProps {
  data: WizardFormData;
  isOpen: boolean;
  onToggle: () => void;
}

export function CompanyDetailsCard({
  data,
  isOpen,
  onToggle,
}: CompanyDetailsCardProps) {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Company Details</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                  <Pencil className="h-4 w-4" />
                </Button>
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-3">
            <div>
              <p className="text-xs text-muted-foreground">Name</p>
              <p className="text-sm font-medium">{data.name || data.company_name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Description</p>
              <p className="text-sm">{data.description}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {data.industry && (
                Array.isArray(data.industry) 
                  ? data.industry.map((ind, i) => <Badge key={i}>{ind}</Badge>)
                  : <Badge>{data.industry}</Badge>
              )}
              {data.business_model?.map((m, i) => (
                <Badge key={i} variant="secondary">{m}</Badge>
              ))}
              {data.stage && <Badge variant="outline">{data.stage}</Badge>}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

export default CompanyDetailsCard;
