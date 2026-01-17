import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Briefcase, 
  Users, 
  Video, 
  FolderOpen 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const actions = [
  { 
    icon: Sparkles, 
    label: 'New Deck', 
    path: '/documents',
    bgColor: 'bg-primary/10',
    iconColor: 'text-primary'
  },
  { 
    icon: Briefcase, 
    label: 'Investor Docs', 
    path: '/documents',
    bgColor: 'bg-muted',
    iconColor: 'text-muted-foreground'
  },
  { 
    icon: Users, 
    label: 'Find Capital', 
    path: '/investors',
    bgColor: 'bg-muted',
    iconColor: 'text-muted-foreground'
  },
  { 
    icon: Video, 
    label: 'Create Video', 
    path: '/projects',
    bgColor: 'bg-muted',
    iconColor: 'text-muted-foreground'
  },
  { 
    icon: FolderOpen, 
    label: 'Data Room', 
    path: '/documents',
    bgColor: 'bg-muted',
    iconColor: 'text-muted-foreground'
  },
];

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {actions.map((action, index) => (
        <motion.button
          key={action.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => navigate(action.path)}
          className="quick-action-card group"
        >
          <div className={`w-10 h-10 rounded-lg ${action.bgColor} flex items-center justify-center transition-colors group-hover:bg-primary/15`}>
            <action.icon className={`w-5 h-5 ${action.iconColor} group-hover:text-primary transition-colors`} />
          </div>
          <span className="text-sm font-medium text-foreground">{action.label}</span>
        </motion.button>
      ))}
    </div>
  );
}