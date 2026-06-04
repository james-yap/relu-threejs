import { createHtmlPlane } from '../../utils';


export const slide1TitleMesh = createHtmlPlane({
  html: 'ReLU, explained quickly.',
  className: 'text-blue-500 font-black text-5xl text-center grid place-items-center',
  width: 7,
  height: 1,
});

slide1TitleMesh.position.set(-3.99, 4, -0.00);
slide1TitleMesh.position.z = 0.05;
