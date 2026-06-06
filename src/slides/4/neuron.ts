import * as THREE from 'three';

import { createHtmlPlane } from '@/components/htmlPlane';
import { createCircleGeom } from '@/slides/3/group';
import type { SlideDeps } from '@/slides/types';

const group = new THREE.Group();
group.name = "slide4NeuronGroup"
group.position.set(9.93, -2.22, 0.00);

const neuron = new THREE.Mesh(createCircleGeom(), new THREE.MeshBasicMaterial({
  color: 0x58C4DD
}))
group.add(neuron);

export function initSlide4Neuron(deps: SlideDeps) {
  const { scene, interactions } = deps;

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
    className: 'blue-text',
    width: 0.45,
    height: 0.45,
    interactions
  });
  x.position.set(-1.74, 0.51, 0.05)
  group.add(x);

  const xSqr = createHtmlPlane({
    html: String.raw`$$ x^2 $$`,
    className: 'blue-text',
    width: 0.45,
    height: 0.45,
    interactions
  });
  xSqr.position.set(-1.74, -0.35, 0.05)
  group.add(xSqr);

  scene.add(group);
}

