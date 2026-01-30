/**
 * Notification System Hook
 * Manages in-app notifications, reminders, and browser notifications
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import {
  NotificationPayload,
  NotificationType,
  OutreachReminderData,
  MeetingReminderData,
  checkNotificationSupport,
  requestNotificationPermission,
  showBrowserNotification,
  scheduleLocalReminder,
  formatTimeUntilReminder,
  DEFAULT_OUTREACH_DELAYS,
} from '@/lib/notifications';

interface NotificationPreferences {
  outreachReminders: boolean;
  meetingReminders: boolean;
  taskDueReminders: boolean;
  aiInsights: boolean;
  budgetAlerts: boolean;
  weeklyDigest: boolean;
  browserNotifications: boolean;
  reminderLeadTime: number; // minutes before event
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  outreachReminders: true,
  meetingReminders: true,
  taskDueReminders: true,
  aiInsights: true,
  budgetAlerts: true,
  weeklyDigest: true,
  browserNotifications: false,
  reminderLeadTime: 30,
};

export function useNotifications() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [isLoading, setIsLoading] = useState(true);
  
  const cleanupFnsRef = useRef<Map<string, () => void>>(new Map());

  // Check browser notification support on mount
  useEffect(() => {
    const { permission } = checkNotificationSupport();
    setBrowserPermission(permission);
  }, []);

  // Load preferences from profile.preferences JSON field
  useEffect(() => {
    if (profile?.preferences) {
      const prefs = profile.preferences as Record<string, any>;
      const notifPrefs = prefs.notifications || {};
      setPreferences({
        ...DEFAULT_PREFERENCES,
        outreachReminders: notifPrefs.outreach_reminders ?? true,
        meetingReminders: notifPrefs.meeting_reminders ?? true,
        taskDueReminders: notifPrefs.task_reminders ?? true,
        aiInsights: notifPrefs.ai_insights ?? true,
        budgetAlerts: notifPrefs.budget_alerts ?? true,
        weeklyDigest: notifPrefs.weekly_digest ?? true,
        browserNotifications: notifPrefs.browser_notifications ?? false,
        reminderLeadTime: notifPrefs.reminder_lead_time ?? 30,
      });
    }
    setIsLoading(false);
  }, [profile]);

  // Request browser notification permission
  const requestPermission = useCallback(async () => {
    const permission = await requestNotificationPermission();
    setBrowserPermission(permission);
    
    if (permission === 'granted') {
      toast({
        title: 'Notifications enabled',
        description: 'You will now receive browser notifications.',
      });
    }
    
    return permission;
  }, [toast]);

  // Update preferences
  const updatePreferences = useCallback(async (
    updates: Partial<NotificationPreferences>
  ) => {
    if (!user) return;

    const newPrefs = { ...preferences, ...updates };
    setPreferences(newPrefs);

    // Get existing preferences and merge
    const existingPrefs = (profile?.preferences as Record<string, any>) || {};
    
    // Save to profile.preferences with notifications nested
    const { error } = await supabase
      .from('profiles')
      .update({
        preferences: {
          ...existingPrefs,
          notifications: {
            outreach_reminders: newPrefs.outreachReminders,
            meeting_reminders: newPrefs.meetingReminders,
            task_reminders: newPrefs.taskDueReminders,
            ai_insights: newPrefs.aiInsights,
            budget_alerts: newPrefs.budgetAlerts,
            weekly_digest: newPrefs.weeklyDigest,
            browser_notifications: newPrefs.browserNotifications,
            reminder_lead_time: newPrefs.reminderLeadTime,
          },
        },
      })
      .eq('id', user.id);

    if (error) {
      console.error('Failed to save notification preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to save notification preferences.',
        variant: 'destructive',
      });
    }
  }, [user, preferences, toast]);

  // Add a notification
  const addNotification = useCallback((
    type: NotificationType,
    title: string,
    body: string,
    data?: Record<string, any>
  ) => {
    const notification: NotificationPayload = {
      id: crypto.randomUUID(),
      type,
      title,
      body,
      data,
      createdAt: new Date(),
      read: false,
    };

    setNotifications(prev => [notification, ...prev].slice(0, 50)); // Keep last 50
    setUnreadCount(prev => prev + 1);

    // Show browser notification if enabled
    if (preferences.browserNotifications && browserPermission === 'granted') {
      const browserNotif = showBrowserNotification(title, {
        body,
        tag: type,
        requireInteraction: type === 'outreach_reminder' || type === 'investor_meeting',
      });

      if (browserNotif && data?.onClick) {
        browserNotif.onclick = data.onClick;
      }
    }

    return notification;
  }, [preferences.browserNotifications, browserPermission]);

  // Mark notification as read
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  // Clear a notification
  const clearNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    // Clean up any scheduled reminders
    const cleanup = cleanupFnsRef.current.get(notificationId);
    if (cleanup) {
      cleanup();
      cleanupFnsRef.current.delete(notificationId);
    }
  }, []);

  // Schedule an outreach reminder
  const scheduleOutreachReminder = useCallback((data: OutreachReminderData) => {
    if (!preferences.outreachReminders) return;

    const id = `outreach-${data.contactId}-${data.sequenceStage}`;
    
    // Clean up existing reminder for this contact/stage
    const existingCleanup = cleanupFnsRef.current.get(id);
    if (existingCleanup) {
      existingCleanup();
    }

    // Schedule new reminder
    const cleanup = scheduleLocalReminder(data.dueAt, () => {
      addNotification(
        'outreach_reminder',
        `Follow-up with ${data.contactName}`,
        `Time to send ${data.stageName} email to ${data.contactName}`,
        { contactId: data.contactId, stage: data.sequenceStage }
      );

      // Show toast as well
      toast({
        title: `📧 Outreach Reminder`,
        description: `Time to follow up with ${data.contactName}`,
      });
    });

    cleanupFnsRef.current.set(id, cleanup);
  }, [preferences.outreachReminders, addNotification, toast]);

  // Schedule a meeting reminder
  const scheduleMeetingReminder = useCallback((data: MeetingReminderData) => {
    if (!preferences.meetingReminders) return;

    const id = `meeting-${data.eventId}`;
    
    // Clean up existing reminder
    const existingCleanup = cleanupFnsRef.current.get(id);
    if (existingCleanup) {
      existingCleanup();
    }

    // Calculate reminder time (lead time before meeting)
    const reminderTime = new Date(data.startTime);
    reminderTime.setMinutes(reminderTime.getMinutes() - preferences.reminderLeadTime);

    const cleanup = scheduleLocalReminder(reminderTime, () => {
      addNotification(
        'investor_meeting',
        `Meeting in ${preferences.reminderLeadTime} minutes`,
        `${data.eventTitle}${data.contactName ? ` with ${data.contactName}` : ''}`,
        { eventId: data.eventId }
      );

      toast({
        title: `🗓️ Meeting Reminder`,
        description: `${data.eventTitle} starts in ${preferences.reminderLeadTime} minutes`,
      });
    });

    cleanupFnsRef.current.set(id, cleanup);
  }, [preferences.meetingReminders, preferences.reminderLeadTime, addNotification, toast]);

  // Show budget alert
  const showBudgetAlert = useCallback((
    currentSpend: number,
    budget: number,
    percentUsed: number
  ) => {
    if (!preferences.budgetAlerts) return;

    addNotification(
      'budget_alert',
      'AI Budget Alert',
      `You've used ${percentUsed.toFixed(0)}% of your monthly AI budget ($${currentSpend.toFixed(2)}/$${budget})`,
      { currentSpend, budget, percentUsed }
    );

    toast({
      title: '⚠️ Budget Alert',
      description: `AI spending at ${percentUsed.toFixed(0)}% of monthly limit`,
      variant: percentUsed > 90 ? 'destructive' : 'default',
    });
  }, [preferences.budgetAlerts, addNotification, toast]);

  // Cleanup all reminders on unmount
  useEffect(() => {
    return () => {
      cleanupFnsRef.current.forEach(cleanup => cleanup());
      cleanupFnsRef.current.clear();
    };
  }, []);

  return {
    notifications,
    unreadCount,
    preferences,
    browserPermission,
    isLoading,
    // Actions
    requestPermission,
    updatePreferences,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotification,
    // Specific reminder schedulers
    scheduleOutreachReminder,
    scheduleMeetingReminder,
    showBudgetAlert,
    // Utilities
    formatTimeUntilReminder,
  };
}

export type { NotificationPreferences, NotificationPayload };
