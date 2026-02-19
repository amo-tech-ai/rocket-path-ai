import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Project = Tables<'projects'>;
export type NewProject = TablesInsert<'projects'>;
export type UpdateProject = TablesUpdate<'projects'>;

// Fetch all projects for the startup
export function useAllProjects(startupId: string | undefined) {
  return useQuery({
    queryKey: ['all-projects', startupId],
    queryFn: async () => {
      if (!startupId) return [];
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .is('deleted_at', null)
        .eq('startup_id', startupId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!startupId,
  });
}

// Fetch single project with task counts
export function useProject(projectId: string | undefined) {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      if (!projectId) return null;
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .is('deleted_at', null)
        .eq('id', projectId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });
}

// Fetch task counts for projects
export function useProjectTaskCounts(projectIds: string[]) {
  return useQuery({
    queryKey: ['project-task-counts', projectIds],
    queryFn: async () => {
      if (projectIds.length === 0) return {};
      
      const { data, error } = await supabase
        .from('tasks')
        .select('project_id, status')
        .is('deleted_at', null)
        .in('project_id', projectIds);
      
      if (error) throw error;
      
      const counts: Record<string, { total: number; completed: number }> = {};
      projectIds.forEach(id => {
        counts[id] = { total: 0, completed: 0 };
      });
      
      (data || []).forEach(task => {
        if (task.project_id) {
          counts[task.project_id].total++;
          if (task.status === 'completed') {
            counts[task.project_id].completed++;
          }
        }
      });
      
      return counts;
    },
    enabled: projectIds.length > 0,
  });
}

// Create new project
export function useCreateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (project: NewProject) => {
      const { data, error } = await supabase
        .from('projects')
        .insert(project)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

// Update project
export function useUpdateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateProject }) => {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['all-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', data.id] });
    },
  });
}

// Delete project
export function useDeleteProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

// Project status options (must match database CHECK constraint)
export const PROJECT_STATUSES = [
  { value: 'planning', label: 'Planning', color: 'bg-blue-500' },
  { value: 'active', label: 'Active', color: 'bg-sage' },
  { value: 'on_hold', label: 'On Hold', color: 'bg-warm-foreground' },
  { value: 'completed', label: 'Completed', color: 'bg-muted-foreground' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-destructive' },
] as const;

// Project health options (must match database CHECK constraint)
export const PROJECT_HEALTH = [
  { value: 'on_track', label: 'On Track', color: 'text-sage' },
  { value: 'at_risk', label: 'At Risk', color: 'text-warm-foreground' },
  { value: 'behind', label: 'Behind', color: 'text-destructive' },
  { value: 'completed', label: 'Completed', color: 'text-muted-foreground' },
] as const;

// Project type options (must match database CHECK constraint)
export const PROJECT_TYPES = [
  { value: 'fundraising', label: 'Fundraising' },
  { value: 'product', label: 'Product' },
  { value: 'hiring', label: 'Hiring' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'operations', label: 'Operations' },
  { value: 'other', label: 'Other' },
] as const;
