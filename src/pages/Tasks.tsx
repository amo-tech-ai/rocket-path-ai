import DashboardLayout from "@/components/layout/DashboardLayout";
import { CheckSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Tasks = () => {
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
          Your daily execution layer. AI-prioritized tasks connected to your 
          strategic goals.
        </p>
        <Button variant="hero" size="lg">
          <Plus className="w-5 h-5" />
          Add your first task
        </Button>
      </motion.div>
    </DashboardLayout>
  );
};

export default Tasks;
