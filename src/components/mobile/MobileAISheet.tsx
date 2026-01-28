/**
 * Mobile AI Sheet Component
 * Bottom sheet drawer for AI panel access on mobile devices
 */

import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileAISheetProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function MobileAISheet({ 
  children, 
  title = "AI Assistant",
  className 
}: MobileAISheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="default"
          size="lg"
          className={cn(
            "fixed bottom-4 right-4 z-40 rounded-full shadow-lg gap-2 h-14 px-5",
            "xl:hidden", // Hide on desktop where AI panel is visible
            className
          )}
        >
          <Brain className="w-5 h-5" />
          <span className="font-medium">AI</span>
          <ChevronUp className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="bottom" 
        className="h-[85vh] rounded-t-3xl px-0"
      >
        <SheetHeader className="px-6 pb-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            {title}
          </SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto h-full px-6 py-4 pb-safe">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MobileAISheet;
