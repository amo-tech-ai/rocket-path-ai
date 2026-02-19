import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CalendarEvent {
  date: number;
  time: string;
  title: string;
}

interface DashboardCalendarProps {
  events?: CalendarEvent[];
}

const defaultEvents: CalendarEvent[] = [
  { date: 17, time: '10:00 AM', title: 'Team Sync' },
  { date: 20, time: '2:00 PM', title: 'Investor Call' },
];

export function DashboardCalendar({ events = defaultEvents }: DashboardCalendarProps) {
  const [currentDate] = useState(new Date());
  const today = currentDate.getDate();
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(
    currentDate.getFullYear(), 
    currentDate.getMonth() + 1, 
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(), 
    currentDate.getMonth(), 
    1
  ).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const eventDates = events.map(e => e.date);
  const todayEvents = events.filter(e => e.date === today);

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="card-premium p-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before first of month */}
        {Array.from({ length: firstDayOfMonth }, (_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        
        {/* Day cells */}
        {days.map(day => {
          const isToday = day === today;
          const hasEvent = eventDates.includes(day);
          const isWeekend = (firstDayOfMonth + day - 1) % 7 === 0 || (firstDayOfMonth + day - 1) % 7 === 6;
          
          return (
            <button
              key={day}
              className={cn(
                "aspect-square flex flex-col items-center justify-center text-sm rounded-lg transition-colors relative",
                isToday 
                  ? "bg-primary text-primary-foreground font-semibold" 
                  : isWeekend
                  ? "text-primary hover:bg-muted"
                  : "text-foreground hover:bg-muted"
              )}
            >
              {day}
              {hasEvent && !isToday && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      {/* Today's events */}
      {todayEvents.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          {todayEvents.map((event, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-1 h-8 rounded-full bg-primary" />
              <div>
                <p className="font-medium text-sm text-foreground">{event.title}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{event.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}