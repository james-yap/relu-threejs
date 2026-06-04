import type { SlideDeps } from '../types';
import { initSlide3Group } from './group';
import { initSlide3Multipliers } from './multipliers';
import { initSlide3Title } from './title';

export function initSlide3(deps: SlideDeps) {
  initSlide3Title(deps);
  initSlide3Group(deps);
  initSlide3Multipliers(deps);

}
