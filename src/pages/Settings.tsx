import DashboardLayout from "@/components/layout/DashboardLayout";
import { Settings as SettingsIcon } from "lucide-react";
import { motion } from "framer-motion";

const Settings = () => {
  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto text-center py-20"
      >
        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-6">
          <SettingsIcon className="w-8 h-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-semibold mb-2">Settings</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Configure your workspace, manage team members, and customize your 
          StartupAI experience.
        </p>
      </motion.div>
    </DashboardLayout>
  );
};

export default Settings;
