import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUserStartup, useUpdateStartup, STARTUP_STAGES, INDUSTRIES } from '@/hooks/useSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Building2, Globe, Linkedin, Github, Loader2 } from 'lucide-react';

const startupSchema = z.object({
  name: z.string().min(1, 'Startup name is required'),
  tagline: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  website_url: z.string().url('Invalid URL').nullable().optional().or(z.literal('')),
  linkedin_url: z.string().url('Invalid URL').nullable().optional().or(z.literal('')),
  github_url: z.string().url('Invalid URL').nullable().optional().or(z.literal('')),
  stage: z.string().nullable().optional(),
  industry: z.string().nullable().optional(),
  team_size: z.number().min(1).nullable().optional(),
  is_raising: z.boolean().optional(),
  raise_amount: z.number().min(0).nullable().optional(),
});

type StartupFormData = z.infer<typeof startupSchema>;

export function StartupSettings() {
  const { data: startup, isLoading } = useUserStartup();
  const updateStartup = useUpdateStartup();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<StartupFormData>({
    resolver: zodResolver(startupSchema),
    defaultValues: {
      name: '',
      tagline: '',
      description: '',
      website_url: '',
      linkedin_url: '',
      github_url: '',
      stage: null,
      industry: null,
      team_size: null,
      is_raising: false,
      raise_amount: null,
    },
  });

  const isRaising = watch('is_raising');

  useEffect(() => {
    if (startup) {
      reset({
        name: startup.name,
        tagline: startup.tagline || '',
        description: startup.description || '',
        website_url: startup.website_url || '',
        linkedin_url: startup.linkedin_url || '',
        github_url: startup.github_url || '',
        stage: startup.stage,
        industry: startup.industry,
        team_size: startup.team_size,
        is_raising: startup.is_raising || false,
        raise_amount: startup.raise_amount,
      });
    }
  }, [startup, reset]);

  const onSubmit = async (data: StartupFormData) => {
    if (!startup?.id) return;

    try {
      await updateStartup.mutateAsync({
        id: startup.id,
        updates: {
          ...data,
          website_url: data.website_url || null,
          linkedin_url: data.linkedin_url || null,
          github_url: data.github_url || null,
        },
      });
      toast.success('Startup profile updated');
    } catch (error) {
      toast.error('Failed to update startup profile');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!startup) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Startup Profile
          </CardTitle>
          <CardDescription>
            No startup profile found. Complete onboarding to create one.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Startup Profile
        </CardTitle>
        <CardDescription>
          Manage your startup's information and settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Startup Name *</Label>
              <Input id="name" {...register('name')} />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input 
                id="tagline" 
                placeholder="One line description"
                {...register('tagline')} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What does your startup do?"
              rows={3}
              {...register('description')}
            />
          </div>

          {/* Stage & Industry */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Stage</Label>
              <Select
                value={watch('stage') || undefined}
                onValueChange={(value) => setValue('stage', value, { shouldDirty: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {STARTUP_STAGES.map((stage) => (
                    <SelectItem key={stage.value} value={stage.value}>
                      {stage.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Industry</Label>
              <Select
                value={watch('industry') || undefined}
                onValueChange={(value) => setValue('industry', value, { shouldDirty: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((industry) => (
                    <SelectItem key={industry.value} value={industry.value}>
                      {industry.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Team Size */}
          <div className="space-y-2">
            <Label htmlFor="team_size">Team Size</Label>
            <Input
              id="team_size"
              type="number"
              min={1}
              {...register('team_size', { valueAsNumber: true })}
            />
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <Label className="text-base">Links</Label>
            <div className="grid gap-3">
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Website URL"
                  className="pl-9"
                  {...register('website_url')}
                />
              </div>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="LinkedIn URL"
                  className="pl-9"
                  {...register('linkedin_url')}
                />
              </div>
              <div className="relative">
                <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="GitHub URL"
                  className="pl-9"
                  {...register('github_url')}
                />
              </div>
            </div>
          </div>

          {/* Fundraising */}
          <div className="space-y-4 p-4 rounded-lg bg-secondary/50 border">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="is_raising" className="text-base">Currently Raising</Label>
                <p className="text-sm text-muted-foreground">
                  Enable to show fundraising progress on dashboard
                </p>
              </div>
              <Switch
                id="is_raising"
                checked={isRaising}
                onCheckedChange={(checked) => setValue('is_raising', checked, { shouldDirty: true })}
              />
            </div>

            {isRaising && (
              <div className="space-y-2">
                <Label htmlFor="raise_amount">Target Amount ($)</Label>
                <Input
                  id="raise_amount"
                  type="number"
                  min={0}
                  step={10000}
                  placeholder="1000000"
                  {...register('raise_amount', { valueAsNumber: true })}
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!isDirty || updateStartup.isPending}
            >
              {updateStartup.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
