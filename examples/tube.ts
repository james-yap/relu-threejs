import * as THREE from 'three';

// 1. Setup Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Add Grid Helper (Plane)
const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
gridHelper.position.y = -0.01; // slightly below 0 to avoid overlapping axes
scene.add(gridHelper);

// 3. Create Cartesian Axes
function createAxes() {
  const axesGroup = new THREE.Group();

  // Define axis endpoints
  const pointsX = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(10, 0, 0)];
  const pointsY = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 10, 0)];
  const pointsZ = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 10)];

  // Define colors (RGB -> XYZ)
  const materialX = new THREE.LineBasicMaterial({ color: 0xff0000 }); // Red
  const materialY = new THREE.LineBasicMaterial({ color: 0x00ff00 }); // Green
  const materialZ = new THREE.LineBasicMaterial({ color: 0x0000ff }); // Blue

  // Create line segments
  axesGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pointsX), materialX));
  axesGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pointsY), materialY));
  axesGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pointsZ), materialZ));

  return axesGroup;
}
scene.add(createAxes());

// 4. Plot a Mathematical Curve ($y = \sin(x)$)
const curvePoints = [];
for (let i = 0; i <= 10; i += 0.1) {
  const x = i;
  const y = Math.sin(x);
  const z = 0;
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
const curveMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // Yellow
const curve = new THREE.Mesh(curveGeometry, curveMaterial);
scene.add(curve);

// 5. Camera Position
camera.position.set(5, 5, 10);
camera.lookAt(0, 0, 0);

// 6. Animation Loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

