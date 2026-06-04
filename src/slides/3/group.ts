import * as THREE from 'three';

import { globalStepTracker } from '../../steps/stepTracker';
import { createHtmlPlane, setGroupOpacity } from '../../utils';
import type { SlideDeps } from '../types';
import { updateSlide2Line } from '../2/grid';
import { createSlider } from '../../components/slider';

export const group = new THREE.Group();
group.position.set(10.00, 2.25, 0.00);

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
group.add(curve)

export const initSlide3Group = (deps: SlideDeps) => {
  const { interactions, scene } = deps;

  const slide3NeuronText = createHtmlPlane({
    html: String.raw`$$ \sum + b $$`,
    id: 'slide3NeuronText',
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
    id: 'x1TextSlide3',
    className: 'blue-text',
    width: 0.5,
    height: 0.5,
    interactions
  });
  x1Text.position.x -= 2;
  group.add(x1Text);

  const tubularSegments = 64;
  const radialSegments = 3; // minimum to draw triangle


  const createBridgeGeometry = (src: THREE.Object3D, target: THREE.Object3D) => {
    // const raycaster = new THREE.Raycaster();
    // const a = src.getWorldPosition(new THREE.Vector3());
    // const b = target.getWorldPosition(new THREE.Vector3());
    // const dir = new THREE.Vector3().subVectors(b, a).normalize();
    // raycaster.set(a, dir);
    // const hits = raycaster.intersectObject(target);
    //
    // if (hits.length < 1) return new THREE.BufferGeometry();

    const points: THREE.Vector3[] = [
      src.position.clone(),
      target.position.clone()
      // group.worldToLocal(hits[0].point.clone()),
      // group.worldToLocal(hits[0].point.clone()).addScaledVector(dir, -0.85 * percentage * hits[0].distance),
    ];

    const bridgeCurve = new THREE.LineCurve3(...points);
    const bridgeGeom = new THREE.TubeGeometry(
      bridgeCurve,
      tubularSegments,
      0.02,
      radialSegments,
      false
    )

    return bridgeGeom;
  }

  const x1BridgeMaterial = new THREE.MeshBasicMaterial({ color: 0x236B8E })
  const x1Bridge = new THREE.Mesh(createBridgeGeometry(curve, x1Text), x1BridgeMaterial);
  group.add(x1Bridge);

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
  const yBridgeMaterial = new THREE.MeshBasicMaterial({ color: 0x236B8E })
  const yBridge = new THREE.Mesh(createBridgeGeometry(curve, yText), yBridgeMaterial);
  group.add(yBridge);

  x1Text.position.z = 0.05
  yText.position.z = 0.05

  const lineParams = {
    _w: 1,
    set w(val: number) {
      this._w = val;
      updateSlide2Line(val, this._b)
    },

    _b: 0,
    set b(val: number) {
      this._b = val;
      updateSlide2Line(this._w, val)
    }
  }

  const wSlider = createSlider({
    name: "w",
    defaultValue: 0,
    min: -2,
    max: 2,
    interactions,
    step: 0.01,
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
    step: 0.01,
    callbackFn: (val) => lineParams.b = val,
    color: "green"
  });
  bSlider.position.set(0.7, -1.2, 0);
  group.add(bSlider);


  globalStepTracker.registerUpdator(3, (p) => {
    x1Bridge.geometry.setDrawRange(0, Math.floor(p * x1Bridge.geometry.index!.count));
    yBridge.geometry.setDrawRange(0, Math.floor(p * yBridge.geometry.index!.count));

    setGroupOpacity(group, p)
  })

  scene.add(group);
}
