import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useUserStartup, useUpdateStartup, STARTUP_STAGES, INDUSTRIES } from '@/hooks/useSettings';
import { ProfileCompletionCard } from '@/components/profile/ProfileCompletionCard';
import { ProfileAIPanel } from '@/components/profile/ProfileAIPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Globe,
  Linkedin,
  Twitter,
  Github,
  Upload,
  Loader2,
  LayoutDashboard,
  FolderKanban,
  Users,
  TrendingUp,
  DollarSign,
  Rocket,
  User,
  Settings,
  Plus,
  X,
} from 'lucide-react';

const companySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  founded_year: z.number().min(1900).max(new Date().getFullYear()).nullable().optional(),
  tagline: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  headquarters: z.string().nullable().optional(),
  industry: z.string().nullable().optional(),
  business_model: z.string().nullable().optional(),
  unique_value: z.string().nullable().optional(),
  website_url: z.string().url().nullable().optional().or(z.literal('')),
  linkedin_url: z.string().url().nullable().optional().or(z.literal('')),
  twitter_url: z.string().url().nullable().optional().or(z.literal('')),
  github_url: z.string().url().nullable().optional().or(z.literal('')),
  team_size: z.number().min(1).nullable().optional(),
  stage: z.string().nullable().optional(),
});

type CompanyFormData = z.infer<typeof companySchema>;

const SECTIONS = [
  { id: 'overview', label: 'Overview', icon: Building2 },
  { id: 'business', label: 'Business', icon: TrendingUp },
  { id: 'traction', label: 'Traction', icon: TrendingUp },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'financials', label: 'Financials', icon: DollarSign },
  { id: 'fundraising', label: 'Fundraising', icon: Rocket },
];

const BUSINESS_MODELS = [
  { value: 'saas', label: 'SaaS' },
  { value: 'marketplace', label: 'Marketplace' },
  { value: 'b2b', label: 'B2B' },
  { value: 'b2c', label: 'B2C' },
  { value: 'enterprise', label: 'Enterprise' },
  { value: 'freemium', label: 'Freemium' },
  { value: 'subscription', label: 'Subscription' },
];

const CompanyProfile = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [customerSegments, setCustomerSegments] = useState<string[]>(['Enterprise', 'B2B', 'SaaS']);
  const [keyFeatures, setKeyFeatures] = useState<string[]>(['AI Dashboard', 'Strategic Planning']);
  const [newSegment, setNewSegment] = useState('');
  const [newFeature, setNewFeature] = useState('');
  
  const { data: startup, isLoading } = useUserStartup();
  const updateStartup = useUpdateStartup();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: '',
      tagline: '',
      description: '',
      headquarters: 'San Francisco, CA',
      industry: null,
      business_model: null,
      unique_value: '',
      website_url: '',
      linkedin_url: '',
      twitter_url: '',
      github_url: '',
      team_size: null,
      stage: null,
    },
  });

  useEffect(() => {
    if (startup) {
      reset({
        name: startup.name,
        tagline: startup.tagline || '',
        description: startup.description || '',
        headquarters: (startup as any).headquarters || 'San Francisco, CA',
        industry: startup.industry,
        business_model: startup.business_model?.[0] || null,
        unique_value: startup.unique_value || '',
        website_url: startup.website_url || '',
        linkedin_url: startup.linkedin_url || '',
        twitter_url: startup.twitter_url || '',
        github_url: startup.github_url || '',
        team_size: startup.team_size,
        stage: startup.stage,
      });
      
      if (startup.target_customers) {
        setCustomerSegments(startup.target_customers);
      }
      if (startup.key_features) {
        setKeyFeatures(startup.key_features);
      }
    }
  }, [startup, reset]);

  const onSubmit = async (data: CompanyFormData) => {
    if (!startup?.id) return;

    try {
      await updateStartup.mutateAsync({
        id: startup.id,
        updates: {
          name: data.name,
          tagline: data.tagline,
          description: data.description,
          industry: data.industry,
          business_model: data.business_model ? [data.business_model] : null,
          unique_value: data.unique_value,
          website_url: data.website_url || null,
          linkedin_url: data.linkedin_url || null,
          twitter_url: data.twitter_url || null,
          github_url: data.github_url || null,
          team_size: data.team_size,
          stage: data.stage,
          target_customers: customerSegments,
          key_features: keyFeatures,
        },
      });
      toast.success('Company profile updated');
    } catch (error) {
      toast.error('Failed to update company profile');
    }
  };

  const addTag = (type: 'segment' | 'feature') => {
    if (type === 'segment' && newSegment.trim()) {
      setCustomerSegments([...customerSegments, newSegment.trim()]);
      setNewSegment('');
    } else if (type === 'feature' && newFeature.trim()) {
      setKeyFeatures([...keyFeatures, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeTag = (type: 'segment' | 'feature', index: number) => {
    if (type === 'segment') {
      setCustomerSegments(customerSegments.filter((_, i) => i !== index));
    } else {
      setKeyFeatures(keyFeatures.filter((_, i) => i !== index));
    }
  };

  // Calculate completion
  const calculateCompletion = () => {
    if (!startup) return { percentage: 0, missing: [] };
    
    const fields = [
      { key: 'name', value: startup.name, label: 'Company Name' },
      { key: 'tagline', value: startup.tagline, label: 'Tagline' },
      { key: 'description', value: startup.description, label: 'Description' },
      { key: 'industry', value: startup.industry, label: 'Industry' },
      { key: 'website', value: startup.website_url, label: 'Website' },
      { key: 'linkedin', value: startup.linkedin_url, label: 'LinkedIn' },
      { key: 'stage', value: startup.stage, label: 'Stage' },
    ];

    const filled = fields.filter(f => f.value).length;
    const missing = fields.filter(f => !f.value).map(f => f.label);
    
    return {
      percentage: Math.round((filled / fields.length) * 100),
      missing,
    };
  };

  const completion = calculateCompletion();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex gap-6">
          <Skeleton className="w-60 h-96" />
          <Skeleton className="flex-1 h-96" />
          <Skeleton className="w-80 h-96" />
        </div>
      </DashboardLayout>
    );
  }

  if (!startup) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Company Profile</h2>
          <p className="text-muted-foreground mb-4">Complete onboarding to create your company profile.</p>
          <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl">
        {/* Left Panel - Context */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-60 shrink-0 space-y-6"
        >
          {/* Section Navigation */}
          <div className="space-y-1">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeSection === section.id
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <section.icon className="w-4 h-4" />
                {section.label}
              </button>
            ))}
          </div>

          {/* Profile Completion */}
          <ProfileCompletionCard
            percentage={completion.percentage}
            missingFields={completion.missing}
          />

          {/* Quick Links */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3">
              Quick Links
            </p>
            <button
              onClick={() => navigate('/user-profile')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors"
            >
              <User className="w-4 h-4" />
              User Profile
            </button>
            <button
              onClick={() => navigate('/projects')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors"
            >
              <FolderKanban className="w-4 h-4" />
              Projects
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
          </div>

          {/* Entity Context */}
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-xs font-medium text-muted-foreground mb-2">Entity Context</p>
            <p className="text-xs text-muted-foreground italic">
              "A complete company profile serves as the bedrock for the Strategy Generator and Investor Matchmaker."
            </p>
          </div>
        </motion.aside>

        {/* Main Panel - Work */}
        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 min-w-0"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold">Company Profile</h1>
              <p className="text-sm text-muted-foreground">
                Manage your company's public information and business details
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-xs">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5" />
                Live Sync
              </Badge>
              <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Company Overview */}
            {(activeSection === 'overview' || activeSection === 'all') && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Company Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Logo Upload */}
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/50 cursor-pointer hover:bg-muted transition-colors">
                      <div className="text-center">
                        <Upload className="w-6 h-6 mx-auto text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground">Upload Logo</span>
                      </div>
                    </div>
                    <div className="flex-1 grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Company Name *</Label>
                        <Input id="name" {...register('name')} />
                        {errors.name && (
                          <p className="text-xs text-destructive">{errors.name.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="founded_year">Founded Year</Label>
                        <Input 
                          id="founded_year" 
                          type="number"
                          placeholder="2024"
                          {...register('founded_year', { valueAsNumber: true })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input 
                      id="tagline" 
                      placeholder="One-line value proposition..."
                      {...register('tagline')} 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Short Description</Label>
                    <Textarea
                      id="description"
                      placeholder="2-3 sentences about what your company does..."
                      rows={3}
                      {...register('description')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="headquarters">Headquarters</Label>
                    <Input 
                      id="headquarters" 
                      placeholder="San Francisco, CA"
                      {...register('headquarters')} 
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Business Information */}
            {(activeSection === 'business' || activeSection === 'overview') && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Business Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
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
                    <div className="space-y-2">
                      <Label>Business Model</Label>
                      <Select
                        value={watch('business_model') || undefined}
                        onValueChange={(value) => setValue('business_model', value, { shouldDirty: true })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          {BUSINESS_MODELS.map((model) => (
                            <SelectItem key={model.value} value={model.value}>
                              {model.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Customer Segments */}
                  <div className="space-y-2">
                    <Label>Customer Segments</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {customerSegments.map((segment, i) => (
                        <Badge key={i} variant="secondary" className="gap-1">
                          {segment}
                          <button type="button" onClick={() => removeTag('segment', i)}>
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                      <div className="flex gap-1">
                        <Input 
                          className="h-7 w-28 text-xs"
                          placeholder="Add segment"
                          value={newSegment}
                          onChange={(e) => setNewSegment(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('segment'))}
                        />
                        <Button 
                          type="button" 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 px-2"
                          onClick={() => addTag('segment')}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Key Features */}
                  <div className="space-y-2">
                    <Label>Key Features</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {keyFeatures.map((feature, i) => (
                        <Badge key={i} variant="secondary" className="gap-1">
                          {feature}
                          <button type="button" onClick={() => removeTag('feature', i)}>
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                      <div className="flex gap-1">
                        <Input 
                          className="h-7 w-28 text-xs"
                          placeholder="Add feature"
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('feature'))}
                        />
                        <Button 
                          type="button" 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 px-2"
                          onClick={() => addTag('feature')}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unique_value">Primary Differentiator</Label>
                    <Textarea
                      id="unique_value"
                      placeholder="What makes your approach unique?"
                      rows={3}
                      {...register('unique_value')}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Social & Web Presence */}
            {activeSection === 'overview' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Social & Web Presence</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                      placeholder="LinkedIn Profile"
                      className="pl-9"
                      {...register('linkedin_url')}
                    />
                  </div>
                  <div className="relative">
                    <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Twitter / X"
                      className="pl-9"
                      {...register('twitter_url')}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Traction Section */}
            {activeSection === 'traction' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Traction Metrics</CardTitle>
                  <CardDescription>Track your key performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-8 text-center text-muted-foreground">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Traction metrics coming soon</p>
                    <p className="text-sm">MRR, Active Users, Growth Rate</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Team Section */}
            {activeSection === 'team' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Team</CardTitle>
                  <CardDescription>Manage your team information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="team_size">Team Size</Label>
                    <Input
                      id="team_size"
                      type="number"
                      min={1}
                      placeholder="Number of team members"
                      {...register('team_size', { valueAsNumber: true })}
                    />
                  </div>
                  <div className="p-8 text-center text-muted-foreground border rounded-lg">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Founder profiles coming soon</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Financials Section */}
            {activeSection === 'financials' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Financials</CardTitle>
                  <CardDescription>Revenue and financial metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-8 text-center text-muted-foreground">
                    <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Financial metrics coming soon</p>
                    <p className="text-sm">Revenue, ARPU, LTV, CAC</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Fundraising Section */}
            {activeSection === 'fundraising' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Fundraising</CardTitle>
                  <CardDescription>Funding goals and timeline</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Fundraising Stage</Label>
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
                  <div className="p-8 text-center text-muted-foreground border rounded-lg">
                    <Rocket className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Fundraising details coming soon</p>
                    <p className="text-sm">Target amount, Use of funds, Timeline</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={!isDirty || updateStartup.isPending}>
                {updateStartup.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </motion.main>

        {/* Right Panel - Intelligence */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-80 shrink-0 hidden xl:block"
        >
          <ProfileAIPanel
            type="company"
            completionPercentage={completion.percentage}
            onImprove={() => toast.info('AI profile improvement coming soon!')}
          />
        </motion.aside>
      </div>
    </DashboardLayout>
  );
};

export default CompanyProfile;
