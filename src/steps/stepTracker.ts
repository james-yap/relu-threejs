import { getIntegerUrlParam, URL_PARAMS } from '../urlParams';

type StepCallback = (percentage: number) => void;

class StepTracker {
  private _updators: Map<number, StepCallback[]>;

  constructor() {
    this._updators = new Map();
  }

  update(step: number) {
    const updators = this._updators;
    const targetStep = Math.ceil(step);
    if (!updators.has(targetStep)) return;
    updators.get(targetStep)!.forEach(callback => {
      callback(1 - (targetStep - step))
    })
  }

  registerUpdator(targetStep: number, callback: StepCallback) {
    // run once from query params
    const defaultStep = getIntegerUrlParam(URL_PARAMS.step, 0) ?? 0;
    callback(targetStep <= defaultStep ? 1 : 0);

    const updators = this._updators;
    if (!updators.has(targetStep)) updators.set(targetStep, []);
    updators.get(targetStep)!.push(callback);
  }
}

export const globalStepTracker = new StepTracker();
