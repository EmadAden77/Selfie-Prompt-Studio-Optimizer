import type { SceneScope } from '../types/studio';

export const DEFAULT_SCENE_SCOPE: SceneScope = 'auto';

export function normalizeSceneScope(value: unknown): SceneScope {
  return value === 'inside' || value === 'outside' ? value : DEFAULT_SCENE_SCOPE;
}

export function sceneScopeLabel(scope: SceneScope): string {
  if (scope === 'inside') return 'داخل السيارة';
  if (scope === 'outside') return 'خارج السيارة';
  return 'تلقائي بواسطة Gemini';
}

export function sceneScopeInstruction(scope: SceneScope): string {
  if (scope === 'inside') {
    return 'Hard constraint: the entire capture is inside the vehicle cabin. Keep the subject seated inside the car, with cabin geometry and interior light physically visible or implied; do not place the subject standing outside, leaning on the hood, or posing beside the vehicle.';
  }
  if (scope === 'outside') {
    return 'Hard constraint: the entire capture is outside the vehicle. The vehicle must be safely parked, and the subject must stand, walk slowly, lean, sit on a real safe surface, or make another physically plausible movement beside the vehicle; do not place the subject in the driver seat or inside the cabin.';
  }
  return 'Scene placement preference: choose automatically between an inside-cabin or outside-the-parked-vehicle selfie according to the selected car, lighting, clothing, and physical scene coherence. Do not override any explicit user selection.';
}
