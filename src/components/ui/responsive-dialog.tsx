/**
 * Responsive Dialog Component
 * Converts to full-screen sheet on mobile for better UX
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useMobileDetect } from "@/hooks/useMobileDetect";

interface ResponsiveDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  trigger?: React.ReactNode;
}

interface ResponsiveDialogContentProps {
  children: React.ReactNode;
  className?: string;
  side?: "top" | "bottom" | "left" | "right";
}

interface ResponsiveDialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface ResponsiveDialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface ResponsiveDialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

interface ResponsiveDialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

interface ResponsiveDialogCloseProps {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}

const ResponsiveDialogContext = React.createContext<{ isMobile: boolean }>({ isMobile: false });

export function ResponsiveDialog({ 
  open, 
  onOpenChange, 
  children, 
  trigger 
}: ResponsiveDialogProps) {
  const { isMobile, isTablet } = useMobileDetect();
  const useSheet = isMobile || isTablet;

  if (useSheet) {
    return (
      <ResponsiveDialogContext.Provider value={{ isMobile: true }}>
        <Sheet open={open} onOpenChange={onOpenChange}>
          {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
          {children}
        </Sheet>
      </ResponsiveDialogContext.Provider>
    );
  }

  return (
    <ResponsiveDialogContext.Provider value={{ isMobile: false }}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        {children}
      </Dialog>
    </ResponsiveDialogContext.Provider>
  );
}

export function ResponsiveDialogContent({ 
  children, 
  className,
  side = "bottom" 
}: ResponsiveDialogContentProps) {
  const { isMobile } = React.useContext(ResponsiveDialogContext);

  if (isMobile) {
    return (
      <SheetContent 
        side={side} 
        className={cn(
          "h-[90vh] rounded-t-2xl overflow-y-auto",
          className
        )}
      >
        {children}
      </SheetContent>
    );
  }

  return (
    <DialogContent className={cn("max-h-[90vh] overflow-y-auto", className)}>
      {children}
    </DialogContent>
  );
}

export function ResponsiveDialogHeader({ children, className }: ResponsiveDialogHeaderProps) {
  const { isMobile } = React.useContext(ResponsiveDialogContext);

  if (isMobile) {
    return <SheetHeader className={className}>{children}</SheetHeader>;
  }

  return <DialogHeader className={className}>{children}</DialogHeader>;
}

export function ResponsiveDialogTitle({ children, className }: ResponsiveDialogTitleProps) {
  const { isMobile } = React.useContext(ResponsiveDialogContext);

  if (isMobile) {
    return <SheetTitle className={className}>{children}</SheetTitle>;
  }

  return <DialogTitle className={className}>{children}</DialogTitle>;
}

export function ResponsiveDialogDescription({ children, className }: ResponsiveDialogDescriptionProps) {
  const { isMobile } = React.useContext(ResponsiveDialogContext);

  if (isMobile) {
    return <SheetDescription className={className}>{children}</SheetDescription>;
  }

  return <DialogDescription className={className}>{children}</DialogDescription>;
}

export function ResponsiveDialogFooter({ children, className }: ResponsiveDialogFooterProps) {
  const { isMobile } = React.useContext(ResponsiveDialogContext);

  if (isMobile) {
    return (
      <SheetFooter className={cn("pt-4 flex-col gap-2 sm:flex-row", className)}>
        {children}
      </SheetFooter>
    );
  }

  return <DialogFooter className={className}>{children}</DialogFooter>;
}

export function ResponsiveDialogClose({ children, className, asChild }: ResponsiveDialogCloseProps) {
  const { isMobile } = React.useContext(ResponsiveDialogContext);

  if (isMobile) {
    return <SheetClose className={className} asChild={asChild}>{children}</SheetClose>;
  }

  return <DialogClose className={className} asChild={asChild}>{children}</DialogClose>;
}

// Also export the trigger for convenience
export { DialogTrigger as ResponsiveDialogTrigger } from "@/components/ui/dialog";
