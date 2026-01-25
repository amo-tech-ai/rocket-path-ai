import { motion } from "framer-motion";
import { Check, Circle, Plus } from "lucide-react";

interface ExecutionScreenProps {
  uiState: string | null;
  isCompleted?: boolean;
}

const investors = {
  interested: [{ name: 'Sarah K.', firm: 'Accel', amount: '$2M', probability: 68 }],
  meeting: [{ name: 'Mark T.', firm: 'a16z', amount: '$5M', probability: 82 }],
  active: [{ name: 'Lisa C.', firm: 'Sequoia', amount: '$3M', probability: 91 }],
  closed: [],
};

const ExecutionScreen = ({ uiState, isCompleted = false }: ExecutionScreenProps) => {
  const isCardHovered = uiState === 'hover-card';
  const isDragging = uiState === 'drag-start' || uiState === 'dragging';
  const cardMoved = uiState === 'drag-end' || uiState === 'card-moved' || uiState === 'click-action' || isCompleted;
  const actionClicked = uiState === 'click-action';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl font-medium text-foreground">
          Investor Pipeline
        </h3>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-secondary/50 transition-colors">
          <Plus className="w-3 h-3" />
          Add Investor
        </button>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-4 gap-2">
        {(['interested', 'meeting', 'active', 'closed'] as const).map((column) => {
          const columnLabel = column.charAt(0).toUpperCase() + column.slice(1);
          const isActiveColumn = column === 'active';
          const showHighlight = isDragging && isActiveColumn;
          
          return (
            <motion.div
              key={column}
              className={`rounded-lg border p-2 min-h-[180px] transition-colors duration-200 ${
                showHighlight 
                  ? 'border-sage bg-sage/5' 
                  : 'border-border bg-secondary/20'
              }`}
            >
              <p className="text-xs font-medium text-muted-foreground mb-2 px-1">
                {columnLabel}
              </p>
              
              {/* Cards */}
              <div className="space-y-2">
                {column === 'meeting' && !cardMoved && (
                  <motion.div
                    className={`p-2 rounded-lg border bg-card transition-all duration-200 ${
                      isDragging 
                        ? 'border-sage shadow-lg scale-105' 
                        : isCardHovered 
                          ? 'border-sage/50 shadow-md' 
                          : 'border-border'
                    }`}
                    animate={{
                      x: isDragging ? 80 : 0,
                      opacity: isDragging ? 0.8 : 1,
                    }}
                  >
                    <p className="text-sm font-medium text-foreground">Mark T.</p>
                    <p className="text-xs text-muted-foreground">a16z</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">$5M</span>
                      <span className="text-xs font-medium text-sage">82%</span>
                    </div>
                  </motion.div>
                )}
                
                {column === 'active' && cardMoved && (
                  <motion.div
                    className="p-2 rounded-lg border border-sage/30 bg-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-sm font-medium text-foreground">Mark T.</p>
                    <p className="text-xs text-muted-foreground">a16z</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">$5M</span>
                      <span className="text-xs font-medium text-sage">82%</span>
                    </div>
                  </motion.div>
                )}
                
                {investors[column].map((investor) => (
                  <div
                    key={investor.name}
                    className="p-2 rounded-lg border border-border bg-card"
                  >
                    <p className="text-sm font-medium text-foreground">{investor.name}</p>
                    <p className="text-xs text-muted-foreground">{investor.firm}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">{investor.amount}</span>
                      <span className={`text-xs font-medium ${
                        investor.probability >= 80 ? 'text-sage' : 'text-muted-foreground'
                      }`}>
                        {investor.probability}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* AI Suggested Actions */}
      <motion.div
        className="p-3 rounded-xl border border-border bg-secondary/30"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-xs font-medium text-muted-foreground mb-3">AI Suggested Actions</p>
        
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-sage shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-foreground">Follow up with Sarah K.</p>
              <p className="text-xs text-muted-foreground">Last contact: 4 days ago</p>
            </div>
          </div>
          
          <motion.div
            className={`flex items-start gap-2 p-2 -mx-2 rounded-lg transition-colors duration-200 ${
              actionClicked ? 'bg-sage/10' : ''
            }`}
          >
            <Circle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-foreground">Schedule check-in with Mark T.</p>
              <p className="text-xs text-muted-foreground">Meeting was 2 weeks ago</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ExecutionScreen;
