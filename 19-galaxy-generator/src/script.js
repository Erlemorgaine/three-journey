import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Material,
  Points,
  PointsMaterial,
} from "three";

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
 * Galaxy
 */
const params = {
  count: 10000,
  size: 0.01,
  radius: 3,
  branches: 5,
  spin: 2.5,
  randomness: 0.6,
  randomnessPower: 3,
  insideColor: "hsl(209, 100%, 50%)",
  outsideColor: "hsl(40, 100%, 80%)",
};

let particleGeometry = null;
let particleMaterial = null;
let points = null;

const generateGalaxy = () => {
  /**
   * Geometry
   */

  particleGeometry = new BufferGeometry();

  const positions = new Float32Array(params.count * 3);
  const colors = new Float32Array(params.count * 3);
  const insideColor = new Color(params.insideColor);
  const outsideColor = new Color(params.outsideColor);

  for (let i = 0; i < params.count; i++) {
    /**
     * Destroy old stuff
     */
    if (points !== null) {
      particleGeometry.dispose();
      particleMaterial.dispose();
      scene.remove(points);
    }

    const i3 = i * 3;
    const radius = Math.pow(Math.random(), 2) * params.radius;
    const branchAngle =
      ((Math.PI * 2) / params.branches) * (i % params.branches);

    // This creates the spiral. It means that the larger the radius
    // on which the particle is positioned, the higher the value of
    // radius * spin will be. And since we put the spinAngle in cos and sin,
    // it will be treated as a point on a radius and thus curve.
    const spinAngle = radius * params.spin;
    const randomX =
      Math.pow(Math.random() * params.randomness, params.randomnessPower) *
      // We do this to make sure the randomness goes both on positive and negative axis
      (Math.random() < 0.5 ? 1 : -1);
    const randomY =
      Math.pow(Math.random() * params.randomness, params.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);
    const randomZ =
      Math.pow(Math.random() * params.randomness, params.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);

    // x
    positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    // y
    positions[i3 + 1] = randomY;
    // z
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    // Lerp finds a value between 2 colors, based on a value between 0 and 1
    const mixedColor = insideColor
      .clone()
      .lerp(outsideColor, radius / params.radius);
    // Color
    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  particleGeometry.setAttribute("position", new BufferAttribute(positions, 3));
  particleGeometry.setAttribute("color", new BufferAttribute(colors, 3));

  /**
   * Material
   */
  particleMaterial = new PointsMaterial({
    size: params.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: AdditiveBlending,
    vertexColors: true,
  });

  /**
   * Points
   */
  points = new Points(particleGeometry, particleMaterial);

  scene.add(points);
};

generateGalaxy();

[
  gui.add(params, "count").min(100).max(100000).step(100),
  gui.add(params, "size").min(0.001).max(0.1).step(0.001),
  gui.add(params, "radius").min(0.1).max(20).step(0.001),
  gui.add(params, "branches").min(2).max(20).step(1),
  gui.add(params, "spin").min(-5).max(5).step(0.5),
  gui.add(params, "randomness").min(0).max(2).step(0.01),
  gui.add(params, "randomnessPower").min(1).max(10).step(0.1),
  gui.addColor(params, "insideColor"),
  gui.addColor(params, "outsideColor"),
].forEach((tweak) => tweak.onFinishChange(generateGalaxy));

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
  0.1,
  100
);
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 3;
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

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
