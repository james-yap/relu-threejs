import * as THREE from 'three';

import { DEBUG } from '@/constants';
import { renderMathElement } from '@/mathjax';
import type { InteractionManager } from 'three/examples/jsm/interaction/InteractionManager.js';

export type HtmlPlaneConfig = {
  html: string | HTMLElement;
  width: number;
  height: number;
  interactions?: InteractionManager;
  id?: string;
  className?: string;
  pixelsPerUnit?: number;
  debug?: boolean;
  wireframeColor?: THREE.ColorRepresentation;
  depthWrite?: boolean;
  alphaTest?: number;
};

type ThreeWithHtmlTexture = typeof THREE & {
  HTMLTexture: new (element: HTMLElement) => THREE.Texture;
};

export const createHtmlPlane = ({
  html,
  width,
  height,
  id,
  interactions,
  className,
  pixelsPerUnit = 100,
  debug = DEBUG,
  wireframeColor = 0x00ff00,
  depthWrite = true,
  alphaTest = 0.01,
}: HtmlPlaneConfig) => {
  const contentElement = typeof html === 'string' ? document.createElement('div') : html;
  const textureElement = document.createElement('div');

  if (typeof html === 'string') contentElement.innerHTML = html;
  if (id) contentElement.id = id;
  if (className) contentElement.className = className;

  const textureWidth = width * pixelsPerUnit;
  const textureHeight = height * pixelsPerUnit;

  contentElement.style.width = `${textureWidth}px`;
  contentElement.style.height = `${textureHeight}px`;
  contentElement.style.boxSizing = 'border-box';

  textureElement.style.width = `${textureWidth}px`;
  textureElement.style.height = `${textureHeight}px`;
  textureElement.style.display = 'grid';
  textureElement.style.placeItems = 'center';
  textureElement.style.overflow = 'hidden';
  textureElement.appendChild(contentElement);

  const planeGeometry = new THREE.PlaneGeometry(width, height);
  const material = new THREE.MeshBasicMaterial({
    transparent: true,
    // Discard fully transparent texture pixels before depth/color writes, so only visible HTML glyphs occlude 3D geometry.
    alphaTest,
    depthWrite,
  });
  const texture = new (THREE as ThreeWithHtmlTexture).HTMLTexture(textureElement);
  material.map = texture;

  void renderMathElement(textureElement).then(() => {
    texture.needsUpdate = true;
    (textureElement.parentElement as (HTMLElement & { requestPaint?: () => void }) | null)?.requestPaint?.();
  });

  const mesh = new THREE.Mesh(planeGeometry, material);

  if (debug) {
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: wireframeColor,
      wireframe: true,
    });
    mesh.add(new THREE.Mesh(planeGeometry, wireMaterial));
  }

  if (interactions) interactions.add(mesh);
  return mesh;
};
