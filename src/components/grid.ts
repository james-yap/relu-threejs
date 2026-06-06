import * as THREE from 'three';
import { LineMaterial, LineSegments2, LineSegmentsGeometry } from 'three/examples/jsm/Addons.js';
import {
  isMultipleOfStep,
  isWithin,
  isZero,
  normalizeRange,
  rangeValues,
  type NumericRange,
} from '@/utils';

export type NumberPlaneConfig = {
  /** Horizontal coordinate range, in graph units. */
  xRange: NumericRange;
  /** Vertical coordinate range, in graph units. */
  yRange: NumericRange;
  /** Rendered width of the whole xRange, in Three.js world units. */
  xLength: number;
  /** Rendered height of the whole yRange, in Three.js world units. */
  yLength: number;
  /** Optional blue z-axis through the origin. Useful when presenting 3D feature spaces. */
  showZAxis?: boolean;
};

// Hardcoded visual style. Keep this small API surface similar to Manim's common NumberPlane use.
const AXIS_WIDTH = 0.035;
const GRID_WIDTH = 0.012;
const FADED_GRID_WIDTH = 0.006;
const FADED_LINE_RATIO = 1;

const X_AXIS_COLOR = 0xff5555;
const Y_AXIS_COLOR = 0x7fff00;
const Z_AXIS_COLOR = 0x3a86ff;
const GRID_COLOR = 0x236B8E;
const FADED_GRID_COLOR = 0x173f52;

/**
 * Manim-inspired 2D number plane for slide diagrams.
 *
 * The plane is a normal THREE.Group, centered on the mathematical origin:
 * coordinate (0, 0) maps to local position (0, 0, 0). Use `coordsToPoint`
 * when placing plotted objects so graph-space data is separated from scene scale.
 */
export class NumberPlane extends THREE.Group {
  xRange: NumericRange;
  yRange: NumericRange;
  xLength: number;
  yLength: number;

  xUnit: number;
  yUnit: number;
  zUnit: number;

  zAxis: LineSegments2;

  constructor({
    xRange,
    yRange,
    xLength,
    yLength,
    showZAxis = false,
  }: NumberPlaneConfig) {
    super();

    const [xMin, xMax, xStep] = normalizeRange(xRange, 'xRange');
    const [yMin, yMax, yStep] = normalizeRange(yRange, 'yRange');

    if (xLength <= 0 || yLength <= 0) {
      throw new Error('NumberPlane lengths must be positive');
    }

    this.name = 'NumberPlane';
    this.xRange = [xMin, xMax, xStep];
    this.yRange = [yMin, yMax, yStep];
    this.xLength = xLength;
    this.yLength = yLength;

    // Units convert graph-space values into local Three.js units.
    // Example: xRange [-3, 3] with xLength 6 means 1 graph x-unit = 1 world unit.
    this.xUnit = xLength / (xMax - xMin);
    this.yUnit = yLength / (yMax - yMin);
    // Z uses the y scale by default so vertical and depth distances feel consistent.
    this.zUnit = this.yUnit;

    this.addGridLines(xMin, xMax, xStep, yMin, yMax, yStep);
    this.addAxes(xMin, xMax, yMin, yMax);

    this.zAxis = this.createZAxis(yMin, yMax);
    this.zAxis.visible = showZAxis;
    this.add(this.zAxis);
  }

  /** Convert graph coordinates into local Three.js coordinates. */
  coordsToPoint(x: number, y: number, z = 0) {
    return new THREE.Vector3(
      this.xToPoint(x),
      this.yToPoint(y),
      this.zToPoint(z),
    );
  }

  /** Convert local Three.js coordinates back into graph coordinates. */
  pointToCoords(point: THREE.Vector3) {
    return new THREE.Vector3(
      point.x / this.xUnit,
      point.y / this.yUnit,
      point.z / this.zUnit,
    );
  }

  /** Toggle the optional z-axis without rebuilding the plane. */
  setZAxisVisible(visible: boolean) {
    this.zAxis.visible = visible;
  }

  xToPoint(x: number) {
    return x * this.xUnit;
  }

  yToPoint(y: number) {
    return y * this.yUnit;
  }

  zToPoint(z: number) {
    return z * this.zUnit;
  }

  addGridLines(xMin: number, xMax: number, xStep: number, yMin: number, yMax: number, yStep: number) {
    // Faded lines sit halfway between major lines, like Manim's NumberPlane subdivisions.
    const fadedLines = createGridLines({
      xMin,
      xMax,
      yMin,
      yMax,
      xStep: xStep / (FADED_LINE_RATIO + 1),
      yStep: yStep / (FADED_LINE_RATIO + 1),
      xToPoint: (x) => this.xToPoint(x),
      yToPoint: (y) => this.yToPoint(y),
      skipXStep: xStep,
      skipYStep: yStep,
    });
    if (fadedLines.length > 0) {
      this.add(createLineSegments(fadedLines, FADED_GRID_COLOR, FADED_GRID_WIDTH, 0.55));
    }

    // Major grid lines use the exact xRange/yRange step values.
    const gridLines = createGridLines({
      xMin,
      xMax,
      yMin,
      yMax,
      xStep,
      yStep,
      xToPoint: (x) => this.xToPoint(x),
      yToPoint: (y) => this.yToPoint(y),
    });
    if (gridLines.length > 0) {
      this.add(createLineSegments(gridLines, GRID_COLOR, GRID_WIDTH, 0.85));
    }
  }

  addAxes(xMin: number, xMax: number, yMin: number, yMax: number) {
    // Only draw an axis when zero is inside the matching opposite range.
    if (isWithin(0, yMin, yMax)) {
      this.add(createLineSegments([
        this.xToPoint(xMin), 0, 0,
        this.xToPoint(xMax), 0, 0,
      ], X_AXIS_COLOR, AXIS_WIDTH, 1));
    }

    if (isWithin(0, xMin, xMax)) {
      this.add(createLineSegments([
        0, this.yToPoint(yMin), 0,
        0, this.yToPoint(yMax), 0,
      ], Y_AXIS_COLOR, AXIS_WIDTH, 1));
    }
  }

  createZAxis(yMin: number, yMax: number) {
    // The plane is primarily 2D; this optional axis can be shown for 3D explanations.
    return createLineSegments([
      0, 0, this.zToPoint(yMin),
      0, 0, this.zToPoint(yMax),
    ], Z_AXIS_COLOR, AXIS_WIDTH, 1);
  }
}

/**
 * Factory retained for existing slide code and for a concise functional call site.
 *
 * Example:
 * ```ts
 * const plane = createNumberPlane({
 *   xRange: [-3, 3, 1],
 *   yRange: [-1, 3, 1],
 *   xLength: 6,
 *   yLength: 4,
 * });
 * point.position.copy(plane.coordsToPoint(2, 1));
 * ```
 */
export function createNumberPlane(config: NumberPlaneConfig) {
  return new NumberPlane(config);
}

type GridLineConfig = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  xStep: number;
  yStep: number;
  xToPoint: (x: number) => number;
  yToPoint: (y: number) => number;
  skipXStep?: number;
  skipYStep?: number;
};

/**
 * Build raw LineSegments positions for vertical and horizontal grid lines.
 *
 * skipXStep/skipYStep are used by the faded grid so the faded pass does not draw
 * on top of major grid lines or axes.
 */
function createGridLines({
  xMin,
  xMax,
  yMin,
  yMax,
  xStep,
  yStep,
  xToPoint,
  yToPoint,
  skipXStep,
  skipYStep,
}: GridLineConfig) {
  const positions: number[] = [];

  for (const x of rangeValues(xMin, xMax, xStep)) {
    if (isZero(x) || isMultipleOfStep(x, skipXStep)) continue;

    positions.push(
      xToPoint(x), yToPoint(yMin), 0,
      xToPoint(x), yToPoint(yMax), 0,
    );
  }

  for (const y of rangeValues(yMin, yMax, yStep)) {
    if (isZero(y) || isMultipleOfStep(y, skipYStep)) continue;

    positions.push(
      xToPoint(xMin), yToPoint(y), 0,
      xToPoint(xMax), yToPoint(y), 0,
    );
  }

  return positions;
}

/**
 * Use LineSegments2/LineMaterial instead of THREE.LineSegments so line width works
 * reliably in world units across browsers and camera distances.
 */
function createLineSegments(
  positions: number[],
  color: THREE.ColorRepresentation,
  linewidth: number,
  opacity: number,
) {
  const geometry = new LineSegmentsGeometry();
  geometry.setPositions(positions);

  const material = new LineMaterial({
    color,
    linewidth,
    worldUnits: true,
    transparent: opacity < 1,
    opacity,
  });

  return new LineSegments2(geometry, material);
}
