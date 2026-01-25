import { motion, AnimatePresence } from "framer-motion";
import AnimatedCursor from "./AnimatedCursor";
import ProfileScreen from "./screens/ProfileScreen";
import AnalysisScreen from "./screens/AnalysisScreen";
import PitchDeckScreen from "./screens/PitchDeckScreen";
import ExecutionScreen from "./screens/ExecutionScreen";
import type { CursorState } from "./useCursorAnimation";

interface AppWindowProps {
  activeStep: number;
  cursorState: CursorState;
  uiState: string | null;
  isMobile?: boolean;
}

const AppWindow = ({ activeStep, cursorState, uiState, isMobile = false }: AppWindowProps) => {
  const renderScreen = () => {
    // On mobile, show completed states
    const isCompleted = isMobile;
    
    switch (activeStep) {
      case 1:
        return <ProfileScreen uiState={uiState} isCompleted={isCompleted} />;
      case 2:
        return <AnalysisScreen uiState={uiState} isCompleted={isCompleted} />;
      case 3:
        return <PitchDeckScreen uiState={uiState} isCompleted={isCompleted} />;
      case 4:
        return <ExecutionScreen uiState={uiState} isCompleted={isCompleted} />;
      default:
        return <ProfileScreen uiState={uiState} isCompleted={isCompleted} />;
    }
  };

  return (
    <div className="relative bg-card rounded-2xl border border-border shadow-lg overflow-hidden">
      {/* Window Header - macOS style */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-destructive/60" />
          <div className="w-3 h-3 rounded-full bg-accent" />
          <div className="w-3 h-3 rounded-full bg-sage/70" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-sm font-medium text-muted-foreground">StartupAI</span>
        </div>
        <div className="w-12" /> {/* Spacer for symmetry */}
      </div>

      {/* Content Area with Screen Transitions */}
      <div className="relative min-h-[400px] lg:min-h-[450px] p-6 lg:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>

        {/* Animated Cursor - Desktop only */}
        {!isMobile && (
          <AnimatedCursor
            x={cursorState.x}
            y={cursorState.y}
            scale={cursorState.scale}
            opacity={cursorState.opacity}
            isVisible={cursorState.isVisible}
          />
        )}
      </div>
    </div>
  );
};

export default AppWindow;
