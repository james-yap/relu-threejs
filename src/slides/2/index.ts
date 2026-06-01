import * as THREE from 'three';
import { InteractionManager } from 'three/addons/interaction/InteractionManager.js';


type Slide1Dependencies = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  interactions: InteractionManager
};

export function initSlide1(_interactionDependencies: Slide1Dependencies) {}
