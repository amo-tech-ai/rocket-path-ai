import { motion } from 'framer-motion';
import { FolderKanban, MoreHorizontal, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { Tables } from '@/integrations/supabase/types';

type Project = Tables<'projects'>;

interface ProjectListProps {
  projects: Project[];
  isLoading?: boolean;
}

export function ProjectList({ projects, isLoading }: ProjectListProps) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-elevated p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="w-5 h-5 rounded" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 rounded-xl" />
          ))}
        </div>
      </motion.div>
    );
  }

  const displayProjects = projects.length > 0 ? projects : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="card-elevated p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FolderKanban className="w-5 h-5 text-sage" />
          <h2 className="font-semibold">Active Projects</h2>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {displayProjects.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <FolderKanban className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No active projects yet</p>
          <Button variant="link" size="sm" className="mt-2" asChild>
            <Link to="/projects">Create your first project</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {displayProjects.map((project) => {
            // Database CHECK constraint values: on_track, at_risk, behind, completed
            const needsAttention = project.health === 'at_risk' || project.health === 'behind';
            return (
              <div key={project.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{project.name}</span>
                    {needsAttention && (
                      <span className="px-2 py-0.5 rounded-full bg-warm text-warm-foreground text-xs font-medium">
                        Needs attention
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground capitalize">
                    {project.status?.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        needsAttention ? "bg-warm-foreground/60" : "bg-sage"
                      }`}
                      style={{ width: `${project.progress || 0}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-8">{project.progress || 0}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Button variant="ghost" size="sm" className="w-full mt-4 text-muted-foreground" asChild>
        <Link to="/projects">
          View all projects
          <ArrowUpRight className="w-4 h-4 ml-1" />
        </Link>
      </Button>
    </motion.div>
  );
}
