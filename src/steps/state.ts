import { globalStepTracker } from "./stepTracker";

type StepStateType = {
  // config
  description: string;
  duration: gsap.TweenValue;
  ease: gsap.EaseString | gsap.EaseFunction;

  // state
  cameraX: number;
  cameraY: number;
  cameraZ: number;
  targetX: number;
  targetY: number;
  targetZ: number;
  zoom: number;
  step: number;
}

// make duration and ease optional
type StepStateInit =
  Omit<StepStateType, 'duration' | 'ease' | 'zoom'> &
  Partial<Pick<StepStateType, 'duration' | 'ease' | 'zoom'>>;

export class StepState {
  private static totalSteps = 0;
  private _state: StepStateType;

  constructor(state: StepStateInit) {
    this._state = {
      ...state,
      duration: state.duration ?? 1,
      ease: state.ease ?? 'power2.inOut',
      zoom: state.zoom ?? 1,
    };
  }

  static registered(state: Omit<StepStateInit, 'step'>) {
    const registeredStep = new StepState({ ...state, step: StepState.totalSteps })
    StepState.totalSteps += 1;
    return registeredStep;
  }

  get description() { return this._state.description; }
  set description(description: string) { this._state.description = description; }

  get cameraX() { return this._state.cameraX; }
  set cameraX(cameraX: number) { this._state.cameraX = cameraX; }

  get cameraY() { return this._state.cameraY; }
  set cameraY(cameraY: number) { this._state.cameraY = cameraY; }

  get cameraZ() { return this._state.cameraZ; }
  set cameraZ(cameraZ: number) { this._state.cameraZ = cameraZ; }

  get targetX() { return this._state.targetX; }
  set targetX(targetX: number) { this._state.targetX = targetX; }

  get targetY() { return this._state.targetY; }
  set targetY(targetY: number) { this._state.targetY = targetY; }

  get targetZ() { return this._state.targetZ; }
  set targetZ(targetZ: number) { this._state.targetZ = targetZ; }

  get zoom() { return this._state.zoom; }
  set zoom(zoom: number) { this._state.zoom = zoom; }

  get step() { return this._state.step; }
  set step(step: number) {
    if (this._state.step === step) return;
    globalStepTracker.update(step);
    this._state.step = step;
  }

  toTweenVars() {
    return {
      ...this._state,
    }
  }

  clone() {
    return new StepState(this._state);
  }
}
