// Cursor animation sequences for each screen
// Coordinates are relative to AppWindow content area

export interface Point {
  x: number;
  y: number;
}

export interface AnimationPhase {
  target: Point;
  action: 'move' | 'click' | 'hover' | 'drag' | 'idle';
  duration: number;
  uiState?: string;
}

// Bezier curve path generation for natural movement
export function generateCurvedPath(start: Point, end: Point, steps = 20): Point[] {
  const points: Point[] = [];
  
  // Calculate perpendicular control points (20% offset)
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const offset = distance * 0.2;
  
  // Perpendicular offset for natural curve
  const perpX = -dy / distance * offset;
  const perpY = dx / distance * offset;
  
  // Control points
  const cp1 = { x: start.x + dx * 0.25 + perpX, y: start.y + dy * 0.25 + perpY };
  const cp2 = { x: start.x + dx * 0.75 + perpX, y: start.y + dy * 0.75 + perpY };
  
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const t2 = t * t;
    const t3 = t2 * t;
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    
    points.push({
      x: mt3 * start.x + 3 * mt2 * t * cp1.x + 3 * mt * t2 * cp2.x + t3 * end.x,
      y: mt3 * start.y + 3 * mt2 * t * cp1.y + 3 * mt * t2 * cp2.y + t3 * end.y
    });
  }
  
  return points;
}

// Easing function for smooth movement
export const easeInOutCubic = (t: number): number => 
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// Screen 1: Profile Screen sequence (~2.5s)
export const profileSequence: AnimationPhase[] = [
  { target: { x: 200, y: 130 }, action: 'move', duration: 800 },
  { target: { x: 200, y: 130 }, action: 'click', duration: 200, uiState: 'focus-url' },
  { target: { x: 200, y: 130 }, action: 'idle', duration: 400, uiState: 'typing' },
  { target: { x: 420, y: 200 }, action: 'move', duration: 600, uiState: 'show-autofill' },
  { target: { x: 420, y: 200 }, action: 'hover', duration: 300, uiState: 'show-autofill' },
  { target: { x: 420, y: 350 }, action: 'move', duration: 600, uiState: 'show-autofill' },
  { target: { x: 420, y: 350 }, action: 'click', duration: 200, uiState: 'click-continue' },
];

// Screen 2: Analysis Screen (skipped - null sequence for transition)
export const analysisSequence: AnimationPhase[] = [];

// Screen 3: Pitch Deck Screen sequence (~2s)
export const pitchDeckSequence: AnimationPhase[] = [
  { target: { x: 90, y: 350 }, action: 'move', duration: 800 },
  { target: { x: 90, y: 350 }, action: 'click', duration: 200, uiState: 'generate-deck' },
  { target: { x: 90, y: 350 }, action: 'idle', duration: 300, uiState: 'generating' },
  { target: { x: 70, y: 140 }, action: 'move', duration: 600, uiState: 'slides-populated' },
  { target: { x: 240, y: 350 }, action: 'move', duration: 500, uiState: 'slides-populated' },
  { target: { x: 240, y: 350 }, action: 'hover', duration: 300, uiState: 'hover-export' },
];

// Screen 4: Execution Screen sequence (~2.5s)
export const executionSequence: AnimationPhase[] = [
  { target: { x: 210, y: 150 }, action: 'move', duration: 800 },
  { target: { x: 210, y: 150 }, action: 'hover', duration: 200, uiState: 'hover-card' },
  { target: { x: 210, y: 150 }, action: 'click', duration: 200, uiState: 'drag-start' },
  { target: { x: 370, y: 150 }, action: 'drag', duration: 1000, uiState: 'dragging' },
  { target: { x: 370, y: 150 }, action: 'idle', duration: 200, uiState: 'drag-end' },
  { target: { x: 300, y: 320 }, action: 'move', duration: 600, uiState: 'card-moved' },
  { target: { x: 300, y: 320 }, action: 'click', duration: 200, uiState: 'click-action' },
];

export const sequences = {
  1: profileSequence,
  2: analysisSequence,
  3: pitchDeckSequence,
  4: executionSequence,
};
