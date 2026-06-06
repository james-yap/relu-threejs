import * as THREE from 'three';

import { createHtmlPlane } from '@/components/htmlPlane';
import { createCircleGeom } from '@/slides/3/group';
import type { SlideDeps } from '@/slides/types';
import { Line2, LineGeometry, LineMaterial } from 'three/examples/jsm/Addons.js';
import { globalStepTracker } from '@/steps/stepTracker';
import { setGroupOpacity } from '@/utils';

const group = new THREE.Group();
group.name = "slide4NeuronGroup"
group.position.set(9.93, -2.22, 0.00);

const neuron = new THREE.Mesh(createCircleGeom(), new THREE.MeshBasicMaterial({
  color: 0x58C4DD
}))
group.add(neuron);

export function initSlide4Neuron(deps: SlideDeps) {
  const { scene, interactions } = deps;


  const eqn = createHtmlPlane({
    html: String.raw`$$y = w_1x + w_2x^2 + b$$`,
    className: 'blue-text',
    width: 2.8,
    height: 0.5,
    interactions
  });
  eqn.position.set(-0.04, 1.53, 0.00)
  group.add(eqn)


  const neuronText = createHtmlPlane({
    html: String.raw`$$ \sum + b $$`,
    className: 'blue-text',
    width: 1,
    height: 1,
    depthWrite: true,
    interactions
  });
  neuronText.position.z = 0.05
  group.add(neuronText)

  const w1 = createHtmlPlane({
    html: String.raw`$$\times w_1$$`,
    className: 'multiplier',
    width: 0.45,
    height: 0.3,
    depthWrite: true,
    interactions
  });
  w1.position.set(-0.75, 0.28, 0.05)
  group.add(w1)

  const w2 = createHtmlPlane({
    html: String.raw`$$\times w_2$$`,
    className: 'multiplier',
    width: 0.45,
    height: 0.3,
    depthWrite: true,
    interactions
  });
  w2.position.set(-0.75, -0.28, 0.05)
  group.add(w2)

  const x = createHtmlPlane({
    html: String.raw`$$ x $$`,
    className: 'blue-text bg-black',
    width: 0.3,
    height: 0.3,
    interactions
  });
  x.position.set(-1.74, 0.51, 0.05)
  group.add(x);

  const xSqr = createHtmlPlane({
    html: String.raw`$$ x^2 $$`,
    className: 'blue-text bg-black',
    width: 0.45,
    height: 0.45,
    interactions
  });
  xSqr.position.set(-1.74, -0.51, 0.05)
  group.add(xSqr);



  const y = createHtmlPlane({
    html: String.raw`$$ y $$`,
    className: 'blue-text bg-black',
    width: 0.3,
    height: 0.3,
    interactions
  });
  y.position.set(1.76, -0.05, 0.05)
  group.add(y);

  scene.add(group);

  const bridgeMat = new LineMaterial({
    color: 0x236B8E,
    transparent: true,
    linewidth: 0.03,
    worldUnits: true,
  })

  const xBridgeGeom = new LineGeometry();
  xBridgeGeom.setPositions([
    ...w1.position.toArray(),
    -1.74, 0.51, 0.00,
  ])
  const xBridge = new Line2(xBridgeGeom, bridgeMat);
  group.add(xBridge);

  const xSqrBridgeGeom = new LineGeometry();
  xSqrBridgeGeom.setPositions([
    ...w2.position.toArray(),
    -1.74, -0.51, 0.00
  ])
  const xSqrBridge = new Line2(xSqrBridgeGeom, bridgeMat);
  group.add(xSqrBridge);

  const yBridgeGeom = new LineGeometry();
  yBridgeGeom.setPositions([
    0.83, -0.05, -0.00,
    1.76, -0.05, 0.00
  ])
  const yBridge = new Line2(yBridgeGeom, bridgeMat);
  group.add(yBridge);

  const xSrc = w1.position.clone()
  const xDest = new THREE.Vector3(-1.74, 0.51, 0.00)
  const xCurrentDest = new THREE.Vector3();
  const xSqrSrc = w2.position.clone();
  const xSqrDest = new THREE.Vector3(-1.74, -0.51, 0.00)
  const xSqrCurrentDest = new THREE.Vector3();


  const fe = createHtmlPlane({
    html: `"Feature Engineering"`,
    className: 'text-green-400 text-3xl flex justify-center items-center',
    width: 3,
    height: 0.4,
    interactions
  });
  fe.position.set(-1.81, -1.12, 0.00)
  group.add(fe)

  globalStepTracker.registerUpdator(5, (p) => {
    setGroupOpacity(group, p);

    xCurrentDest.lerpVectors(xSrc, xDest, p)
    xBridgeGeom.setPositions([
      ...xSrc.toArray(),
      ...xCurrentDest.toArray(),
    ])

    xSqrCurrentDest.lerpVectors(xSqrSrc, xSqrDest, p)
    xSqrBridgeGeom.setPositions([
      ...xSqrSrc.toArray(),
      ...xSqrCurrentDest.toArray(),
    ])
  })
}

