import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Question } from './Step3Interview';

interface QuestionCardProps {
  question: Question;
  selectedAnswer: string | null;
  selectedMulti: string[];
  onSelectAnswer: (answerId: string) => void;
  onToggleMulti: (answerId: string) => void;
}

export function QuestionCard({
  question,
  selectedAnswer,
  selectedMulti,
  onSelectAnswer,
  onToggleMulti,
}: QuestionCardProps) {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg leading-relaxed">
            {question.text}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {question.type === 'multiple_choice' && question.options && (
            <RadioGroup
              value={selectedAnswer || ''}
              onValueChange={onSelectAnswer}
              className="space-y-3"
            >
              {question.options.map((option) => (
                <div
                  key={option.id}
                  className={cn(
                    'flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer',
                    selectedAnswer === option.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-accent/50'
                  )}
                  onClick={() => onSelectAnswer(option.id)}
                >
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                    {option.emoji && <span className="mr-2">{option.emoji}</span>}
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {question.type === 'multi_select' && question.options && (
            <div className="space-y-3">
              {question.options.map((option) => (
                <div
                  key={option.id}
                  className={cn(
                    'flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer',
                    selectedMulti.includes(option.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-accent/50'
                  )}
                  onClick={() => onToggleMulti(option.id)}
                >
                  <Checkbox
                    checked={selectedMulti.includes(option.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onToggleMulti(option.id);
                      } else {
                        onToggleMulti(option.id);
                      }
                    }}
                  />
                  <Label className="flex-1 cursor-pointer">{option.text}</Label>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Answer honestly — accuracy improves your score more than optimism.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default QuestionCard;
