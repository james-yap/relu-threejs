import * as THREE from 'three';
import { InteractionManager } from 'three/addons/interaction/InteractionManager.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import './style.css'
import { setupResize } from './eventListeners';
import { setupPolyfill } from './setupPolyfill'
import { debugPanel, initDebug, renderDebug } from './debug'
import { initSlide1 } from './slides/1';
import { type RuntimeParams, DEFAULT_RUNTIME_PARAMS, HEMI_LUMINOUS_IRRADIANCES } from './constants';
import { initGui } from './gui';
import { getStartingState } from './steps';
import { initSlide2 } from './slides/2';
import { initSlide3 } from './slides/3';

const params: RuntimeParams = { ...DEFAULT_RUNTIME_PARAMS };

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const interactions = new InteractionManager();
const hemiLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.02);

const startingState = getStartingState();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.getElementById('app')!.appendChild(renderer.domElement)


const startingCameraPos: [number, number, number] = [startingState.cameraX, startingState.cameraY, startingState.cameraZ]
const startingTarget: [number, number, number] = [startingState.targetX, startingState.targetY, startingState.targetZ]

const controls = new OrbitControls(camera, renderer.domElement);
controls.enabled = params.debug;
controls.minDistance = 1;
controls.maxDistance = 20;

initDebug({ scene, camera, controls, renderer, params });
initGui({ scene, camera, controls, renderer, params });
setupPolyfill(debugPanel);
setupResize(renderer, camera);

scene.add(hemiLight);

camera.position.set(...startingCameraPos)
controls.target.set(...startingTarget)
controls.update()
camera.lookAt(...startingTarget)

interactions.connect(renderer, camera);


function animate(_time: number) {
  hemiLight.intensity = HEMI_LUMINOUS_IRRADIANCES[params.hemiIrradiance];
  renderer.toneMappingExposure = params.exposure;
  renderer.shadowMap.enabled = params.shadows;

  renderDebug();
  interactions.update();
  renderer.render(scene, camera);
}

initSlide1({ scene, interactions })
initSlide2({ scene, interactions })
initSlide3({ scene, interactions })

