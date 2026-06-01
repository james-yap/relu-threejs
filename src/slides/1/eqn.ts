import { createHtmlPlane } from '../../utils';

export const slide1Eqn = createHtmlPlane({
  html: String.raw`$$\text{ReLU}(x) = \text{max}(0, x)$$`,
  id: 'slide1Eqn',
  className: 'blue-text',
  width: 5,
  height: 1,
});

slide1Eqn.position.set(-3.98, 0.39, 0.00);
