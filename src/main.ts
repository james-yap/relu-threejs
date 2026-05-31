import * as THREE from 'three';

import './style.css'
import './eventListeners';
import './setupPolyfill'
import { initDebug, renderDebug } from './debug'

export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

export const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.getElementById('app')!.appendChild(renderer.domElement)

camera.position.z = 10;
camera.lookAt(0, 0, 0)

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

function animate(time: number) {
  cube.rotation.x = time / 2000;
  cube.rotation.y = time / 1000;

  renderer.render(scene, camera);
  renderDebug();
}

initDebug();
