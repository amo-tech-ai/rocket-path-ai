import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Task = Tables<'tasks'>;
export type NewTask = TablesInsert<'tasks'>;
export type UpdateTask = TablesUpdate<'tasks'>;

// Task statuses for kanban
export const TASK_STATUSES = [
  { value: 'pending', label: 'To Do', color: 'bg-muted' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-warm' },
  { value: 'completed', label: 'Done', color: 'bg-sage-light' },
] as const;

// Task priorities
export const TASK_PRIORITIES = [
  { value: 'low', label: 'Low', color: 'text-muted-foreground' },
  { value: 'medium', label: 'Medium', color: 'text-foreground' },
  { value: 'high', label: 'High', color: 'text-warm-foreground' },
  { value: 'urgent', label: 'Urgent', color: 'text-destructive' },
] as const;

export type TaskWithProject = Task & {
  project: { id: string; name: string } | null;
};

// Fetch all tasks for a startup
export function useAllTasks(startupId: string | undefined) {
  return useQuery({
    queryKey: ['all-tasks', startupId],
    queryFn: async () => {
      if (!startupId) return [];
      
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          project:projects(id, name)
        `)
        .is('deleted_at', null)
        .eq('startup_id', startupId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []) as TaskWithProject[];
    },
    enabled: !!startupId,
  });
}

// Fetch tasks by project
export function useTasksByProject(projectId: string | undefined) {
  return useQuery({
    queryKey: ['tasks-by-project', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          project:projects(id, name)
        `)
        .is('deleted_at', null)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []) as TaskWithProject[];
    },
    enabled: !!projectId,
  });
}

// Create task
export function useCreateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (task: NewTask) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert(task)
        .select(`
          *,
          project:projects(id, name)
        `)
        .single();
      
      if (error) throw error;
      return data as TaskWithProject;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task-stats'] });
    },
  });
}

// Update task
export function useUpdateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateTask }) => {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          project:projects(id, name)
        `)
        .single();
      
      if (error) throw error;
      return data as TaskWithProject;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task-stats'] });
    },
  });
}

// Delete task
export function useDeleteTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task-stats'] });
    },
  });
}

// Update task status (for drag-and-drop)
export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task-stats'] });
    },
  });
}
