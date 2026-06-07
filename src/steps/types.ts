import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export type StepDependencies = {
  scene: THREE.Scene;
  getCamera: () => THREE.Camera;
  controls: OrbitControls,
  renderer: THREE.WebGLRenderer;
};

