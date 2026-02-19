import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ProfileCompletionCardProps {
  percentage: number;
  missingFields?: string[];
  onComplete?: () => void;
}

export function ProfileCompletionCard({ 
  percentage, 
  missingFields = [], 
  onComplete 
}: ProfileCompletionCardProps) {
  const isComplete = percentage >= 100;

  return (
    <div className="p-4 rounded-lg border bg-card">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium">Profile Completion</span>
        <span className={`text-sm font-semibold ${
          percentage >= 80 ? 'text-green-600' : 
          percentage >= 50 ? 'text-yellow-600' : 'text-red-600'
        }`}>
          {percentage}%
        </span>
      </div>
      
      <Progress value={percentage} className="h-2 mb-3" />
      
      {!isComplete && missingFields.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Missing:</p>
          <ul className="space-y-1">
            {missingFields.slice(0, 3).map((field) => (
              <li key={field} className="text-xs flex items-center gap-1.5">
                <AlertCircle className="w-3 h-3 text-yellow-500" />
                {field}
              </li>
            ))}
            {missingFields.length > 3 && (
              <li className="text-xs text-muted-foreground">
                +{missingFields.length - 3} more
              </li>
            )}
          </ul>
        </div>
      )}
      
      {isComplete && (
        <div className="flex items-center gap-1.5 text-xs text-green-600">
          <CheckCircle2 className="w-3 h-3" />
          Profile complete!
        </div>
      )}
      
      {!isComplete && onComplete && (
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-3"
          onClick={onComplete}
        >
          Complete Profile
        </Button>
      )}
    </div>
  );
}
