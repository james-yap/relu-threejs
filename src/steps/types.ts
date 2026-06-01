import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export type StepDependencies = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls,
  renderer: THREE.WebGLRenderer;
};

export type StepState = {
  description: string;
  cameraX: number,
  cameraY: number,
  cameraZ: number,
  targetX: number,
  targetY: number,
  targetZ: number,
}
