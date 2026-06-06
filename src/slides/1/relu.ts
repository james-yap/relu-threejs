import * as THREE from 'three';
import gsap from "gsap"

import { createGridHelper } from '@/components/grid';
import { debugSphere } from '@/utils';

export const slide1GridGroup = new THREE.Group();
const grid = createGridHelper({ xStart: -3, xEnd: 3, yStart: -1, yEnd: 3 })

const scale = 0.6

slide1GridGroup.position.set(-4.01, 1.5, 0.00)
slide1GridGroup.scale.set(scale, scale, scale)


const createReluGeometry = (xBound: number) => {
  const curvePoints: THREE.Vector3[] = [];

  for (let i = -3; i <= xBound; i += 0.1) {
    const x = i;
    const y = Math.max(0, x);
    curvePoints.push(new THREE.Vector3(x, y, 0));
  }

  curvePoints.push(new THREE.Vector3(xBound, Math.max(0, xBound), 0));

  const curvePath = new THREE.CatmullRomCurve3(curvePoints);
  return new THREE.TubeGeometry(
    curvePath,
    100, // tubular segments
    0.05, // thickness / radius
    3, // radial segments
    false
  );
};

const curveMaterial = new THREE.MeshBasicMaterial({ color: 0x58C4DD });
const curve = new THREE.Mesh(createReluGeometry(3), curveMaterial);

slide1GridGroup.add(grid)
slide1GridGroup.add(curve)

const sphere = debugSphere.clone()
// sphere.position.set(curveState.xBound, Math.max(0, curveState.xBound), 0)
slide1GridGroup.add(sphere)


const curveState = { p: 0 };

gsap.to(curveState, {
  p: 1,
  duration: 2,
  ease: 'sine.inOut',
  yoyo: true,
  repeat: -1,
  onUpdate: () => {
    // curve.geometry.dispose();
    // curve.geometry = createReluGeometry(curveState.xBound);
    curve.geometry.setDrawRange(0, Math.floor(curveState.p * curve.geometry.index!.count));
    // sphere.position.set(curveState.xBound, Math.max(0, curveState.xBound), 0);
  },
});

// reluTween.pause();    // pause, can resume later                             
// reluTween.resume();   // continue                                            
// reluTween.restart();  // start over                                          
