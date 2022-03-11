import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

// To be able to load this, you need to allow shaders in webpack, see webpack.common.js
import spikyVertexShader from "./shaders/test/spikyVertex.glsl";
import blobbyFragmentShader from "./shaders/test/blobbyFragment.glsl";
import textureFragmentShader from "./shaders/test/textureFragment.glsl";

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
const flagTexture = textureLoader.load("/textures/flag-french.jpg");

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 256, 256);

// Get count of vertices
const count = geometry.attributes.position.count;
const randoms = new Float32Array(count);

for (let i = 0; i < count; i++) {
  randoms[i] = Math.random() - 0.5;
}

// Pass attribute to shader
// Good practice: with attribute, use u. With uniform, use u. With varying, use v.
geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

// Material
const material = new THREE.RawShaderMaterial({
  vertexShader: spikyVertexShader,
  fragmentShader: textureFragmentShader,
  //   fragmentShader: blobbyFragmentShader,
  transparent: true,
  uniforms: {
    uFrequency: { value: new THREE.Vector2(10, 5) },
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("hsl(20, 100%, 50%)") },
    uTexture: { value: flagTexture },
  },
  // There are some properties that still work, but others that won't,
  // since they will be handled by the fragment shader
});

gui
  .add(material.uniforms.uFrequency.value, "x")
  .min(0)
  .max(20)
  .step(0.1)
  .name("frequencyX");
gui
  .add(material.uniforms.uFrequency.value, "y")
  .min(0)
  .max(20)
  .step(0.1)
  .name("frequencyY");

gui
  .add(material.uniforms.uColor.value, "r")
  .min(0)
  .max(1)
  .step(0.01)
  .name("colorR");

gui
  .add(material.uniforms.uColor.value, "g")
  .min(0)
  .max(1)
  .step(0.01)
  .name("colorG");

gui
  .add(material.uniforms.uColor.value, "b")
  .min(0)
  .max(1)
  .step(0.01)
  .name("colorB");

// Mesh
const mesh = new THREE.Mesh(geometry, material);
mesh.scale.setScalar(1.25);
scene.add(mesh);

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
camera.position.set(0.25, -0.25, 1);
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

  // Update material
  material.uniforms.uTime.value = elapsedTime * 0.5;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
