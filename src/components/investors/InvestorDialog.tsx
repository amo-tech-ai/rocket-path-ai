import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Investor, InvestorInsert, INVESTOR_STATUSES, INVESTOR_TYPES, INVESTOR_PRIORITIES, useCreateInvestor, useUpdateInvestor } from '@/hooks/useInvestors';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const investorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  firm_name: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  title: z.string().optional(),
  linkedin_url: z.string().url().optional().or(z.literal('')),
  website_url: z.string().url().optional().or(z.literal('')),
  type: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  check_size_min: z.string().optional(),
  check_size_max: z.string().optional(),
  investment_focus: z.string().optional(),
  stage_focus: z.string().optional(),
  warm_intro_from: z.string().optional(),
  notes: z.string().optional(),
});

type InvestorFormValues = z.infer<typeof investorSchema>;

interface InvestorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  investor?: Investor | null;
  startupId: string;
}

export function InvestorDialog({ open, onOpenChange, investor, startupId }: InvestorDialogProps) {
  const createInvestor = useCreateInvestor();
  const updateInvestor = useUpdateInvestor();
  const isEditing = !!investor;

  const form = useForm<InvestorFormValues>({
    resolver: zodResolver(investorSchema),
    defaultValues: {
      name: '',
      firm_name: '',
      email: '',
      phone: '',
      title: '',
      linkedin_url: '',
      website_url: '',
      type: 'vc',
      status: 'researching',
      priority: 'medium',
      check_size_min: '',
      check_size_max: '',
      investment_focus: '',
      stage_focus: '',
      warm_intro_from: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (investor) {
      form.reset({
        name: investor.name || '',
        firm_name: investor.firm_name || '',
        email: investor.email || '',
        phone: investor.phone || '',
        title: investor.title || '',
        linkedin_url: investor.linkedin_url || '',
        website_url: investor.website_url || '',
        type: investor.type || 'vc',
        status: investor.status || 'researching',
        priority: investor.priority || 'medium',
        check_size_min: investor.check_size_min?.toString() || '',
        check_size_max: investor.check_size_max?.toString() || '',
        investment_focus: investor.investment_focus?.join(', ') || '',
        stage_focus: investor.stage_focus?.join(', ') || '',
        warm_intro_from: investor.warm_intro_from || '',
        notes: investor.notes || '',
      });
    } else {
      form.reset({
        name: '',
        firm_name: '',
        email: '',
        phone: '',
        title: '',
        linkedin_url: '',
        website_url: '',
        type: 'vc',
        status: 'researching',
        priority: 'medium',
        check_size_min: '',
        check_size_max: '',
        investment_focus: '',
        stage_focus: '',
        warm_intro_from: '',
        notes: '',
      });
    }
  }, [investor, form]);

  const onSubmit = async (values: InvestorFormValues) => {
    const investorData: InvestorInsert = {
      startup_id: startupId,
      name: values.name,
      firm_name: values.firm_name || null,
      email: values.email || null,
      phone: values.phone || null,
      title: values.title || null,
      linkedin_url: values.linkedin_url || null,
      twitter_url: null,
      website_url: values.website_url || null,
      type: values.type || null,
      status: values.status || 'researching',
      priority: values.priority || 'medium',
      check_size_min: values.check_size_min ? parseFloat(values.check_size_min) : null,
      check_size_max: values.check_size_max ? parseFloat(values.check_size_max) : null,
      investment_focus: values.investment_focus ? values.investment_focus.split(',').map(s => s.trim()).filter(Boolean) : null,
      stage_focus: values.stage_focus ? values.stage_focus.split(',').map(s => s.trim()).filter(Boolean) : null,
      warm_intro_from: values.warm_intro_from || null,
      notes: values.notes || null,
      portfolio_companies: null,
      first_contact_date: null,
      last_contact_date: null,
      next_follow_up: null,
      meetings_count: 0,
      tags: null,
      custom_fields: null,
    };

    if (isEditing && investor) {
      await updateInvestor.mutateAsync({ id: investor.id, ...investorData });
    } else {
      await createInvestor.mutateAsync(investorData);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Investor' : 'Add Investor'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="investment">Investment</TabsTrigger>
                <TabsTrigger value="tracking">Tracking</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="John Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="firm_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Firm Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Sequoia Capital" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Partner" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Investor Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {INVESTOR_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@sequoia.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 000-0000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="linkedin_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn</FormLabel>
                        <FormControl>
                          <Input placeholder="https://linkedin.com/in/..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="website_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="investment" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="check_size_min"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Check Size ($)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="100000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="check_size_max"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Check Size ($)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="500000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="investment_focus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investment Focus (comma-separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="AI/ML, SaaS, Enterprise" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stage_focus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stage Focus (comma-separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="seed, series_a" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="tracking" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {INVESTOR_STATUSES.map((status) => (
                              <SelectItem key={status.value} value={status.value}>
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {INVESTOR_PRIORITIES.map((priority) => (
                              <SelectItem key={priority.value} value={priority.value}>
                                {priority.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="warm_intro_from"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Warm Intro From</FormLabel>
                      <FormControl>
                        <Input placeholder="Who introduced you?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add notes about this investor..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createInvestor.isPending || updateInvestor.isPending}
              >
                {isEditing ? 'Update' : 'Add'} Investor
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
