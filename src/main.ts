import * as THREE from 'three';
import { InteractionManager } from 'three/addons/interaction/InteractionManager.js';

import './style.css'
import { setupResize } from './eventListeners';
import { setupPolyfill } from './setupPolyfill'
import { debugPanel, initDebug, renderDebug } from './debug'
import { renderMath } from './mathjax';
import { initSlide1 } from './slides/1';
import { type RuntimeParams, DEFAULT_RUNTIME_PARAMS, HEMI_LUMINOUS_IRRADIANCES } from './constants';
import { step } from './steps';

declare global {
  interface Window {
    step: (targetStep: number) => void;
  }
}

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

setInterval(renderMath, 1000);

scene.add(hemiLight);

camera.position.set(...params.startingCameraPos)
camera.lookAt(...params.startingCameraPos)

interactions.connect(renderer, camera);


function animate(_time: number) {
  hemiLight.intensity = HEMI_LUMINOUS_IRRADIANCES[params.hemiIrradiance];

  renderDebug();
  interactions.update();
  renderer.render(scene, camera);
}

initSlide1({ scene, camera, renderer, interactions })

window.step = (targetStep) => step(targetStep, { camera, renderer, scene })

