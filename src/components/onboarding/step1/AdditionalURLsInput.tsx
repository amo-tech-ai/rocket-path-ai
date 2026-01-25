import { Link2, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface AdditionalURLsInputProps {
  urls: string[];
  onAdd: (url: string) => void;
  onRemove: (index: number) => void;
}

export function AdditionalURLsInput({ urls, onAdd, onRemove }: AdditionalURLsInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="space-y-2">
      <Label>Additional URLs (optional)</Label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Blog, press release, docs..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={handleAdd} disabled={!inputValue.trim()}>
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
      {urls.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {urls.map((url, index) => (
            <div
              key={index}
              className="flex items-center gap-1 px-2 py-1 bg-accent rounded-md text-sm"
            >
              <span className="truncate max-w-[200px]">{url}</span>
              <button
                onClick={() => onRemove(index)}
                className="text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdditionalURLsInput;
