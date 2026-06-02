import { globalStepTracker } from '../../steps/stepTracker';
import { createHtmlPlane } from '../../utils';

export const slide3W = createHtmlPlane({
  html: String.raw`$$\times w$$`,
  id: 'slide3W',
  className: 'multiplier',
  width: 0.4,
  height: 0.3,
  depthWrite: true
});

export const slide3_b = createHtmlPlane({
  html: String.raw`$$+b$$`,
  id: 'slide3_b',
  className: 'multiplier',
  width: 0.4,
  height: 0.3,
  depthWrite: true
});


globalStepTracker.registerUpdator(3, (p) => {
  slide3W.material.opacity = p;
  slide3_b.material.opacity = p;
})

slide3W.position.set(9.21, 2.24, 0.05);
slide3_b.position.set(10.84, 2.24, 0.05);
