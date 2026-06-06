import * as THREE from 'three';

const geometry = new THREE.SphereGeometry(0.1, 32, 16);
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
export const debugSphere = new THREE.Mesh(geometry, material);

export function setGroupOpacity(group: THREE.Object3D, opacity: number) {
  group.traverse((child) => {
    // Use instanceof to narrow the type to Mesh
    if (child instanceof THREE.Mesh) {

      // Three.js materials can sometimes be an array (MultiMaterial)
      if (Array.isArray(child.material)) {
        child.material.forEach(mat => {
          mat.opacity = opacity;
          mat.transparent = true; // Required for opacity to show
        });
      } else {
        child.material.opacity = opacity;
        child.material.transparent = true; // Required for opacity to show
      }
    }
  });

}
