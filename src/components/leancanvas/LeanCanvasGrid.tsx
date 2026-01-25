import { CanvasBox } from './CanvasBox';
import { LeanCanvasData, CANVAS_BOX_CONFIG } from '@/hooks/useLeanCanvas';
import { motion } from 'framer-motion';

interface LeanCanvasGridProps {
  data: LeanCanvasData;
  onUpdate: (key: keyof LeanCanvasData, items: string[]) => void;
  startupId?: string;
}

export function LeanCanvasGrid({ data, onUpdate, startupId }: LeanCanvasGridProps) {
  return (
    <div className="space-y-4">
      {/* Top Row: 5 columns */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4"
      >
        {CANVAS_BOX_CONFIG.filter(box => box.row === 1).map((box, index) => (
          <motion.div
            key={box.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <CanvasBox
              title={box.title}
              boxKey={box.key}
              description={box.description}
              placeholder={box.placeholder}
              items={data[box.key]?.items || []}
              validation={data[box.key]?.validation}
              validationMessage={data[box.key]?.validationMessage}
              onUpdate={(items) => onUpdate(box.key, items)}
              startupId={startupId}
              canvasData={data}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Middle Row: 2 columns (under Problem and Solution) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
      >
        {CANVAS_BOX_CONFIG.filter(box => box.row === 2).map((box, index) => (
          <motion.div
            key={box.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.05 }}
            className={box.col === 1 ? 'lg:col-span-1' : 'lg:col-span-1 lg:col-start-2'}
          >
            <CanvasBox
              title={box.title}
              boxKey={box.key}
              description={box.description}
              placeholder={box.placeholder}
              items={data[box.key]?.items || []}
              validation={data[box.key]?.validation}
              validationMessage={data[box.key]?.validationMessage}
              onUpdate={(items) => onUpdate(box.key, items)}
              startupId={startupId}
              canvasData={data}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom Row: 2 wide columns */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {CANVAS_BOX_CONFIG.filter(box => box.row === 3).map((box, index) => (
          <motion.div
            key={box.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 + index * 0.05 }}
          >
            <CanvasBox
              title={box.title}
              boxKey={box.key}
              description={box.description}
              placeholder={box.placeholder}
              items={data[box.key]?.items || []}
              validation={data[box.key]?.validation}
              validationMessage={data[box.key]?.validationMessage}
              onUpdate={(items) => onUpdate(box.key, items)}
              startupId={startupId}
              canvasData={data}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
