import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Bell, Mail, Sparkles, Calendar, CheckSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationPreference {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
}

export function NotificationSettings() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      id: 'weekly_digest',
      label: 'Weekly Digest',
      description: 'Receive a weekly summary of your startup progress',
      icon: <Mail className="w-4 h-4" />,
      enabled: true,
    },
    {
      id: 'ai_insights',
      label: 'AI Insights',
      description: 'Get notified when AI generates new recommendations',
      icon: <Sparkles className="w-4 h-4" />,
      enabled: true,
    },
    {
      id: 'event_reminders',
      label: 'Event Reminders',
      description: 'Reminders for upcoming events and meetings',
      icon: <Calendar className="w-4 h-4" />,
      enabled: true,
    },
    {
      id: 'task_reminders',
      label: 'Task Due Dates',
      description: 'Notifications when tasks are due or overdue',
      icon: <CheckSquare className="w-4 h-4" />,
      enabled: false,
    },
  ]);

  const togglePreference = (id: string) => {
    setPreferences(prev =>
      prev.map(p => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate save - in production, this would update profiles.notification_preferences
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setIsSaving(false);
    toast({
      title: "Notifications updated",
      description: "Your notification preferences have been saved.",
    });
  };

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
        {/* Email Notifications */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Email Notifications
          </h4>
          
          {preferences.map((pref) => (
            <div
              key={pref.id}
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
                checked={pref.enabled}
                onCheckedChange={() => togglePreference(pref.id)}
              />
            </div>
          ))}
        </div>

        {/* Push Notifications */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Push Notifications
          </h4>
          
          <div className="p-4 rounded-lg border bg-muted/50">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Browser Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications in your browser
                </p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Coming Soon
              </Button>
            </div>
          </div>
        </div>

        {/* Notification Schedule */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Schedule
          </h4>
          
          <div className="p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Quiet Hours</Label>
                <p className="text-sm text-muted-foreground">
                  Pause notifications during specific hours
                </p>
              </div>
              <Switch disabled />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Quiet hours configuration coming soon
            </p>
          </div>
        </div>

        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          {isSaving ? "Saving..." : "Save Preferences"}
        </Button>
      </CardContent>
    </Card>
  );
}
