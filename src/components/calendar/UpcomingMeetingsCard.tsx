/**
 * Upcoming Meetings Card
 * Displays scheduled investor meetings with quick actions
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  MoreHorizontal,
  ExternalLink,
  X,
  Edit,
  Copy,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format, isToday, isTomorrow, formatDistanceToNow } from 'date-fns';
import { useCalendarSync, InvestorMeeting } from '@/hooks/useCalendarSync';
import { useToast } from '@/hooks/use-toast';

export function UpcomingMeetingsCard() {
  const { 
    meetings, 
    isLoadingMeetings, 
    cancelMeeting, 
    openGoogleCalendar,
    generateCalendarLink 
  } = useCalendarSync();
  const { toast } = useToast();

  const formatMeetingDate = (date: Date): string => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEE, MMM d');
  };

  const getStatusColor = (status: InvestorMeeting['status']): string => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'scheduled':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'completed':
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleCopyLink = (meeting: InvestorMeeting) => {
    if (meeting.meetingLink) {
      navigator.clipboard.writeText(meeting.meetingLink);
      toast({ title: 'Meeting link copied' });
    }
  };

  const handleDownloadICS = (meeting: InvestorMeeting) => {
    const link = generateCalendarLink(meeting);
    const a = document.createElement('a');
    a.href = link;
    a.download = `${meeting.title.replace(/\s+/g, '-')}.ics`;
    a.click();
  };

  if (isLoadingMeetings) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const upcomingMeetings = meetings
    .filter(m => m.status !== 'cancelled' && m.status !== 'completed')
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Upcoming Meetings
        </CardTitle>
        <CardDescription>
          {upcomingMeetings.length} investor {upcomingMeetings.length === 1 ? 'meeting' : 'meetings'} scheduled
        </CardDescription>
      </CardHeader>
      <CardContent>
        {upcomingMeetings.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              No upcoming meetings
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Schedule a meeting with an investor to get started
            </p>
          </div>
        ) : (
          <ScrollArea className="max-h-[400px]">
            <div className="space-y-3">
              {upcomingMeetings.map((meeting, index) => (
                <motion.div
                  key={meeting.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm truncate">
                          {meeting.title}
                        </h4>
                        <Badge variant="outline" className={`shrink-0 text-xs ${getStatusColor(meeting.status)}`}>
                          {meeting.status}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {meeting.investorName}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatMeetingDate(meeting.startTime)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(meeting.startTime, 'h:mm a')}
                        </span>
                        {meeting.meetingLink ? (
                          <span className="flex items-center gap-1">
                            <Video className="w-3 h-3" />
                            Virtual
                          </span>
                        ) : meeting.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {meeting.location}
                          </span>
                        )}
                      </div>

                      {/* Quick action for meetings starting soon */}
                      {isToday(meeting.startTime) && meeting.meetingLink && (
                        <Button
                          size="sm"
                          className="mt-3"
                          onClick={() => window.open(meeting.meetingLink, '_blank')}
                        >
                          <Video className="w-3.5 h-3.5 mr-1.5" />
                          Join Meeting
                        </Button>
                      )}
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="shrink-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {meeting.meetingLink && (
                          <>
                            <DropdownMenuItem onClick={() => window.open(meeting.meetingLink, '_blank')}>
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Open meeting
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCopyLink(meeting)}>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy link
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem onClick={() => openGoogleCalendar(meeting)}>
                          <Calendar className="w-4 h-4 mr-2" />
                          Add to Google Calendar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownloadICS(meeting)}>
                          <Calendar className="w-4 h-4 mr-2" />
                          Download .ics
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => cancelMeeting(meeting.id)}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel meeting
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

export default UpcomingMeetingsCard;
