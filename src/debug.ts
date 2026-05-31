import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import {
  BULB_LUMINOUS_POWERS,
  BULB_POWER_OPTIONS,
  DEBUG,
  DEFAULT_DEBUG_PARAMS,
  HEMI_IRRADIANCE_OPTIONS,
  HEMI_LUMINOUS_IRRADIANCES,
} from './constants';
import type { DebugParams } from './constants';
import { camera, renderer, scene } from './main';

const params: DebugParams = { ...DEFAULT_DEBUG_PARAMS };


const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const pointerOnPlane = new THREE.Vector3();
const cameraWorldPos = new THREE.Vector3();
const pointerToCamera = new THREE.Vector3();
const bulbPos = new THREE.Vector3();

const floorMat = new THREE.MeshStandardMaterial({
  roughness: 0.8,
  color: 0xffffff,
  metalness: 0.2,
  bumpScale: 1
});
const textureLoader = new THREE.TextureLoader();
textureLoader.load('textures/hardwood2_diffuse.jpg', function (map) {

  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = 4;
  map.repeat.set(10, 24);
  map.colorSpace = THREE.SRGBColorSpace;
  floorMat.map = map;
  floorMat.needsUpdate = true;

});
textureLoader.load('textures/hardwood2_bump.jpg', function (map) {

  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = 4;
  map.repeat.set(10, 24);
  floorMat.bumpMap = map;
  floorMat.needsUpdate = true;

});
textureLoader.load('textures/hardwood2_roughness.jpg', function (map) {

  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = 4;
  map.repeat.set(10, 24);
  floorMat.roughnessMap = map;
  floorMat.needsUpdate = true;

});

const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMesh = new THREE.Mesh(floorGeometry, floorMat);
floorMesh.receiveShadow = true;
// floorMesh.rotation.x = - Math.PI / 2.0;


const bulbGeometry = new THREE.SphereGeometry(0.02, 16, 8);
const bulbLight = new THREE.PointLight(0xffee88, 1, 100, 2);

const bulbMat = new THREE.MeshStandardMaterial({
  emissive: 0xffffee,
  emissiveIntensity: 1,
  color: 0x000000
});
bulbLight.add(new THREE.Mesh(bulbGeometry, bulbMat));
bulbLight.position.set(0, 2, 0);
bulbLight.castShadow = true;


const hemiLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.02);

export function initDebug() {
  if (!DEBUG) return;

  const gui = new GUI();
  gui.add(params, 'hemiIrradiance', HEMI_IRRADIANCE_OPTIONS);
  gui.add(params, 'bulbPower', BULB_POWER_OPTIONS);
  gui.add(params, 'exposure', 0, 1);
  gui.add(params, 'shadows');
  gui.add(params, 'bulbDist', 0, 10);
  gui.open();

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 1;
  controls.maxDistance = 20;

  scene.add(bulbLight);
  scene.add(hemiLight);
  scene.add(floorMesh);

  window.addEventListener('mousemove', (event) => {
    // Normalize mouse coordinates from -1 to +1
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);

    const hits = raycaster.intersectObject(floorMesh);

    if (hits.length > 0) pointerOnPlane.copy(hits[0].point)
    pointerToCamera.subVectors(cameraWorldPos, pointerOnPlane).normalize().multiplyScalar(params.bulbDist);
    bulbPos.addVectors(pointerOnPlane, pointerToCamera)
    bulbLight.position.copy(bulbPos)
  });
}

export function renderDebug() {
  if (!DEBUG) return;

  updateCameraPositionPanel();

  bulbLight.power = BULB_LUMINOUS_POWERS[params.bulbPower];
  bulbMat.emissiveIntensity = bulbLight.intensity / Math.pow(0.02, 2.0); // convert from intensity to irradiance at bulb surface
  hemiLight.intensity = HEMI_LUMINOUS_IRRADIANCES[params.hemiIrradiance];
}

function updateCameraPositionPanel() {
  camera.getWorldPosition(cameraWorldPos);

  const panel = document.getElementById('debug-panel')!
  const { x, y, z } = cameraWorldPos;
  panel.textContent = `Camera position
x: ${x.toFixed(2)}
y: ${y.toFixed(2)}
z: ${z.toFixed(2)}

Mouse position
x: ${pointerOnPlane.x.toFixed(2)}
y: ${pointerOnPlane.y.toFixed(2)}
z: ${pointerOnPlane.z.toFixed(2)}`;
}
