/**
 * Industry Card Component
 * Display card for a single industry pack
 */

import { motion } from 'framer-motion';
import { 
  Brain, 
  CreditCard, 
  Heart, 
  GraduationCap, 
  ShoppingCart, 
  Store, 
  Building2, 
  Users, 
  Leaf, 
  Home, 
  Truck, 
  Film,
  Shield,
  Calendar,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { IndustryPack } from '@/hooks/useIndustryPacks';

interface IndustryCardProps {
  pack: IndustryPack;
  isSelected: boolean;
  onClick: () => void;
}

// Map industry slugs to icons
const INDUSTRY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  ai_saas: Brain,
  fintech: CreditCard,
  healthcare: Heart,
  edtech: GraduationCap,
  education: GraduationCap,
  ecommerce: ShoppingCart,
  marketplace: Store,
  enterprise: Building2,
  consumer: Users,
  climate: Leaf,
  proptech: Home,
  logistics: Truck,
  media: Film,
  cybersecurity: Shield,
  events: Calendar,
  generic: Layers,
};

// Map industry slugs to gradient colors
const INDUSTRY_COLORS: Record<string, string> = {
  ai_saas: 'from-violet-500/20 to-purple-500/20 hover:from-violet-500/30 hover:to-purple-500/30',
  fintech: 'from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30',
  healthcare: 'from-rose-500/20 to-pink-500/20 hover:from-rose-500/30 hover:to-pink-500/30',
  education: 'from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30',
  ecommerce: 'from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30',
  marketplace: 'from-indigo-500/20 to-blue-500/20 hover:from-indigo-500/30 hover:to-blue-500/30',
  cybersecurity: 'from-red-500/20 to-orange-500/20 hover:from-red-500/30 hover:to-orange-500/30',
  events: 'from-fuchsia-500/20 to-pink-500/20 hover:from-fuchsia-500/30 hover:to-pink-500/30',
  generic: 'from-slate-500/20 to-gray-500/20 hover:from-slate-500/30 hover:to-gray-500/30',
};

export function IndustryCard({ pack, isSelected, onClick }: IndustryCardProps) {
  const Icon = INDUSTRY_ICONS[pack.industry] || Layers;
  const colorClass = INDUSTRY_COLORS[pack.industry] || INDUSTRY_COLORS.generic;

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'relative w-full p-4 rounded-xl border-2 transition-all duration-200 text-left',
        'bg-gradient-to-br',
        colorClass,
        isSelected
          ? 'border-primary ring-2 ring-primary/20'
          : 'border-transparent hover:border-border'
      )}
    >
      {/* Selected indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
        >
          <svg
            className="w-3 h-3 text-primary-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>
      )}

      {/* Icon */}
      <div className={cn(
        'w-10 h-10 rounded-lg flex items-center justify-center mb-3',
        isSelected ? 'bg-primary/20' : 'bg-background/50'
      )}>
        <Icon className={cn(
          'w-5 h-5',
          isSelected ? 'text-primary' : 'text-foreground'
        )} />
      </div>

      {/* Content */}
      <div className="space-y-1">
        <h4 className={cn(
          'font-medium text-sm',
          isSelected ? 'text-primary' : 'text-foreground'
        )}>
          {pack.display_name}
        </h4>
        {pack.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {pack.description}
          </p>
        )}
      </div>

      {/* Startup types count badge */}
      {pack.startup_types && pack.startup_types.length > 0 && (
        <div className="mt-3 flex items-center gap-1">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-background/50 text-muted-foreground">
            {pack.startup_types.length} startup types
          </span>
        </div>
      )}
    </motion.button>
  );
}
