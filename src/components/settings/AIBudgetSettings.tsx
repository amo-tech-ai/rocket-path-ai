/**
 * AI Budget Settings
 * Configure AI spending limits, usage alerts, and cost controls
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Brain,
  DollarSign,
  Bell,
  AlertTriangle,
  TrendingUp,
  Zap,
  Settings,
  RefreshCw,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/hooks/useNotifications';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { subDays, format } from 'date-fns';

interface AIBudgetSettings {
  monthlyBudget: number;
  dailyLimit: number;
  alertThreshold: number; // Percentage
  alertsEnabled: boolean;
  autoDisableOnLimit: boolean;
  preferredModel: 'auto' | 'fast' | 'balanced' | 'quality';
}

const DEFAULT_BUDGET_SETTINGS: AIBudgetSettings = {
  monthlyBudget: 100,
  dailyLimit: 10,
  alertThreshold: 80,
  alertsEnabled: true,
  autoDisableOnLimit: false,
  preferredModel: 'auto',
};

const MODEL_OPTIONS = [
  { value: 'auto', label: 'Auto (Recommended)', description: 'Automatically selects best model for task' },
  { value: 'fast', label: 'Fast', description: 'Lower cost, quicker responses' },
  { value: 'balanced', label: 'Balanced', description: 'Good balance of speed and quality' },
  { value: 'quality', label: 'Quality', description: 'Best results, higher cost' },
];

export function AIBudgetSettings() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const { showBudgetAlert } = useNotifications();
  
  const [settings, setSettings] = useState<AIBudgetSettings>(DEFAULT_BUDGET_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch current AI usage
  const { data: usageData, isLoading: isLoadingUsage } = useQuery({
    queryKey: ['ai-usage-summary', user?.id],
    queryFn: async () => {
      const thirtyDaysAgo = subDays(new Date(), 30).toISOString();
      const today = new Date().toISOString().split('T')[0];

      const { data: runs, error } = await supabase
        .from('ai_runs')
        .select('cost_usd, created_at')
        .gte('created_at', thirtyDaysAgo);

      if (error) throw error;

      const monthlyCost = runs?.reduce((sum, r) => sum + (r.cost_usd || 0), 0) || 0;
      const todayRuns = runs?.filter(r => r.created_at?.startsWith(today)) || [];
      const dailyCost = todayRuns.reduce((sum, r) => sum + (r.cost_usd || 0), 0);
      const totalRequests = runs?.length || 0;

      return {
        monthlyCost,
        dailyCost,
        totalRequests,
        avgDailyCost: monthlyCost / 30,
      };
    },
    enabled: !!user,
  });

  // Load settings from profile
  useEffect(() => {
    if (profile?.preferences) {
      const prefs = profile.preferences as Record<string, any>;
      const aiBudget = prefs.ai_budget || {};
      setSettings({
        ...DEFAULT_BUDGET_SETTINGS,
        monthlyBudget: aiBudget.monthly_budget ?? 100,
        dailyLimit: aiBudget.daily_limit ?? 10,
        alertThreshold: aiBudget.alert_threshold ?? 80,
        alertsEnabled: aiBudget.alerts_enabled ?? true,
        autoDisableOnLimit: aiBudget.auto_disable ?? false,
        preferredModel: aiBudget.preferred_model ?? 'auto',
      });
    }
  }, [profile]);

  const handleSettingChange = <K extends keyof AIBudgetSettings>(
    key: K,
    value: AIBudgetSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    
    try {
      const existingPrefs = (profile?.preferences as Record<string, any>) || {};
      
      const { error } = await supabase
        .from('profiles')
        .update({
          preferences: {
            ...existingPrefs,
            ai_budget: {
              monthly_budget: settings.monthlyBudget,
              daily_limit: settings.dailyLimit,
              alert_threshold: settings.alertThreshold,
              alerts_enabled: settings.alertsEnabled,
              auto_disable: settings.autoDisableOnLimit,
              preferred_model: settings.preferredModel,
            },
          },
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Settings saved',
        description: 'Your AI budget settings have been updated.',
      });
      
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save AI budget settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const monthlyUsagePercent = usageData 
    ? (usageData.monthlyCost / settings.monthlyBudget) * 100 
    : 0;

  const dailyUsagePercent = usageData
    ? (usageData.dailyCost / settings.dailyLimit) * 100
    : 0;

  // Check if we need to show alert
  useEffect(() => {
    if (settings.alertsEnabled && usageData && monthlyUsagePercent >= settings.alertThreshold) {
      showBudgetAlert(usageData.monthlyCost, settings.monthlyBudget, monthlyUsagePercent);
    }
  }, [usageData, settings.alertsEnabled, settings.alertThreshold, settings.monthlyBudget, monthlyUsagePercent, showBudgetAlert]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          AI Budget & Usage
        </CardTitle>
        <CardDescription>
          Set spending limits and control AI usage across your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Usage Summary */}
        <div className="p-4 rounded-lg bg-muted/50 space-y-4">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Current Usage
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Monthly</span>
                <span className="text-xs font-medium">
                  ${usageData?.monthlyCost.toFixed(2) || '0.00'} / ${settings.monthlyBudget}
                </span>
              </div>
              <Progress 
                value={Math.min(monthlyUsagePercent, 100)} 
                className={`h-2 ${monthlyUsagePercent >= 90 ? '[&>div]:bg-destructive' : monthlyUsagePercent >= 75 ? '[&>div]:bg-yellow-500' : ''}`}
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Today</span>
                <span className="text-xs font-medium">
                  ${usageData?.dailyCost.toFixed(2) || '0.00'} / ${settings.dailyLimit}
                </span>
              </div>
              <Progress 
                value={Math.min(dailyUsagePercent, 100)} 
                className={`h-2 ${dailyUsagePercent >= 90 ? '[&>div]:bg-destructive' : ''}`}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total requests this month</span>
            <Badge variant="secondary">
              <Zap className="w-3 h-3 mr-1" />
              {usageData?.totalRequests || 0}
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Budget Limits */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Budget Limits
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthlyBudget">Monthly Budget ($)</Label>
              <Input
                id="monthlyBudget"
                type="number"
                min={10}
                max={1000}
                value={settings.monthlyBudget}
                onChange={(e) => handleSettingChange('monthlyBudget', Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dailyLimit">Daily Limit ($)</Label>
              <Input
                id="dailyLimit"
                type="number"
                min={1}
                max={100}
                value={settings.dailyLimit}
                onChange={(e) => handleSettingChange('dailyLimit', Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Alerts */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Alerts & Controls
          </h4>

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="space-y-0.5">
              <Label>Budget Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when spending approaches limit
              </p>
            </div>
            <Switch
              checked={settings.alertsEnabled}
              onCheckedChange={(checked) => handleSettingChange('alertsEnabled', checked)}
            />
          </div>

          {settings.alertsEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-3 pl-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Alert Threshold</Label>
                  <span className="text-sm font-medium">{settings.alertThreshold}%</span>
                </div>
                <Slider
                  value={[settings.alertThreshold]}
                  onValueChange={([value]) => handleSettingChange('alertThreshold', value)}
                  min={50}
                  max={95}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Alert when usage reaches {settings.alertThreshold}% of monthly budget
                </p>
              </div>
            </motion.div>
          )}

          <div className="flex items-center justify-between p-3 rounded-lg border border-destructive/20 bg-destructive/5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-destructive mt-0.5" />
              <div className="space-y-0.5">
                <Label>Auto-disable on Limit</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically disable AI features when daily limit is reached
                </p>
              </div>
            </div>
            <Switch
              checked={settings.autoDisableOnLimit}
              onCheckedChange={(checked) => handleSettingChange('autoDisableOnLimit', checked)}
            />
          </div>
        </div>

        <Separator />

        {/* Model Preference */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Model Preference
          </h4>

          <div className="space-y-2">
            <Label htmlFor="preferredModel">Default AI Model</Label>
            <Select
              value={settings.preferredModel}
              onValueChange={(value: AIBudgetSettings['preferredModel']) => 
                handleSettingChange('preferredModel', value)
              }
            >
              <SelectTrigger id="preferredModel">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MODEL_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      <span className="text-xs text-muted-foreground">{option.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Affects cost and response quality for AI features
            </p>
          </div>
        </div>

        {/* Save Button */}
        <Button 
          onClick={handleSave} 
          disabled={isSaving || !hasChanges}
          className="w-full"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Settings'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

export default AIBudgetSettings;
