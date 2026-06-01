import * as THREE from 'three';
import { slide3Title } from './title';
import { slide3Group } from './group';

type Slide3Dependencies = {
  scene: THREE.Scene;
};

export function initSlide3(deps: Slide3Dependencies) {
  const { scene } = deps;

  scene.add(slide3Title)
  scene.add(slide3Group)
}
