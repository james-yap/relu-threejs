import { StepState } from './state';

export const states = [
  new StepState({
    description: "Intro slide",
    cameraX: -4.06,
    cameraY: 2.25,
    cameraZ: 3.00,
    targetX: -4.06,
    targetY: 2.25,
    targetZ: 0,
    slide2Percentage: 0,
  }),
  new StepState({
    description: "Linear problem",
    cameraX: 4.09,
    cameraY: 2.25,
    cameraZ: 3.00,
    targetX: 4.09,
    targetY: 2.25,
    targetZ: 0,
    slide2Percentage: 0,
  }),
  new StepState({
    description: "Linear problem fit",
    cameraX: 4.09,
    cameraY: 2.25,
    cameraZ: 3.00,
    targetX: 4.09,
    targetY: 2.25,
    targetZ: 0,
    slide2Percentage: 1,
  })
]
