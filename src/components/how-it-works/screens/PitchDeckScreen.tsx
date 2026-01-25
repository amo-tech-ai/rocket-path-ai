import { motion } from "framer-motion";
import { Check, Info, Plus } from "lucide-react";

interface PitchDeckScreenProps {
  uiState: string | null;
  isCompleted?: boolean;
}

const slides = [
  { num: 1, name: 'Problem' },
  { num: 2, name: 'Solution' },
  { num: 3, name: 'Market', active: true },
  { num: 4, name: 'Product' },
  { num: 5, name: 'Traction' },
  { num: 6, name: 'Team' },
  { num: 7, name: 'Ask' },
];

const PitchDeckScreen = ({ uiState, isCompleted = false }: PitchDeckScreenProps) => {
  const isGenerating = uiState === 'generating' || uiState === 'generate-deck';
  const slidesPopulated = uiState === 'slides-populated' || uiState === 'hover-export' || isCompleted;
  const isExportHovered = uiState === 'hover-export';

  return (
    <div className="space-y-4">
      {/* Header with Badge */}
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl font-medium text-foreground">
          Pitch Deck Editor
        </h3>
        <motion.div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage text-sage-foreground text-xs font-medium"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: slidesPopulated ? 1 : 0, scale: slidesPopulated ? 1 : 0.8 }}
        >
          <Check className="w-3 h-3" />
          Generated from Profile
        </motion.div>
      </div>

      {/* Main Layout - Sidebar + Canvas */}
      <div className="flex gap-4 min-h-[280px]">
        {/* Slide Sidebar */}
        <div className="w-24 shrink-0 space-y-2">
          <p className="text-xs font-medium text-muted-foreground px-1">Slides</p>
          
          {slides.map((slide, index) => (
            <motion.div
              key={slide.num}
              className={`px-2 py-1.5 rounded-md text-xs transition-all duration-200 ${
                slide.active 
                  ? 'bg-sage/10 border border-sage/30 text-sage font-medium' 
                  : 'text-muted-foreground hover:bg-secondary/50'
              }`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ 
                opacity: slidesPopulated || isCompleted ? 1 : (index === 0 ? 1 : 0.3),
                x: 0 
              }}
              transition={{ delay: slidesPopulated ? index * 0.1 : 0 }}
            >
              {slide.num}. {slide.name}
            </motion.div>
          ))}
          
          <button className="w-full px-2 py-1.5 rounded-md text-xs text-muted-foreground hover:bg-secondary/50 flex items-center gap-1">
            <Plus className="w-3 h-3" />
            Add
          </button>
        </div>

        {/* Canvas - Market Slide */}
        <div className="flex-1 p-4 rounded-xl border border-border bg-card">
          <h4 className="font-display text-lg font-medium text-foreground mb-4">
            Market Opportunity
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">TAM:</span>
              <span className="font-display text-lg font-medium text-foreground">$47B</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">SAM:</span>
              <span className="font-display text-lg font-medium text-foreground">$8.2B</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">SOM:</span>
              <span className="font-display text-lg font-medium text-foreground">$420M</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Sources:</p>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Info className="w-3 h-3" />
                Gartner 2025
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Info className="w-3 h-3" />
                IDC Research
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <motion.button
          className="px-4 py-2 rounded-lg bg-sage text-sage-foreground text-sm font-medium"
          animate={{
            scale: isGenerating ? 0.95 : 1,
          }}
          transition={{ duration: 0.1 }}
        >
          {isGenerating ? 'Generating...' : 'Generate Deck'}
        </motion.button>
        
        <motion.button
          className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors"
          animate={{
            borderColor: isExportHovered ? 'hsl(var(--sage))' : undefined,
            backgroundColor: isExportHovered ? 'hsl(var(--sage) / 0.05)' : undefined,
          }}
        >
          Export PDF
        </motion.button>
        
        <button className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors">
          Share →
        </button>
      </div>
    </div>
  );
};

export default PitchDeckScreen;
