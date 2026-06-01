import { createHtmlPlane } from '../../utils';

export const slide2YLabel = createHtmlPlane({
  html: 'GPA',
  id: 'slide2YLabel',
  className: 'blue-text',
  width: 4,
  height: 0.8,
});

slide2YLabel.rotateZ(Math.PI / 2);
slide2YLabel.position.set(2.79, 2.54, 0.00);
