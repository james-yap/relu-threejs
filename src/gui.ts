import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import {
  BULB_POWER_OPTIONS,
  HEMI_IRRADIANCE_OPTIONS,
  type RuntimeParams,
} from './constants';
import { getCurrentStep, states, step } from './steps';

type GuiDependencies = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  params: RuntimeParams;
};

export function initGui({ scene, camera, renderer, params }: GuiDependencies) {
  const gui = new GUI();

  gui.add(params, 'hemiIrradiance', HEMI_IRRADIANCE_OPTIONS);
  gui.add(params, 'bulbPower', BULB_POWER_OPTIONS);
  gui.add(params, 'exposure', 0, 1);
  gui.add(params, 'shadows');
  gui.add(params, 'bulbDist', 0, 10);

  const stepOptions = states.map(({ description }) => description);
  let stepDropdown: { updateDisplay: () => void } | null = null;
  const stepControls = {
    currentStep: stepOptions[getCurrentStep()],
    previous: () => navigateToStep(getCurrentStep() - 1),
    next: () => navigateToStep(getCurrentStep() + 1),
  };

  const navigateToStep = (targetStep: number, updateDropdown = true) => {
    const clampedStep = THREE.MathUtils.clamp(targetStep, 0, states.length - 1);
    step(clampedStep, { scene, camera, renderer });
    stepControls.currentStep = stepOptions[clampedStep];
    if (updateDropdown) stepDropdown?.updateDisplay();
  };

  const stepFolder = gui.addFolder('Steps');
  stepDropdown = stepFolder
    .add(stepControls, 'currentStep', stepOptions)
    .name('State')
    .onChange((description: string) => {
      const targetStep = stepOptions.indexOf(description);
      if (targetStep !== -1) navigateToStep(targetStep, false);
    });
  stepFolder.add(stepControls, 'previous').name('← Previous');
  stepFolder.add(stepControls, 'next').name('Next →');

  gui.open();

  return gui;
}
