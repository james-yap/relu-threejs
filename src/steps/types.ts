import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import type { AppCamera } from '../camera';

export type StepDependencies = {
  scene: THREE.Scene;
  getCamera: () => AppCamera;
  controls: OrbitControls,
  renderer: THREE.WebGLRenderer;
};

