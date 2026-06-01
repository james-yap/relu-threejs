import * as THREE from 'three';

import { DEBUG } from './constants';

export type GridHelperConfig = {
  xStart?: number;
  xEnd?: number;
  yStart?: number;
  yEnd?: number;
  xStep?: number;
  yStep?: number;
  gridColor?: THREE.ColorRepresentation;
  xAxisColor?: THREE.ColorRepresentation;
  yAxisColor?: THREE.ColorRepresentation;
};

export type HtmlPlaneConfig = {
  html: string | HTMLElement;
  width: number;
  height: number;
  id?: string;
  className?: string;
  pixelsPerUnit?: number;
  debug?: boolean;
  wireframeColor?: THREE.ColorRepresentation;
};

type ThreeWithHtmlTexture = typeof THREE & {
  HTMLTexture: new (element: HTMLElement) => THREE.Texture;
};

const isZero = (value: number) => Math.abs(value) < 1e-10;

export const createHtmlPlane = ({
  html,
  width,
  height,
  id,
  className,
  pixelsPerUnit = 100,
  debug = DEBUG,
  wireframeColor = 0x00ff00,
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
  const material = new THREE.MeshBasicMaterial({ transparent: true });
  material.map = new (THREE as ThreeWithHtmlTexture).HTMLTexture(textureElement);

  const mesh = new THREE.Mesh(planeGeometry, material);

  if (debug) {
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: wireframeColor,
      wireframe: true,
    });
    mesh.add(new THREE.Mesh(planeGeometry, wireMaterial));
  }

  return mesh;
};

export const createGridHelper = ({
  xStart = -5,
  xEnd = 5,
  yStart = -5,
  yEnd = 5,
  xStep = 1,
  yStep = 1,
  gridColor = 0x444444,
  xAxisColor = 0xff5555,
  yAxisColor = 0x55ff55,
}: GridHelperConfig = {}) => {
  const xMin = Math.min(xStart, xEnd);
  const xMax = Math.max(xStart, xEnd);
  const yMin = Math.min(yStart, yEnd);
  const yMax = Math.max(yStart, yEnd);
  const normalizedXStep = Math.abs(xStep);
  const normalizedYStep = Math.abs(yStep);
  const points: THREE.Vector3[] = [];
  const group = new THREE.Group();

  if (normalizedXStep === 0 || normalizedYStep === 0) {
    throw new Error('Grid steps must be non-zero');
  }

  for (let x = xMin; x <= xMax; x += normalizedXStep) {
    if (isZero(x)) continue;

    points.push(new THREE.Vector3(x, yMin, 0));
    points.push(new THREE.Vector3(x, yMax, 0));
  }

  for (let y = yMin; y <= yMax; y += normalizedYStep) {
    if (isZero(y)) continue;

    points.push(new THREE.Vector3(xMin, y, 0));
    points.push(new THREE.Vector3(xMax, y, 0));
  }

  const gridGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const gridMaterial = new THREE.LineBasicMaterial({ color: gridColor });
  group.add(new THREE.LineSegments(gridGeometry, gridMaterial));

  const xAxisGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(xMin, 0, 0),
    new THREE.Vector3(xMax, 0, 0),
  ]);
  const xAxisMaterial = new THREE.LineBasicMaterial({ color: xAxisColor });
  group.add(new THREE.LineSegments(xAxisGeometry, xAxisMaterial));

  const yAxisGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, yMin, 0),
    new THREE.Vector3(0, yMax, 0),
  ]);
  const yAxisMaterial = new THREE.LineBasicMaterial({ color: yAxisColor });
  group.add(new THREE.LineSegments(yAxisGeometry, yAxisMaterial));

  return group;
};

const geometry = new THREE.SphereGeometry(0.1, 32, 16);
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
export const debugSphere = new THREE.Mesh(geometry, material);

