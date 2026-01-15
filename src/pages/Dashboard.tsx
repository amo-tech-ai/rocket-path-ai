import DashboardLayout from "@/components/layout/DashboardLayout";
import AIPanel from "@/components/dashboard/AIPanel";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  TrendingUp, 
  Users, 
  FolderKanban,
  ArrowUpRight,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Dashboard = () => {
  const todaysPriorities = [
    { id: 1, title: "Finalize Q1 product roadmap", completed: true, project: "Product" },
    { id: 2, title: "Review investor deck with team", completed: false, project: "Fundraising" },
    { id: 3, title: "Send follow-up to Sequoia partner", completed: false, project: "Fundraising" },
    { id: 4, title: "Technical architecture review", completed: false, project: "Engineering" },
  ];

  const activeProjects = [
    { name: "Product Launch v2.0", progress: 72, tasks: 24, status: "on-track" },
    { name: "Series A Fundraise", progress: 45, tasks: 18, status: "attention" },
    { name: "Team Hiring", progress: 60, tasks: 8, status: "on-track" },
  ];

  const keyMetrics = [
    { label: "MRR", value: "$48.2K", change: "+12%", trend: "up" },
    { label: "Active Users", value: "2,847", change: "+8%", trend: "up" },
    { label: "Runway", value: "8 months", change: "-1", trend: "neutral" },
    { label: "Team Size", value: "12", change: "+2", trend: "up" },
  ];

  const recentActivity = [
    { action: "Completed task", item: "Update pricing page", time: "2h ago", user: "You" },
    { action: "Added note", item: "Meeting with Accel", time: "3h ago", user: "You" },
    { action: "Created project", item: "Q1 Marketing Push", time: "Yesterday", user: "Emma" },
    { action: "Closed deal", item: "Enterprise contract", time: "2 days ago", user: "Alex" },
  ];

  return (
    <DashboardLayout aiPanel={<AIPanel />}>
      <div className="max-w-5xl">
        {/* Page header */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-semibold mb-1">Good morning, Alex</h1>
          <p className="text-muted-foreground">
            Here's your startup at a glance. You have 3 priorities for today.
          </p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {keyMetrics.map((metric) => (
            <div key={metric.label} className="card-premium p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {metric.label}
                </span>
                <span className={`text-xs font-medium ${
                  metric.trend === "up" ? "text-sage" : "text-muted-foreground"
                }`}>
                  {metric.change}
                </span>
              </div>
              <div className="text-2xl font-semibold">{metric.value}</div>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Today's Priorities */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-elevated p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-sage" />
                <h2 className="font-semibold">Today's Priorities</h2>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {todaysPriorities.map((priority) => (
                <div 
                  key={priority.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                >
                  {priority.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-sage flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${priority.completed ? "line-through text-muted-foreground" : ""}`}>
                      {priority.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{priority.project}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="ghost" size="sm" className="w-full mt-4 text-muted-foreground">
              View all tasks
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>

          {/* Active Projects */}
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

            <div className="space-y-4">
              {activeProjects.map((project) => (
                <div key={project.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{project.name}</span>
                      {project.status === "attention" && (
                        <span className="px-2 py-0.5 rounded-full bg-warm text-warm-foreground text-xs font-medium">
                          Needs attention
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{project.tasks} tasks</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          project.status === "attention" ? "bg-warm-foreground/60" : "bg-sage"
                        }`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium w-8">{project.progress}%</span>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="ghost" size="sm" className="w-full mt-4 text-muted-foreground">
              View all projects
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-premium p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-sage" />
              <h2 className="font-semibold">Recent Activity</h2>
            </div>
          </div>

          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 py-2 border-b border-border last:border-0"
              >
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>
                    {" "}{activity.action}:{" "}
                    <span className="text-muted-foreground">{activity.item}</span>
                  </p>
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0">{activity.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
