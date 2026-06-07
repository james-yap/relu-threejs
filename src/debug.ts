import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import {
  BULB_LUMINOUS_POWERS,
  type RuntimeParams,
} from './constants';
import { getUrlParam, writeUrlParam, URL_PARAMS } from './urlParams';

type DebugDependencies = {
  scene: THREE.Scene;
  getCamera: () => THREE.Camera;
  controls: OrbitControls;
  renderer: THREE.WebGLRenderer;
  params: RuntimeParams
};

let debugDependencies: DebugDependencies | null = null;
let isCopyMode = false;

const groupNameInput = document.querySelector('#group-input')! as HTMLInputElement;
const copyPointerButton = document.querySelector('#target-button')! as HTMLButtonElement;
const copyCameraButton = document.querySelector('#cam-button')! as HTMLButtonElement;
export const debugPanel = document.querySelector('#stats')! as HTMLDivElement;

groupNameInput.defaultValue = getUrlParam(URL_PARAMS.targetParent) ?? "";
groupNameInput.addEventListener("change", () => {
  writeUrlParam(URL_PARAMS.targetParent, groupNameInput.value || null);
})

copyPointerButton.addEventListener('click', (event) => {
  event.stopPropagation();
  isCopyMode = true;
  copyPointerButton.style.borderColor = "yellow";
});
copyCameraButton.addEventListener('click', async (event) => {
  event.stopPropagation();
  await copyCameraPosition();
});

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const pointerOnPlane = new THREE.Vector3();
const cameraWorldPos = new THREE.Vector3();
const pointerToCamera = new THREE.Vector3();
const bulbPos = new THREE.Vector3();

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

export function setDebugEnabled(enabled: boolean) {
  floorMesh.visible = enabled;
  floorGridHelper.visible = enabled;
  // if (controls) controls.enabled = enabled;
  if (!enabled) isCopyMode = false;
}

export function initDebug(dependencies: DebugDependencies) {
  debugDependencies = dependencies;

  const { getCamera, renderer, scene, params } = dependencies;


  // scene.add(bulbLight);
  scene.add(floorMesh);
  scene.add(floorGridHelper);
  setDebugEnabled(params.debug);

  renderer.domElement.addEventListener('mousemove', (event) => {
    updatePointerPosition(event, renderer, getCamera());
    updateBulbPosition();
  });

  renderer.domElement.addEventListener('pointerdown', async (event) => {
    if (!isCopyMode || event.button !== 0) return;

    updatePointerPosition(event, renderer, getCamera());
    await copyPointerPosition();
  });
}

export function renderDebug() {
  if (debugDependencies === null) return;

  const { params } = debugDependencies

  updateCameraPositionPanel(debugDependencies.getCamera());

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
  debugPanel.textContent = `Camera position
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
    const groupName = groupNameInput.value;
    const object = debugDependencies!.scene.getObjectByName(groupName);

    if (groupName && !object) {
      if (!object) throw new Error(`Object "${groupName}" not found in scene`)
    }

    await navigator.clipboard.writeText(formatPointerPosition(object));
    copyPointerButton.style.borderColor = "green";
  } catch (error) {
    copyPointerButton.style.borderColor = "red";
    console.error('Failed to copy pointer position', error);
  }

  isCopyMode = false;
  window.setTimeout(() => {
    copyPointerButton.style.removeProperty("border-color")
  }, 1200);
}

async function copyCameraPosition() {
  if (debugDependencies === null) return;

  try {
    await navigator.clipboard.writeText(formatCameraPosition(debugDependencies.getCamera(), debugDependencies.controls));
    copyCameraButton.style.borderColor = "green";
  } catch (error) {
    copyCameraButton.style.borderColor = "red";
    console.error('Failed to copy camera position', error);
  }

  window.setTimeout(() => {
    copyCameraButton.style.removeProperty("border-color")
  }, 1200);
}

function formatPointerPosition(parent?: THREE.Object3D) {
  let pos = pointerOnPlane;
  if (parent) pos = parent.worldToLocal(pointerOnPlane);
  return `${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)}`;
}

function formatCameraPosition(camera: THREE.Camera, controls: OrbitControls) {
  camera.getWorldPosition(cameraWorldPos);
  return `cameraX: ${cameraWorldPos.x.toFixed(2)},
cameraY: ${cameraWorldPos.y.toFixed(2)},
cameraZ: ${cameraWorldPos.z.toFixed(2)},
targetX: ${controls.target.x.toFixed(2)},
targetY: ${controls.target.y.toFixed(2)},
targetZ: ${controls.target.z.toFixed(2)},`;
}
