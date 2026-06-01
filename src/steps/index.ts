import * as THREE from 'three';
import gsap from "gsap"
import { DEFAULT_RUNTIME_PARAMS } from '../constants';

export type StepDependencies = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
};

export type StepState = {
  description: string;
  cameraX: number,
  cameraY: number,
  cameraZ: number,
}

export const states: StepState[] = [
  {
    description: "Intro slide",
    cameraX: -4.06,
    cameraY: 2.25,
    cameraZ: 3.00
  },
  {
    description: "Linear problem",
    cameraX: 4.09,
    cameraY: 2.25,
    cameraZ: 3.00,
  }
]

const state = structuredClone(states[0]);
let currentStep = 0;
let activeTween: gsap.core.Tween | null = null;

export function getStartingState() {
  return states[DEFAULT_RUNTIME_PARAMS.startingStep];
}

export function getCurrentStep() {
  return currentStep;
}

export function step(targetStep: number, deps: StepDependencies) {
  const targetState = states[targetStep];
  if (!targetState) return;

  const { camera } = deps
  currentStep = targetStep;
  activeTween?.kill();

  activeTween = gsap.to(state, {
    cameraX: targetState.cameraX,
    cameraY: targetState.cameraY,
    cameraZ: targetState.cameraZ,
    duration: 1,
    ease: 'expo.inOut',
    onUpdate: () => {
      camera.position.set(state.cameraX, state.cameraY, state.cameraZ)
    }
  });
}
