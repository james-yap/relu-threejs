import { createHtmlPlane } from '../../utils';
import type { SlideDeps } from '../types';

import { slide1GridGroup } from './relu';

export function initSlide1(deps: SlideDeps) {
  const { scene, interactions } = deps;

  const slide1TitleMesh = createHtmlPlane({
    html: 'ReLU, explained quickly.',
    className: 'text-blue-500 font-black text-5xl text-center grid place-items-center',
    width: 7,
    height: 1,
    interactions
  });
  slide1TitleMesh.position.set(-3.99, 4, -0.00);
  slide1TitleMesh.position.z = 0.05;
  scene.add(slide1TitleMesh);


  const slide1Eqn = createHtmlPlane({
    html: String.raw`$$\text{ReLU}(x) = \text{max}(0, x)$$`,
    id: 'slide1Eqn',
    className: 'blue-text',
    width: 5,
    height: 1,
    interactions
  });
  scene.add(slide1Eqn)
  slide1Eqn.position.set(-3.98, 0.39, 0.00);

  scene.add(slide1GridGroup)
}
