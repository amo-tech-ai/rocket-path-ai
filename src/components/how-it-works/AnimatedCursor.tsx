import { motion } from "framer-motion";

interface AnimatedCursorProps {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  isVisible: boolean;
}

const AnimatedCursor = ({ x, y, scale, opacity, isVisible }: AnimatedCursorProps) => {
  if (!isVisible) return null;

  return (
    <motion.div
      className="absolute pointer-events-none hidden lg:block"
      style={{
        left: 0,
        top: 0,
        zIndex: 9999,
        willChange: 'transform, opacity',
      }}
      animate={{
        x,
        y,
        scale,
        opacity,
      }}
      transition={{
        x: { duration: 0 },
        y: { duration: 0 },
        scale: { duration: 0.1 },
        opacity: { duration: 0.3 },
      }}
    >
      {/* SVG Arrow Cursor */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="drop-shadow-md"
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
        }}
      >
        <path
          d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z"
          fill="#111111"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Click ripple effect */}
      {scale < 1 && (
        <motion.div
          className="absolute -inset-2 rounded-full"
          initial={{ scale: 0.5, opacity: 0.4 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            backgroundColor: 'hsl(var(--sage) / 0.2)',
          }}
        />
      )}
    </motion.div>
  );
};

export default AnimatedCursor;
