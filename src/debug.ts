import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { camera, renderer, scene } from './main';

export function initDebug() {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 1;
  controls.maxDistance = 20;

  const cameraPositionPanel = document.getElementById('debug-panel');
  if (cameraPositionPanel) {
    updateCameraPositionPanel(cameraPositionPanel);
  }

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
  scene.add(bulbLight);

  const hemiLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.02);
  scene.add(hemiLight);

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
  floorMesh.rotation.x = - Math.PI / 2.0;
  scene.add(floorMesh);
}

function updateCameraPositionPanel(panel: HTMLElement) {
  const { x, y, z } = camera.position;
  panel.textContent = `Camera position\nx: ${x.toFixed(2)}\ny: ${y.toFixed(2)}\nz: ${z.toFixed(2)}`;

  requestAnimationFrame(() => updateCameraPositionPanel(panel));
}


// const raycaster = new THREE.Raycaster();
// const mouse = new THREE.Vector2();
//
// // 2. Create a mathematical plane at Z=0 to click against
// // (Change the normal vector if you are working on a different axis)
// const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
// const clickTarget = new THREE.Vector3();
//
// // 3. Listen for clicks
// window.addEventListener('click', (event) => {
//     // Normalize mouse coordinates from -1 to +1
//     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//
//     // Cast the ray from the camera
//     raycaster.setFromCamera(mouse, camera);
//
//     // Find where the ray intersects the Z=0 plane
//     raycaster.ray.intersectPlane(plane, clickTarget);
//
//     if (clickTarget) {
//         console.log(`%c📍 Clicked Coords: x: ${clickTarget.x.toFixed(2)}, y: ${clickTarget.y.toFixed(2)}, z: ${clickTarget.z.toFixed(2)}`, 'color: #00ff00; font-weight: bold;');
//     }
// });
