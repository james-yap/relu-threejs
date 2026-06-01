import * as THREE from 'three';

import { globalStepTracker } from '../../steps/stepTracker';
import { createHtmlPlane } from '../../utils';

export const slide3Group = new THREE.Group();

const createCurveGeometry = (percentage: number) => {
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


const neuronText = createHtmlPlane({
  html: String.raw`$$ \sum + b $$`,
  id: 'slide3NeuronText',
  className: 'blue-text',
  width: 8,
  height: 1.5,
});


globalStepTracker.registerUpdator(4, (p) => {
  curve.geometry.dispose();
  if (p <= 0.1) curve.geometry = new THREE.BufferGeometry()
  else curve.geometry = createCurveGeometry(p);

  // neuronText.material.transparent = true;
  neuronText.material.opacity = p;
})

slide3Group.position.set(12.05, 2.25, 0.00);
slide3Group.add(curve)
slide3Group.add(neuronText)
