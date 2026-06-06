import * as THREE from 'three';

export type GridHelperConfig = {
  xStart?: number;
  xEnd?: number;
  yStart?: number;
  yEnd?: number;
  xStep?: number;
  yStep?: number;
  gridColor?: THREE.ColorRepresentation;
  xAxisColor?: THREE.ColorRepresentation;
  yAxisColor?: THREE.ColorRepresentation;
};

const isZero = (value: number) => Math.abs(value) < 1e-10;

export const createGridHelper = ({
  xStart = -5,
  xEnd = 5,
  yStart = -5,
  yEnd = 5,
  xStep = 1,
  yStep = 1,
  gridColor = 0x444444,
  xAxisColor = 0xff5555,
  yAxisColor = 0x55ff55,
}: GridHelperConfig = {}) => {
  const xMin = Math.min(xStart, xEnd);
  const xMax = Math.max(xStart, xEnd);
  const yMin = Math.min(yStart, yEnd);
  const yMax = Math.max(yStart, yEnd);
  const normalizedXStep = Math.abs(xStep);
  const normalizedYStep = Math.abs(yStep);
  const points: THREE.Vector3[] = [];
  const group = new THREE.Group();

  if (normalizedXStep === 0 || normalizedYStep === 0) {
    throw new Error('Grid steps must be non-zero');
  }

  for (let x = xMin; x <= xMax; x += normalizedXStep) {
    if (isZero(x)) continue;

    points.push(new THREE.Vector3(x, yMin, 0));
    points.push(new THREE.Vector3(x, yMax, 0));
  }

  for (let y = yMin; y <= yMax; y += normalizedYStep) {
    if (isZero(y)) continue;

    points.push(new THREE.Vector3(xMin, y, 0));
    points.push(new THREE.Vector3(xMax, y, 0));
  }

  const gridGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const gridMaterial = new THREE.LineBasicMaterial({ color: gridColor });
  group.add(new THREE.LineSegments(gridGeometry, gridMaterial));

  const xAxisGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(xMin, 0, 0),
    new THREE.Vector3(xMax, 0, 0),
  ]);
  const xAxisMaterial = new THREE.LineBasicMaterial({ color: xAxisColor });
  group.add(new THREE.LineSegments(xAxisGeometry, xAxisMaterial));

  const yAxisGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, yMin, 0),
    new THREE.Vector3(0, yMax, 0),
  ]);
  const yAxisMaterial = new THREE.LineBasicMaterial({ color: yAxisColor });
  group.add(new THREE.LineSegments(yAxisGeometry, yAxisMaterial));

  return group;
};
