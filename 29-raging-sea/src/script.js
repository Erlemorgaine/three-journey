import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import fragmentShader from "./shaders/water/fragment.glsl";
import vertexShader from "./shaders/water/vertex.glsl";

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 });
const debugObject = {
  depthColor: "hsl(190, 100%, 25%)",
  surfaceColor: "hsl(210, 100%, 80%)",
};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512);

// Material
const waterMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uTime: { value: 0 },
    // Waves geometry
    uWavesSpeed: { value: 1 },
    uWavesElevation: { value: 0.1 },
    uWavesFrequency: { value: new THREE.Vector2(7.0, 5.0) },
    // Small waves noise
    uSmallWavesElevation: { value: 0.15 },
    uSmallWavesIteration: { value: 4 },
    uSmallWavesFrequency: { value: 3 },
    uSmallWavesSpeed: { value: 0.2 },

    // Colors
    uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
    uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
    uColorOffset: { value: 0.05 },
    uColorMultiplier: { value: 5 },
  },
});

gui
  .add(waterMaterial.uniforms.uWavesElevation, "value", 0, 1, 0.001)
  .name("WavesElevation");
gui
  .add(waterMaterial.uniforms.uWavesFrequency.value, "x", 0, 30, 1)
  .name("WavesFrequencyX");
gui
  .add(waterMaterial.uniforms.uWavesFrequency.value, "y", 0, 30, 1)
  .name("WavesFrequencyY");

gui
  .add(waterMaterial.uniforms.uWavesSpeed, "value", 0, 3, 0.01)
  .name("wavesSpeed");

gui
  .add(waterMaterial.uniforms.uSmallWavesElevation, "value", 0, 1, 0.01)
  .name("SmallWavesElevation");

gui
  .add(waterMaterial.uniforms.uSmallWavesIteration, "value", 0, 4, 1)
  .name("SmallWavesIteration");

gui
  .add(waterMaterial.uniforms.uSmallWavesFrequency, "value", 0, 30, 0.01)
  .name("SmallWavesFrequency");

gui
  .add(waterMaterial.uniforms.uSmallWavesSpeed, "value", 0, 4, 0.01)
  .name("smallWavesSpeed");

gui
  .addColor(debugObject, "depthColor")
  .onFinishChange(() =>
    water.material.uniforms.uDepthColor.value.set(debugObject.depthColor)
  );
gui
  .addColor(debugObject, "surfaceColor")
  .onFinishChange(() =>
    water.material.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)
  );

gui
  .add(waterMaterial.uniforms.uColorOffset, "value", 0, 1, 0.001)
  .name("ColorOffset");

gui
  .add(waterMaterial.uniforms.uColorMultiplier, "value", 0, 10, 0.1)
  .name("ColorMultiplier");

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI * 0.5;
scene.add(water);

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
camera.position.set(1, 1, 1);
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

  // Update water
  water.material.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
