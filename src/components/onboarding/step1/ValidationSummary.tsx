import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ValidationSummaryProps {
  missingFields: string[];
  showErrors: boolean;
  isValid: boolean;
}

export function ValidationSummary({ missingFields, showErrors, isValid }: ValidationSummaryProps) {
  if (!showErrors || isValid || missingFields.length === 0) {
    return null;
  }

  return (
    <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        <span className="font-medium">Missing required fields: </span>
        {missingFields.join(', ')}
      </AlertDescription>
    </Alert>
  );
}

export default ValidationSummary;
