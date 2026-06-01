// Tell TypeScript that MathJax exists on the window object
declare global {
  interface Window {
    MathJax: any;
  }
}

// Ensure this file is treated as a module
export const renderMath = async () => {
  if (window.MathJax && window.MathJax.typesetPromise) {
    try {
      await window.MathJax.typesetPromise();
    } catch (err) {
      console.error('MathJax rendering failed:', err);
    }
  } else {
    // Retry if MathJax hasn't finished loading from the CDN
    // setTimeout(renderMath, 100);
  }
};
