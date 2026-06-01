import { updateSlide2Percentage } from "../slides/2/grid";

type StepStateType = {
  // config
  description: string;
  duration: number;
  ease: string;

  // state
  cameraX: number;
  cameraY: number;
  cameraZ: number;
  targetX: number;
  targetY: number;
  targetZ: number;
  slide2Percentage: number;
}

// make duration and ease optional
type StepStateInit =
  Omit<StepStateType, 'duration' | 'ease'> &
  Partial<Pick<StepStateType, 'duration' | 'ease'>>;

export class StepState {
  private _state: StepStateType;

  constructor(state: StepStateInit) {
    this._state = {
      ...state,
      duration: state.duration ?? 1,
      ease: state.ease ?? 'expo.inOut',
    };
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

  get slide2Percentage() { return this._state.slide2Percentage; }
  set slide2Percentage(slide2Percentage: number) {
    if (this._state.slide2Percentage === slide2Percentage) return;
    updateSlide2Percentage(slide2Percentage);
    this._state.slide2Percentage = slide2Percentage;
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
