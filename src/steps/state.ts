export class StepState {
  private _state: {
    description: string;
    cameraX: number;
    cameraY: number;
    cameraZ: number;
    targetX: number;
    targetY: number;
    targetZ: number;
  };

  constructor(state: {
    description: string;
    cameraX: number;
    cameraY: number;
    cameraZ: number;
    targetX: number;
    targetY: number;
    targetZ: number;
  }) {
    this._state = { ...state };
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

  clone() {
    return new StepState(this._state);
  }
}
