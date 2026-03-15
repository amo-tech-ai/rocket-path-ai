import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface ChatModeSession {
  id: string;
  user_id: string;
  mode: string;
  title: string | null;
  messages: Array<{ role: string; content: string }>;
  metadata: Record<string, unknown>;
  started_at: string;
  ended_at: string | null;
  created_at: string;
  updated_at: string;
}

export function useChatModeSessions(mode?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const sessionsQuery = useQuery({
    queryKey: ['chat-mode-sessions', user?.id, mode],
    queryFn: async () => {
      let query = supabase
        .from('chat_mode_sessions')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(20);

      if (mode) {
        query = query.eq('mode', mode);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as unknown as ChatModeSession[];
    },
    enabled: !!user,
  });

  const createSession = useMutation({
    mutationFn: async ({ mode, title }: { mode: string; title?: string }) => {
      const { data, error } = await supabase
        .from('chat_mode_sessions')
        .insert({
          user_id: user!.id,
          mode,
          title: title || null,
          messages: [],
          metadata: {},
        } as any)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as ChatModeSession;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-mode-sessions'] });
    },
    onError: (err) => {
      toast({ title: 'Failed to create session', description: err.message, variant: 'destructive' });
    },
  });

  const saveMessages = useMutation({
    mutationFn: async ({ sessionId, messages, title }: {
      sessionId: string;
      messages: Array<{ role: string; content: string }>;
      title?: string;
    }) => {
      const update: Record<string, unknown> = { messages };
      if (title) update.title = title;

      const { error } = await supabase
        .from('chat_mode_sessions')
        .update(update as any)
        .eq('id', sessionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-mode-sessions'] });
    },
  });

  const deleteSession = useMutation({
    mutationFn: async (sessionId: string) => {
      const { error } = await supabase
        .from('chat_mode_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-mode-sessions'] });
    },
  });

  return {
    sessions: sessionsQuery.data || [],
    isLoading: sessionsQuery.isLoading,
    createSession: createSession.mutateAsync,
    saveMessages: saveMessages.mutate,
    deleteSession: deleteSession.mutate,
  };
}
