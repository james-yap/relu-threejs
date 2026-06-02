import * as THREE from 'three';
import { slide3Title } from './title';
import { slide3Group } from './group';
import type { InteractionManager } from 'three/examples/jsm/interaction/InteractionManager.js';
import { slide3W } from './multipliers';

type Slide3Dependencies = {
  scene: THREE.Scene;
  interactions: InteractionManager;
};

export function initSlide3(deps: Slide3Dependencies) {
  const { scene } = deps;

  scene.add(slide3Title)
  scene.add(slide3Group)
  scene.add(slide3W)
}
