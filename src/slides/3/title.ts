import * as THREE from 'three';

import { globalStepTracker } from '../../steps/stepTracker';
import { createHtmlPlane } from '../../utils';

export const slide3Title = createHtmlPlane({
  html: '$$y_i = x_iw + b$$',
  id: 'slide3Title',
  className: 'blue-text',
  width: 2,
  height: 0.5,
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
