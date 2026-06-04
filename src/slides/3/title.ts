import * as THREE from 'three';

import { globalStepTracker } from '../../steps/stepTracker';
import { createHtmlPlane } from '../../utils';
import type { SlideDeps } from '../types';

const titleEl = document.createElement('div');
titleEl.innerHTML = String.raw`$$y_i = x_iw + b$$`;

export function initSlide3Title(deps: SlideDeps) {
  const { interactions, scene } = deps;

  const slide3Title = createHtmlPlane({
    html: titleEl,
    id: 'slide3Title',
    className: 'blue-text',
    width: 2,
    height: 0.5,
    interactions
  });

  globalStepTracker.registerUpdator(2, (p) => {
    slide3Title.scale.set(p, p, p);
  })

  globalStepTracker.registerUpdator(3, (p) => {
    const a = new THREE.Vector3(8, 2.25, 0.00);
    const b = new THREE.Vector3(9.95, 3.90, 0.00);
    const dir = new THREE.Vector3().subVectors(b, a).multiplyScalar(p);
    const pos = new THREE.Vector3().addVectors(a, dir)
    slide3Title.position.copy(pos);
  })

  slide3Title.position.z = 0.05;

  scene.add(slide3Title)
}
