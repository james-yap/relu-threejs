import { getBooleanUrlParam, writeUrlParam, URL_PARAMS } from '../urlParams';

export function getUrlControlsEnabled() {
  return getBooleanUrlParam(URL_PARAMS.controls);
}

export function writeUrlControlsEnabled(isControlsEnabled: boolean) {
  writeUrlParam(URL_PARAMS.controls, isControlsEnabled ? 'true' : null);
}
