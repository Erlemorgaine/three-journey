import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Textures
 */

// This is kinda happening behind the scenes
// const image = new Image();
// const texture = new THREE.Texture(image);

// image.onload = () => {
//   // Tell texture that the image is updated and so the texture also needs update
//   texture.needsUpdate = true;
// };

// image.src = "/textures/door/color.jpg";

// Loading manager is used to track process of all loaders (where it's used) together
// so you can use it to e.g. show progress bar
const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = () => {};
loadingManager.onLoad = () => {};
loadingManager.onProgress = () => {};
loadingManager.onError = () => {};

const textureLoader = new THREE.TextureLoader(loadingManager);
const colorTexture = textureLoader.load(
  // "/textures/checkerboard-1024x1024.png",
  "/textures/minecraft.png",
  // load
  () => {},
  // progress
  () => {},
  // error
  () => {}
);

// Repeat: amount of times you want to repeat texture
// But you need wrap to actually show it n times
// colorTexture.repeat.x = 3;
// colorTexture.repeat.y = 2;
// colorTexture.wrapS = THREE.MirroredRepeatWrapping; // Repeat on x
// colorTexture.wrapT = THREE.RepeatWrapping; // Repeat on y

// Determine start of texture
// colorTexture.offset.x = 0.5;

// You can only rotate in UV coordinates obviously
// colorTexture.rotation = Math.PI * 0.25;

// Rotation appears on 0, 0, so we should change this pivot point to center
colorTexture.center.x = 0.5;
colorTexture.center.y = 0.5;

// const alphaTexture = textureLoader.load("/textures/door/alpha.jpg");
// const heightTexture = textureLoader.load("/textures/door/height.jpg");
// const normalTexture = textureLoader.load("/textures/door/normal.jpg");
// const ambientOcclusionTexture = textureLoader.load(
//   "/textures/door/ambientOcclusion.jpg"
// );
// const metalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
// const roughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

// Min filters (minification filters) changes how texture is being fetch when object looks small
// It determines how mipmapping happens (so you can change blurriness)

// This prevents mipmapping from happening, better for performance
// You can do this when you're using NearestFilter in minFilter
colorTexture.generateMipmaps = false;
colorTexture.minFilter = THREE.NearestFilter; // Less blurry than default LinearFilter

// Maxification filter: when texture is small and object zoomed in / big, so pixels get stretched
colorTexture.magFilter = THREE.NearestFilter; // Again, doesn't stretch pixels in a blurry way, gives pixelated effect
// NearestFilter also is better for PERFORMANCE

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */

// UV unwrapping: the way a texture is wrapped a certain way around a geometry
// When you 'unwrap' the texture from the geometry, you get a flat plane with uv coordinates.
// Each vertex on the geometry also has uv coordinates that corresponds with coordinates on the texture
// We can see the coordinates on buffer geometries, on geometry.attributes
const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
console.log(geometry.attributes.uv);

// If you make your own geometry, you also have to indicate the uv coordinates yourself

const material = new THREE.MeshBasicMaterial({ map: colorTexture });
const mesh = new THREE.Mesh(geometry, material);
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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 1;
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
