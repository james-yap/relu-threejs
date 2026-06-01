import * as THREE from 'three';

export const slide2Group = new THREE.Group();

const pos: [number, number, number] = [3.21, 1.00, 0.00]

const axesHelper = new THREE.AxesHelper(3);
slide2Group.add(axesHelper)

const scatterPoints = Array.from({ length: 3 }, () => {
  const point = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xff4d6d })
  );

  point.position.set(
    THREE.MathUtils.randFloat(0.25, 2.75),
    THREE.MathUtils.randFloat(0.25, 2.75),
    0
  );

  return point;
});

slide2Group.add(...scatterPoints)
slide2Group.position.set(...pos)
