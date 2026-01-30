/**
 * Chat History Dialog
 * Modal wrapper for ChatHistorySearch component
 */

import { useState } from 'react';
import { History, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ChatHistorySearch } from './ChatHistorySearch';
import { cn } from '@/lib/utils';

interface ChatHistoryDialogProps {
  onSelectMessage?: (message: { content: string; role: string }, session: { id: string }) => void;
  triggerClassName?: string;
}

export function ChatHistoryDialog({ onSelectMessage, triggerClassName }: ChatHistoryDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectMessage = (message: { content: string; role: string; id: string }, session: { id: string }) => {
    onSelectMessage?.(message, session);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", triggerClassName)}
          title="Chat History"
        >
          <History className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] h-[600px] p-0 flex flex-col">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <History className="w-4 h-4" />
            Chat History
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <ChatHistorySearch 
            onSelectMessage={handleSelectMessage}
            className="h-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ChatHistoryDialog;
