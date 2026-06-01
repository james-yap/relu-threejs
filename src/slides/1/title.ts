import { createHtmlPlane } from '../../utils';

export const slide1TitleMesh = createHtmlPlane({
  html: '<h1>ReLU, explained quickly.</h1>',
  id: 'slide1Title',
  className: 'blue-text',
  width: 8,
  height: 1.5,
});

slide1TitleMesh.position.set(-3.99, 4, -0.00);
slide1TitleMesh.position.z = 0.05;
