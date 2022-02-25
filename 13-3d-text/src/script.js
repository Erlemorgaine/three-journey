import "./style.css";

import * as dat from "lil-gui";

import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

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
 * AxesHelper
 */

// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/textures/matcaps/4.png");
const matcapDonutTexture = textureLoader.load("/textures/matcaps/5.png");

/**
 * Fonts
 * - One loader can instantiate multiple fonts
 */
const fontLoader = new FontLoader();
fontLoader.load("/fonts/DM_Sans_Regular.json", (font) => {
  const bevelSize = 0.02;
  const bevelThickness = 0.03;
  const textGeometry = new TextGeometry("We like DONUTS", {
    font,
    size: 0.25,
    height: 0.1, // Depth of font
    curveSegments: 5, // This determines the triangles, so better performance if lower
    bevelEnabled: true,
    bevelThickness,
    bevelSize,
    bevelOffset: 0,
    bevelSegments: 3, // This is about segments of rounding of characters in z dimension
  });

  // This gives us access to geometry.boundingBox;
  // The bounding box consists of a min and max value (both Vector3), that, when
  // subtracted against each other, return the widht, height and depth of the box
  textGeometry.computeBoundingBox();
  // We only move the geometry, not the mesh, so that mesh will rotate on its center
  // In BufferGeometry, we can use translate
  //   textGeometry.translate(
  //     (textGeometry.boundingBox.max.x - bevelSize) * -0.5,
  //     (textGeometry.boundingBox.max.y - bevelSize) * -0.5,
  //     (textGeometry.boundingBox.max.z - bevelThickness) * -0.5
  //   );
  // But now it's not exactly in the center. This is becayse we have a bevel size of 0.02,
  // so the boundingBox doesn't start at 0, 0, 0

  // .... But... we can also use the center method of BufferGeometry
  textGeometry.center();

  const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
  const text = new THREE.Mesh(textGeometry, textMaterial);

  scene.add(text);

  // This is a way to measuse the time, in combination with timeEnd
  console.time("donuts");

  const donutGeometry = new THREE.TorusBufferGeometry(0.2, 0.1, 20, 45);
  const donutMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcapDonutTexture,
  });

  for (let i = 0; i < 100; i++) {
    const donut = new THREE.Mesh(donutGeometry, donutMaterial);

    donut.scale.setScalar(Math.random());

    donut.position.x = (Math.random() - 0.5) * 10;
    donut.position.y = (Math.random() - 0.5) * 10;
    donut.position.z = (Math.random() - 0.5) * 10;

    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;

    scene.add(donut);
  }

  console.timeEnd("donuts");
});

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
