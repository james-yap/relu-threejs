import * as THREE from 'three';

import type { CameraMode } from './constants';

const PERSPECTIVE_FOV = 75;
const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 1000;
const ORTHOGRAPHIC_FRUSTUM_SIZE = 6;

export type AppCamera = THREE.PerspectiveCamera | THREE.OrthographicCamera;

export function createAppCamera(mode: CameraMode): AppCamera {
  const camera = mode === 'orthographic'
    ? new THREE.OrthographicCamera(0, 0, 0, 0, CAMERA_NEAR, CAMERA_FAR)
    : new THREE.PerspectiveCamera(PERSPECTIVE_FOV, 1, CAMERA_NEAR, CAMERA_FAR);

  updateCameraViewport(camera);
  return camera;
}

export function updateCameraViewport(camera: AppCamera) {
  const aspect = window.innerWidth / window.innerHeight;

  if (camera instanceof THREE.PerspectiveCamera) {
    camera.aspect = aspect;
  } else {
    const halfHeight = ORTHOGRAPHIC_FRUSTUM_SIZE / 2;
    const halfWidth = halfHeight * aspect;

    camera.left = -halfWidth;
    camera.right = halfWidth;
    camera.top = halfHeight;
    camera.bottom = -halfHeight;
  }

  camera.updateProjectionMatrix();
}

export function syncCameraTransform(source: THREE.Camera, target: THREE.Camera) {
  target.position.copy(source.position);
  target.quaternion.copy(source.quaternion);
  target.up.copy(source.up);
  target.updateMatrixWorld();
}
