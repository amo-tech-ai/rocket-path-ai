import { Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { TOPICS, normalizeTopic } from './constants';
import { Question } from './Step3Interview';
import { InterviewAnswer } from '@/hooks/useWizardSession';

interface TopicBadgesProps {
  questions: Question[];
  answers: InterviewAnswer[];
}

export function TopicBadges({ questions, answers }: TopicBadgesProps) {
  // Build set of covered topics with normalized comparison
  const topicsCoveredSet = new Set(
    answers
      .map(a => questions.find(q => q.id === a.question_id)?.topic)
      .filter(Boolean)
      .map(t => normalizeTopic(t as string))
  );

  return (
    <div className="flex flex-wrap gap-2">
      {TOPICS.map((topic) => {
        const isCovered = topicsCoveredSet.has(normalizeTopic(topic));
        return (
          <Badge
            key={topic}
            variant={isCovered ? 'default' : 'outline'}
            className={cn(
              'text-xs',
              isCovered && 'bg-primary text-primary-foreground'
            )}
          >
            {isCovered && <Check className="h-3 w-3 mr-1" />}
            {topic}
          </Badge>
        );
      })}
    </div>
  );
}

export default TopicBadges;
