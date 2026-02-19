import { formatDistanceToNow } from 'date-fns';
import { Document, DOCUMENT_TYPES, DOCUMENT_STATUSES } from '@/hooks/useDocuments';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  ExternalLink,
  Sparkles,
  Clock
} from 'lucide-react';

interface DocumentCardProps {
  document: Document;
  onEdit: () => void;
  onDelete: () => void;
  onOpen: () => void;
  index: number;
}

export function DocumentCard({ document, onEdit, onDelete, onOpen, index }: DocumentCardProps) {
  const docType = DOCUMENT_TYPES.find(t => t.value === document.type);
  const docStatus = DOCUMENT_STATUSES.find(s => s.value === document.status);

  const updatedAgo = document.updated_at
    ? formatDistanceToNow(new Date(document.updated_at), { addSuffix: true })
    : 'Recently';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card 
        className="group hover:shadow-md transition-all cursor-pointer border-border hover:border-sage/30"
        onClick={onOpen}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{docType?.icon || '📄'}</div>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium truncate">{document.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {docType?.label || document.type}
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onOpen(); }}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive" 
                  onClick={(e) => { e.stopPropagation(); onDelete(); }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Preview content */}
          {document.content && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {document.content.substring(0, 150)}...
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2">
              <Badge 
                variant="secondary" 
                className={`text-xs ${docStatus?.color || ''}`}
              >
                {docStatus?.label || document.status}
              </Badge>
              {document.ai_generated && (
                <Badge variant="outline" className="text-xs gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {updatedAgo}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
