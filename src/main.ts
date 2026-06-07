import * as THREE from 'three';
import { InteractionManager } from 'three/addons/interaction/InteractionManager.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';

import './style.css'
import './icons'
import { setupResize } from './eventListeners';
import { setupPolyfill } from './setupPolyfill'
import { debugPanel, initDebug, renderDebug } from './debug'
import { initSlide1 } from './slides/1';
import { type CameraMode, type RuntimeParams, DEFAULT_RUNTIME_PARAMS, HEMI_LUMINOUS_IRRADIANCES } from './constants';
import { initGui } from './gui';
import { getStartingState } from './steps';
import { initSlide2 } from './slides/2';
import { initSlide3 } from './slides/3';
import { renderBeams } from './slides/3/group';
import { initSlide4 } from './slides/4';
import { initSlide5 } from './slides/5';
import { renderBeam5 } from './slides/5/neuron';
import { createAppCamera, syncCameraTransform, type AppCamera } from './camera';
import { writeUrlParam, URL_PARAMS } from './urlParams';

const params: RuntimeParams = { ...DEFAULT_RUNTIME_PARAMS };

const scene = new THREE.Scene();
let cameraMode: CameraMode = params.cameraMode;
let camera: AppCamera = createAppCamera(cameraMode);
const getCamera = () => camera;
const interactions = new InteractionManager();
const hemiLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.02);

const startingState = getStartingState();
const app = document.getElementById('app')!;

const renderer = new THREE.WebGLRenderer();
renderer.domElement.className = 'absolute inset-0 z-0';
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
app.appendChild(renderer.domElement)

const cssRenderer = new CSS3DRenderer();
cssRenderer.domElement.className = 'absolute inset-0 z-[1] pointer-events-none';
cssRenderer.setSize(window.innerWidth, window.innerHeight);
app.appendChild(cssRenderer.domElement)


const startingCameraPos: [number, number, number] = [startingState.cameraX, startingState.cameraY, startingState.cameraZ]
const startingTarget: [number, number, number] = [startingState.targetX, startingState.targetY, startingState.targetZ]

const controls = new OrbitControls(camera, renderer.domElement);
controls.enabled = params.isControlsEnabled;
controls.minDistance = 1;
controls.maxDistance = 20;

initDebug({ scene, getCamera, controls, renderer, params });
initGui({ scene, getCamera, controls, renderer, params, setCameraMode });
setupPolyfill(debugPanel);
setupResize(getCamera, [renderer, cssRenderer]);

scene.add(hemiLight);

camera.position.set(...startingCameraPos)
camera.zoom = startingState.zoom;
camera.updateProjectionMatrix();
controls.target.set(...startingTarget)
controls.update()
camera.lookAt(...startingTarget)

interactions.connect(renderer, camera);

function setCameraMode(mode: CameraMode) {
  if (mode === cameraMode) return;

  const nextCamera = createAppCamera(mode);
  syncCameraTransform(camera, nextCamera);
  camera = nextCamera;
  cameraMode = mode;
  params.cameraMode = mode;

  controls.object = camera;
  controls.update();
  interactions.connect(renderer, camera);
  writeUrlParam(URL_PARAMS.camera, mode);
}

function animate(_time: number) {
  hemiLight.intensity = HEMI_LUMINOUS_IRRADIANCES[params.hemiIrradiance];
  renderer.toneMappingExposure = params.exposure;
  renderer.shadowMap.enabled = params.shadows;

  renderBeams();
  renderBeam5();

  renderDebug();
  interactions.update();
  renderer.render(scene, camera);
  cssRenderer.render(scene, camera);
}

initSlide1({ scene, interactions })
initSlide2({ scene, interactions })
initSlide3({ scene, interactions })
initSlide4({ scene, interactions })
initSlide5({ scene, interactions, renderer })

