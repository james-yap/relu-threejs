import { renderer } from "./main"

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
})
