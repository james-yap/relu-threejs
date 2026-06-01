declare global {
  interface Window {
    MathJax: any;
  }
}

const waitForMathJax = async (attempt = 0): Promise<any | null> => {
  if (window.MathJax?.typesetPromise) return window.MathJax;
  if (attempt >= 100) return null;

  await new Promise((resolve) => window.setTimeout(resolve, 50));
  return waitForMathJax(attempt + 1);
};

export const renderMathElement = async (element: HTMLElement) => {
  const mathJax = await waitForMathJax();
  if (!mathJax) return;

  try {
    await mathJax.typesetPromise([element]);
  } catch (err) {
    console.error('MathJax rendering failed:', err);
  }
};

export const renderMath = async () => {
  const mathJax = await waitForMathJax();
  if (!mathJax) return;

  try {
    await mathJax.typesetPromise();
  } catch (err) {
    console.error('MathJax rendering failed:', err);
  }
};
