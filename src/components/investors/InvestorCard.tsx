import { Building2, Mail, Linkedin, Calendar, DollarSign, Star, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Investor, INVESTOR_STATUSES, INVESTOR_PRIORITIES, INVESTOR_TYPES } from '@/hooks/useInvestors';
import { format } from 'date-fns';

interface InvestorCardProps {
  investor: Investor;
  onClick?: () => void;
  onStatusChange?: (status: string) => void;
  isDragging?: boolean;
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
  return null;
}

export function InvestorCard({ investor, onClick, onStatusChange, isDragging }: InvestorCardProps) {
  const status = INVESTOR_STATUSES.find(s => s.value === investor.status);
  const priority = INVESTOR_PRIORITIES.find(p => p.value === investor.priority);
  const type = INVESTOR_TYPES.find(t => t.value === investor.type);
  const checkSize = formatCheckSize(investor.check_size_min, investor.check_size_max);

  const getNextStatus = () => {
    const currentIndex = INVESTOR_STATUSES.findIndex(s => s.value === investor.status);
    if (currentIndex < INVESTOR_STATUSES.length - 2) { // Don't auto-advance to "passed"
      return INVESTOR_STATUSES[currentIndex + 1];
    }
    return null;
  };

  const nextStatus = getNextStatus();

  return (
    <Card 
      className={`p-4 cursor-pointer hover:shadow-md transition-all border-l-4 ${
        isDragging ? 'opacity-50 rotate-2' : ''
      }`}
      style={{ borderLeftColor: status?.color.replace('bg-', 'var(--') || 'var(--border)' }}
      onClick={onClick}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('investorId', investor.id);
        e.dataTransfer.setData('currentStatus', investor.status || '');
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium truncate">{investor.name}</h3>
            {investor.priority === 'top' && (
              <Star className="w-4 h-4 text-amber-500 fill-amber-500 flex-shrink-0" />
            )}
          </div>
          {investor.firm_name && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Building2 className="w-3 h-3" />
              <span className="truncate">{investor.firm_name}</span>
            </div>
          )}
        </div>
        <Badge variant="outline" className={`text-xs flex-shrink-0 ${priority?.color}`}>
          {priority?.label || 'Medium'}
        </Badge>
      </div>

      {investor.title && (
        <p className="text-sm text-muted-foreground mb-2">{investor.title}</p>
      )}

      <div className="flex flex-wrap gap-1 mb-3">
        {type && (
          <Badge variant="secondary" className="text-xs">
            {type.label}
          </Badge>
        )}
        {checkSize && (
          <Badge variant="outline" className="text-xs">
            <DollarSign className="w-3 h-3 mr-0.5" />
            {checkSize}
          </Badge>
        )}
      </div>

      {investor.investment_focus && investor.investment_focus.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {investor.investment_focus.slice(0, 3).map((focus, i) => (
            <Badge key={i} variant="outline" className="text-xs bg-muted/50">
              {focus}
            </Badge>
          ))}
          {investor.investment_focus.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{investor.investment_focus.length - 3}
            </Badge>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
        <div className="flex items-center gap-3">
          {investor.last_contact_date && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {format(new Date(investor.last_contact_date), 'MMM d')}
            </span>
          )}
          {investor.email && (
            <Mail className="w-3 h-3" />
          )}
          {investor.linkedin_url && (
            <Linkedin className="w-3 h-3" />
          )}
        </div>
        
        {nextStatus && onStatusChange && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs px-2"
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(nextStatus.value);
            }}
          >
            <ArrowRight className="w-3 h-3 mr-1" />
            {nextStatus.label}
          </Button>
        )}
      </div>

      {investor.warm_intro_from && (
        <div className="mt-2 pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Intro:</span> {investor.warm_intro_from}
          </p>
        </div>
      )}
    </Card>
  );
}
