import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { PointLight } from "three";

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
 * Lights
 * 
// Types of light that can cast shadows:
// PointLight
// DirectionaLight
// SpotLight

 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);

scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(2, 2, -1);

gui.add(directionalLight, "intensity").min(0).max(1).step(0.001);
gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001);

scene.add(directionalLight);
directionalLight.castShadow = true;

// directionalLight.shadow is where the info about the shadowMap is stored
// You shouldn't make these map values too big, for performance
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;

// For directional light it's an orthographic camera, since rays are parallell
// We can set amplitude to make shadows more sharp (smaller amplitude)
directionalLight.shadow.camera.top = 1;
directionalLight.shadow.camera.right = 1;
directionalLight.shadow.camera.bottom = -1;
directionalLight.shadow.camera.left = -1;

directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;

// You can increase radius to blur the shadow
directionalLight.shadow.radius = 15;

// Helper to show the camera that the light uses to create shadowmaps
// You can use this.e.g. to adjust near and far, amplitude, etc, to optimise the camera and avoid bugs
const directionalLightCamHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
// directionalLightCamHelper.visible = false;
scene.add(directionalLightCamHelper);

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.7;
gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);

/**
 * Objects
 */
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);

// For each object, say if they can cast or receive shadow
sphere.castShadow = true;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;

plane.receiveShadow = true;

scene.add(sphere, plane);

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

  // Tell renderer to enable shadowmaps
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

renderer.shadowMap.enabled = true;
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
