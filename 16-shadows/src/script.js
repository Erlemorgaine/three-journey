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
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);

scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
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
directionalLightCamHelper.visible = false;
scene.add(directionalLightCamHelper);

const spotLight = new THREE.SpotLight(0xffffff, 0.4, 10, Math.PI * 0.3);
spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

spotLight.shadow.camera.fov = 30;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 6;

spotLight.position.set(0, 2, 2);

scene.add(spotLight);
scene.add(spotLight.target);

// It seems that the order matters, we should to this last
const spotLightCamHelper = new THREE.CameraHelper(spotLight.shadow.camera);
// scene.add(spotLightCamHelper);

// Point light does 6 renders for every direction,
// since it uses a perspective camera that looks in every direction
// Probably we see the helper looking down, because the last render is in that direction
// In any case, this is why point light + shadows is not so performant
const pointLight = new THREE.PointLight(0xffff, 0.3);
pointLight.castShadow = true;
pointLight.position.set(-1, 1, 0);
scene.add(pointLight);

const pointLightCamHelper = new THREE.CameraHelper(pointLight.shadow.camera);
// scene.add(pointLightCamHelper);

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.7;
gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);

/**
 * Use a baked shadow texture to add a shadow, more performant.
 * Use this with new THREE.MeshBasicMaterial({ map: bakeTexture }) ON THE PLANE
 * But for dynamic scenes it's difficult to use baked shadows
 *
 * The simpleShadow is an option that does work with dynamic scene:
 * you use a plane in combination with alphamap
 */
const textureLoader = new THREE.TextureLoader();
const bakeTexture = textureLoader.load("/textures/bakedShadow.jpg");
const simpleShadow = textureLoader.load("/textures/simpleShadow.jpg");

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

const sphereShadow = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
    color: 0xff,
    alphaMap: simpleShadow,
    transparent: true,
  })
);

sphereShadow.rotation.x = Math.PI * -0.5;
sphereShadow.position.y = plane.position.y + 0.01;

scene.add(sphereShadow);

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

// renderer.shadowMap.enabled = true;

// Here you can set shadowmap algorithms.
// They differ in performance and how soft they will be on the edges
// For this map, radius won't work anymore to set blur
// Default: PCFShadowMap
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Move sphere and its shadow
  sphere.position.x = Math.cos(elapsedTime);
  sphere.position.z = Math.sin(elapsedTime);
  sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));

  sphereShadow.position.x = Math.cos(elapsedTime);
  sphereShadow.position.z = Math.sin(elapsedTime);
  sphereShadow.material.opacity = 1.25 - sphere.position.y;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
