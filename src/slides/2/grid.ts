import * as THREE from 'three';
import { Line2 } from 'three/addons/lines/Line2.js';
import { globalStepTracker } from '../../steps/stepTracker';
import { createNumberPlane } from '@/components/grid';
import { LineGeometry, LineMaterial } from 'three/examples/jsm/Addons.js';

export const slide2Group = new THREE.Group();

const pos: [number, number, number] = [3.21, 1.00, 0.00]

const plane = createNumberPlane({
  xRange: [0, 3, 1],
  yRange: [0, 3, 1],
  xLength: 3,
  yLength: 3,
  showZAxis: false,
});
slide2Group.add(plane)

const x = [0.0, 0.3333333333333333, 0.6666666666666666, 1.0, 1.3333333333333333, 1.6666666666666665, 2.0, 2.333333333333333, 2.6666666666666665, 3.0];
const y = [-0.002920395778944087, 0.20693794606456695, 0.8089330831743278, 1.1141554662900175, 1.2048354679621593, 1.3710745979199308, 2.2523983441409503, 2.4247953839948044, 2.9621562641446135, 2.366112204421725];

const scatterPoints = x.map((xVal, i) => {
  const yVal = y[i];

  const point = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xff4d6d })
  );

  point.position.copy(plane.coordsToPoint(xVal, yVal))

  return point
})

slide2Group.add(...scatterPoints)
slide2Group.position.set(...pos)

const lineGeom = new LineGeometry();
const initialLineStart = plane.coordsToPoint(0, 0);
const initialLineEnd = plane.coordsToPoint(3, 3);
lineGeom.setPositions([
  initialLineStart.x, initialLineStart.y, initialLineStart.z,
  initialLineEnd.x, initialLineEnd.y, initialLineEnd.z
])

const lineMat = new LineMaterial({
  color: 0x58C4DD,
  linewidth: 0.05, // Thickness
  worldUnits: true // Ensures thickness scales correctly in 3D space
});

const line = new Line2(lineGeom, lineMat);
slide2Group.add(line)

export function updateSlide2Line(w: number, b: number) {
  const yFunc = (x: number) => w * x + b;
  const start = plane.coordsToPoint(0, yFunc(0));
  const end = plane.coordsToPoint(3, yFunc(3));
  line.geometry.setPositions([
    start.x, start.y, start.z,
    end.x, end.y, end.z
  ])
  line.geometry.attributes.position.needsUpdate = true;
}


globalStepTracker.registerUpdator(2, (p) => {
  const start = plane.coordsToPoint(0, 0);
  const end = plane.coordsToPoint(3 * p, 3 * p);
  line.geometry.setPositions([
    start.x, start.y, start.z,
    end.x, end.y, end.z
  ])
  line.geometry.attributes.position.needsUpdate = true;
})
