import * as THREE from 'three';
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { createNumberPlane } from '@/components/grid';
import type { SlideDeps } from '@/slides/types';
import { globalStepTracker } from '@/steps/stepTracker';
import { Circle } from '@/components/circle';
import { initSlide5Neuron } from './neuron';

type Slide5Deps = SlideDeps & {
  camera: THREE.Camera;
  renderer: THREE.WebGLRenderer;
};

const group = new THREE.Group();
group.name = "circlesGroup"
group.position.set(16.02, -0.02, 0.00)

const plane = createNumberPlane({
  xRange: [-1.5, 1.5, 0.5],
  yRange: [-1.5, 1.5, 0.5],
  xLength: 6,
  yLength: 6,
  showZAxis: true,
});
plane.zAxis.material.transparent = true;
group.add(plane);

const x = [-0.038804515648031196, 0.16885664979162168, 0.1487511060931646, -0.1684966183387776, 0.1588720017592733, -0.05339409162228284, 0.20066062592222608, 0.20734231266439607, 0.09138458887250979, 0.2532073032568884, -0.2478853463048662, -0.18640787059144226, -0.2745090943037771, 0.179842617550717, -0.027868580300008966, -0.2783483240733899, 0.1359203011604, 0.19060983633421055, 0.25215638023877707, -0.2569392095678706, 0.10167817100261499, 0.18360623959598937, 0.07947605593297259, 0.24224990978061114, -0.267027530571752, -0.007330050840440774, -0.28699936305915014, 0.18452538095107646, 0.3198604005682142, -0.31844734211022774, 0.339850887480169, 0.28932653699431093, 0.2547333149378254, -0.2498087151665764, -0.34621142421033874, -0.3675021831562402, -0.035752880972985526, 0.36512093458423533, -0.12304334131757914, -0.26890898681637704, 0.3580916380773517, -0.21920932047940772, 0.19490677808811277, -0.31198215596999107, -0.2079738789111708, -0.22702077134293935, -0.21290872346095208, -0.33911143419664236, -0.45295043013748915, 0.18244661299642323, -0.4086792477484933, 0.06782759114826066, 0.8208730423645397, -0.010591746568773465, -0.901362739603794, 0.6219471271050079, -0.5326257672793525, 0.9071840815429787, 0.7508496946662087, -0.1470627464302292, 0.4928704315869703, -0.8499106491482844, 0.9321497299351998, 0.6130479949441281, -0.7485410207351051, -0.9495753614675129, -0.8160727172933097, -0.7181336725450936, -0.44207091075532157, 0.9116951811913853, -0.8825615861365929, -0.9261419152457996, 0.8307604716372184, -0.9731579710385933, 0.4654272523478097, -0.7621716670679821, 0.7473881870156394, -0.7883094369694865, 0.25405140428696515, -0.4062293580375394, 1.0313455068800652, 0.8960709438584779, -1.0352248305922689, -0.2371886248465072, 0.5365417593725658, 0.6331866662071113, -0.7309770352957252, 0.35966886838348766, 0.10964664900951272, 0.544097788558788, 1.052355137643124, -0.17507169272015508, -0.18928479631067147, 0.12157863347348248, 0.912098589141901, -0.02494581264988005, -0.4644044129410294, 1.1661400474082715, -1.0981427557002548, 0.1449916912256501];
const y = [-0.04479644105393596, -0.05156666939119506, -0.11399355103691615, 0.09246965708095367, -0.13821920124420436, 0.20833059396502185, 0.08256358696795782, 0.1022608286215773, -0.23000816550472805, -0.05203712671174515, -0.07589190532212993, -0.2009159816222671, -0.011291565913547755, 0.21222537077713186, -0.2768946001179313, -0.004486511972937583, 0.24870812284903362, 0.21286407908573746, 0.137827107565502, -0.1361979399416241, -0.2738315669340939, 0.2275320017119269, 0.2995841025999086, 0.19336874897577594, 0.1646577508538894, -0.3173459878168081, 0.14986059293243484, 0.26943690773107526, 0.08111826682542875, 0.12536031033913056, -0.06559568705107556, -0.19339448446906954, 0.2461789437082664, 0.26103117666892867, 0.12376981555518153, -0.013278425612003986, -0.3757993857512316, -0.11304964495022288, -0.3746724194128967, -0.31417927680556085, -0.21190579316158936, 0.3572718942752815, -0.3783869992563357, 0.2901182622507871, -0.40463448137561375, 0.4278675675498207, 0.4438915895302907, -0.37541345768776624, -0.25828402193362837, -0.4952418343149519, 0.732259917307283, 0.86000564092328, -0.26971282337440156, -0.8783007419424744, 0.06675094609836871, 0.6636342441922262, -0.7455174886938856, 0.14907219169590233, 0.5340018569826408, 0.9138813255270881, 0.8082293038866134, 0.41878948319281395, 0.1808121482193767, -0.728200815192963, -0.5975383005646202, -0.1281303519112823, -0.5273692815808358, -0.6583802582399493, -0.8697887346805193, -0.3769951403599339, 0.4501162819898735, 0.3576207916753162, 0.5553639605372704, -0.24370004574109524, -0.8899461453085827, 0.6549370656383341, -0.6765235446959886, 0.6401315550114014, 1.0031690902460473, -0.9519874858208024, -0.1011697529088097, 0.5231436717659711, 0.08194666083729006, -1.0185763621150603, 0.9224509276976323, 0.8650562027454914, 0.7992520079625514, -1.0228461540286111, 1.0938810961409966, -0.9734337710367127, -0.397701028401357, -1.1277998814340684, 1.1393919020866845, 1.150577452294528, -0.715484150995054, -1.1601354780753923, 1.0727612609490493, 0.08892455598615633, -0.500103962001931, -1.333764062638882];
const labels = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].reverse();


export const disks5 = new THREE.Group();
x.forEach((xVal, i) => {
  const yVal = y[i];
  const baseColor = labels[i] ? 0xff4d6d : 0x5CD0B3;

  const container = new THREE.Group();

  const point = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 16, 16),
    new THREE.MeshBasicMaterial({ color: baseColor })
  );

  point.position.copy(plane.coordsToPoint(xVal, yVal))
  point.userData.baseColor = baseColor;

  container.add(point);

  const normalizedRadius = new THREE.Vector2(xVal, yVal).length();
  const actualRadius = point.position.length();

  const circ = new Circle({
    radius: actualRadius,
    percentage: 1,
    linewidth: normalizedRadius * 5
  })
  circ.material.color.lerpColors(
    new THREE.Color(0x00FF00),
    new THREE.Color(0xFF00FF),
    normalizedRadius,
  )
  circ.material.transparent = true;
  circ.material.opacity = 0.5;
  // circ.rotateZ(Math.PI * 2 * Math.random())
  container.add(circ)

  disks5.add(container)
})
group.add(disks5);

export const decisionCirc5 = new Circle({
  radius: 0,
  linewidth: 8,
  color: "white"
})
group.add(decisionCirc5)

export function initSlide5(deps: Slide5Deps) {
  const { scene } = deps;
  scene.add(group)
  initSlide5Neuron(deps)
}

function createDesmosObject() {
  const wrapper = document.createElement('div');
  wrapper.className = 'w-[500px] h-[500px] bg-white border border-[#ccc] pointer-events-auto';

  const iframe = document.createElement('iframe');
  iframe.className = 'block w-[800px] h-[600px] border-0 bg-white [backface-visibility:hidden]';
  iframe.src = 'https://www.desmos.com/calculator/zgtart4esh';
  iframe.title = 'Desmos calculator';
  wrapper.appendChild(iframe);

  const object = new CSS3DObject(wrapper);
  object.position.set(6, 1, 1);
  object.rotateX(Math.PI / 2);
  object.scale.setScalar(0);

  return object;
}
const desmos = createDesmosObject()
group.add(desmos);


globalStepTracker.registerUpdator(7, (p) => {
  desmos.scale.setScalar(0.01 * p);
  plane.zAxis.material.opacity = p;
})


const lagRatio = 0.03;
const circleDuration = 1;
const totalDuration = circleDuration + lagRatio * (disks5.children.length - 1);

globalStepTracker.registerUpdator(8, (p) => {
  disks5.children.forEach((i, index) => {
    const point = i.children[0];
    const circ = i.children[1] as Circle;

    const localP = THREE.MathUtils.clamp(
      (p * totalDuration - index * lagRatio) / circleDuration,
      0,
      1,
    );
    const easedP = THREE.MathUtils.smootherstep(localP, 0, 1);

    i.position.z = easedP * point.position.length();
    circ.setPercentage(localP);
  });
});

globalStepTracker.registerUpdator(9, p => {
  desmos.scale.setScalar(0.01 * (1 - p));


})

globalStepTracker.registerUpdator(10, p => {
  disks5.children.forEach((i, index) => {
    const point = i.children[0];
    const circ = i.children[1] as Circle;

    const localP = THREE.MathUtils.clamp(
      (p * totalDuration - index * lagRatio) / circleDuration,
      0,
      1,
    );
    const easedP = THREE.MathUtils.smootherstep(localP, 0, 1);

    i.position.z = (1 - easedP) * point.position.length();
    circ.setPercentage(1 - localP);
  });
})

