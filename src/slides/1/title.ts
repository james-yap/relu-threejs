import * as THREE from 'three';

import { DEBUG } from '../../constants';

const element = document.createElement('div');
element.id = "inter"
element.innerHTML = '<h1>ReLU, explained quickly.</h1>'

const planeGeometry = new THREE.PlaneGeometry(8, 1.5);

const material = new THREE.MeshStandardMaterial({
  roughness: 0,
  metalness: 0.5,
  transparent: true,
  // alphaTest: 0.01
});
material.map = new THREE.HTMLTexture(element);
const wireMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
})

export const slide1TitleMesh = new THREE.Mesh(planeGeometry, material);
const wireframeHelper = new THREE.Mesh(planeGeometry, wireMaterial);
if (DEBUG) slide1TitleMesh.add(wireframeHelper);


slide1TitleMesh.position.set(-3.99, 3.85, -0.00);
slide1TitleMesh.position.z = 0.05;
