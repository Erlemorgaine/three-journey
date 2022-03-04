import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("/textures/particles/6.png");

/**
 * Particle setup
 */

// You will see this geometry, made up of n particles
// const particleGeometry = new THREE.SphereBufferGeometry(1, 32, 32);
const particleGeometry = new THREE.BufferGeometry();
const particleAmount = 1000; // Verticles

const positions = new Float32Array(particleAmount * 3);

// Colors * 3, because it's rgb
const colors = new Float32Array(particleAmount * 3);

let angle;
const step = 0.01;

for (let i = 0; i < particleAmount * 3; i++) {
  // This makes for quite a starry effect, you're in a tube (with radius between 2 and 22)
  // Camera should be almost 0 for this to work
  // const radius = 2 + Math.random() * 20;
  // if (i % 3 === 0) {
  //   // x
  //   // Radius should be from 3 to 9
  //   angle = Math.PI * 2 * Math.random();
  //   positions[i] = Math.cos(angle) * radius;
  // } else if (i % 3 === 2) {
  //   // z
  //   positions[i] = Math.sin(angle) * radius;
  // } else {
  //   // y
  //   // positions[i] = 0;
  //   // positions[i] = Math.sin(angle) * radius;
  //   positions[i] = (Math.random() - 0.5) * 10;
  // }

  // Make a SPIRAL
  // let angle;
  const radius = 1;
  const outerRadius = 5;

  const outerAngle = (Math.PI * 2 * 1) / particleAmount;
  if (i % 3 === 0) {
    // x
    // Radius should be from 3 to 9

    angle = Math.PI * 2 * i * step;
    positions[i] = Math.cos(angle) * radius; // + Math.sin(outerAngle) * outerRadius;
  } else if (i % 3 === 2) {
    // z
    positions[i] = Math.sin(angle) * radius;
  } else {
    // y
    positions[i] = i * step - particleAmount * step; // + Math.cos(outerAngle) * outerRadius;
    // positions[i] = Math.sin(angle) * radius;
    // positions[i] = (Math.random() - 0.5) * 5;
  }

  // ....... Or just random particles
  // Combine with commented out animation
  // positions[i] = (Math.random() - 0.5) * 10;

  // if (i % 3 === 2) {
  //   colors[i] = 1;
  // } else {
  colors[i] = Math.random();
  // }
}

particleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.2, // Size of the particle
  // Creates perspective: how the particle looks at a certain distance from camera
  // Putting false makes all particles size of size
  sizeAttenuation: true,
  color: "hsl(330, 100%, 70%)", // Leaving baseCOlor with vertexColors mixes both
  vertexColors: true, // Indicates the colors in the geometry attributes should be used
  alphaMap: particleTexture,
  transparent: true,
  // This makes sure that pixels that are transparent (0, its default value) are not rendered
  // Fixes the bug that when a pixel is transparent but on top of the pixel of another
  // object that is drawn later, it will not show the pixel of the other object
  // More or less same result as depthWrite. But: doesn't work on pixels that are almost transparent
  // alphaTest: 0.001,

  // With depthTesting, the renderer will just turn off its trying to guess which object is closer to camera
  // dephtTest: false

  // DepthWrite: false: tells that the particles written to the depth buffer should not be drawn.
  // It's a good solution.

  // Possible alternative: blending.
  // BUT can be bad for performance
  depthWrite: false,
  blending: THREE.AdditiveBlending, // Makes overlaying pixels very bright
});

// Points
const particles = new THREE.Points(particleGeometry, particlesMaterial);
scene.add(particles);

/**
 * Sizes
 */
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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.01,
  100
);
camera.position.z = 3;
// camera.position.z = 0.01;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update particles
  // THIS IS BAD, because updating a lot of particles on each frame is bad
  // You should do this stuff with custom shaders
  // for (let i = 0; i < particleAmount; i++) {
  //   const yIndex = i * 3 + 1;
  //   const x = particleGeometry.attributes.position.array[i * 3];
  //   particleGeometry.attributes.position.array[yIndex] = Math.sin(
  //     // Offsetting elapsedTime with x gives a rippling effect
  //     elapsedTime + x
  //   );
  // }

  // When you change an attribute on a geometry, you need to tell Three.js that attribute has updated
  // particleGeometry.attributes.position.needsUpdate = true;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
