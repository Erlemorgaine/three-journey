import "./style.css";

import * as dat from "lil-gui";
import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { slide1 } from "./slide-1";
import { slide2 } from "./slide-2";
import { slide3 } from "./slide-3";
import { slide4 } from "./slide-4";
import { slide5 } from "./slide-5";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const disposeOfObjects = () => {
  scene.children.forEach((child) => {
    if (child.material) child.material.dispose();
    if (child.geometry) child.geometry.dispose();

    scene.remove(child);
  });
};

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

/**
 * Slides
 */
const slides = [slide1, slide2, slide3, slide4, slide5];

/**
 * Navigation
 */
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let currentSlideIndex = 0;

const navigate = () => {
  if (currentSlideIndex === 0) {
    prevBtn.style.display = "none";
  } else if (currentSlideIndex === slides.length - 1) {
    nextBtn.style.display = "none";
  } else {
    prevBtn.style.display = "initial";
    nextBtn.style.display = "initial";
  }

  disposeOfObjects();
  slides[currentSlideIndex](scene, textureLoader);
};

prevBtn.addEventListener("click", () => {
  currentSlideIndex++;
  navigate();
});
nextBtn.addEventListener("click", () => {
  currentSlideIndex++;
  navigate();
});

navigate();

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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
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
