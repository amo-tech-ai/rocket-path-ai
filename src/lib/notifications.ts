/**
 * Notification System Core
 * Types, permission handling, and notification utilities
 */

import { supabase } from '@/integrations/supabase/client';

export type NotificationType = 
  | 'outreach_reminder' 
  | 'investor_meeting' 
  | 'task_due' 
  | 'ai_insight'
  | 'budget_alert'
  | 'weekly_digest';

export interface NotificationPayload {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  scheduledFor?: Date;
  createdAt: Date;
  read: boolean;
}

export interface OutreachReminderData {
  contactId: string;
  contactName: string;
  contactEmail: string;
  sequenceStage: number;
  stageName: string;
  dueAt: Date;
}

export interface MeetingReminderData {
  eventId: string;
  eventTitle: string;
  startTime: Date;
  location?: string;
  contactName?: string;
}

/**
 * Check if browser notifications are supported and granted
 */
export function checkNotificationSupport(): {
  supported: boolean;
  permission: NotificationPermission | 'unsupported';
} {
  if (!('Notification' in window)) {
    return { supported: false, permission: 'unsupported' };
  }
  return { supported: true, permission: Notification.permission };
}

/**
 * Request notification permission from user
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }
  
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }
  
  return Notification.permission;
}

/**
 * Show a browser notification
 */
export function showBrowserNotification(
  title: string,
  options?: NotificationOptions
): Notification | null {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return null;
  }

  return new Notification(title, {
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    ...options,
  });
}

/**
 * Calculate next reminder time for outreach sequence
 */
export function calculateNextReminderTime(
  lastSentAt: Date,
  currentStage: number,
  stageDelays: number[]
): Date | null {
  if (currentStage >= stageDelays.length) {
    return null; // Sequence complete
  }

  const delayDays = stageDelays[currentStage];
  const nextReminder = new Date(lastSentAt);
  nextReminder.setDate(nextReminder.getDate() + delayDays);
  
  return nextReminder;
}

/**
 * Format time until reminder
 */
export function formatTimeUntilReminder(reminderDate: Date): string {
  const now = new Date();
  const diff = reminderDate.getTime() - now.getTime();
  
  if (diff < 0) {
    return 'Overdue';
  }
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `in ${days} day${days > 1 ? 's' : ''}`;
  }
  
  if (hours > 0) {
    return `in ${hours} hour${hours > 1 ? 's' : ''}`;
  }
  
  const minutes = Math.floor(diff / (1000 * 60));
  return `in ${minutes} minute${minutes > 1 ? 's' : ''}`;
}

/**
 * Schedule a local reminder using setTimeout
 * Returns cleanup function
 */
export function scheduleLocalReminder(
  reminderAt: Date,
  callback: () => void
): () => void {
  const now = new Date();
  const delay = reminderAt.getTime() - now.getTime();
  
  if (delay <= 0) {
    // Already due, fire immediately
    callback();
    return () => {};
  }
  
  const timeoutId = setTimeout(callback, delay);
  return () => clearTimeout(timeoutId);
}

/**
 * Get default outreach stage delays in days
 */
export const DEFAULT_OUTREACH_DELAYS = [0, 3, 7, 14]; // Initial, Follow-up 1, 2, 3
