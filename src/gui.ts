import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import {
  BULB_POWER_OPTIONS,
  HEMI_IRRADIANCE_OPTIONS,
  type RuntimeParams,
} from './constants';
import { getCurrentStep, states, step } from './steps';

type GuiDependencies = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  renderer: THREE.WebGLRenderer;
  params: RuntimeParams;
};

export function initGui({ scene, camera, controls, renderer, params }: GuiDependencies) {
  const gui = new GUI();

  // const lightingFolder = gui.addFolder('Lighting');
  // lightingFolder.add(params, 'hemiIrradiance', HEMI_IRRADIANCE_OPTIONS).name('Hemi irradiance');
  // lightingFolder.add(params, 'bulbPower', BULB_POWER_OPTIONS).name('Bulb power');
  // lightingFolder.add(params, 'bulbDist', 0, 10).name('Bulb distance');

  // const renderFolder = gui.addFolder('Render');
  // renderFolder.add(params, 'exposure', 0, 1).name('Exposure');
  // renderFolder.add(params, 'shadows').name('Shadows');

  const debugFolder = gui.addFolder('Debug');
  debugFolder
    .add(params, 'debug')
    .name('Enabled')
    .onChange((enabled: boolean) => {
      const url = new URL(window.location.href);
      if (enabled) {
        url.searchParams.set('mode', 'debug');
      } else {
        url.searchParams.delete('mode');
      }
      window.location.href = url.toString();
    });

  const stepOptions = states.map(({ description }) => description);
  let stepDropdown: { updateDisplay: () => void } | null = null;
  const stepControls = {
    currentStep: stepOptions[getCurrentStep()],
    previous: () => navigateToStep(getCurrentStep() - 1),
    next: () => navigateToStep(getCurrentStep() + 1),
  };

  const navigateToStep = (targetStep: number, updateDropdown = true) => {
    const clampedStep = THREE.MathUtils.clamp(targetStep, 0, states.length - 1);
    step(clampedStep, { scene, camera, controls, renderer });
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
