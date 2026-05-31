import { installHtmlInCanvasPolyfill } from 'three-html-render/polyfill';

import { debugPanel } from './debug';

if (!('requestPaint' in HTMLCanvasElement.prototype)) {
  installHtmlInCanvasPolyfill();

  const notice = document.createElement('div');
  notice.className = 'debug-panel-notice';
  notice.innerHTML = `
    <a href="https://github.com/WICG/html-in-canvas" target="_blank">HTML-in-Canvas API</a> not available.<br>
    Using <a href="https://github.com/repalash/three-html-render" target="_blank">polyfill</a>.
  `;
  debugPanel.appendChild(notice);
}
