import "./style.css";
import * as THREE from "three";
import gsap from "gsap";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

// let time = Date.now();
// const clock = new THREE.Clock();

// Greensock does the tick by itself
gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 });
gsap.to(mesh.position, { duration: 1, delay: 2, x: 0 });

// Animations
const tick = () => {
  // Time
  //   const currentTime = Date.now();
  //   const deltaTime = currentTime - time;
  //   time = currentTime;

  // Clock returns time from tick start in seconds
  //   const elapsedTime = clock.getElapsedTime();

  // In this case: the higher the framerate, the fast the rotation
  // We don't want that, therefore we have to use time
  // Solution 1) use Date
  // Solution 2) use THREE clock
  // mesh.rotation.x += 0.001 * deltaTime;
  //   mesh.rotation.x = elapsedTime;

  // For 1 turn per second:
  // mesh.rotation.x = elapsedTime * Math.PI * 2;

  // When using sinus:
  // goes up and down, because sin always returns a value between 1 and -1
  // (in waves)
  //   mesh.position.y = Math.sin(elapsedTime);

  // When using cos:
  // Does the same as sin, but up / down is reverse from sin
  //   mesh.position.x = Math.cos(elapsedTime);

  // Another option: using camera
  //   camera.position.y = Math.sin(elapsedTime);
  //   camera.position.x = Math.cos(elapsedTime);
  //   camera.lookAt(mesh.position);

  // BUT... prefer to use a library, e.g. greensock
  renderer.render(scene, camera);

  requestAnimationFrame(tick);
};

tick();
