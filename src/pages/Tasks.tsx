import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { KanbanBoard } from '@/components/tasks/KanbanBoard';
import { TaskDialog } from '@/components/tasks/TaskDialog';
import { AITaskSuggestions } from '@/components/tasks/AITaskSuggestions';
import { TaskDetailSheet } from '@/components/tasks/TaskDetailSheet';
import { TasksAIPanel } from '@/components/tasks/TasksAIPanel';
import { 
  useAllTasks, 
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useUpdateTaskStatus,
  TaskWithProject,
} from '@/hooks/useTasks';
import { useStartup } from '@/hooks/useDashboardData';
import { useAllProjects } from '@/hooks/useProjects';
import { 
  CheckSquare, 
  Plus, 
  Search,
  Filter,
  LayoutGrid,
  List,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TaskCard } from '@/components/tasks/TaskCard';

const Tasks = () => {
  const [searchParams] = useSearchParams();
  const projectFilter = searchParams.get('project');
  
  const { data: startup, isLoading: startupLoading } = useStartup();
  const { data: tasks = [], isLoading: tasksLoading } = useAllTasks(startup?.id);
  const { data: projects = [] } = useAllProjects(startup?.id);
  
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const updateTaskStatus = useUpdateTaskStatus();
  
  // Dialog states
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithProject | null>(null);
  const [defaultStatus, setDefaultStatus] = useState('pending');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<TaskWithProject | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<string>(projectFilter || 'all');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskWithProject | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);

  const isLoading = startupLoading || tasksLoading;

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProject = selectedProject === 'all' || task.project_id === selectedProject;
      return matchesSearch && matchesProject;
    });
  }, [tasks, searchQuery, selectedProject]);

  // Stats
  const stats = useMemo(() => {
    const pending = filteredTasks.filter(t => t.status === 'pending').length;
    const inProgress = filteredTasks.filter(t => t.status === 'in_progress').length;
    const completed = filteredTasks.filter(t => t.status === 'completed').length;
    return { pending, inProgress, completed, total: filteredTasks.length };
  }, [filteredTasks]);

  const handleCreateTask = async (data: any) => {
    if (!startup?.id) {
      toast.error('No startup found. Please set up your startup profile first.');
      return;
    }
    
    try {
      await createTask.mutateAsync({
        ...data,
        startup_id: startup.id,
        project_id: data.project_id || null,
      });
      toast.success('Task created');
      setTaskDialogOpen(false);
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleUpdateTask = async (data: any) => {
    if (!editingTask) return;
    
    try {
      await updateTask.mutateAsync({
        id: editingTask.id,
        updates: {
          ...data,
          project_id: data.project_id || null,
        },
      });
      toast.success('Task updated');
      setEditingTask(null);
      setTaskDialogOpen(false);
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    
    try {
      await deleteTask.mutateAsync(taskToDelete.id);
      toast.success('Task deleted');
      setDeleteConfirmOpen(false);
      setTaskToDelete(null);
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleStatusChange = async (taskId: string, status: string) => {
    try {
      await updateTaskStatus.mutateAsync({ id: taskId, status });
      // Update selectedTask if it's the one being changed
      if (selectedTask?.id === taskId) {
        setSelectedTask({ ...selectedTask, status });
      }
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  const handleTaskClick = (task: TaskWithProject) => {
    setSelectedTask(task);
    setDetailSheetOpen(true);
  };

  const openEditTask = (task: TaskWithProject) => {
    setEditingTask(task);
    setTaskDialogOpen(true);
  };

  const openDeleteConfirm = (task: TaskWithProject) => {
    setTaskToDelete(task);
    setDeleteConfirmOpen(true);
  };

  const openAddTask = (status: string) => {
    setDefaultStatus(status);
    setEditingTask(null);
    setTaskDialogOpen(true);
  };

  // Empty state
  if (!isLoading && tasks.length === 0) {
    return (
      <DashboardLayout>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center py-20"
        >
          <div className="w-16 h-16 rounded-2xl bg-sage-light flex items-center justify-center mx-auto mb-6">
            <CheckSquare className="w-8 h-8 text-sage" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Tasks</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Stay on top of your work with a beautiful kanban board. 
            Track progress and never miss a deadline.
          </p>
          <Button onClick={() => setTaskDialogOpen(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Create your first task
          </Button>
        </motion.div>

        <TaskDialog
          open={taskDialogOpen}
          onOpenChange={setTaskDialogOpen}
          onSubmit={handleCreateTask}
          projects={projects}
          isLoading={createTask.isPending}
        />
      </DashboardLayout>
    );
  }

  const aiPanel = (
    <TasksAIPanel 
      stats={stats} 
      startupId={startup?.id}
      onGenerateTasks={() => setShowAISuggestions(true)} 
    />
  );

  return (
    <DashboardLayout aiPanel={aiPanel}>
      <div className="max-w-6xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
        >
          <div>
            <h1 className="text-2xl font-semibold mb-1">Tasks</h1>
            <p className="text-muted-foreground">
              {stats.total} tasks · {stats.pending} to do · {stats.inProgress} in progress · {stats.completed} done
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={showAISuggestions ? "sage" : "outline"}
              onClick={() => setShowAISuggestions(!showAISuggestions)}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI Generate
            </Button>
            <Button onClick={() => openAddTask('pending')}>
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </Button>
          </div>
        </motion.div>

        {/* AI Suggestions Panel */}
        {showAISuggestions && startup && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <AITaskSuggestions
              startupId={startup.id}
              startupContext={{
                name: startup.name,
                stage: startup.stage || undefined,
                industry: startup.industry || undefined,
              }}
              onAcceptTask={async (task) => {
                await handleCreateTask({
                  title: task.title,
                  description: task.description,
                  priority: task.priority,
                  status: 'pending',
                });
              }}
            />
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('kanban')}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Task Board/List */}
        {isLoading ? (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-96 w-80 flex-shrink-0 rounded-xl" />
            ))}
          </div>
        ) : viewMode === 'kanban' ? (
          <KanbanBoard
            tasks={filteredTasks}
            onEditTask={openEditTask}
            onDeleteTask={openDeleteConfirm}
            onStatusChange={handleStatusChange}
            onAddTask={openAddTask}
            onTaskClick={handleTaskClick}
            selectedTaskId={selectedTask?.id}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2 max-w-2xl"
          >
            {filteredTasks.map((task, index) => (
              <div
                key={task.id}
                onClick={() => handleTaskClick(task)}
                className={cn(
                  "cursor-pointer transition-colors rounded-lg",
                  selectedTask?.id === task.id && "ring-2 ring-primary"
                )}
              >
                <TaskCard
                  task={task}
                  onEdit={() => openEditTask(task)}
                  onDelete={() => openDeleteConfirm(task)}
                  onStatusChange={(status) => handleStatusChange(task.id, status)}
                  index={index}
                />
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Task Detail Sheet - Overlays on far right */}
      <TaskDetailSheet
        task={selectedTask}
        open={detailSheetOpen}
        onOpenChange={(open) => {
          setDetailSheetOpen(open);
          if (!open) setSelectedTask(null);
        }}
        onEdit={() => {
          if (selectedTask) openEditTask(selectedTask);
          setDetailSheetOpen(false);
        }}
        onDelete={() => {
          if (selectedTask) openDeleteConfirm(selectedTask);
        }}
        onStatusChange={(status) => {
          if (selectedTask) handleStatusChange(selectedTask.id, status);
        }}
      />

      {/* Task Dialog */}
      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={(open) => {
          setTaskDialogOpen(open);
          if (!open) setEditingTask(null);
        }}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        task={editingTask}
        projects={projects}
        defaultStatus={defaultStatus}
        isLoading={createTask.isPending || updateTask.isPending}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{taskToDelete?.title}"? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTask}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Tasks;
