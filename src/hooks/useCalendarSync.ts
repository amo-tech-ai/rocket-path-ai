/**
 * Calendar Sync Hook
 * Handles investor meeting scheduling and calendar integration
 */

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { addMinutes, format, parseISO } from 'date-fns';

export interface MeetingSlot {
  start: Date;
  end: Date;
  available: boolean;
}

export interface InvestorMeeting {
  id: string;
  eventId: string;
  investorId: string;
  investorName: string;
  investorEmail?: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  meetingLink?: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  calendarEventId?: string; // External calendar ID
  calendarProvider?: 'google' | 'outlook' | null;
}

export interface CalendarSettings {
  defaultDuration: number; // minutes
  bufferTime: number; // minutes between meetings
  availableHours: {
    start: string; // "09:00"
    end: string; // "17:00"
  };
  availableDays: number[]; // 0-6 (Sunday-Saturday)
  timezone: string;
}

const DEFAULT_CALENDAR_SETTINGS: CalendarSettings = {
  defaultDuration: 30,
  bufferTime: 15,
  availableHours: {
    start: '09:00',
    end: '17:00',
  },
  availableDays: [1, 2, 3, 4, 5], // Mon-Fri
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};

// Map event status to meeting status
function mapEventStatus(eventStatus: string): InvestorMeeting['status'] {
  switch (eventStatus) {
    case 'confirmed':
      return 'confirmed';
    case 'cancelled':
      return 'cancelled';
    case 'completed':
      return 'completed';
    default:
      return 'scheduled';
  }
}

export function useCalendarSync() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [settings, setSettings] = useState<CalendarSettings>(DEFAULT_CALENDAR_SETTINGS);
  const [isConnecting, setIsConnecting] = useState(false);

  // Check if calendar is connected
  const calendarConnection = useQuery({
    queryKey: ['calendar-connection', user?.id],
    queryFn: async () => {
      if (!user) return null;

      // Check profile preferences for calendar connection info
      const prefs = (profile?.preferences as Record<string, any>) || {};
      const calendarPrefs = prefs.calendar || {};

      return {
        provider: calendarPrefs.provider as 'google' | 'outlook' | null,
        connected: !!calendarPrefs.connected,
        email: calendarPrefs.email as string | null,
        settings: calendarPrefs.settings || DEFAULT_CALENDAR_SETTINGS,
      };
    },
    enabled: !!user,
  });

  // Fetch investor meetings from events table
  const investorMeetings = useQuery({
    queryKey: ['investor-meetings', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get startup ID from profile
      const { data: startupData } = await supabase
        .from('startups')
        .select('id')
        .eq('org_id', profile?.org_id || '')
        .limit(1)
        .maybeSingle();

      if (!startupData) return [];

      const { data: events, error } = await supabase
        .from('events')
        .select(`
          *,
          event_attendees (
            id,
            name,
            email,
            contact_id
          )
        `)
        .eq('startup_id', startupData.id)
        .eq('event_type', 'meeting') // Use 'meeting' type for investor meetings
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true });

      if (error) throw error;

      return (events || []).map((event: any): InvestorMeeting => ({
        id: event.id,
        eventId: event.id,
        investorId: event.event_attendees?.[0]?.contact_id || '',
        investorName: event.event_attendees?.[0]?.name || event.name || 'Unknown',
        investorEmail: event.event_attendees?.[0]?.email,
        title: event.title || event.name || 'Investor Meeting',
        description: event.description,
        startTime: new Date(event.start_date),
        endTime: event.end_date ? new Date(event.end_date) : addMinutes(new Date(event.start_date), 30),
        location: event.location,
        meetingLink: event.virtual_meeting_url,
        status: mapEventStatus(event.status),
        notes: (event.metadata as any)?.notes,
        calendarEventId: (event.metadata as any)?.external_calendar_id,
        calendarProvider: (event.metadata as any)?.calendar_provider,
      }));
    },
    enabled: !!user && !!profile?.org_id,
  });

  // Generate available time slots
  const generateAvailableSlots = useCallback((
    date: Date,
    existingMeetings: InvestorMeeting[],
    calendarSettings: CalendarSettings = settings
  ): MeetingSlot[] => {
    const slots: MeetingSlot[] = [];
    const dayOfWeek = date.getDay();

    // Check if this day is available
    if (!calendarSettings.availableDays.includes(dayOfWeek)) {
      return slots;
    }

    const [startHour, startMin] = calendarSettings.availableHours.start.split(':').map(Number);
    const [endHour, endMin] = calendarSettings.availableHours.end.split(':').map(Number);

    let currentTime = new Date(date);
    currentTime.setHours(startHour, startMin, 0, 0);

    const endTime = new Date(date);
    endTime.setHours(endHour, endMin, 0, 0);

    while (currentTime < endTime) {
      const slotEnd = addMinutes(currentTime, calendarSettings.defaultDuration);
      
      // Check if slot conflicts with existing meetings
      const hasConflict = existingMeetings.some(meeting => {
        const meetingStart = new Date(meeting.startTime);
        const meetingEnd = new Date(meeting.endTime);
        const bufferStart = addMinutes(meetingStart, -calendarSettings.bufferTime);
        const bufferEnd = addMinutes(meetingEnd, calendarSettings.bufferTime);
        
        return (
          (currentTime >= bufferStart && currentTime < bufferEnd) ||
          (slotEnd > bufferStart && slotEnd <= bufferEnd) ||
          (currentTime <= bufferStart && slotEnd >= bufferEnd)
        );
      });

      slots.push({
        start: new Date(currentTime),
        end: new Date(slotEnd),
        available: !hasConflict,
      });

      // Move to next slot (duration + buffer)
      currentTime = addMinutes(currentTime, calendarSettings.defaultDuration + calendarSettings.bufferTime);
    }

    return slots;
  }, [settings]);

  // Create investor meeting
  const createMeeting = useMutation({
    mutationFn: async (meeting: {
      investorId: string;
      investorName: string;
      investorEmail?: string;
      title: string;
      description?: string;
      startTime: Date;
      duration?: number;
      location?: string;
      meetingLink?: string;
    }) => {
      if (!user || !profile?.org_id) throw new Error('Not authenticated');

      // Get startup ID
      const { data: startupData } = await supabase
        .from('startups')
        .select('id')
        .eq('org_id', profile.org_id)
        .limit(1)
        .single();

      if (!startupData) throw new Error('No startup found');

      const duration = meeting.duration || settings.defaultDuration;
      const endTime = addMinutes(meeting.startTime, duration);

      // Create event using proper typed insert
      const eventInsert = {
        startup_id: startupData.id,
        title: meeting.title,
        name: meeting.title,
        description: meeting.description || null,
        event_type: 'meeting' as const,
        start_date: meeting.startTime.toISOString(),
        end_date: endTime.toISOString(),
        location: meeting.location || null,
        virtual_meeting_url: meeting.meetingLink || null,
        status: 'scheduled' as const,
        metadata: {
          is_investor_meeting: true,
          investor_id: meeting.investorId,
        },
      };

      const { data: event, error: eventError } = await supabase
        .from('events')
        .insert(eventInsert)
        .select()
        .single();

      if (eventError) throw eventError;

      // Add investor as attendee
      if (meeting.investorEmail) {
        await supabase
          .from('event_attendees')
          .insert({
            event_id: event.id,
            name: meeting.investorName,
            email: meeting.investorEmail,
            contact_id: meeting.investorId || null,
            rsvp_status: 'invited',
          });
      }

      return event;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investor-meetings'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: 'Meeting scheduled',
        description: 'Investor meeting has been added to your calendar.',
      });
    },
    onError: (error) => {
      console.error('Failed to create meeting:', error);
      toast({
        title: 'Error',
        description: 'Failed to schedule meeting. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Update meeting
  const updateMeeting = useMutation({
    mutationFn: async ({ id, updates }: {
      id: string;
      updates: Partial<{
        title: string;
        description: string;
        startTime: Date;
        endTime: Date;
        location: string;
        meetingLink: string;
        status: InvestorMeeting['status'];
        notes: string;
      }>;
    }) => {
      const updateData: Record<string, any> = {};
      
      if (updates.title) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.startTime) updateData.start_date = updates.startTime.toISOString();
      if (updates.endTime) updateData.end_date = updates.endTime.toISOString();
      if (updates.location !== undefined) updateData.location = updates.location;
      if (updates.meetingLink !== undefined) updateData.virtual_link = updates.meetingLink;
      if (updates.status) updateData.status = updates.status;
      if (updates.notes !== undefined) updateData.notes = updates.notes;

      const { data, error } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investor-meetings'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: 'Meeting updated',
        description: 'Meeting details have been saved.',
      });
    },
  });

  // Cancel meeting
  const cancelMeeting = useMutation({
    mutationFn: async (meetingId: string) => {
      const { error } = await supabase
        .from('events')
        .update({ status: 'cancelled' })
        .eq('id', meetingId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investor-meetings'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: 'Meeting cancelled',
        description: 'The meeting has been cancelled.',
      });
    },
  });

  // Update calendar settings
  const updateSettings = useCallback(async (newSettings: Partial<CalendarSettings>) => {
    if (!user) return;

    const mergedSettings = { ...settings, ...newSettings };
    setSettings(mergedSettings);

    // Save to profile preferences
    const existingPrefs = (profile?.preferences as Record<string, any>) || {};
    await supabase
      .from('profiles')
      .update({
        preferences: {
          ...existingPrefs,
          calendar: {
            ...(existingPrefs.calendar || {}),
            settings: mergedSettings,
          },
        },
      })
      .eq('id', user.id);
  }, [user, profile, settings]);

  // Generate calendar link (ICS format)
  const generateCalendarLink = useCallback((meeting: InvestorMeeting): string => {
    const startStr = format(meeting.startTime, "yyyyMMdd'T'HHmmss");
    const endStr = format(meeting.endTime, "yyyyMMdd'T'HHmmss");
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${startStr}`,
      `DTEND:${endStr}`,
      `SUMMARY:${meeting.title}`,
      meeting.description ? `DESCRIPTION:${meeting.description.replace(/\n/g, '\\n')}` : '',
      meeting.location ? `LOCATION:${meeting.location}` : '',
      'END:VEVENT',
      'END:VCALENDAR',
    ].filter(Boolean).join('\n');

    return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;
  }, []);

  // Open Google Calendar with pre-filled event
  const openGoogleCalendar = useCallback((meeting: InvestorMeeting) => {
    const startStr = format(meeting.startTime, "yyyyMMdd'T'HHmmss");
    const endStr = format(meeting.endTime, "yyyyMMdd'T'HHmmss");
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: meeting.title,
      dates: `${startStr}/${endStr}`,
      details: meeting.description || '',
      location: meeting.location || meeting.meetingLink || '',
    });

    window.open(`https://calendar.google.com/calendar/render?${params}`, '_blank');
  }, []);

  return {
    // Data
    meetings: investorMeetings.data || [],
    isLoadingMeetings: investorMeetings.isLoading,
    calendarConnection: calendarConnection.data,
    settings,
    isConnecting,

    // Slot generation
    generateAvailableSlots,

    // Meeting actions
    createMeeting: createMeeting.mutate,
    updateMeeting: updateMeeting.mutate,
    cancelMeeting: cancelMeeting.mutate,
    isCreating: createMeeting.isPending,
    isUpdating: updateMeeting.isPending,

    // Settings
    updateSettings,

    // Calendar utilities
    generateCalendarLink,
    openGoogleCalendar,
  };
}

// Re-export types (already exported via interfaces above)
