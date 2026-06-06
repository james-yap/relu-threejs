import * as THREE from 'three';
import { Line2, LineGeometry, LineMaterial } from 'three/examples/jsm/Addons.js';

export type CircleConfig = {
  radius: number;
  percentage?: number;
  linewidth?: number;
  color?: THREE.ColorRepresentation;
  segments?: number;
};

/**
 * A Line2-backed circle/arc that reveals itself with geometry.instanceCount.
 *
 * The full circle geometry is created once. `percentage` controls how many
 * precomputed line segments are rendered, avoiding per-frame position rebuilds.
 *
 * `percentage` controls how much of the circle is drawn:
 * - 1 = full circle
 * - 0.5 = half circle
 * - 0 = no visible arc
 */
export class Circle extends Line2 {
  radius: number;
  percentage: number;
  linewidth: number;
  segments: number;

  private circleGeometry: LineGeometry;
  private circleMaterial: LineMaterial;

  constructor({
    radius,
    percentage = 1,
    linewidth = 1,
    color = 0xff0000,
    segments = 50,
  }: CircleConfig) {
    const geometry = Circle.createGeometry(radius, segments);
    geometry.instanceCount = Circle.percentageToInstanceCount(percentage, segments);
    const material = new LineMaterial({
      color,
      linewidth,
    });

    super(geometry, material);

    this.radius = radius;
    this.percentage = THREE.MathUtils.clamp(percentage, 0, 1);
    this.linewidth = linewidth;
    this.segments = segments;
    this.circleGeometry = geometry;
    this.circleMaterial = material;
  }

  setRadius(radius: number) {
    this.radius = radius;
    this.updateGeometry();
  }

  setPercentage(percentage: number) {
    this.percentage = THREE.MathUtils.clamp(percentage, 0, 1);
    this.updateInstanceCount();
  }

  setLinewidth(linewidth: number) {
    this.linewidth = linewidth;
    this.circleMaterial.linewidth = linewidth;
  }

  setColor(color: THREE.ColorRepresentation) {
    this.circleMaterial.color.set(color);
  }

  dispose() {
    this.circleGeometry.dispose();
    this.circleMaterial.dispose();
  }

  private updateGeometry() {
    const positions = Circle.createPositions(this.radius, this.segments);
    this.circleGeometry.setPositions(positions);
    this.circleGeometry.attributes.position.needsUpdate = true;
    this.updateInstanceCount();
  }

  private updateInstanceCount() {
    this.circleGeometry.instanceCount = Circle.percentageToInstanceCount(this.percentage, this.segments);
  }

  private static createGeometry(radius: number, segments: number) {
    const geometry = new LineGeometry();
    geometry.setPositions(Circle.createPositions(radius, segments));
    return geometry;
  }

  private static createPositions(radius: number, segments: number) {
    const curve = new THREE.EllipseCurve(
      0,
      0,
      radius,
      radius,
      0,
      2 * Math.PI,
    );
    const curvePoints = curve.getPoints(segments);
    return curvePoints.flatMap((point) => [point.x, point.y, 0]);
  }

  private static percentageToInstanceCount(percentage: number, segments: number) {
    const clampedPercentage = THREE.MathUtils.clamp(percentage, 0, 1);
    return Math.floor(segments * clampedPercentage);
  }
}

export function createCircle(radius: number, percentage = 1, linewidth = 1) {
  return new Circle({ radius, percentage, linewidth });
}
