import * as THREE from 'three';
import { Line2, LineGeometry, LineMaterial } from 'three/examples/jsm/Addons.js';
import { createNumberPlane } from '@/components/grid';
import type { SlideDeps } from '@/slides/types';

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
  showZAxis: false,
});
group.add(plane);

const x = [-0.9495753614675129, 0.09138458887250979, 0.9321497299351998, 0.20734231266439607, -0.3675021831562402, 0.2532073032568884, -0.4086792477484933, -0.2745090943037771, 0.24224990978061114, 0.1588720017592733, 0.179842617550717, 0.19490677808811277, -0.18640787059144226, 0.12157863347348248, 0.4928704315869703, -0.8160727172933097, -0.8825615861365929, -0.901362739603794, -0.44207091075532157, 0.6331866662071113, 0.7473881870156394, 0.07947605593297259, 0.8307604716372184, -0.28699936305915014, 0.912098589141901, 1.052355137643124, 0.6219471271050079, 0.3580916380773517, -0.038804515648031196, -0.1684966183387776, 0.18452538095107646, -0.33911143419664236, 0.10167817100261499, -0.2498087151665764, 0.3198604005682142, -0.9731579710385933, -0.7309770352957252, 0.2547333149378254, -0.21290872346095208, -0.2783483240733899, 1.1661400474082715, 0.19060983633421055, 0.544097788558788, 0.35966886838348766, 0.8960709438584779, -0.18928479631067147, -0.4644044129410294, 0.4654272523478097, -0.02494581264988005, 0.7508496946662087, -0.027868580300008966, -0.05339409162228284, 0.9071840815429787, -0.4062293580375394, -0.7485410207351051, 0.36512093458423533, 0.10964664900951272, -0.17507169272015508, -0.9261419152457996, 0.25215638023877707, 0.25405140428696515, -0.7181336725450936, -0.21920932047940772, 0.20066062592222608, -0.45295043013748915, -0.26890898681637704, -0.5326257672793525, -0.12304334131757914, -0.1470627464302292, 0.18244661299642323, -0.7621716670679821, -1.0981427557002548, 1.0313455068800652, 0.28932653699431093, 0.339850887480169, -0.31844734211022774, -0.7883094369694865, 0.1487511060931646, -0.34621142421033874, -0.2478853463048662, -1.0352248305922689, -0.010591746568773465, -0.2569392095678706, 0.9116951811913853, 0.1449916912256501, -0.22702077134293935, 0.18360623959598937, 0.06782759114826066, -0.007330050840440774, -0.31198215596999107, -0.035752880972985526, -0.2371886248465072, -0.8499106491482844, -0.2079738789111708, 0.5365417593725658, 0.16885664979162168, -0.267027530571752, 0.1359203011604, 0.8208730423645397, 0.6130479949441281];
const y = [-0.1281303519112823, -0.23000816550472805, 0.1808121482193767, 0.1022608286215773, -0.013278425612003986, -0.05203712671174515, 0.732259917307283, -0.011291565913547755, 0.19336874897577594, -0.13821920124420436, 0.21222537077713186, -0.3783869992563357, -0.2009159816222671, 1.150577452294528, 0.8082293038866134, -0.5273692815808358, 0.4501162819898735, 0.06675094609836871, -0.8697887346805193, 0.8650562027454914, -0.6765235446959886, 0.2995841025999086, 0.5553639605372704, 0.14986059293243484, -0.715484150995054, -0.397701028401357, 0.6636342441922262, -0.21190579316158936, -0.04479644105393596, 0.09246965708095367, 0.26943690773107526, -0.37541345768776624, -0.2738315669340939, 0.26103117666892867, 0.08111826682542875, -0.24370004574109524, 0.7992520079625514, 0.2461789437082664, 0.4438915895302907, -0.004486511972937583, 0.08892455598615633, 0.21286407908573746, -0.9734337710367127, -1.0228461540286111, 0.5231436717659711, 1.1393919020866845, 1.0727612609490493, -0.8899461453085827, -1.1601354780753923, 0.5340018569826408, -0.2768946001179313, 0.20833059396502185, 0.14907219169590233, -0.9519874858208024, -0.5975383005646202, -0.11304964495022288, 1.0938810961409966, -1.1277998814340684, 0.3576207916753162, 0.137827107565502, 1.0031690902460473, -0.6583802582399493, 0.3572718942752815, 0.08256358696795782, -0.25828402193362837, -0.31417927680556085, -0.7455174886938856, -0.3746724194128967, 0.9138813255270881, -0.4952418343149519, 0.6549370656383341, -0.500103962001931, -0.1011697529088097, -0.19339448446906954, -0.06559568705107556, 0.12536031033913056, 0.6401315550114014, -0.11399355103691615, 0.12376981555518153, -0.07589190532212993, 0.08194666083729006, -0.8783007419424744, -0.1361979399416241, -0.3769951403599339, -1.333764062638882, 0.4278675675498207, 0.2275320017119269, 0.86000564092328, -0.3173459878168081, 0.2901182622507871, -0.3757993857512316, -1.0185763621150603, 0.41878948319281395, -0.40463448137561375, 0.9224509276976323, -0.05156666939119506, 0.1646577508538894, 0.24870812284903362, -0.26971282337440156, -0.728200815192963];
const labels = [0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0];

export function initSlide5(deps: Slide5Deps) {
  const { scene, camera, renderer } = deps;
  scene.add(group)

  const scatterPoints = x.map((xVal, i) => {
    const yVal = y[i];
    const baseColor = labels[i] ? 0xff4d6d : 0x5CD0B3;

    const point = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 16, 16),
      new THREE.MeshBasicMaterial({ color: baseColor })
    );

    point.position.copy(plane.coordsToPoint(xVal, yVal))
    point.userData.baseColor = baseColor;

    return point
  })
  group.add(...scatterPoints)

  const hoverLineGeometry = new LineGeometry();
  hoverLineGeometry.setPositions([0, 0, 0, 0, 0, 0]);
  const hoverLine = new Line2(
    hoverLineGeometry,
    new LineMaterial({
      color: 0x58C4DD,
      depthTest: false,
      transparent: true,
      opacity: 0.95,
      linewidth: 0.07,
      worldUnits: true,
    })
  );
  hoverLine.renderOrder = 10;
  hoverLine.visible = false;
  group.add(hoverLine);

  const distanceLabel = createDistanceLabel();
  distanceLabel.visible = false;
  group.add(distanceLabel);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const labelOffset = new THREE.Vector3(0, 0.35, 0.05);
  let hoveredPoint: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial> | null = null;

  const clearHoveredPoint = () => {
    if (!hoveredPoint) return;

    hoveredPoint.scale.setScalar(1);
    hoveredPoint.material.color.setHex(hoveredPoint.userData.baseColor as number);
    hoveredPoint = null;
  };

  renderer.domElement.addEventListener('pointermove', (event) => {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const [hit] = raycaster.intersectObjects(scatterPoints, false);

    if (!hit) {
      clearHoveredPoint();
      hoverLine.visible = false;
      distanceLabel.visible = false;
      return;
    }

    const point = hit.object as THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
    if (hoveredPoint !== point) {
      clearHoveredPoint();
      hoveredPoint = point;
      hoveredPoint.scale.setScalar(1.8);
      hoveredPoint.material.color.setHex(0xffd166);
    }

    hoverLineGeometry.setPositions([0, 0, 0, point.position.x, point.position.y, point.position.z]);
    hoverLine.visible = true;

    const distFloat = point.position.length();
    updateDistanceLabel(distanceLabel, distFloat);
    distanceLabel.position.copy(point.position).add(labelOffset);
    distanceLabel.visible = true;
  });
}

function createDistanceLabel() {
  const canvas = document.createElement('canvas');
  canvas.width = 384;
  canvas.height = 128;

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(1.35, 0.45, 1);
  sprite.renderOrder = 11;
  sprite.userData.canvas = canvas;
  sprite.userData.texture = texture;

  return sprite;
}

function updateDistanceLabel(sprite: THREE.Sprite, distFloat: number) {
  const canvas = sprite.userData.canvas as HTMLCanvasElement;
  const texture = sprite.userData.texture as THREE.CanvasTexture;
  const context = canvas.getContext('2d');
  if (!context) return;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.font = '700 56px sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = 'rgba(0, 0, 0, 0.72)';
  context.fillRect(28, 14, 328, 88);
  context.strokeStyle = '#58C4DD';
  context.lineWidth = 4;
  context.strokeRect(28, 14, 328, 88);
  context.fillStyle = '#58C4DD';
  context.fillText(`z = ${distFloat.toFixed(2)}`, canvas.width / 2, canvas.height / 2);

  texture.needsUpdate = true;
}


