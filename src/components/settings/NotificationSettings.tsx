import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Bell, Mail, Sparkles, Calendar, CheckSquare, DollarSign, BellRing, Clock } from 'lucide-react';
import { useNotifications, NotificationPreferences } from '@/hooks/useNotifications';
import { motion } from 'framer-motion';

interface NotificationPreference {
  id: keyof Omit<NotificationPreferences, 'browserNotifications' | 'reminderLeadTime'>;
  label: string;
  description: string;
  icon: React.ReactNode;
  prefsKey: keyof NotificationPreferences;
}

const NOTIFICATION_TYPES: NotificationPreference[] = [
  {
    id: 'weeklyDigest',
    label: 'Weekly Digest',
    description: 'Receive a weekly summary of your startup progress',
    icon: <Mail className="w-4 h-4" />,
    prefsKey: 'weeklyDigest',
  },
  {
    id: 'aiInsights',
    label: 'AI Insights',
    description: 'Get notified when AI generates new recommendations',
    icon: <Sparkles className="w-4 h-4" />,
    prefsKey: 'aiInsights',
  },
  {
    id: 'meetingReminders',
    label: 'Meeting Reminders',
    description: 'Reminders for upcoming investor meetings',
    icon: <Calendar className="w-4 h-4" />,
    prefsKey: 'meetingReminders',
  },
  {
    id: 'taskDueReminders',
    label: 'Task Due Dates',
    description: 'Notifications when tasks are due or overdue',
    icon: <CheckSquare className="w-4 h-4" />,
    prefsKey: 'taskDueReminders',
  },
  {
    id: 'outreachReminders',
    label: 'Outreach Reminders',
    description: 'Follow-up reminders for investor outreach',
    icon: <Mail className="w-4 h-4" />,
    prefsKey: 'outreachReminders',
  },
  {
    id: 'budgetAlerts',
    label: 'Budget Alerts',
    description: 'Alerts when AI spending approaches limits',
    icon: <DollarSign className="w-4 h-4" />,
    prefsKey: 'budgetAlerts',
  },
];

export function NotificationSettings() {
  const { 
    preferences,
    browserPermission,
    isLoading,
    updatePreferences,
    requestPermission,
  } = useNotifications();
  
  const [isSaving, setIsSaving] = useState(false);
  const [localPrefs, setLocalPrefs] = useState<NotificationPreferences>(preferences);

  useEffect(() => {
    setLocalPrefs(preferences);
  }, [preferences]);

  const handleToggle = async (key: keyof NotificationPreferences, enabled: boolean) => {
    const newPrefs = { ...localPrefs, [key]: enabled };
    setLocalPrefs(newPrefs);
    
    setIsSaving(true);
    await updatePreferences({ [key]: enabled });
    setIsSaving(false);
  };

  const handleLeadTimeChange = async (value: number[]) => {
    const leadTime = value[0];
    setLocalPrefs(prev => ({ ...prev, reminderLeadTime: leadTime }));
    await updatePreferences({ reminderLeadTime: leadTime });
  };

  const handleEnableBrowserNotifications = async () => {
    const permission = await requestPermission();
    if (permission === 'granted') {
      await updatePreferences({ browserNotifications: true });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-muted rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications
        </CardTitle>
        <CardDescription>
          Configure email and push notification preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Browser Notifications */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Browser Notifications
          </h4>
          
          <div className="p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-md bg-secondary">
                  <BellRing className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Desktop Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications in your browser
                  </p>
                </div>
              </div>
              {browserPermission === 'granted' ? (
                <Badge variant="secondary" className="gap-1">
                  <Bell className="w-3 h-3" />
                  Enabled
                </Badge>
              ) : browserPermission === 'denied' ? (
                <Badge variant="outline" className="text-muted-foreground">
                  Blocked
                </Badge>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleEnableBrowserNotifications}
                >
                  Enable
                </Button>
              )}
            </div>
            
            {browserPermission === 'denied' && (
              <p className="text-xs text-muted-foreground mt-2">
                Browser notifications are blocked. Enable them in your browser settings.
              </p>
            )}
          </div>
        </div>

        {/* Email Notifications */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Email & In-App Notifications
          </h4>
          
          {NOTIFICATION_TYPES.map((pref) => (
            <motion.div
              key={pref.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-md bg-secondary">
                  {pref.icon}
                </div>
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">{pref.label}</Label>
                  <p className="text-sm text-muted-foreground">
                    {pref.description}
                  </p>
                </div>
              </div>
              <Switch
                checked={localPrefs[pref.prefsKey] as boolean}
                onCheckedChange={(checked) => handleToggle(pref.prefsKey, checked)}
                disabled={isSaving}
              />
            </motion.div>
          ))}
        </div>

        {/* Reminder Lead Time */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Reminder Timing
          </h4>
          
          <div className="p-4 rounded-lg border">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 rounded-md bg-secondary">
                <Clock className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 flex-1">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Meeting Reminder Lead Time</Label>
                  <span className="text-sm font-medium">{localPrefs.reminderLeadTime} min</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  How early to remind you before meetings
                </p>
              </div>
            </div>
            
            <Slider
              value={[localPrefs.reminderLeadTime]}
              onValueChange={handleLeadTimeChange}
              min={5}
              max={60}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>5 min</span>
              <span>60 min</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
