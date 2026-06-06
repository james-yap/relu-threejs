import * as THREE from 'three';

export const EPSILON = 1e-10;

/**
 * Manim-style numeric range: [min, max, step].
 *
 * Example: [-3, 3, 1] represents -3, -2, ..., 3.
 */
export type NumericRange = readonly [min: number, max: number, step: number];

/** Normalize reversed ranges and validate the step before geometry/math code uses it. */
export function normalizeRange(range: NumericRange, name: string): NumericRange {
  const [start, end, step] = range;

  if (start === end) throw new Error(`${name} min and max must be different`);
  if (step === 0) throw new Error(`${name} step must be non-zero`);

  return [Math.min(start, end), Math.max(start, end), Math.abs(step)];
}

/**
 * Generate inclusive values from min to max using integer step indices.
 * This avoids accumulating floating-point drift from repeated `value += step` loops.
 */
export function rangeValues(min: number, max: number, step: number) {
  const values: number[] = [];
  const first = Math.ceil((min - EPSILON) / step);
  const last = Math.floor((max + EPSILON) / step);

  for (let i = first; i <= last; i++) {
    values.push(cleanFloat(i * step));
  }

  return values;
}

export function cleanFloat(value: number) {
  return isZero(value) ? 0 : Number(value.toFixed(12));
}

export function isZero(value: number) {
  return Math.abs(value) < EPSILON;
}

export function isWithin(value: number, min: number, max: number) {
  return value >= min - EPSILON && value <= max + EPSILON;
}

export function isMultipleOfStep(value: number, step?: number) {
  if (!step) return false;

  const quotient = value / step;
  return Math.abs(quotient - Math.round(quotient)) < EPSILON;
}

const geometry = new THREE.SphereGeometry(0.1, 32, 16);
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
export const debugSphere = new THREE.Mesh(geometry, material);

export function setGroupOpacity(group: THREE.Object3D, opacity: number) {
  group.traverse((child) => {
    // Use instanceof to narrow the type to Mesh
    if (child instanceof THREE.Mesh) {

      // Three.js materials can sometimes be an array (MultiMaterial)
      if (Array.isArray(child.material)) {
        child.material.forEach(mat => {
          mat.opacity = opacity;
          mat.transparent = true; // Required for opacity to show
        });
      } else {
        child.material.opacity = opacity;
        child.material.transparent = true; // Required for opacity to show
      }
    }
  });

}
