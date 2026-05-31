import * as THREE from 'three';
import { InteractionManager } from 'three/addons/interaction/InteractionManager.js';

import './style.css'
import { setupResize } from './eventListeners';
import { setupPolyfill } from './setupPolyfill'
import { debugPanel, initDebug, renderDebug } from './debug'

export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

export const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.getElementById('app')!.appendChild(renderer.domElement)

setupPolyfill(debugPanel);
setupResize(renderer, camera);

camera.position.z = 10;
camera.lookAt(0, 0, 0)


const planeGeometry = new THREE.PlaneGeometry(10, 10);

const element = document.createElement('div');
element.id = 'draw_element';
element.innerHTML = `
Hello world!<br>I'm multi-line, <b>formatted</b>,
rotated text with emoji (&#128512;), RTL text
<span dir=rtl>من فارسی صحبت میکنم</span>,
vertical text,
<p style="writing-mode: vertical-rl;">
这是垂直文本
</p>
an inline image (<img width="150" src="textures/hardwood2_diffuse.jpg">), and
<svg width="50" height="50">
<circle cx="25" cy="25" r="20" fill="green" />
<text x="25" y="30" font-size="15" text-anchor="middle" fill="#fff">
  SVG
</text>
</svg>!
<br>
<input type="text" placeholder="Type here...">
<button id="clicker">Click me</button>`;

const material = new THREE.MeshStandardMaterial({ roughness: 0, metalness: 0.5 });
material.map = new THREE.HTMLTexture(element);

const mesh = new THREE.Mesh(planeGeometry, material);
mesh.position.z = 0.05;
scene.add(mesh);

// Interaction

const interactions = new InteractionManager();
interactions.connect(renderer, camera);
interactions.add(mesh);

// Button click handler

element.addEventListener('pointerdown', (event) => {
  if ((event.target as Element).closest('button, input, textarea, select, a')) {
    event.stopPropagation();
  }
}, { capture: true });

const clicker = element.querySelector<HTMLButtonElement>('#clicker')!;
clicker.addEventListener('click', () => {
  clicker.textContent = 'Clicked!';
});

function animate(_time: number) {
  renderDebug();
  interactions.update();
  renderer.render(scene, camera);
}

initDebug({ scene, camera, renderer });
