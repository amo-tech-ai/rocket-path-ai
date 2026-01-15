import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { DEAL_STAGES, Contact } from '@/hooks/useCRM';
import { Tables } from '@/integrations/supabase/types';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

type Deal = Tables<'deals'>;

const dealSchema = z.object({
  name: z.string().min(1, 'Deal name is required').max(100),
  contact_id: z.string().optional(),
  amount: z.number().min(0).optional(),
  stage: z.string().default('research'),
  probability: z.number().min(0).max(100).default(0),
  expected_close: z.string().optional(),
  description: z.string().max(500).optional(),
});

type DealFormData = z.infer<typeof dealSchema>;

interface DealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: DealFormData) => Promise<void>;
  deal?: Deal | null;
  contacts: Contact[];
  isLoading?: boolean;
}

export function DealDialog({
  open,
  onOpenChange,
  onSubmit,
  deal,
  contacts,
  isLoading,
}: DealDialogProps) {
  const isEditing = !!deal;
  
  const form = useForm<DealFormData>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      name: '',
      contact_id: '',
      amount: 0,
      stage: 'research',
      probability: 0,
      expected_close: '',
      description: '',
    },
  });

  useEffect(() => {
    if (deal) {
      form.reset({
        name: deal.name || '',
        contact_id: deal.contact_id || '',
        amount: Number(deal.amount) || 0,
        stage: deal.stage || 'research',
        probability: deal.probability || 0,
        expected_close: deal.expected_close || '',
        description: deal.description || '',
      });
    } else {
      form.reset({
        name: '',
        contact_id: '',
        amount: 0,
        stage: 'research',
        probability: 0,
        expected_close: '',
        description: '',
      });
    }
  }, [deal, form]);

  const handleSubmit = async (data: DealFormData) => {
    await onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Deal' : 'Create New Deal'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deal Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Series A - Sequoia" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select contact" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {contacts.map((contact) => (
                        <SelectItem key={contact.id} value={contact.id}>
                          {contact.name} {contact.company && `(${contact.company})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="500000" 
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stage</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DEAL_STAGES.map((stage) => (
                          <SelectItem key={stage.value} value={stage.value}>
                            {stage.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expected_close"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Close</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="probability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Probability: {field.value}%</FormLabel>
                    <FormControl>
                      <Slider
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        max={100}
                        step={5}
                        className="py-2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Deal details, next steps..." 
                      className="resize-none"
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isEditing ? 'Save Changes' : 'Create Deal'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
