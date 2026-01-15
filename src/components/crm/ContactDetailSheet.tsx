import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  Phone, 
  Building2, 
  Linkedin, 
  Globe,
  Calendar,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import { Contact, CONTACT_TYPES, RELATIONSHIP_STRENGTH } from '@/hooks/useCRM';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ContactDetailSheetProps {
  contact: Contact | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onAddDeal?: () => void;
}

export function ContactDetailSheet({
  contact,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  onAddDeal,
}: ContactDetailSheetProps) {
  if (!contact) return null;

  const contactType = CONTACT_TYPES.find(t => t.value === contact.type);
  const strength = RELATIONSHIP_STRENGTH.find(s => s.value === contact.relationship_strength);
  
  const initials = contact.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="text-left">
          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="bg-sage-light text-sage-foreground text-lg font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-xl mb-1">{contact.name}</SheetTitle>
              {contact.title && contact.company && (
                <p className="text-sm text-muted-foreground">
                  {contact.title} at {contact.company}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                {contactType && (
                  <Badge variant="secondary">{contactType.label}</Badge>
                )}
                {strength && (
                  <Badge variant="outline" className="gap-1">
                    <span className={cn("w-2 h-2 rounded-full", strength.color)} />
                    {strength.label}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={onEdit}>
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button variant="outline" size="sm" className="flex-1" onClick={onAddDeal}>
              <Plus className="w-4 h-4 mr-1" />
              Add Deal
            </Button>
            <Button variant="outline" size="sm" onClick={onDelete} className="text-destructive hover:text-destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <Separator />

          {/* Contact Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Contact Information</h3>
            
            {contact.email && (
              <a 
                href={`mailto:${contact.email}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{contact.email}</span>
              </a>
            )}
            
            {contact.phone && (
              <a 
                href={`tel:${contact.phone}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{contact.phone}</span>
              </a>
            )}
            
            {contact.company && (
              <div className="flex items-center gap-3 p-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{contact.company}</span>
              </div>
            )}
            
            {contact.linkedin_url && (
              <a 
                href={contact.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <Linkedin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-sage">View LinkedIn Profile</span>
              </a>
            )}
          </div>

          {/* Bio/Notes */}
          {contact.bio && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
                <p className="text-sm whitespace-pre-wrap">{contact.bio}</p>
              </div>
            </>
          )}

          {/* AI Summary */}
          {contact.ai_summary && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">AI Summary</h3>
                <div className="p-3 rounded-lg bg-sage-light/50 border border-sage/20">
                  <p className="text-sm">{contact.ai_summary}</p>
                </div>
              </div>
            </>
          )}

          {/* Tags */}
          {contact.tags && contact.tags.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Tags</h3>
                <div className="flex flex-wrap gap-1.5">
                  {contact.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Metadata */}
          <Separator />
          <div className="space-y-2 text-xs text-muted-foreground">
            {contact.created_at && (
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                <span>Added {format(new Date(contact.created_at), 'MMM d, yyyy')}</span>
              </div>
            )}
            {contact.last_contacted_at && (
              <div className="flex items-center gap-2">
                <Mail className="w-3 h-3" />
                <span>Last contacted {format(new Date(contact.last_contacted_at), 'MMM d, yyyy')}</span>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
