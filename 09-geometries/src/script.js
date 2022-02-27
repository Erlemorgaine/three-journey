import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Float32Array
 * - can only handle floats,
 * - has a fixed length,
 * - and is way more performant than array
 */

// const positionsArray = new Float32Array([
//   // vertex 1
//   0, 0, -1,
//   // vertex 2
//   1, 0, -1,
//   // vertex 3
//   0.5, 1, 0,
//   // vertex 4
//   0.5, 1, 0,
//   // vertex 5
//   1, 2, -1,
//   // vertex 6
//   0, 2, -1,
// ]);

// Params: array with vertices, and how many values belong together (x, y, z)
// if we would only use uv coordinates (x, y), we would pass 2
// const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);

// Provide attribute name and attribute. You have to use the correct name, i.e. this name
// is used inside the (built-in) shaders!
// const geometry = new THREE.BufferGeometry().setAttribute(
//   "position",
//   positionsAttribute
// );

// Object
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({
//   color: 0xff0000,
//   wireframe: true,
// });
// const mesh = new THREE.Mesh(geometry, material);

// scene.add(mesh);

const count = 500;

// Array of n * 3 vertices * xyz
const randPosArray = new Float32Array(count * 3 * 3);

for (let i = 0; i < count * 3 * 3; i++) {
  const distance = Math.random() * 2 - 1;
  randPosArray[i] = Math.random() * 0.1 + distance; // center with -0.5;
}

const randAttribute = new THREE.BufferAttribute(randPosArray, 3);

const randGeometry = new THREE.BufferGeometry().setAttribute(
  "position",
  randAttribute
);

const randMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
});
const randMesh = new THREE.Mesh(randGeometry, randMaterial);

scene.add(randMesh);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
