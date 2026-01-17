import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  useProject, 
  useUpdateProject,
  useDeleteProject,
  PROJECT_STATUSES,
  PROJECT_HEALTH,
  PROJECT_TYPES,
} from '@/hooks/useProjects';
import { useTasksByProject, useUpdateTaskStatus, TaskWithProject } from '@/hooks/useTasks';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskDetailSheet } from '@/components/tasks/TaskDetailSheet';
import { TaskDialog } from '@/components/tasks/TaskDialog';
import { CreateProjectDialog } from '@/components/projects/CreateProjectDialog';
import { ProjectDetailAIPanel } from '@/components/projects/ProjectDetailAIPanel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowLeft,
  Edit2,
  Trash2,
  Plus,
  Calendar,
  Users,
  Target,
  CheckCircle2,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
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
import { useCreateTask, useUpdateTask, useDeleteTask } from '@/hooks/useTasks';
import { useStartup } from '@/hooks/useDashboardData';
import { useAllProjects } from '@/hooks/useProjects';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const { data: project, isLoading: projectLoading } = useProject(projectId);
  const { data: tasks = [], isLoading: tasksLoading } = useTasksByProject(projectId);
  const { data: startup } = useStartup();
  const { data: projects = [] } = useAllProjects(startup?.id);
  
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const updateTaskStatus = useUpdateTaskStatus();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskWithProject | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithProject | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<TaskWithProject | null>(null);
  const [taskFilter, setTaskFilter] = useState('all');

  const isLoading = projectLoading || tasksLoading;

  // Task stats
  const taskStats = useMemo(() => {
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const overdue = tasks.filter(t => 
      t.due_at && new Date(t.due_at) < new Date() && t.status !== 'completed'
    ).length;
    return { completed, inProgress, pending, overdue, total: tasks.length };
  }, [tasks]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    switch (taskFilter) {
      case 'active':
        return tasks.filter(t => t.status !== 'completed');
      case 'completed':
        return tasks.filter(t => t.status === 'completed');
      case 'overdue':
        return tasks.filter(t => 
          t.due_at && new Date(t.due_at) < new Date() && t.status !== 'completed'
        );
      default:
        return tasks;
    }
  }, [tasks, taskFilter]);

  const progress = taskStats.total > 0 
    ? Math.round((taskStats.completed / taskStats.total) * 100) 
    : 0;

  const statusInfo = PROJECT_STATUSES.find(s => s.value === project?.status);
  const healthInfo = PROJECT_HEALTH.find(h => h.value === project?.health);
  const typeInfo = PROJECT_TYPES.find(t => t.value === project?.type);

  const handleUpdateProject = async (data: any) => {
    if (!project) return;
    try {
      await updateProject.mutateAsync({ id: project.id, updates: data });
      toast.success('Project updated');
      setEditDialogOpen(false);
    } catch {
      toast.error('Failed to update project');
    }
  };

  const handleDeleteProject = async () => {
    if (!project) return;
    try {
      await deleteProject.mutateAsync(project.id);
      toast.success('Project deleted');
      navigate('/projects');
    } catch {
      toast.error('Failed to delete project');
    }
  };

  const handleStatusChange = async (taskId: string, status: string) => {
    try {
      await updateTaskStatus.mutateAsync({ id: taskId, status });
      if (selectedTask?.id === taskId) {
        setSelectedTask({ ...selectedTask, status });
      }
    } catch {
      toast.error('Failed to update task status');
    }
  };

  const handleCreateTask = async (data: any) => {
    if (!startup?.id || !projectId) return;
    try {
      await createTask.mutateAsync({
        ...data,
        startup_id: startup.id,
        project_id: projectId,
      });
      toast.success('Task created');
      setTaskDialogOpen(false);
    } catch {
      toast.error('Failed to create task');
    }
  };

  const handleUpdateTask = async (data: any) => {
    if (!editingTask) return;
    try {
      await updateTask.mutateAsync({ id: editingTask.id, updates: data });
      toast.success('Task updated');
      setEditingTask(null);
      setTaskDialogOpen(false);
      if (selectedTask?.id === editingTask.id) {
        setSelectedTask(null);
      }
    } catch {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      await deleteTask.mutateAsync(taskToDelete.id);
      toast.success('Task deleted');
      setTaskToDelete(null);
      if (selectedTask?.id === taskToDelete.id) {
        setSelectedTask(null);
      }
    } catch {
      toast.error('Failed to delete task');
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <h2 className="text-xl font-semibold mb-2">Project not found</h2>
          <Button variant="link" asChild>
            <Link to="/projects">Back to Projects</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const aiPanel = (
    <ProjectDetailAIPanel
      projectName={project.name}
      projectHealth={project.health || 'on_track'}
      taskStats={taskStats}
      progress={progress}
    />
  );

  return (
    <DashboardLayout aiPanel={aiPanel}>
      <div className="max-w-4xl">
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="space-y-6 pr-4">
              {/* Back Link & Header */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Link 
                  to="/projects" 
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Projects
                </Link>

                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h1 className="text-2xl font-semibold">{project.name}</h1>
                      {statusInfo && (
                        <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                      )}
                    </div>
                    {project.description && (
                      <p className="text-muted-foreground max-w-2xl">{project.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditDialogOpen(true)}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-destructive"
                      onClick={() => setDeleteConfirmOpen(true)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Stats Cards */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-sage-light">
                        <Target className="w-4 h-4 text-sage" />
                      </div>
                      <div>
                        <p className="text-2xl font-semibold">{progress}%</p>
                        <p className="text-xs text-muted-foreground">Progress</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-2xl font-semibold">{taskStats.completed}/{taskStats.total}</p>
                        <p className="text-xs text-muted-foreground">Tasks Done</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-warm">
                        <Clock className="w-4 h-4 text-warm-foreground" />
                      </div>
                      <div>
                        <p className="text-2xl font-semibold">{taskStats.inProgress}</p>
                        <p className="text-xs text-muted-foreground">In Progress</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        taskStats.overdue > 0 ? "bg-destructive/10" : "bg-muted"
                      )}>
                        <AlertTriangle className={cn(
                          "w-4 h-4",
                          taskStats.overdue > 0 ? "text-destructive" : "text-muted-foreground"
                        )} />
                      </div>
                      <div>
                        <p className="text-2xl font-semibold">{taskStats.overdue}</p>
                        <p className="text-xs text-muted-foreground">Overdue</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Progress Bar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Overall Progress</span>
                      <div className="flex items-center gap-2">
                        {healthInfo && (
                          <span className={cn("text-sm font-medium", healthInfo.color)}>
                            {healthInfo.label}
                          </span>
                        )}
                      </div>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Project Info */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Project Details</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    {typeInfo && (
                      <div>
                        <p className="text-sm text-muted-foreground">Type</p>
                        <p className="font-medium">{typeInfo.label}</p>
                      </div>
                    )}
                    {project.start_date && (
                      <div>
                        <p className="text-sm text-muted-foreground">Start Date</p>
                        <p className="font-medium flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(project.start_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    )}
                    {project.end_date && (
                      <div>
                        <p className="text-sm text-muted-foreground">End Date</p>
                        <p className="font-medium flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(project.end_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    )}
                    {project.team_members && project.team_members.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground">Team Size</p>
                        <p className="font-medium flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {project.team_members.length} members
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Tasks Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">Linked Tasks</CardTitle>
                    <Button size="sm" onClick={() => setTaskDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add Task
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={taskFilter} onValueChange={setTaskFilter}>
                      <TabsList>
                        <TabsTrigger value="all">All ({taskStats.total})</TabsTrigger>
                        <TabsTrigger value="active">Active ({taskStats.pending + taskStats.inProgress})</TabsTrigger>
                        <TabsTrigger value="completed">Done ({taskStats.completed})</TabsTrigger>
                        {taskStats.overdue > 0 && (
                          <TabsTrigger value="overdue" className="text-destructive">
                            Overdue ({taskStats.overdue})
                          </TabsTrigger>
                        )}
                      </TabsList>
                      <TabsContent value={taskFilter} className="mt-4">
                        {filteredTasks.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <p>No tasks in this category</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {filteredTasks.map((task, index) => (
                              <div
                                key={task.id}
                                onClick={() => {
                                  setSelectedTask(task);
                                  setDetailSheetOpen(true);
                                }}
                                className={cn(
                                  "cursor-pointer transition-colors rounded-lg",
                                  selectedTask?.id === task.id && "ring-2 ring-primary"
                                )}
                              >
                                <TaskCard
                                  task={task}
                                  onEdit={() => {
                                    setEditingTask(task);
                                    setTaskDialogOpen(true);
                                  }}
                                  onDelete={() => setTaskToDelete(task)}
                                  onStatusChange={(status) => handleStatusChange(task.id, status)}
                                  index={index}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </ScrollArea>
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
          if (selectedTask) {
            setEditingTask(selectedTask);
            setTaskDialogOpen(true);
          }
          setDetailSheetOpen(false);
        }}
        onDelete={() => {
          if (selectedTask) setTaskToDelete(selectedTask);
        }}
        onStatusChange={(status) => {
          if (selectedTask) handleStatusChange(selectedTask.id, status);
        }}
      />

      {/* Dialogs */}
      <CreateProjectDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSubmit={handleUpdateProject}
        project={project}
        isLoading={updateProject.isPending}
      />

      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={(open) => {
          setTaskDialogOpen(open);
          if (!open) setEditingTask(null);
        }}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        task={editingTask}
        projects={projects}
        defaultStatus="pending"
        isLoading={createTask.isPending || updateTask.isPending}
      />

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{project.name}"? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProject}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!taskToDelete} onOpenChange={() => setTaskToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{taskToDelete?.title}"?
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

export default ProjectDetail;
