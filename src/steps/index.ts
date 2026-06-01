import * as THREE from 'three';
import gsap from "gsap"
import { DEFAULT_RUNTIME_PARAMS } from '../constants';

type StepDependencies = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
};

type StepState = {
  cameraX: number,
  cameraY: number,
  cameraZ: number,
}

const states: StepState[] = [
  {
    cameraX: DEFAULT_RUNTIME_PARAMS.startingCameraPos[0],
    cameraY: DEFAULT_RUNTIME_PARAMS.startingCameraPos[1],
    cameraZ: DEFAULT_RUNTIME_PARAMS.startingCameraPos[2]
  },
  {
    cameraX: 4.09,
    cameraY: 2.25,
    cameraZ: 3.00,
  }
]

const state = structuredClone(states[0]);

export function step(step: number, deps: StepDependencies) {
  const { camera } = deps

  gsap.to(state, {
    ...states[step],
    duration: 1,
    ease: 'expo.inOut',
    onUpdate: () => {
      camera.position.set(state.cameraX, state.cameraY, state.cameraZ)
    }
  });
}
