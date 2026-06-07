import * as THREE from 'three';

import { getIntegerUrlParam, getUrlParam, writeUrlParam, URL_PARAMS } from '../urlParams';

export function clampStep(targetStep: number, stepCount: number) {
  return THREE.MathUtils.clamp(Math.trunc(targetStep), 0, stepCount - 1);
}

export function getUrlStep(stepCount: number) {
  const stepParam = getIntegerUrlParam(URL_PARAMS.step);
  return stepParam === null ? null : clampStep(stepParam, stepCount);
}

export function writeUrlStep(targetStep: number) {
  const nextStep = String(targetStep);
  if (getUrlParam(URL_PARAMS.step) === nextStep) return;

  writeUrlParam(URL_PARAMS.step, nextStep);
}
