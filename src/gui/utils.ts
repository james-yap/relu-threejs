const IS_CONTROLS_ENABLED_PARAM = 'controls';

export function getUrlControlsEnabled() {
  const param = new URLSearchParams(window.location.search).get(IS_CONTROLS_ENABLED_PARAM);
  return Boolean(param);
}

export function writeUrlControlsEnabled(isControlsEnabled: boolean) {
  const url = new URL(window.location.href);
  if (isControlsEnabled) {
    url.searchParams.set(IS_CONTROLS_ENABLED_PARAM, String(isControlsEnabled));
  } else {
    url.searchParams.delete(IS_CONTROLS_ENABLED_PARAM);
  }

  window.history.replaceState(window.history.state, '', url);
}
