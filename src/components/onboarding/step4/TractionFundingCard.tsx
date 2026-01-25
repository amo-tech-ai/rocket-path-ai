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
  isOpen: boolean;
  onToggle: () => void;
}

export function TractionFundingCard({
  data,
  isOpen,
  onToggle,
}: TractionFundingCardProps) {
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
                  {parseTractionValue(
                    data.extracted_traction?.mrr_range || data.extracted_traction?.current_mrr,
                    MRR_LABELS
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Growth</p>
                <p className="text-sm font-medium">
                  {parseTractionValue(
                    data.extracted_traction?.growth_range || data.extracted_traction?.growth_rate,
                    GROWTH_LABELS
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Users</p>
                <p className="text-sm font-medium">
                  {parseTractionValue(
                    data.extracted_traction?.users_range || data.extracted_traction?.users,
                    USERS_LABELS
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Fundraising</p>
                <p className="text-sm font-medium">
                  {parseFundingStatus(data.extracted_funding)}
                </p>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

export default TractionFundingCard;
