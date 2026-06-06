import * as THREE from 'three';
import { cva, type VariantProps } from 'class-variance-authority';
import { createHtmlPlane } from '@/components/htmlPlane';
import type { InteractionManager } from 'three/examples/jsm/interaction/InteractionManager.js';

const sliderLabel = cva('font-bold text-lg text-center grid place-items-center', {
  variants: {
    color: {
      blue: 'text-blue-500',
      red: 'text-red-500',
      green: 'text-green-500',
    },
  },
  defaultVariants: {
    color: 'blue',
  },
});

const sliderInput = cva('', {
  variants: {
    color: {
      blue: 'accent-blue-500',
      red: 'accent-red-500',
      green: 'accent-green-500',
    },
  },
  defaultVariants: {
    color: 'blue',
  },
});

type SliderColor = VariantProps<typeof sliderLabel>['color'];

type Props = {
  name: string;
  defaultValue: number;
  interactions: InteractionManager;
  min: number;
  max: number;
  step: number;
  callbackFn: (val: number) => void;
  color?: SliderColor;
}

export function createSlider({
  name,
  defaultValue,
  interactions,
  min,
  max,
  step,
  callbackFn,
  color = "blue"
}: Props) {
  const group = new THREE.Object3D();

  const labelElt = document.createElement('div');
  labelElt.innerHTML = `${name} = ${defaultValue}`;
  const label = createHtmlPlane({
    html: labelElt,
    className: sliderLabel({ color }),
    width: 1,
    height: 0.3,
    interactions
  });
  label.position.y = 0.1;
  group.add(label);

  const sliderElt = document.createElement('div')
  sliderElt.innerHTML = `<input type="range" min="${min}" max="${max}" step="${step}" class="${sliderInput({ color })}"  />`

  sliderElt.addEventListener("input", (e) => {
    if (!e.target) return;
    const val = parseFloat((e.target as HTMLInputElement).value);
    labelElt.innerHTML = `${name} = ${val.toFixed(2)}`;
    callbackFn(val);
  })

  const slider = createHtmlPlane({
    html: sliderElt,
    className: 'grid place-items-center',
    width: 1.5,
    height: 0.2,
    interactions
  });
  slider.position.y = -0.1;
  group.add(slider)

  return group;
}

