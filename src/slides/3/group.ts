import * as THREE from 'three';

import { globalStepTracker } from '../../steps/stepTracker';
import { createHtmlPlane } from '../../utils';

export const slide3Group = new THREE.Group();

const createCurveGeometry = (percentage: number = 100) => {
  const radians = 2.1 * Math.PI * percentage;
  const curvePoints: THREE.Vector3[] = [];
  const phaseOffset = Math.PI - 0.1;
  const radius = 0.8;

  for (let theta = phaseOffset; theta <= radians + phaseOffset; theta += 0.1) {
    curvePoints.push(new THREE.Vector3(radius * Math.cos(theta), radius * Math.sin(theta), 0));
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
const curveMaterial = new THREE.MeshBasicMaterial({
  color: 0x58C4DD,
  transparent: true
});
const curve = new THREE.Mesh(createCurveGeometry(), curveMaterial);

export const slide3NeuronText = createHtmlPlane({
  html: String.raw`$$ \sum + b $$`,
  id: 'slide3NeuronText',
  className: 'blue-text',
  width: 8,
  height: 1.5,
});

const x1Text = createHtmlPlane({
  html: String.raw`$$ x_i $$`,
  id: 'x1TextSlide3',
  className: 'blue-text',
  width: 8,
  height: 1.5,
});
x1Text.position.x -= 2;
const x1BridgeMaterial = new THREE.MeshBasicMaterial({ color: 0x236B8E })
const x1Bridge = new THREE.Mesh(new THREE.BufferGeometry(), x1BridgeMaterial);

const yText = createHtmlPlane({
  html: String.raw`$$ y_i $$`,
  id: 'yTextSlide3',
  className: 'blue-text',
  width: 8,
  height: 1.5,
});
yText.position.x += 2;
const yBridgeMaterial = new THREE.MeshBasicMaterial({ color: 0x236B8E })
const yBridge = new THREE.Mesh(new THREE.BufferGeometry(), yBridgeMaterial);

const createBridgeGeometry = (src: THREE.Object3D, target: THREE.Object3D, percentage: number) => {
  const raycaster = new THREE.Raycaster();
  const a = src.getWorldPosition(new THREE.Vector3());
  const b = target.getWorldPosition(new THREE.Vector3());
  const dir = new THREE.Vector3().subVectors(b, a).normalize();
  raycaster.set(a, dir);
  const hits = raycaster.intersectObject(curve);

  if (hits.length < 1) return new THREE.BufferGeometry();

  const points: THREE.Vector3[] = [
    slide3Group.worldToLocal(hits[0].point.clone()),
    slide3Group.worldToLocal(hits[0].point.clone()).addScaledVector(dir, -0.85 * percentage * hits[0].distance),
  ];

  const bridgeCurve = new THREE.LineCurve3(...points);
  const bridgeGeom = new THREE.TubeGeometry(
    bridgeCurve,
    1,
    0.02,
    3,
    false
  )

  return bridgeGeom;
}

globalStepTracker.registerUpdator(3, (p) => {
  curve.material.opacity = p;

  x1Bridge.geometry.dispose();
  if (p < 0.01) {
    x1Bridge.geometry = new THREE.BufferGeometry();
    yBridge.geometry = new THREE.BufferGeometry();
  }
  else {
    x1Bridge.geometry = createBridgeGeometry(x1Text, curve, p);
    yBridge.geometry = createBridgeGeometry(yText, curve, p);
  }

  slide3NeuronText.material.opacity = p;
  x1Text.material.opacity = p
})

slide3Group.position.set(10.00, 2.25, 0.00);
slide3Group.add(curve)
slide3Group.add(slide3NeuronText)
slide3Group.add(x1Text);
slide3Group.add(x1Bridge);
slide3Group.add(yText);
slide3Group.add(yBridge);
