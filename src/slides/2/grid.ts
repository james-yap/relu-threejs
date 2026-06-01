import * as THREE from 'three';

export const slide2Group = new THREE.Group();

const pos: [number, number, number] = [3.21, 1.31, 0.00]

const axesHelper = new THREE.AxesHelper(2);
slide2Group.add(axesHelper)
slide2Group.position.set(...pos)
