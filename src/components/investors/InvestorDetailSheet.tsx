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
} from 'lucide-react';
import { Investor, INVESTOR_STATUSES, INVESTOR_TYPES, INVESTOR_PRIORITIES, useDeleteInvestor } from '@/hooks/useInvestors';
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

interface InvestorDetailSheetProps {
  investor: Investor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
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

export function InvestorDetailSheet({ investor, open, onOpenChange, onEdit }: InvestorDetailSheetProps) {
  const deleteInvestor = useDeleteInvestor();

  if (!investor) return null;

  const status = INVESTOR_STATUSES.find(s => s.value === investor.status);
  const type = INVESTOR_TYPES.find(t => t.value === investor.type);
  const priority = INVESTOR_PRIORITIES.find(p => p.value === investor.priority);

  const handleDelete = async () => {
    await deleteInvestor.mutateAsync(investor.id);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="space-y-4">
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

        <div className="mt-6 space-y-6">
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
        </div>
      </SheetContent>
    </Sheet>
  );
}
