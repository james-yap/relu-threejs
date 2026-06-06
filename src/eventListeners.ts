import type { PerspectiveCamera, WebGLRenderer } from 'three';
import type { CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';

type ResizableRenderer = WebGLRenderer | CSS3DRenderer;

export function setupResize(camera: PerspectiveCamera, renderers: ResizableRenderer[]) {
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderers.forEach((renderer) => {
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  });
}
