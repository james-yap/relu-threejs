import gsap from "gsap"

import { DEFAULT_RUNTIME_PARAMS } from '../constants';
import { states } from './steps';
import type { StepDependencies } from './types';
import { clampStep, getUrlStep, writeUrlStep } from './utils';

export { states };

let currentStep = getUrlStep(states.length) ?? clampStep(DEFAULT_RUNTIME_PARAMS.startingStep, states.length);
const state = states[currentStep].clone();
let activeTween: gsap.core.Tween | null = null;

export function getStartingState() {
  return states[currentStep];
}

export function getCurrentStep() {
  return currentStep;
}

export function step(targetStep: number, deps: StepDependencies) {
  const nextStep = clampStep(targetStep, states.length);
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
