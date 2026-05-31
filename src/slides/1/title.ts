import { DEBUG } from '../../constants';
import { createHtmlPlane } from '../../utils';

export const slide1TitleMesh = createHtmlPlane({
  html: '<h1>ReLU, explained quickly.</h1>',
  id: 'inter',
  width: 8,
  height: 1.5,
  debug: DEBUG,
});

slide1TitleMesh.position.set(-3.99, 4, -0.00);
slide1TitleMesh.position.z = 0.05;
