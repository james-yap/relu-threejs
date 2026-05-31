import * as THREE from 'three';
import { debugSphere, createGridHelper } from '../../utils';

export const slide1GridGroup = new THREE.Group();
const grid = createGridHelper({ xStart: -3, xEnd: 3, yStart: -1, yEnd: 3 })

const scale = 0.6

slide1GridGroup.position.set(-4.01, 1.5, 0.00)
slide1GridGroup.scale.set(scale, scale, scale)


const curvePoints = [];
for (let i = -3; i <= 3; i += 0.1) {
  const x = i;
  const y = Math.max(0, x);
  const z = 0.0;
  curvePoints.push(new THREE.Vector3(x, y, z));
}

const curvePath = new THREE.CatmullRomCurve3(curvePoints);
const curveGeometry = new THREE.TubeGeometry(
  curvePath,
  100, // tubular segments
  0.05, // thickness / radius
  8, // radial segments
  false
);
const curveMaterial = new THREE.MeshBasicMaterial({ color: 0x58C4DD });
const curve = new THREE.Mesh(curveGeometry, curveMaterial);

slide1GridGroup.add(grid)
slide1GridGroup.add(curve)

const sphere = debugSphere.clone()
slide1GridGroup.add(sphere)
