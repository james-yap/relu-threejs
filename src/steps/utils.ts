import * as THREE from 'three';

const STEP_SEARCH_PARAM = 'step';

export function clampStep(targetStep: number, stepCount: number) {
  return THREE.MathUtils.clamp(Math.trunc(targetStep), 0, stepCount - 1);
}

export function getUrlStep(stepCount: number) {
  const stepParam = new URLSearchParams(window.location.search).get(STEP_SEARCH_PARAM);
  if (stepParam === null) return null;

  const parsedStep = Number(stepParam);
  return Number.isInteger(parsedStep) ? clampStep(parsedStep, stepCount) : null;
}

export function writeUrlStep(targetStep: number) {
  const url = new URL(window.location.href);
  const nextStep = String(targetStep);
  if (url.searchParams.get(STEP_SEARCH_PARAM) === nextStep) return;

  url.searchParams.set(STEP_SEARCH_PARAM, nextStep);
  window.history.replaceState(window.history.state, '', url);
}
