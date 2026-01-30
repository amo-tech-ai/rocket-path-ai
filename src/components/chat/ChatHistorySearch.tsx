/**
 * Chat History Search Component
 * Searchable, filterable chat history with session grouping
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Search, 
  Calendar, 
  MessageSquare, 
  Filter, 
  ChevronDown,
  ChevronRight,
  Clock,
  Tag,
  Loader2,
  X
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  tab: string;
  created_at: string;
  session_id: string;
}

interface ChatSession {
  id: string;
  title: string | null;
  last_tab: string | null;
  message_count: number;
  created_at: string;
  messages?: ChatMessage[];
}

interface GroupedSessions {
  today: ChatSession[];
  yesterday: ChatSession[];
  thisWeek: ChatSession[];
  thisMonth: ChatSession[];
  older: ChatSession[];
}

interface ChatHistorySearchProps {
  onSelectMessage?: (message: ChatMessage, session: ChatSession) => void;
  onSelectSession?: (session: ChatSession) => void;
  className?: string;
}

const TAB_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  tasks: 'Tasks',
  crm: 'CRM',
  investors: 'Investors',
  'pitch-deck': 'Pitch Deck',
  'lean-canvas': 'Lean Canvas',
  events: 'Events',
  settings: 'Settings',
};

export function ChatHistorySearch({ 
  onSelectMessage, 
  onSelectSession,
  className 
}: ChatHistorySearchProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [tabFilter, setTabFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [searchResults, setSearchResults] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set());
  
  const debouncedQuery = useDebounce(searchQuery, 300);

  // Load sessions
  useEffect(() => {
    if (!user) return;

    const loadSessions = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('chat_sessions')
          .select('id, title, last_tab, message_count, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) throw error;
        setSessions(data || []);
      } catch (error) {
        console.error('Failed to load sessions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSessions();
  }, [user]);

  // Search messages
  useEffect(() => {
    if (!user || !debouncedQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const searchMessages = async () => {
      setIsSearching(true);
      try {
        let query = supabase
          .from('chat_messages')
          .select('id, role, content, tab, created_at, session_id')
          .eq('user_id', user.id)
          .ilike('content', `%${debouncedQuery}%`)
          .order('created_at', { ascending: false })
          .limit(50);

        if (tabFilter !== 'all') {
          query = query.eq('tab', tabFilter);
        }

        const { data, error } = await query;

        if (error) throw error;
        setSearchResults((data as ChatMessage[]) || []);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsSearching(false);
      }
    };

    searchMessages();
  }, [user, debouncedQuery, tabFilter]);

  // Group sessions by date
  const groupedSessions = useMemo((): GroupedSessions => {
    const groups: GroupedSessions = {
      today: [],
      yesterday: [],
      thisWeek: [],
      thisMonth: [],
      older: [],
    };

    let filteredSessions = sessions;

    if (tabFilter !== 'all') {
      filteredSessions = sessions.filter(s => s.last_tab === tabFilter);
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      filteredSessions = filteredSessions.filter(s => {
        const date = new Date(s.created_at);
        switch (dateFilter) {
          case 'today': return isToday(date);
          case 'week': return isThisWeek(date);
          case 'month': return isThisMonth(date);
          default: return true;
        }
      });
    }

    filteredSessions.forEach(session => {
      const date = new Date(session.created_at);
      if (isToday(date)) {
        groups.today.push(session);
      } else if (isYesterday(date)) {
        groups.yesterday.push(session);
      } else if (isThisWeek(date)) {
        groups.thisWeek.push(session);
      } else if (isThisMonth(date)) {
        groups.thisMonth.push(session);
      } else {
        groups.older.push(session);
      }
    });

    return groups;
  }, [sessions, tabFilter, dateFilter]);

  // Load session messages when expanded
  const loadSessionMessages = useCallback(async (sessionId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('id, role, content, tab, created_at, session_id')
        .eq('session_id', sessionId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;

      setSessions(prev => 
        prev.map(s => 
          s.id === sessionId 
            ? { ...s, messages: data as ChatMessage[] }
            : s
        )
      );
    } catch (error) {
      console.error('Failed to load session messages:', error);
    }
  }, [user]);

  const toggleSession = useCallback((sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    
    setExpandedSessions(prev => {
      const next = new Set(prev);
      if (next.has(sessionId)) {
        next.delete(sessionId);
      } else {
        next.add(sessionId);
        if (!session?.messages) {
          loadSessionMessages(sessionId);
        }
      }
      return next;
    });
  }, [sessions, loadSessionMessages]);

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) 
        ? <mark key={i} className="bg-primary/20 text-primary rounded px-0.5">{part}</mark>
        : part
    );
  };

  const clearSearch = () => {
    setSearchQuery('');
    setTabFilter('all');
    setDateFilter('all');
  };

  const isSearchActive = searchQuery.trim().length > 0;

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Search Header */}
      <div className="p-3 border-b space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search chat history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9"
          />
          {(searchQuery || tabFilter !== 'all' || dateFilter !== 'all') && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={clearSearch}
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
        
        <div className="flex gap-2">
          <Select value={tabFilter} onValueChange={setTabFilter}>
            <SelectTrigger className="h-8 text-xs flex-1">
              <Filter className="w-3 h-3 mr-1" />
              <SelectValue placeholder="Tab" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tabs</SelectItem>
              {Object.entries(TAB_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="h-8 text-xs flex-1">
              <Calendar className="w-3 h-3 mr-1" />
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : isSearchActive ? (
          /* Search Results */
          <div className="p-2 space-y-1">
            {isSearching && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground p-2">
                <Loader2 className="w-3 h-3 animate-spin" />
                Searching...
              </div>
            )}
            <AnimatePresence mode="popLayout">
              {searchResults.length === 0 && !isSearching ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-sm text-muted-foreground"
                >
                  No messages found for "{debouncedQuery}"
                </motion.div>
              ) : (
                searchResults.map((message) => (
                  <motion.button
                    key={message.id}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "w-full text-left p-2 rounded-lg hover:bg-muted/50 transition-colors",
                      "border border-transparent hover:border-border"
                    )}
                    onClick={() => {
                      const session = sessions.find(s => s.id === message.session_id);
                      if (session && onSelectMessage) {
                        onSelectMessage(message, session);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={message.role === 'user' ? 'default' : 'secondary'} className="text-[10px] h-4">
                        {message.role}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {format(new Date(message.created_at), 'MMM d, h:mm a')}
                      </span>
                      {message.tab && (
                        <Badge variant="outline" className="text-[10px] h-4">
                          {TAB_LABELS[message.tab] || message.tab}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs line-clamp-2">
                      {highlightMatch(message.content, debouncedQuery)}
                    </p>
                  </motion.button>
                ))
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* Session List */
          <div className="p-2 space-y-3">
            {Object.entries(groupedSessions).map(([group, groupSessions]) => {
              if (groupSessions.length === 0) return null;
              
              const labels: Record<string, string> = {
                today: 'Today',
                yesterday: 'Yesterday',
                thisWeek: 'This Week',
                thisMonth: 'This Month',
                older: 'Older',
              };
              
              return (
                <div key={group}>
                  <div className="flex items-center gap-2 px-2 py-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">
                      {labels[group]}
                    </span>
                    <Badge variant="secondary" className="text-[10px] h-4">
                      {groupSessions.length}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 mt-1">
                    {groupSessions.map((session) => (
                      <Collapsible
                        key={session.id}
                        open={expandedSessions.has(session.id)}
                        onOpenChange={() => toggleSession(session.id)}
                      >
                        <CollapsibleTrigger asChild>
                          <button
                            className={cn(
                              "w-full text-left p-2 rounded-lg hover:bg-muted/50 transition-colors",
                              "border border-transparent hover:border-border flex items-start gap-2"
                            )}
                          >
                            {expandedSessions.has(session.id) ? (
                              <ChevronDown className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            ) : (
                              <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <MessageSquare className="w-3 h-3 text-primary" />
                                <span className="text-xs font-medium truncate">
                                  {session.title || 'Chat Session'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-muted-foreground">
                                  {session.message_count || 0} messages
                                </span>
                                {session.last_tab && (
                                  <Badge variant="outline" className="text-[10px] h-4">
                                    {TAB_LABELS[session.last_tab] || session.last_tab}
                                  </Badge>
                                )}
                                <span className="text-[10px] text-muted-foreground">
                                  {format(new Date(session.created_at), 'h:mm a')}
                                </span>
                              </div>
                            </div>
                          </button>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent>
                          <div className="ml-5 pl-2 border-l space-y-1 py-1">
                            {session.messages ? (
                              session.messages.slice(0, 10).map((msg) => (
                                <button
                                  key={msg.id}
                                  className="w-full text-left p-1.5 rounded hover:bg-muted/30 transition-colors"
                                  onClick={() => onSelectMessage?.(msg, session)}
                                >
                                  <div className="flex items-center gap-1 mb-0.5">
                                    <Badge 
                                      variant={msg.role === 'user' ? 'default' : 'secondary'} 
                                      className="text-[9px] h-3.5 px-1"
                                    >
                                      {msg.role === 'user' ? 'You' : 'AI'}
                                    </Badge>
                                  </div>
                                  <p className="text-[11px] text-muted-foreground line-clamp-1">
                                    {msg.content}
                                  </p>
                                </button>
                              ))
                            ) : (
                              <div className="py-2 flex items-center justify-center">
                                <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                              </div>
                            )}
                            {session.messages && session.messages.length > 10 && (
                              <p className="text-[10px] text-muted-foreground text-center py-1">
                                +{session.messages.length - 10} more messages
                              </p>
                            )}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                </div>
              );
            })}
            
            {sessions.length === 0 && (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No chat history yet
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

export default ChatHistorySearch;
