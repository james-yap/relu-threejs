import * as THREE from 'three';
import type { InteractionManager } from 'three/examples/jsm/interaction/InteractionManager.js';

export type SlideDeps = {
  scene: THREE.Scene;
  interactions: InteractionManager;
};
