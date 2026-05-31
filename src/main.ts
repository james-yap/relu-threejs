import * as THREE from 'three';
import { InteractionManager } from 'three/addons/interaction/InteractionManager.js';

import './style.css'
import { setupResize } from './eventListeners';
import { setupPolyfill } from './setupPolyfill'
import { debugPanel, initDebug, renderDebug } from './debug'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const interactions = new InteractionManager();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.getElementById('app')!.appendChild(renderer.domElement)

setupPolyfill(debugPanel);
setupResize(renderer, camera);

camera.position.z = 10;
camera.lookAt(0, 0, 0)

interactions.connect(renderer, camera);


function animate(_time: number) {
  renderDebug();
  interactions.update();
  renderer.render(scene, camera);
}

initDebug({ scene, camera, renderer });
