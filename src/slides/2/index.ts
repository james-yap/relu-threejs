import * as THREE from 'three';
import { InteractionManager } from 'three/addons/interaction/InteractionManager.js';


type Slide1Dependencies = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  interactions: InteractionManager
};

let deps: Slide1Dependencies | null = null;

export function initSlide1(interactionDependencies: Slide1Dependencies) {
  deps = interactionDependencies;
  const { scene, interactions } = deps;
}
