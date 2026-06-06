import { createHtmlPlane } from '@/components/htmlPlane';
import { slide2Group } from '@/slides/2/grid';
import type { SlideDeps } from '@/slides/types';

export function initSlide2(deps: SlideDeps) {
  const { scene, interactions } = deps;

  const slide2XLabel = createHtmlPlane({
    html: 'Study time (hours)',
    id: 'slide2XLabel',
    className: 'blue-text',
    width: 4,
    height: 0.8,
    interactions
  });
  scene.add(slide2XLabel)
  slide2XLabel.position.set(4.78, 0.57, 0.00);

  const slide2YLabel = createHtmlPlane({
    html: 'GPA',
    id: 'slide2YLabel',
    className: 'blue-text',
    width: 1,
    height: 0.6,
    interactions
  });
  slide2YLabel.rotateZ(Math.PI / 2);
  slide2YLabel.position.set(2.79, 2.54, 0.00);
  scene.add(slide2YLabel)

  scene.add(slide2Group);
}
