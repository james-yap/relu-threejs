import * as THREE from 'three';

import { createHtmlPlane } from '@/components/htmlPlane';
import { createSlider } from '@/components/slider';
import { updateSlide2Line } from '@/slides/2/grid';
import type { SlideDeps } from '@/slides/types';
import { globalStepTracker } from '@/steps/stepTracker';
import { setGroupOpacity } from '@/utils';
import { Line2, LineGeometry, LineMaterial, LineSegments2 } from 'three/examples/jsm/Addons.js';

export const group = new THREE.Group();
group.position.set(10.00, 2.25, 0.00);

export const createCircleGeom = (percentage: number = 1) => {
  const radians = 2 * Math.PI * percentage;
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
const neuronMaterial = new THREE.MeshBasicMaterial({
  color: 0x58C4DD,
  // transparent: true
});
const curve = new THREE.Mesh(createCircleGeom(), neuronMaterial);
group.add(curve)

export const initSlide3Group = (deps: SlideDeps) => {
  const { interactions, scene } = deps;

  const slide3NeuronText = createHtmlPlane({
    html: String.raw`$$ \sum + b $$`,
    className: 'blue-text',
    width: 1,
    height: 1,
    depthWrite: true,
    interactions
  });
  slide3NeuronText.position.z = 0.05
  group.add(slide3NeuronText)

  const x1Text = createHtmlPlane({
    html: String.raw`$$ x_i $$`,
    className: 'blue-text',
    width: 0.5,
    height: 0.5,
    interactions
  });
  x1Text.position.x -= 2;
  group.add(x1Text);

  const yText = createHtmlPlane({
    html: String.raw`$$ y_i $$`,
    id: 'yTextSlide3',
    className: 'blue-text',
    width: 0.5,
    height: 0.5,
    interactions
  });
  yText.position.x += 2;
  group.add(yText);

  x1Text.position.z = 0.05
  yText.position.z = 0.05

  const lineParams = {
    _w: 1,
    set w(val: number) {
      this._w = val;
      updateSlide2Line(val, this._b)
      wBeam.material.opacity = 1;
    },

    _b: 0,
    set b(val: number) {
      this._b = val;
      updateSlide2Line(this._w, val)
      bBeam.material.opacity = 1;
    }
  }

  const wSlider = createSlider({
    name: "w",
    defaultValue: 0,
    min: -2,
    max: 2,
    interactions,
    step: 0.3,
    callbackFn: (val) => lineParams.w = val,
    color: "red"
  });
  wSlider.position.set(-0.7, -1.2, 0);
  group.add(wSlider);


  const bSlider = createSlider({
    name: "b",
    defaultValue: 0,
    min: -2,
    max: 2,
    interactions,
    step: 0.3,
    callbackFn: (val) => lineParams.b = val,
    color: "green"
  });
  bSlider.position.set(0.7, -1.2, 0);
  group.add(bSlider);


  globalStepTracker.registerUpdator(3, (p) => {
    bridgeMat.opacity = p;
    setGroupOpacity(group, p)
  })

  scene.add(group);
  scene.add(x1Bridge);
  scene.add(x2Bridge);
  scene.add(wBeam);
  scene.add(bBeam);
}


const wBeamGeom = new LineGeometry();
wBeamGeom.setPositions([
  9.33, 1.34, 0.00,
  9.22, 2.22, 0.00,
  9.33, 1.34, 0.00,
  10.15, 3.72, -0.00
])
const wBeamMat = new LineMaterial({
  color: 0XF7C797,
  linewidth: 0.03, // Thickness
  worldUnits: true, // Ensures thickness scales correctly in 3D space
  transparent: true,
});
const wBeam = new LineSegments2(wBeamGeom, wBeamMat);

const bBeamGeom = new LineGeometry();
bBeamGeom.setPositions([
  10.71, 1.26, 0.00,
  10.35, 2.23, 0.00,
  10.71, 1.26, 0.00,
  10.68, 3.76, 0.00
])
const bBeamMat = wBeamMat.clone();
const bBeam = new LineSegments2(bBeamGeom, bBeamMat);

export function renderBeams() {
  wBeamMat.opacity -= Math.max(0, (0.1 * wBeamMat.opacity))
  bBeamMat.opacity -= Math.max(0, (0.1 * bBeamMat.opacity))
}

const bridgeMat = new LineMaterial({
  color: 0x236B8E,
  transparent: true,
  linewidth: 0.03,
  worldUnits: true,
})
const x1BridgeGeom = new LineGeometry();
x1BridgeGeom.setPositions([
  9, 2.23, -0.00,
  8.2, 2.25, 0.00
])
const x1Bridge = new Line2(x1BridgeGeom, bridgeMat);
const x2BridgeGeom = new LineGeometry();
x2BridgeGeom.setPositions([
  10.80, 2.24, 0.00,
  11.83, 2.23, -0.00
])
const x2Bridge = new Line2(x2BridgeGeom, bridgeMat);
