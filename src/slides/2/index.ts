import * as THREE from 'three';
import { slide2Group } from './grid';
import { slide2XLabel } from './xLabel';
import { slide2YLabel } from './yLabel';

type Slide2Dependencies = {
  scene: THREE.Scene;
};

export function initSlide2(deps: Slide2Dependencies) {
  const { scene } = deps;

  scene.add(slide2Group);
  scene.add(slide2XLabel)
  scene.add(slide2YLabel)
}
