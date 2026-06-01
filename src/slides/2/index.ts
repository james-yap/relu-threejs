import * as THREE from 'three';
import { slide2Group } from './grid';

type Slide2Dependencies = {
  scene: THREE.Scene;
};

export function initSlide2(deps: Slide2Dependencies) {
  const { scene } = deps;

  scene.add(slide2Group);
}
