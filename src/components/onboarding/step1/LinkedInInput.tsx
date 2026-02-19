import { Linkedin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LinkedInInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

export function LinkedInInput({ value, onChange, onBlur }: LinkedInInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="linkedin_url">LinkedIn URL</Label>
      <div className="relative">
        <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id="linkedin_url"
          placeholder="https://linkedin.com/company/..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className="pl-10"
        />
      </div>
    </div>
  );
}

export default LinkedInInput;
