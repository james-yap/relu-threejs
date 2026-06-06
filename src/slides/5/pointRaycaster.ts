import * as THREE from 'three';
import { Line2, LineGeometry, LineMaterial } from 'three/examples/jsm/Addons.js';

export type HoverPoint = THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;

type PointHoverRaycasterConfig = {
  group: THREE.Group;
  points: HoverPoint[];
  camera: THREE.Camera;
  renderer: THREE.WebGLRenderer;
};

/**
 * Handles slide 5 point hover interactions:
 * - raycasts from the pointer into the scatter points
 * - draws the center-to-point distance line
 * - shows the z = distance label
 * - highlights/grows the hovered point
 *
 * The listener is only attached while enabled, so this can be toggled off when
 * another interaction mode should own pointer movement.
 */
export class PointHoverRaycaster {
  private group: THREE.Group;
  private points: HoverPoint[];
  private camera: THREE.Camera;
  private renderer: THREE.WebGLRenderer;
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();
  private labelOffset = new THREE.Vector3(0, 0.35, 0.05);
  private hoveredPoint: HoverPoint | null = null;
  private enabled = false;
  private hoverLineGeometry = new LineGeometry();
  private hoverLine: Line2;
  private distanceLabel = createDistanceLabel();

  constructor({ group, points, camera, renderer }: PointHoverRaycasterConfig) {
    this.group = group;
    this.points = points;
    this.camera = camera;
    this.renderer = renderer;

    this.hoverLineGeometry.setPositions([0, 0, 0, 0, 0, 0]);
    this.hoverLine = new Line2(
      this.hoverLineGeometry,
      new LineMaterial({
        color: 0x58C4DD,
        depthTest: false,
        transparent: true,
        opacity: 0.95,
        linewidth: 0.07,
        worldUnits: true,
      })
    );
    this.hoverLine.renderOrder = 10;
    this.hoverLine.visible = false;
    this.group.add(this.hoverLine);

    this.distanceLabel.visible = false;
    this.group.add(this.distanceLabel);
  }

  enable() {
    if (this.enabled) return;

    this.enabled = true;
    this.renderer.domElement.addEventListener('pointermove', this.handlePointerMove);
  }

  disable() {
    if (!this.enabled) return;

    this.enabled = false;
    this.renderer.domElement.removeEventListener('pointermove', this.handlePointerMove);
    this.clearHover();
  }

  setEnabled(enabled: boolean) {
    if (enabled) {
      this.enable();
    } else {
      this.disable();
    }
  }

  isEnabled() {
    return this.enabled;
  }

  dispose() {
    this.disable();
    this.group.remove(this.hoverLine);
    this.group.remove(this.distanceLabel);
    this.hoverLineGeometry.dispose();
    this.hoverLine.material.dispose();
    this.distanceLabel.material.map?.dispose();
    this.distanceLabel.material.dispose();
  }

  private handlePointerMove = (event: PointerEvent) => {
    this.updatePointer(event);
    this.raycaster.setFromCamera(this.pointer, this.camera);

    const [hit] = this.raycaster.intersectObjects(this.points, false);
    if (!hit) {
      this.clearHover();
      return;
    }

    this.setHoveredPoint(hit.object as HoverPoint);
  };

  private updatePointer(event: PointerEvent) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  private setHoveredPoint(point: HoverPoint) {
    if (this.hoveredPoint !== point) {
      this.clearHoveredPoint();
      this.hoveredPoint = point;
      this.hoveredPoint.scale.setScalar(1.8);
      this.hoveredPoint.material.color.setHex(0xffd166);
    }

    this.hoverLineGeometry.setPositions([0, 0, 0, point.position.x, point.position.y, point.position.z]);
    this.hoverLine.visible = true;

    const distFloat = point.position.length();
    updateDistanceLabel(this.distanceLabel, distFloat);
    this.distanceLabel.position.copy(point.position).add(this.labelOffset);
    this.distanceLabel.visible = true;
  }

  private clearHover() {
    this.clearHoveredPoint();
    this.hoverLine.visible = false;
    this.distanceLabel.visible = false;
  }

  private clearHoveredPoint() {
    if (!this.hoveredPoint) return;

    this.hoveredPoint.scale.setScalar(1);
    this.hoveredPoint.material.color.setHex(this.hoveredPoint.userData.baseColor as number);
    this.hoveredPoint = null;
  }
}

export function createPointHoverRaycaster(config: PointHoverRaycasterConfig) {
  return new PointHoverRaycaster(config);
}

function createDistanceLabel() {
  const canvas = document.createElement('canvas');
  canvas.width = 384;
  canvas.height = 128;

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(1.35, 0.45, 1);
  sprite.renderOrder = 11;
  sprite.userData.canvas = canvas;
  sprite.userData.texture = texture;

  return sprite;
}

function updateDistanceLabel(sprite: THREE.Sprite, distFloat: number) {
  const canvas = sprite.userData.canvas as HTMLCanvasElement;
  const texture = sprite.userData.texture as THREE.CanvasTexture;
  const context = canvas.getContext('2d');
  if (!context) return;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.font = '700 56px sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = 'rgba(0, 0, 0, 0.72)';
  context.fillRect(28, 14, 328, 88);
  context.strokeStyle = '#58C4DD';
  context.lineWidth = 4;
  context.strokeRect(28, 14, 328, 88);
  context.fillStyle = '#58C4DD';
  context.fillText(`z = ${distFloat.toFixed(2)}`, canvas.width / 2, canvas.height / 2);

  texture.needsUpdate = true;
}
