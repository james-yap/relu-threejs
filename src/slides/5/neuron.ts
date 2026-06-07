import * as THREE from 'three';

import { createHtmlPlane } from '@/components/htmlPlane';
import type { SlideDeps } from '@/slides/types';
import { Circle } from '@/components/circle';
import { Line2, LineGeometry, LineMaterial, LineSegments2, LineSegmentsGeometry } from 'three/examples/jsm/Addons.js';
import { globalStepTracker } from '@/steps/stepTracker';
import { setGroupOpacity } from '@/utils';
import { createSlider } from '@/components/slider';
import { decisionCirc5, disks5 } from '.';
import { currentStep } from '@/steps';

const group = new THREE.Group();
group.name = "slide5NeuronGroup"
group.position.set(22.84, 1, 1);

const neuron = new Circle({
  radius: 1,
  linewidth: 4,
  color: 0x58C4DD
})
neuron.name = "slide5Neuron"
neuron.position.y -= 1.3
group.add(neuron);

export function initSlide5Neuron(deps: SlideDeps) {
  const { scene, interactions } = deps;

  scene.add(group);

  const neuronText = createHtmlPlane({
    html: String.raw`$$ \sum + b$$`,
    className: 'blue-text',
    width: 1,
    height: 1,
    depthWrite: true,
    interactions
  });
  neuron.add(neuronText);

  const eqn = createHtmlPlane({
    html: String.raw`$$y = w_1x + w_2x^2 + w_3y + w_4y^2 + w_5(xy) + b$$`,
    className: 'blue-text',
    width: 6,
    height: 0.5,
    interactions
  });
  eqn.position.set(-0.04, 1.66, -0.00)
  group.add(eqn)


  const eqn2 = createHtmlPlane({
    html: String.raw`$$y = w_2x^2 + w_4y^2 + b$$`,
    className: 'blue-text',
    width: 3,
    height: 0.5,
    interactions
  });
  eqn2.position.set(-0.04, 1, -0.00)
  group.add(eqn2)

  const joints: [number, number, number][] = [];
  const ins: [number, number, number][] = [];
  const linePos: number[] = [
    1, 0, 0,
    2, 0, 0,
  ];

  for (let i = 0; i < 5; i++) {
    const t = (Math.PI / 4) * i + (Math.PI / 2);
    const x = Math.cos(t)
    const y = Math.sin(t)
    const joint: [number, number, number] = [x, y, 0.00];
    joints.push(joint);

    // const r = 1.5
    // ins.push([r * Math.cos(t), r * Math.sin(t), 0.00])
    const inPos: [number, number, number] = [x - 1, y + (2 - i) * 0.2, 0.05];
    ins.push(inPos)

    linePos.push(...joint)
    linePos.push(...inPos)
  }

  const X = ["x", "x^2", "y", "y^2", "xy"]

  const lineMat = new LineMaterial({
    color: 0x236B8E,
    linewidth: 0.03, // Thickness
    worldUnits: true, // Ensures thickness scales correctly in 3D space
    transparent: true,
  });
  const lineGeom = new LineSegmentsGeometry().setPositions(linePos);
  const lines = new LineSegments2(lineGeom, lineMat);
  neuron.add(lines)

  joints.forEach((j, idx) => {
    const w = createHtmlPlane({
      html: String.raw`$$\times ` + `w_${idx}$$`,
      className: 'multiplier',
      width: 0.45,
      height: 0.3,
      depthWrite: true,
      interactions
    });
    w.position.set(j[0], j[1], 0.05)
    neuron.add(w)

    const x = createHtmlPlane({
      html: `$$${X[idx]}$$`,
      className: 'blue-text bg-black',
      width: 0.45,
      height: 0.45,
      depthWrite: true,
      interactions
    });
    x.position.set(...ins[idx])
    neuron.add(x)
  })


  const z = createHtmlPlane({
    html: `z`,
    className: 'blue-text bg-black',
    width: 0.45,
    height: 0.45,
    depthWrite: true,
    interactions
  });
  z.position.x += 2
  z.position.z = 0.05
  neuron.add(z)


  const slider = createSlider({
    name: "b",
    defaultValue: 0,
    interactions,
    min: -3,
    max: 1,
    step: 0.3,
    callbackFn: (val) => {
      if (currentStep !== 10) disks5.position.z = val;
      beamMat.opacity = 1;
      decisionCirc5.setRadius(Math.min(0, val))
    },
    color: "green"
  })
  slider.position.set(1.47, -1.02, 0.00)
  neuron.add(slider)
}



const beamGeom = new LineGeometry().setPositions([
  1.16, -0.28, -1.00,
  1.87, -1.05, -1.00
])
const beamMat = new LineMaterial({
  color: 0XF7C797,
  transparent: true,
  linewidth: 0.03,
  worldUnits: true,
})
const beam = new Line2(beamGeom, beamMat)
neuron.add(beam)

export function renderBeam5() {
  beamMat.opacity -= Math.max(0, (0.1 * beamMat.opacity))
}

globalStepTracker.registerUpdator(9, p => {
  setGroupOpacity(group, p)
})


globalStepTracker.registerUpdator(10, p => {
  // group.position.z = 1 - p;
  group.rotation.x = ((1 - p) * (Math.PI / 2))
})
