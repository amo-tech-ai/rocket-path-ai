/**
 * Lean Canvas Actions - Index
 * Re-exports all action handlers
 */

export { mapProfile, checkProfileSync } from "./mapping.ts";
export { prefillCanvas, suggestBox } from "./generation.ts";
export { validateCanvas } from "./validation.ts";
export { saveVersion, loadVersions, restoreVersion } from "./versions.ts";
export { canvasToPitch } from "./pitch.ts";
export { getBenchmarks } from "./benchmarks.ts";
export { suggestPivots } from "./pivots.ts";
export {
  extractAssumptions,
  suggestExperiment,
  getAssumptions,
  updateAssumptionStatus,
} from "./assumptions.ts";
export { coach } from "./coach.ts";
