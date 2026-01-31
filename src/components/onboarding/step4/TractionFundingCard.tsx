import { Pencil, ChevronDown, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { WizardFormData } from '@/hooks/useWizardSession';
import { 
  parseTractionValue, 
  parseFundingStatus, 
  MRR_LABELS, 
  GROWTH_LABELS, 
  USERS_LABELS 
} from './constants';

interface TractionFundingCardProps {
  data: WizardFormData;
  sessionTraction?: Record<string, unknown> | null;  // Session-level traction data
  sessionFunding?: Record<string, unknown> | null;   // Session-level funding data
  isOpen: boolean;
  onToggle: () => void;
}

export function TractionFundingCard({
  data,
  sessionTraction,
  sessionFunding,
  isOpen,
  onToggle,
}: TractionFundingCardProps) {
  // Merge session data with form data (session takes priority - it's the source of truth from edge function)
  const traction = sessionTraction || data.extracted_traction || {};
  const funding = sessionFunding || data.extracted_funding || {};

  // Check for display values first (set by processAnswer), then fall back to raw values
  const mrrValue = (traction as any)?.mrr_display ||
                   (traction as any)?.mrr_range ||
                   (traction as any)?.current_mrr;
  const growthValue = (traction as any)?.growth_display ||
                      (traction as any)?.growth_range ||
                      (traction as any)?.growth_rate;
  const usersValue = (traction as any)?.users_display ||
                     (traction as any)?.users_range ||
                     (traction as any)?.users;
  const pmfValue = (traction as any)?.pmf_display || (traction as any)?.pmf_status;

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Traction & Funding</CardTitle>
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
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">MRR</p>
                <p className="text-sm font-medium">
                  {mrrValue ?
                    (typeof mrrValue === 'string' && mrrValue.includes('$') ? mrrValue : parseTractionValue(mrrValue, MRR_LABELS))
                    : 'Not set'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Growth</p>
                <p className="text-sm font-medium">
                  {growthValue ? parseTractionValue(growthValue, GROWTH_LABELS) : 'Not set'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Users</p>
                <p className="text-sm font-medium">
                  {usersValue ? parseTractionValue(usersValue, USERS_LABELS) : 'Not set'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Fundraising</p>
                <p className="text-sm font-medium">
                  {(funding as any)?.raising_display || parseFundingStatus(funding) || 'Not set'}
                </p>
              </div>
              {pmfValue && (
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Product-Market Fit</p>
                  <p className="text-sm font-medium">{pmfValue}</p>
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

export default TractionFundingCard;
