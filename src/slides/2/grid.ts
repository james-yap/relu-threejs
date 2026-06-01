import * as THREE from 'three';

export const slide2Group = new THREE.Group();

const pos: [number, number, number] = [3.21, 1.00, 0.00]

const axesHelper = new THREE.AxesHelper(3);
slide2Group.add(axesHelper)


const x = [0.0, 0.3333333333333333, 0.6666666666666666, 1.0, 1.3333333333333333, 1.6666666666666665, 2.0, 2.333333333333333, 2.6666666666666665, 3.0];
const y = [-0.002920395778944087, 0.20693794606456695, 0.8089330831743278, 1.1141554662900175, 1.2048354679621593, 1.3710745979199308, 2.2523983441409503, 2.4247953839948044, 2.9621562641446135, 2.366112204421725];

const scatterPoints = x.map((xVal, i) => {
  const yVal = y[i];

  const point = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xff4d6d })
  );

  point.position.set(xVal, yVal, 0)

  return point
})

slide2Group.add(...scatterPoints)
slide2Group.position.set(...pos)


const createCurveGeometry = (percentage: number) => {
  const curveLength = 3 * percentage;
  const curvePoints: THREE.Vector3[] = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(curveLength, curveLength, 0)
  ];

  const curvePath = new THREE.CatmullRomCurve3(curvePoints);
  return new THREE.TubeGeometry(
    curvePath,
    100, // tubular segments
    0.05, // thickness / radius
    8, // radial segments
    false
  );
};

const curveMaterial = new THREE.MeshBasicMaterial({ color: 0x58C4DD });
const curve = new THREE.Mesh(createCurveGeometry(0), curveMaterial);

export function updateSlide2Percentage(percentage: number) {
  curve.geometry.dispose();
  curve.geometry = createCurveGeometry(percentage);
}

slide2Group.add(curve)
