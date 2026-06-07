export const URL_PARAMS = {
  camera: 'camera',
  controls: 'controls',
  mode: 'mode',
  step: 'step',
  targetParent: 'targetParent',
} as const;

type UrlParamValue = string | number | boolean | null | undefined;

type WriteUrlParamsOptions = {
  reload?: boolean;
};

function getCurrentUrl() {
  return new URL(window.location.href);
}

export function getUrlParam(name: string) {
  return new URLSearchParams(window.location.search).get(name);
}

export function getBooleanUrlParam(name: string, defaultValue = false) {
  const value = getUrlParam(name);
  if (value === null) return defaultValue;

  return value === 'true' || value === '1';
}

export function getIntegerUrlParam(name: string, defaultValue: number | null = null) {
  const value = getUrlParam(name);
  if (value === null) return defaultValue;

  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : defaultValue;
}

export function getEnumUrlParam<T extends string>(
  name: string,
  options: readonly T[],
  defaultValue: T,
) {
  const value = getUrlParam(name);
  return options.includes(value as T) ? (value as T) : defaultValue;
}

export function writeUrlParams(
  params: Record<string, UrlParamValue>,
  options: WriteUrlParamsOptions = {},
) {
  const url = getCurrentUrl();
  const before = url.toString();

  Object.entries(params).forEach(([name, value]) => {
    if (value === null || value === undefined || value === false) {
      url.searchParams.delete(name);
    } else {
      url.searchParams.set(name, String(value));
    }
  });

  const after = url.toString();
  if (before === after) return;

  if (options.reload) {
    window.location.href = after;
  } else {
    window.history.replaceState(window.history.state, '', url);
  }
}

export function writeUrlParam(name: string, value: UrlParamValue, options?: WriteUrlParamsOptions) {
  writeUrlParams({ [name]: value }, options);
}
