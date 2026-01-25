import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CompanyNameInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  showError: boolean;
  touched: boolean;
}

export function CompanyNameInput({
  value,
  onChange,
  onBlur,
  error,
  showError,
  touched,
}: CompanyNameInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="company_name" className="flex items-center gap-1">
        Company Name
        <span className="text-destructive">*</span>
      </Label>
      <Input
        id="company_name"
        placeholder="e.g. ACME Corp"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={showError && error ? 'border-destructive' : ''}
      />
      {showError && touched && error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}

export default CompanyNameInput;
