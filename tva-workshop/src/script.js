import "./style.css";

import * as dat from "lil-gui";
import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { slide1 } from "./slide-1";
import { slide2 } from "./slide-2";
import { slide3 } from "./slide-3";
import { slide4 } from "./slide-4";
import { slide5 } from "./slide-5";
import { slide6 } from "./slide-6";
import { slide7 } from "./slide-7";
import { slide8 } from "./slide-8";
import { slide9 } from "./slide-9";

/**
 * Base
 */
// Debug
// const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

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
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 4;

scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// renderer.autoClear = false;

const disposeOfObjects = () => {
  [...scene.children].forEach((child) => {
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
const slides = [
  slide1,
  slide2,
  slide3,
  slide4,
  slide5,
  slide6,
  slide7,
  slide8,
  slide9,
];

/**
 * Navigation
 */
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let currentSlideIndex = 0;

const navigate = () => {
  if (currentSlideIndex === 0) {
    prevBtn.classList.add("hide");

    document
      .getElementById("slide-" + (currentSlideIndex + 2))
      .classList.add("hide");
  } else if (currentSlideIndex === slides.length - 1) {
    nextBtn.classList.add("hide");
    document.getElementById("slide-" + currentSlideIndex).classList.add("hide");
  } else {
    prevBtn.classList.remove("hide");
    nextBtn.classList.remove("hide");

    if (currentSlideIndex !== 1) {
      document
        .getElementById("slide-" + currentSlideIndex)
        .classList.add("hide");
    }

    document
      .getElementById("slide-" + (currentSlideIndex + 2))
      .classList.add("hide");
  }

  if (currentSlideIndex !== 0) {
    document
      .getElementById("slide-" + (currentSlideIndex + 1))
      .classList.remove("hide");
  }

  disposeOfObjects();
  controls.reset();
  slides[currentSlideIndex](scene, textureLoader, camera, controls, renderer);
};

prevBtn.addEventListener("click", () => {
  currentSlideIndex--;
  navigate();
});
nextBtn.addEventListener("click", () => {
  currentSlideIndex++;
  navigate();
});

navigate();
