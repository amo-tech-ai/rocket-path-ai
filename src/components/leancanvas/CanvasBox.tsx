import { useState, useRef, KeyboardEvent } from 'react';
import { Edit2, Check, AlertTriangle, AlertCircle, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface CanvasBoxProps {
  title: string;
  description: string;
  placeholder: string;
  items: string[];
  validation?: 'valid' | 'warning' | 'error';
  validationMessage?: string;
  onUpdate: (items: string[]) => void;
  className?: string;
}

export function CanvasBox({
  title,
  description,
  placeholder,
  items,
  validation,
  validationMessage,
  onUpdate,
  className,
}: CanvasBoxProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newItem, setNewItem] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddItem = () => {
    if (newItem.trim()) {
      onUpdate([...items, newItem.trim()]);
      setNewItem('');
      inputRef.current?.focus();
    }
  };

  const handleRemoveItem = (index: number) => {
    onUpdate(items.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const validationIcon = {
    valid: <Check className="w-3.5 h-3.5 text-sage" />,
    warning: <AlertTriangle className="w-3.5 h-3.5 text-warm-foreground" />,
    error: <AlertCircle className="w-3.5 h-3.5 text-destructive" />,
  };

  const validationBorder = {
    valid: 'border-sage/40',
    warning: 'border-warm/40',
    error: 'border-destructive/40',
  };

  return (
    <motion.div
      layout
      className={cn(
        "relative p-4 rounded-xl bg-card border transition-colors h-full flex flex-col",
        validation ? validationBorder[validation] : "border-border",
        isEditing && "ring-2 ring-sage/30",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">{title}</h3>
            {validation && (
              <span title={validationMessage}>
                {validationIcon[validation]}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 flex-shrink-0"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1.5 min-h-[60px]">
        <AnimatePresence mode="popLayout">
          {items.length === 0 && !isEditing ? (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-muted-foreground/60 italic"
            >
              {placeholder}
            </motion.p>
          ) : (
            items.map((item, index) => (
              <motion.div
                key={`${item}-${index}`}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-start gap-2 group"
              >
                <span className="text-sage mt-0.5">•</span>
                <span className="text-sm flex-1">{item}</span>
                {isEditing && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveItem(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Edit input */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t"
          >
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                placeholder="Add item..."
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-8 text-sm"
                autoFocus
              />
              <Button
                size="sm"
                variant="sage"
                className="h-8"
                onClick={handleAddItem}
                disabled={!newItem.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5">
              Press Enter to add, Esc to close
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
