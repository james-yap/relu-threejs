import * as THREE from 'three';

import { globalStepTracker } from '../../steps/stepTracker';

export const slide3Group = new THREE.Group();

const createCurveGeometry = (percentage: number) => {
  if (percentage <= 0) return new THREE.BufferGeometry();

  const radians = 2.2 * Math.PI * percentage;
  const curvePoints: THREE.Vector3[] = [];

  for (let theta = 0; theta <= radians; theta += 0.1) {
    curvePoints.push(new THREE.Vector3(Math.cos(theta), Math.sin(theta), 0));
  }

  const curvePath = new THREE.CatmullRomCurve3(curvePoints);
  return new THREE.TubeGeometry(
    curvePath,
    100, // tubular segments
    0.02, // thickness / radius
    8, // radial segments
    false
  );
};


const curveMaterial = new THREE.MeshBasicMaterial({ color: 0x58C4DD });
const curve = new THREE.Mesh(new THREE.BufferGeometry(), curveMaterial);

globalStepTracker.registerUpdator(4, (p) => {
  curve.geometry.dispose();
  curve.geometry = createCurveGeometry(p);
})

slide3Group.position.set(12.05, 2.25, 0.00);
slide3Group.add(curve)
