/**
 * Meeting Scheduler Dialog
 * UI for scheduling investor meetings with time slot selection
 */

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  User,
  Plus,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, startOfDay, isSameDay } from 'date-fns';
import { useCalendarSync, MeetingSlot, InvestorMeeting } from '@/hooks/useCalendarSync';
import { useNotifications } from '@/hooks/useNotifications';

interface MeetingSchedulerProps {
  investor?: {
    id: string;
    name: string;
    email?: string;
    company?: string;
  };
  trigger?: React.ReactNode;
  onScheduled?: (meeting: any) => void;
}

export function MeetingScheduler({ investor, trigger, onScheduled }: MeetingSchedulerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'date' | 'time' | 'details'>('date');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<MeetingSlot | null>(null);
  const [meetingDetails, setMeetingDetails] = useState({
    title: investor ? `Meeting with ${investor.name}` : 'Investor Meeting',
    description: '',
    location: '',
    meetingLink: '',
    duration: 30,
  });

  const {
    meetings,
    settings,
    generateAvailableSlots,
    createMeeting,
    isCreating,
  } = useCalendarSync();

  const { scheduleMeetingReminder } = useNotifications();

  // Generate 7 days of dates starting from today
  const availableDates = useMemo(() => {
    const dates: Date[] = [];
    const today = startOfDay(new Date());
    
    for (let i = 0; i < 14; i++) {
      const date = addDays(today, i);
      if (settings.availableDays.includes(date.getDay())) {
        dates.push(date);
      }
    }
    
    return dates;
  }, [settings.availableDays]);

  // Generate time slots for selected date
  const timeSlots = useMemo(() => {
    if (!selectedDate) return [];
    return generateAvailableSlots(selectedDate, meetings, settings);
  }, [selectedDate, meetings, settings, generateAvailableSlots]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setStep('time');
  };

  const handleSlotSelect = (slot: MeetingSlot) => {
    if (!slot.available) return;
    setSelectedSlot(slot);
    setStep('details');
  };

  const handleSchedule = () => {
    if (!selectedSlot || !investor) return;

    createMeeting({
      investorId: investor.id,
      investorName: investor.name,
      investorEmail: investor.email,
      title: meetingDetails.title,
      description: meetingDetails.description,
      startTime: selectedSlot.start,
      duration: meetingDetails.duration,
      location: meetingDetails.location,
      meetingLink: meetingDetails.meetingLink,
    });

    // Schedule reminder notification
    scheduleMeetingReminder({
      eventId: crypto.randomUUID(), // Will be replaced with actual ID
      eventTitle: meetingDetails.title,
      startTime: selectedSlot.start,
      contactName: investor.name,
      location: meetingDetails.location || meetingDetails.meetingLink,
    });

    onScheduled?.({
      ...meetingDetails,
      startTime: selectedSlot.start,
      investorName: investor.name,
    });

    // Reset and close
    setIsOpen(false);
    setStep('date');
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  const renderDateStep = () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Select a date for your meeting with {investor?.name}
      </p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {availableDates.slice(0, 8).map((date) => {
          const isToday = isSameDay(date, new Date());
          
          return (
            <motion.button
              key={date.toISOString()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleDateSelect(date)}
              className={`p-3 rounded-lg border text-center transition-colors hover:border-primary ${
                selectedDate && isSameDay(date, selectedDate)
                  ? 'border-primary bg-primary/10'
                  : ''
              }`}
            >
              <p className="text-xs text-muted-foreground">
                {format(date, 'EEE')}
              </p>
              <p className="text-lg font-semibold">
                {format(date, 'd')}
              </p>
              <p className="text-xs text-muted-foreground">
                {format(date, 'MMM')}
              </p>
              {isToday && (
                <Badge variant="secondary" className="mt-1 text-xs">
                  Today
                </Badge>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );

  const renderTimeStep = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setStep('date')}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <p className="text-sm font-medium">
          {selectedDate && format(selectedDate, 'EEEE, MMMM d')}
        </p>
      </div>

      <ScrollArea className="h-[300px]">
        <div className="grid grid-cols-2 gap-2 pr-4">
          {timeSlots.map((slot, idx) => (
            <motion.button
              key={idx}
              whileHover={slot.available ? { scale: 1.02 } : {}}
              whileTap={slot.available ? { scale: 0.98 } : {}}
              onClick={() => handleSlotSelect(slot)}
              disabled={!slot.available}
              className={`p-3 rounded-lg border text-center transition-colors ${
                slot.available
                  ? 'hover:border-primary cursor-pointer'
                  : 'opacity-50 cursor-not-allowed bg-muted/50'
              } ${
                selectedSlot?.start.getTime() === slot.start.getTime()
                  ? 'border-primary bg-primary/10'
                  : ''
              }`}
            >
              <Clock className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
              <p className="font-medium">
                {format(slot.start, 'h:mm a')}
              </p>
              <p className="text-xs text-muted-foreground">
                {settings.defaultDuration} min
              </p>
            </motion.button>
          ))}
        </div>

        {timeSlots.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No available slots on this date</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );

  const renderDetailsStep = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setStep('time')}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        {selectedSlot && (
          <Badge variant="outline">
            <Calendar className="w-3 h-3 mr-1" />
            {format(selectedSlot.start, 'EEE, MMM d')} at {format(selectedSlot.start, 'h:mm a')}
          </Badge>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Meeting Title</Label>
          <Input
            id="title"
            value={meetingDetails.title}
            onChange={(e) => setMeetingDetails(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g., Intro call with investor"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Select
              value={String(meetingDetails.duration)}
              onValueChange={(v) => setMeetingDetails(prev => ({ ...prev, duration: Number(v) }))}
            >
              <SelectTrigger id="duration">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location Type</Label>
            <Select
              value={meetingDetails.meetingLink ? 'virtual' : 'in-person'}
              onValueChange={(v) => {
                if (v === 'virtual') {
                  setMeetingDetails(prev => ({ 
                    ...prev, 
                    location: '',
                    meetingLink: 'https://meet.google.com/' 
                  }));
                } else {
                  setMeetingDetails(prev => ({ 
                    ...prev, 
                    meetingLink: '' 
                  }));
                }
              }}
            >
              <SelectTrigger id="location">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="virtual">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Virtual
                  </div>
                </SelectItem>
                <SelectItem value="in-person">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    In-person
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {meetingDetails.meetingLink && (
          <div className="space-y-2">
            <Label htmlFor="meetingLink">Meeting Link</Label>
            <Input
              id="meetingLink"
              value={meetingDetails.meetingLink}
              onChange={(e) => setMeetingDetails(prev => ({ ...prev, meetingLink: e.target.value }))}
              placeholder="https://meet.google.com/..."
            />
          </div>
        )}

        {!meetingDetails.meetingLink && (
          <div className="space-y-2">
            <Label htmlFor="locationAddress">Location</Label>
            <Input
              id="locationAddress"
              value={meetingDetails.location}
              onChange={(e) => setMeetingDetails(prev => ({ ...prev, location: e.target.value }))}
              placeholder="e.g., Coffee shop, office address..."
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="description">Notes (optional)</Label>
          <Textarea
            id="description"
            value={meetingDetails.description}
            onChange={(e) => setMeetingDetails(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Agenda, talking points, etc."
            rows={3}
          />
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm">
            <Calendar className="w-4 h-4 mr-1.5" />
            Schedule Meeting
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Schedule Investor Meeting
          </DialogTitle>
          <DialogDescription>
            {investor ? (
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {investor.name}
                {investor.company && <span className="text-muted-foreground">• {investor.company}</span>}
              </span>
            ) : (
              'Select a time slot and add meeting details'
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {step === 'date' && renderDateStep()}
              {step === 'time' && renderTimeStep()}
              {step === 'details' && renderDetailsStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {step === 'details' && (
          <DialogFooter>
            <Button
              onClick={handleSchedule}
              disabled={isCreating || !selectedSlot}
              className="w-full"
            >
              {isCreating ? (
                'Scheduling...'
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-1.5" />
                  Schedule Meeting
                </>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default MeetingScheduler;
