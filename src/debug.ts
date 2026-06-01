import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import {
  BULB_LUMINOUS_POWERS,
  BULB_POWER_OPTIONS,
  DEBUG,
  HEMI_IRRADIANCE_OPTIONS,
  type RuntimeParams,
} from './constants';
import { renderMath } from './mathjax';
import { getCurrentStep, states, step } from './steps';

type DebugDependencies = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  params: RuntimeParams
};

let debugDependencies: DebugDependencies | null = null;
export const debugPanel = document.getElementById('debug-panel')!;
const debugStats = document.createElement('div');
const copyPointerButton = document.createElement('button');
const copyCameraButton = document.createElement('button');
const renderMathButton = document.createElement('button');
let isCopyMode = false;
copyPointerButton.type = 'button';
copyPointerButton.className = 'debug-panel-copy';
copyPointerButton.textContent = 'Enter copy mode';
copyPointerButton.addEventListener('click', (event) => {
  event.stopPropagation();
  isCopyMode = true;
  copyPointerButton.textContent = 'Click floor to copy';
});
copyCameraButton.type = 'button';
copyCameraButton.className = 'debug-panel-copy';
copyCameraButton.textContent = 'Copy camera';
copyCameraButton.addEventListener('click', async (event) => {
  event.stopPropagation();
  await copyCameraPosition();
});
renderMathButton.type = 'button';
renderMathButton.className = 'debug-panel-copy';
renderMathButton.textContent = 'Render math';
renderMathButton.addEventListener('click', async (event) => {
  event.stopPropagation();
  await renderMath();
});
debugPanel.appendChild(debugStats);
debugPanel.appendChild(copyPointerButton);
debugPanel.appendChild(copyCameraButton);
debugPanel.appendChild(renderMathButton);
debugPanel.hidden = !DEBUG;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const pointerOnPlane = new THREE.Vector3();
const cameraWorldPos = new THREE.Vector3();
const pointerToCamera = new THREE.Vector3();
const bulbPos = new THREE.Vector3();

// const floorMat = new THREE.MeshStandardMaterial({
//   roughness: 0.8,
//   color: 0xffffff,
//   metalness: 0.2,
//   bumpScale: 1
// });
// const textureLoader = new THREE.TextureLoader();
// textureLoader.load('textures/hardwood2_diffuse.jpg', function (map) {
//
//   map.wrapS = THREE.RepeatWrapping;
//   map.wrapT = THREE.RepeatWrapping;
//   map.anisotropy = 4;
//   map.repeat.set(10, 24);
//   map.colorSpace = THREE.SRGBColorSpace;
//   floorMat.map = map;
//   floorMat.needsUpdate = true;
//
// });
// textureLoader.load('textures/hardwood2_bump.jpg', function (map) {
//
//   map.wrapS = THREE.RepeatWrapping;
//   map.wrapT = THREE.RepeatWrapping;
//   map.anisotropy = 4;
//   map.repeat.set(10, 24);
//   floorMat.bumpMap = map;
//   floorMat.needsUpdate = true;
//
// });
// textureLoader.load('textures/hardwood2_roughness.jpg', function (map) {
//
//   map.wrapS = THREE.RepeatWrapping;
//   map.wrapT = THREE.RepeatWrapping;
//   map.anisotropy = 4;
//   map.repeat.set(10, 24);
//   floorMat.roughnessMap = map;
//   floorMat.needsUpdate = true;
//
// });
const floorMat = new THREE.MeshBasicMaterial({
  transparent: true,
  opacity: 0,
  depthWrite: false
});

const FLOOR_SIZE = 50;
const GRID_SIZE = 50;
const GRID_CELL_SIZE = 0.5;
const GRID_Z_OFFSET = 0.01;
const floorGeometry = new THREE.PlaneGeometry(FLOOR_SIZE, FLOOR_SIZE);
const floorMesh = new THREE.Mesh(floorGeometry, floorMat);
floorMesh.receiveShadow = true;
// floorMesh.rotation.x = - Math.PI / 2.0;
const floorGridHelperBase = new THREE.GridHelper(
  GRID_SIZE,
  Math.round(GRID_SIZE / GRID_CELL_SIZE),
  0x00ffff,
  0x226666
);
const floorGridHelperGeometry = new LineSegmentsGeometry().fromLineSegments(floorGridHelperBase);
const floorGridHelperMaterial = new LineMaterial({
  color: 0x58C4DD,
  linewidth: 5, // Thickness in pixels!
  resolution: new THREE.Vector2(window.innerWidth, window.innerHeight) // Required
});
const floorGridHelper = new LineSegments2(floorGridHelperGeometry, floorGridHelperMaterial)
floorGridHelper.rotation.x = Math.PI / 2; // rotates the Local Axes (locally, plane still in XZ)
floorGridHelper.position.z = GRID_Z_OFFSET;
floorGridHelper.scale.set(16, 1, 9) // scales in the Local Axes


const bulbGeometry = new THREE.SphereGeometry(0.02, 16, 8);
const bulbLight = new THREE.PointLight(0xffee88, 1, 100, 2);

const bulbMat = new THREE.MeshStandardMaterial({
  emissive: 0xffffee,
  emissiveIntensity: 1,
  color: 0x000000
});
bulbLight.add(new THREE.Mesh(bulbGeometry, bulbMat));
bulbLight.position.set(0, 0, 5);
bulbLight.castShadow = true;



export function initDebug(dependencies: DebugDependencies) {
  debugDependencies = dependencies;

  if (!DEBUG) return;

  const { camera, renderer, scene, params } = dependencies;

  const gui = new GUI();
  gui.add(params, 'hemiIrradiance', HEMI_IRRADIANCE_OPTIONS);
  gui.add(params, 'bulbPower', BULB_POWER_OPTIONS);
  gui.add(params, 'exposure', 0, 1);
  gui.add(params, 'shadows');
  gui.add(params, 'bulbDist', 0, 10);

  const stepOptions = states.map(({ description }) => description);
  let stepDropdown: { updateDisplay: () => void } | null = null;
  const navigateToStep = (targetStep: number, updateDropdown = true) => {
    const clampedStep = THREE.MathUtils.clamp(targetStep, 0, states.length - 1);
    step(clampedStep, { scene, camera, renderer });
    stepControls.currentStep = stepOptions[clampedStep];
    if (updateDropdown) stepDropdown?.updateDisplay();
  };
  const stepControls = {
    currentStep: stepOptions[getCurrentStep()],
    previous: () => navigateToStep(getCurrentStep() - 1),
    next: () => navigateToStep(getCurrentStep() + 1),
  };
  const stepFolder = gui.addFolder('Steps');
  stepDropdown = stepFolder
    .add(stepControls, 'currentStep', stepOptions)
    .name('State')
    .onChange((description: string) => {
      const targetStep = stepOptions.indexOf(description);
      if (targetStep !== -1) navigateToStep(targetStep, false);
    });
  stepFolder.add(stepControls, 'previous').name('← Previous');
  stepFolder.add(stepControls, 'next').name('Next →');

  gui.open();

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 1;
  controls.maxDistance = 20;
  controls.target.set(params.startingCameraPos[0], params.startingCameraPos[1], 0)
  controls.update()

  // scene.add(bulbLight);
  scene.add(floorMesh);
  scene.add(floorGridHelper);

  renderer.domElement.addEventListener('mousemove', (event) => {
    updatePointerPosition(event, renderer, camera);
    updateBulbPosition();
  });

  renderer.domElement.addEventListener('pointerdown', async (event) => {
    if (!isCopyMode || event.button !== 0) return;

    updatePointerPosition(event, renderer, camera);
    await copyPointerPosition();
  });
}

export function renderDebug() {
  if (!DEBUG || debugDependencies === null) return;

  const { params } = debugDependencies

  updateCameraPositionPanel(debugDependencies.camera);

  debugDependencies.renderer.toneMappingExposure = params.exposure;
  debugDependencies.renderer.shadowMap.enabled = params.shadows;
  bulbLight.castShadow = params.shadows;
  floorMesh.receiveShadow = params.shadows;

  bulbLight.power = BULB_LUMINOUS_POWERS[params.bulbPower];
  bulbMat.emissiveIntensity = bulbLight.intensity / Math.pow(0.02, 2.0); // convert from intensity to irradiance at bulb surface
}

function updateCameraPositionPanel(camera: THREE.Camera) {
  camera.getWorldPosition(cameraWorldPos);

  const { x, y, z } = cameraWorldPos;
  debugStats.textContent = `Camera position
x: ${x.toFixed(2)}
y: ${y.toFixed(2)}
z: ${z.toFixed(2)}

Pointer position
x: ${pointerOnPlane.x.toFixed(2)}
y: ${pointerOnPlane.y.toFixed(2)}
z: ${pointerOnPlane.z.toFixed(2)}`;
}

function updatePointerPosition(event: MouseEvent, renderer: THREE.WebGLRenderer, camera: THREE.Camera) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);

  const hits = raycaster.intersectObject(floorMesh);
  if (hits.length > 0) pointerOnPlane.copy(hits[0].point);
}

function updateBulbPosition() {
  if (debugDependencies === null) return;

  const { params } = debugDependencies;
  pointerToCamera.subVectors(cameraWorldPos, pointerOnPlane).normalize().multiplyScalar(params.bulbDist);
  bulbPos.addVectors(pointerOnPlane, pointerToCamera);
  bulbLight.position.copy(bulbPos);
}

async function copyPointerPosition() {
  try {
    await navigator.clipboard.writeText(formatPointerPosition());
    copyPointerButton.textContent = 'Copied!';
  } catch (error) {
    console.error('Failed to copy pointer position', error);
    copyPointerButton.textContent = 'Copy failed';
  }

  isCopyMode = false;
  window.setTimeout(() => {
    copyPointerButton.textContent = 'Enter copy mode';
  }, 1200);
}

async function copyCameraPosition() {
  if (debugDependencies === null) return;

  try {
    await navigator.clipboard.writeText(formatCameraPosition(debugDependencies.camera));
    copyCameraButton.textContent = 'Copied camera!';
  } catch (error) {
    console.error('Failed to copy camera position', error);
    copyCameraButton.textContent = 'Copy failed';
  }

  window.setTimeout(() => {
    copyCameraButton.textContent = 'Copy camera';
  }, 1200);
}

function formatPointerPosition() {
  return `${pointerOnPlane.x.toFixed(2)}, ${pointerOnPlane.y.toFixed(2)}, ${pointerOnPlane.z.toFixed(2)}`;
}

function formatCameraPosition(camera: THREE.Camera) {
  camera.getWorldPosition(cameraWorldPos);
  return `${cameraWorldPos.x.toFixed(2)}, ${cameraWorldPos.y.toFixed(2)}, ${cameraWorldPos.z.toFixed(2)}`;
}
