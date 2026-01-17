import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useProfile, useUpdateProfile } from '@/hooks/useSettings';
import { ProfileCompletionCard } from '@/components/profile/ProfileCompletionCard';
import { ProfileAIPanel } from '@/components/profile/ProfileAIPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Camera,
  Loader2,
  Building2,
  Settings,
  LayoutDashboard,
  Shield,
  Bell,
  Activity,
  Linkedin,
  Globe,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';

const profileSchema = z.object({
  full_name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  avatar_url: z.string().url().nullable().optional(),
  bio: z.string().max(500).nullable().optional(),
  linkedin_url: z.string().url().nullable().optional().or(z.literal('')),
  website_url: z.string().url().nullable().optional().or(z.literal('')),
  timezone: z.string().nullable().optional(),
  language: z.string().nullable().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const TIMEZONES = [
  { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada)' },
  { value: 'America/Denver', label: 'Mountain Time (US & Canada)' },
  { value: 'America/Chicago', label: 'Central Time (US & Canada)' },
  { value: 'America/New_York', label: 'Eastern Time (US & Canada)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
];

const LANGUAGES = [
  { value: 'en', label: 'English (United States)' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'pt', label: 'Portuguese' },
];

const UserProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: '',
      email: '',
      avatar_url: null,
      bio: '',
      timezone: 'America/Los_Angeles',
      language: 'en',
    },
  });

  useEffect(() => {
    if (profile) {
      const prefs = (profile.preferences as Record<string, unknown>) || {};
      reset({
        full_name: profile.full_name || '',
        email: profile.email,
        avatar_url: profile.avatar_url,
        bio: (prefs.bio as string) || '',
        linkedin_url: (prefs.linkedin_url as string) || '',
        website_url: (prefs.website_url as string) || '',
        timezone: (prefs.timezone as string) || 'America/Los_Angeles',
        language: (prefs.language as string) || 'en',
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile.mutateAsync({
        full_name: data.full_name,
        avatar_url: data.avatar_url,
        preferences: {
          bio: data.bio,
          linkedin_url: data.linkedin_url || null,
          website_url: data.website_url || null,
          timezone: data.timezone,
          language: data.language,
        },
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  // Calculate completion
  const calculateCompletion = () => {
    if (!profile) return { percentage: 0, missing: [] };
    const prefs = (profile.preferences as Record<string, unknown>) || {};
    
    const fields = [
      { key: 'full_name', value: profile.full_name, label: 'Full Name' },
      { key: 'avatar', value: profile.avatar_url, label: 'Profile Photo' },
      { key: 'bio', value: prefs.bio, label: 'Bio' },
      { key: 'linkedin', value: prefs.linkedin_url, label: 'LinkedIn' },
      { key: 'timezone', value: prefs.timezone, label: 'Timezone' },
    ];

    const filled = fields.filter(f => f.value).length;
    const missing = fields.filter(f => !f.value).map(f => f.label);
    
    return {
      percentage: Math.round((filled / fields.length) * 100),
      missing,
    };
  };

  const completion = calculateCompletion();

  const initials = profile?.full_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'U';

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

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl">
        {/* Left Panel - Context */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-60 shrink-0 space-y-6"
        >
          {/* Navigation Tabs */}
          <div className="space-y-1">
            {[
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'preferences', label: 'Preferences', icon: Settings },
              { id: 'security', label: 'Security', icon: Shield },
              { id: 'activity', label: 'Activity', icon: Activity },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
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
              onClick={() => navigate('/company-profile')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors"
            >
              <Building2 className="w-4 h-4" />
              Company Profile
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
          </div>

          {/* Account Status */}
          <div className="p-4 rounded-lg border bg-card">
            <p className="text-xs font-medium text-muted-foreground mb-2">Account Status</p>
            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              Active
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
            </p>
          </div>

          {/* Context Quote */}
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground italic">
              "Personalized preferences help tailor the AI Coach's communication style and dashboard visibility."
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
              <h1 className="text-2xl font-semibold">My Profile</h1>
              <p className="text-sm text-muted-foreground">
                Manage your personal information and account settings
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
            {activeTab === 'profile' && (
              <>
                {/* Avatar Section */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <div className="relative">
                        <Avatar className="w-24 h-24">
                          <AvatarImage src={profile?.avatar_url || undefined} />
                          <AvatarFallback className="text-2xl bg-sage text-sage-foreground">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <button
                          type="button"
                          className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-center sm:text-left">
                        <h2 className="text-xl font-semibold">{profile?.full_name || 'Your Name'}</h2>
                        <p className="text-sm text-muted-foreground">CEO & Founder</p>
                        <Button type="button" variant="outline" size="sm" className="mt-2" disabled>
                          Change Avatar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Personal Information</CardTitle>
                    <CardDescription>Manage your public profile details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name *</Label>
                        <Input id="full_name" {...register('full_name')} />
                        {errors.full_name && (
                          <p className="text-xs text-destructive">{errors.full_name.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            className="pl-9"
                            disabled
                            {...register('email')}
                          />
                          <Badge className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px]" variant="outline">
                            Verified
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="bio">Bio</Label>
                        <Button type="button" variant="ghost" size="sm" className="text-xs h-auto py-1">
                          ✨ Rewrite with AI
                        </Button>
                      </div>
                      <Textarea
                        id="bio"
                        placeholder="Tell us a little about yourself..."
                        rows={3}
                        {...register('bio')}
                      />
                      <p className="text-xs text-muted-foreground text-right">
                        {(watch('bio') || '').length}/500 characters
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Timezone *</Label>
                        <Select
                          value={watch('timezone') || undefined}
                          onValueChange={(value) => setValue('timezone', value, { shouldDirty: true })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            {TIMEZONES.map((tz) => (
                              <SelectItem key={tz.value} value={tz.value}>
                                {tz.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Language</Label>
                        <Select
                          value={watch('language') || undefined}
                          onValueChange={(value) => setValue('language', value, { shouldDirty: true })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            {LANGUAGES.map((lang) => (
                              <SelectItem key={lang.value} value={lang.value}>
                                {lang.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {activeTab === 'preferences' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Preferences</CardTitle>
                  <CardDescription>Customize your workspace experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Appearance</Label>
                      <p className="text-sm text-muted-foreground">Select your interface color theme</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">☀️ Light</Button>
                      <Button variant="outline" size="sm">🌙 Dark</Button>
                      <Button variant="default" size="sm">🖥️ Auto</Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">AI Copilot Mode</Label>
                      <Badge className="ml-2 text-[10px]" variant="secondary">Beta</Badge>
                      <p className="text-sm text-muted-foreground">
                        Enable proactive suggestions and automated insights
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive updates about your projects</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'security' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Security</CardTitle>
                  <CardDescription>Manage your account security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg border bg-muted/50">
                    <p className="text-sm text-muted-foreground">
                      Security settings coming soon. This will include password management, 2FA, and connected accounts.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'activity' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Activity</CardTitle>
                  <CardDescription>Your recent account activity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg border bg-muted/50">
                    <p className="text-sm text-muted-foreground">
                      Activity history coming soon. This will include login sessions, profile updates, and more.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submit Button */}
            {activeTab === 'profile' && (
              <div className="flex justify-end">
                <Button type="submit" disabled={!isDirty || updateProfile.isPending}>
                  {updateProfile.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            )}
          </form>
        </motion.main>

        {/* Right Panel - Intelligence */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-80 shrink-0 hidden xl:block"
        >
          <ProfileAIPanel
            type="user"
            completionPercentage={completion.percentage}
            onImprove={() => toast.info('AI profile improvement coming soon!')}
          />
        </motion.aside>
      </div>
    </DashboardLayout>
  );
};

export default UserProfile;
