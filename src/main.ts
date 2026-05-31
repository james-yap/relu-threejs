import * as THREE from 'three';
import { InteractionManager } from 'three/addons/interaction/InteractionManager.js';

import './style.css'
import { setupResize } from './eventListeners';
import { setupPolyfill } from './setupPolyfill'
import { debugPanel, initDebug, renderDebug } from './debug'
import { initInteractions } from './interactions';
import { type RuntimeParams, DEFAULT_RUNTIME_PARAMS, HEMI_LUMINOUS_IRRADIANCES } from './constants';


const params: RuntimeParams = { ...DEFAULT_RUNTIME_PARAMS };

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const interactions = new InteractionManager();
const hemiLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.02);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.getElementById('app')!.appendChild(renderer.domElement)

initDebug({ scene, camera, renderer, params });
setupPolyfill(debugPanel);
setupResize(renderer, camera);
initInteractions({ scene, camera, renderer, interactions })


scene.add(hemiLight);

camera.position.z = 5;
camera.lookAt(0, 0, 0)

interactions.connect(renderer, camera);


function animate(_time: number) {
  hemiLight.intensity = HEMI_LUMINOUS_IRRADIANCES[params.hemiIrradiance];

  renderDebug();
  interactions.update();
  renderer.render(scene, camera);
}
