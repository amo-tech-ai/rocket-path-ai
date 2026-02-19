import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  Building2, 
  Linkedin,
  MoreHorizontal,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Contact, CONTACT_TYPES, RELATIONSHIP_STRENGTH } from '@/hooks/useCRM';
import { cn } from '@/lib/utils';

interface ContactCardProps {
  contact: Contact;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
  index?: number;
}

export function ContactCard({ 
  contact, 
  onEdit, 
  onDelete,
  onClick,
  index = 0 
}: ContactCardProps) {
  const contactType = CONTACT_TYPES.find(t => t.value === contact.type);
  const strength = RELATIONSHIP_STRENGTH.find(s => s.value === contact.relationship_strength);
  
  const initials = contact.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="card-premium p-4 hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarFallback className="bg-sage-light text-sage-foreground text-sm font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-medium text-sm truncate">{contact.name}</h3>
            {strength && (
              <span className={cn(
                "w-2 h-2 rounded-full flex-shrink-0",
                strength.color
              )} />
            )}
          </div>
          
          {contact.title && contact.company && (
            <p className="text-xs text-muted-foreground truncate">
              {contact.title} at {contact.company}
            </p>
          )}
          
          <div className="flex items-center gap-2 mt-2">
            {contactType && (
              <Badge variant="secondary" className="text-xs">
                {contactType.label}
              </Badge>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit?.(); }}>
              Edit contact
            </DropdownMenuItem>
            {contact.email && (
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); window.open(`mailto:${contact.email}`); }}>
                <Mail className="w-4 h-4 mr-2" />
                Send email
              </DropdownMenuItem>
            )}
            {contact.linkedin_url && (
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); window.open(contact.linkedin_url!, '_blank'); }}>
                <Linkedin className="w-4 h-4 mr-2" />
                View LinkedIn
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={(e) => { e.stopPropagation(); onDelete?.(); }} 
              className="text-destructive"
            >
              Delete contact
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Quick contact actions */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
        {contact.email && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={(e) => { e.stopPropagation(); window.open(`mailto:${contact.email}`); }}
          >
            <Mail className="w-3 h-3 mr-1" />
            Email
          </Button>
        )}
        {contact.phone && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={(e) => { e.stopPropagation(); window.open(`tel:${contact.phone}`); }}
          >
            <Phone className="w-3 h-3 mr-1" />
            Call
          </Button>
        )}
      </div>
    </motion.div>
  );
}
