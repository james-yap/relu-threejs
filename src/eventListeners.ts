import type { WebGLRenderer } from 'three';
import type { CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';

import type { AppCamera } from './camera';
import { updateCameraViewport } from './camera';

type ResizableRenderer = WebGLRenderer | CSS3DRenderer;

export function setupResize(getCamera: () => AppCamera, renderers: ResizableRenderer[]) {
  window.addEventListener('resize', () => {
    updateCameraViewport(getCamera());

    renderers.forEach((renderer) => {
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  });
}
