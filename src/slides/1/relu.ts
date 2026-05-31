import * as THREE from 'three';
import { debugSphere, createGridHelper } from '../../utils';

export const slide1GridGroup = new THREE.Group();
const grid = createGridHelper({ xStart: -7, xEnd: 7 })

const sphere = debugSphere.clone()
const sphere2 = debugSphere.clone()
sphere2.position.x = 1

const scale = 0.3

slide1GridGroup.position.set(-4.01, 1.8, 0.00)
slide1GridGroup.scale.set(scale, scale, scale)


const curvePoints = [];
for (let i = 0; i <= Math.PI; i += 0.1) {
  const x = i - Math.PI / 2;
  const y = Math.sin(x * 2);
  const z = 0.1;
  curvePoints.push(new THREE.Vector3(x, y, z));
}

const curvePath = new THREE.CatmullRomCurve3(curvePoints);
const curveGeometry = new THREE.TubeGeometry(
  curvePath,
  100, // tubular segments
  0.01, // thickness / radius
  8, // radial segments
  false
);
const curveMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // Yellow
const curve = new THREE.Mesh(curveGeometry, curveMaterial);

slide1GridGroup.add(sphere)
slide1GridGroup.add(sphere2)
slide1GridGroup.add(grid)
slide1GridGroup.add(curve)
