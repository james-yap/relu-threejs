import * as THREE from 'three';
import { InteractionManager } from 'three/addons/interaction/InteractionManager.js';


type InteractionDependencies = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  interactions: InteractionManager
};

let deps: InteractionDependencies | null = null;

const element = document.createElement('div');
element.id = "inter"
element.innerHTML = '<h1>Hello World!</h1>'

const planeGeometry = new THREE.PlaneGeometry(10, 10);

const material = new THREE.MeshStandardMaterial({
  roughness: 0,
  metalness: 0.5,
  transparent: true,
  // alphaTest: 0.01
});
material.map = new THREE.HTMLTexture(element);

const mesh = new THREE.Mesh(planeGeometry, material);
mesh.position.z = 0.05;

export function initInteractions(interactionDependencies: InteractionDependencies) {
  deps = interactionDependencies;
  const { scene, interactions } = deps;

  scene.add(mesh);
  interactions.add(mesh);
}
