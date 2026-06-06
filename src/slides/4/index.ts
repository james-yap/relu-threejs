import * as THREE from 'three';
import { createHtmlPlane } from '@/components/htmlPlane';
import { initSlide4Neuron } from '@/slides/4/neuron';
import type { SlideDeps } from '@/slides/types';
import { globalStepTracker } from '@/steps/stepTracker';

const group = new THREE.Group();
group.position.set(3.21, -3.40, 0.00)

const axesHelper = new THREE.AxesHelper(3);
group.add(axesHelper);


const x = [0.0, 0.3333333333333333, 0.6666666666666666, 1.0, 1.3333333333333333, 1.6666666666666665, 2.0, 2.333333333333333, 2.6666666666666665, 3.0];
const y = [2.2857495229031564, 1.5794627534632775, 0.766572832730836, 0.3161792171298822, -0.023003558062765564, 0.16630204907028737, 0.2613737287775476, 0.704116241050859, 1.419514591906635, 2.215099751141758];

const scatterPoints = x.map((xVal, i) => {
  const yVal = y[i];

  const point = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xff4d6d })
  );

  point.position.set(xVal, yVal, 0)

  return point
})
group.add(...scatterPoints)


const curvePoints: THREE.Vector3[] = [];
for (let i = 0; i <= 3; i += 0.1) {
  const X = new THREE.Vector3(Math.pow(i, 2), i, 1);
  const w = new THREE.Vector3(0.98, -2.90, 2.14);
  const y = X.dot(w);

  curvePoints.push(new THREE.Vector3(i, y, 0));
}
const curvePath = new THREE.CatmullRomCurve3(curvePoints);
const curveGeom = new THREE.TubeGeometry(
  curvePath,
  100, // tubular segments
  0.05, // thickness / radius
  3, // radial segments
  false
);
const curveMat = new THREE.MeshBasicMaterial({
  color: 0x58C4DD,
  transparent: true
});
const curve = new THREE.Mesh(curveGeom, curveMat);
group.add(curve)

export function initSlide4(deps: SlideDeps) {
  const { scene, interactions } = deps;

  const tempLabel = createHtmlPlane({
    html: 'Temperature',
    className: 'blue-text',
    width: 2,
    height: 0.5,
    interactions
  });
  scene.add(tempLabel)
  tempLabel.position.set(4.73, -3.80, 0.00);

  const energyLabel = createHtmlPlane({
    html: 'Energy Use',
    className: 'blue-text',
    width: 2.5,
    height: 0.5,
    interactions
  });
  scene.add(energyLabel)
  energyLabel.position.set(2.82, -2.06, 0.00);
  energyLabel.rotateZ(Math.PI / 2);

  initSlide4Neuron(deps)
  scene.add(group)
}

globalStepTracker.registerUpdator(5, p => {
  curveMat.opacity = p
})
