import * as THREE from 'three';
import gsap from "gsap"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { DEFAULT_RUNTIME_PARAMS } from '../constants';

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

export const states: StepState[] = [
  {
    description: "Intro slide",
    cameraX: -4.06,
    cameraY: 2.25,
    cameraZ: 3.00,
    targetX: -4.06,
    targetY: 2.25,
    targetZ: 0,
  },
  {
    description: "Linear problem",
    cameraX: 4.09,
    cameraY: 2.25,
    cameraZ: 3.00,
    targetX: 4.09,
    targetY: 2.25,
    targetZ: 0,
  }
]

const STEP_SEARCH_PARAM = 'step';

function clampStep(targetStep: number) {
  return THREE.MathUtils.clamp(Math.trunc(targetStep), 0, states.length - 1);
}

function getUrlStep() {
  const stepParam = new URLSearchParams(window.location.search).get(STEP_SEARCH_PARAM);
  if (stepParam === null) return null;

  const parsedStep = Number(stepParam);
  return Number.isInteger(parsedStep) ? clampStep(parsedStep) : null;
}

function writeUrlStep(targetStep: number) {
  const url = new URL(window.location.href);
  const nextStep = String(targetStep);
  if (url.searchParams.get(STEP_SEARCH_PARAM) === nextStep) return;

  url.searchParams.set(STEP_SEARCH_PARAM, nextStep);
  window.history.replaceState(window.history.state, '', url);
}

let currentStep = getUrlStep() ?? clampStep(DEFAULT_RUNTIME_PARAMS.startingStep);
const state = structuredClone(states[currentStep]);
let activeTween: gsap.core.Tween | null = null;

export function getStartingState() {
  return states[currentStep];
}

export function getCurrentStep() {
  return currentStep;
}

export function step(targetStep: number, deps: StepDependencies) {
  const nextStep = clampStep(targetStep);
  const targetState = states[nextStep];
  if (!targetState) return;

  const { camera, controls } = deps
  currentStep = nextStep;
  writeUrlStep(nextStep);
  activeTween?.kill();

  activeTween = gsap.to(state, {
    cameraX: targetState.cameraX,
    cameraY: targetState.cameraY,
    cameraZ: targetState.cameraZ,
    targetX: targetState.targetX,
    targetY: targetState.targetY,
    targetZ: targetState.targetZ,
    duration: 1,
    ease: 'expo.inOut',
    onUpdate: () => {
      camera.position.set(state.cameraX, state.cameraY, state.cameraZ);
      controls.target.set(state.targetX, state.targetY, state.targetZ);
      controls.update();
      camera.lookAt(state.targetX, state.targetY, state.targetZ);
    }
  });
}
