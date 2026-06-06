type PenOverlay = {
  setEnabled: (enabled: boolean) => void;
  isEnabled: () => boolean;
  clear: () => void;
};

let penOverlay: PenOverlay | null = null;

export function getPenOverlay(): PenOverlay {
  if (penOverlay) return penOverlay;

  const canvas = document.createElement('canvas');
  canvas.id = 'pen-overlay';
  canvas.className = 'fixed inset-0 z-[9] pointer-events-none';
  document.body.appendChild(canvas);

  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not create pen overlay canvas context');

  let enabled = false;
  let drawing = false;

  const resize = () => {
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * pixelRatio;
    canvas.height = window.innerHeight * pixelRatio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = 4;
    context.strokeStyle = '#ff3b5c';
  };

  const clear = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const setEnabled = (nextEnabled: boolean) => {
    enabled = nextEnabled;
    canvas.classList.toggle('pointer-events-auto', enabled);
    canvas.classList.toggle('cursor-crosshair', enabled);
    canvas.classList.toggle('pointer-events-none', !enabled);
    if (!enabled) drawing = false;
  };

  canvas.addEventListener('pointerdown', (event) => {
    if (!enabled) return;

    event.preventDefault();

    if (event.button === 2) {
      clear();
      return;
    }

    if (event.button !== 0) return;

    drawing = true;
    canvas.setPointerCapture(event.pointerId);
    context.beginPath();
    context.moveTo(event.clientX, event.clientY);
  });

  canvas.addEventListener('pointermove', (event) => {
    if (!enabled || !drawing) return;

    event.preventDefault();
    context.lineTo(event.clientX, event.clientY);
    context.stroke();
  });

  canvas.addEventListener('pointerup', (event) => {
    if (!enabled || !drawing) return;

    drawing = false;
    canvas.releasePointerCapture(event.pointerId);
  });

  canvas.addEventListener('pointercancel', () => {
    drawing = false;
  });

  canvas.addEventListener('contextmenu', (event) => {
    if (!enabled) return;

    event.preventDefault();
    clear();
  });

  window.addEventListener('resize', resize);
  resize();

  penOverlay = {
    setEnabled,
    isEnabled: () => enabled,
    clear,
  };

  return penOverlay;
}
