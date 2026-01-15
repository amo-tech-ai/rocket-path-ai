import DashboardLayout from "@/components/layout/DashboardLayout";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Documents = () => {
  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto text-center py-20"
      >
        <div className="w-16 h-16 rounded-2xl bg-sage-light flex items-center justify-center mx-auto mb-6">
          <FileText className="w-8 h-8 text-sage" />
        </div>
        <h1 className="text-2xl font-semibold mb-2">Documents & Decks</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Create, store, and collaborate on pitch decks, memos, and strategic 
          documents—all in one place.
        </p>
        <Button variant="hero" size="lg">
          <Plus className="w-5 h-5" />
          Create your first document
        </Button>
      </motion.div>
    </DashboardLayout>
  );
};

export default Documents;
