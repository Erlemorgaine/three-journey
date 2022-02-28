import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

/**
 * Debug UI
 */

const gui = new dat.GUI();

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */

scene.add(new THREE.AmbientLight(0xffffff, 0.5));

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);

/**
 * Textures
 */

const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAOTexture = textureLoader.load("/textures/door/ambientOcclusion.jpg");
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
const matcapTexture = textureLoader.load("/textures/matcaps/3.png");
const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");

/**
 * Materials
 */

// BASIC

// const material = new THREE.MeshBasicMaterial({
//   map: doorColorTexture,
// });

// material.color.set("hsl(240, 100%, 70%)"); // Use either set, or a Color()
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;
// material.side = THREE.DoubleSide; // Front is default

// NORMAL
// const material = new THREE.MeshNormalMaterial();

// Shows faces of material because every face has different color
// Used to debug normals
// material.flatShading = true;

// MATCAP
// const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

// MESH DEPTH MATERIAL
// const material = new THREE.MeshDepthMaterial();

// MESH LAMBERT MATERIAL
// const material = new THREE.MeshLambertMaterial();

// MESH PHONG MATERIAL
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100; // More defined light reflection

// Changes color of light reflection
// Test on white surfaces to really see the effect
// material.specular = new THREE.Color("hsl(20, 100%, 35%)");

// MESH PHONG MATERIAL
// const material = new THREE.MeshToonMaterial();

// This makes the toon lose cartoonish effect
// It tries to stretch the gradient using mip mapping
// By using nearestFilter we can use all the colors in gradient
// In that case we can also stop generating mipmaps
// gradientTexture.minFilter = THREE.NearestFilter;
// gradientTexture.magFilter = THREE.NearestFilter;
// gradientTexture.generateMipmaps = false;
// material.gradientMap = gradientTexture;

// MESH STANDARD MATERIAL
const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
material.side = THREE.DoubleSide;
// material.map = doorColorTexture;

// We should not combine this with metalness and roughness params,
// because they will overwrite them
// material.metalnessMap = doorMetalnessTexture;
// material.roughnessMap = doorRoughnessTexture;
// material.normalMap = doorNormalTexture;

// material.transparent = true;
// material.alphaMap = doorAlphaTexture;

material.normalScale.set(0.5, 0.5);

// You need to do this when material actually exist
// with min value, max value, and step
gui.add(material, "metalness", 0, 1, 0.001);
gui.add(material, "roughness", 0, 1, 0.001);

// Load an environment map
const cubeTextureLoader = new THREE.CubeTextureLoader();

// 1 path for every cube face
const envMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.jpg",
  "/textures/environmentMaps/0/nx.jpg",
  "/textures/environmentMaps/0/py.jpg",
  "/textures/environmentMaps/0/ny.jpg",
  "/textures/environmentMaps/0/pz.jpg",
  "/textures/environmentMaps/0/nz.jpg",
]);

// This makes texture reflect on objects
material.envMap = envMapTexture;

const sphere = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.25, 64, 64),
  material
);

sphere.position.x = -1.5;

// Third and fourth params are vertices
const plane = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(1, 1, 100, 100),
  material
);

const torus = new THREE.Mesh(
  new THREE.TorusBufferGeometry(0.15, 0.05, 64, 128),
  material
);

torus.position.x = 1.5;

// For AO, Three js wants us to apply another set of UV coordinates (to wrap texture).
// Here we want it on the same places as already existing uv coordinates
// material.aoMap = doorAOTexture;
// material.aoMapIntensity = 2;
gui.add(material, "aoMapIntensity", 0, 15, 1);

plane.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);

// For height map, we need enough vertices
// material.displacementMap = doorHeightTexture;
// material.displacementScale = 0.1;
gui.add(material, "displacementScale", 0, 1, 0.001);

// Add multiple objects
scene.add(sphere, plane, torus);

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

  sphere.rotation.y = elapsedTime * 0.2;
  plane.rotation.y = elapsedTime * 0.2;
  torus.rotation.y = elapsedTime * 0.2;

  sphere.rotation.x = elapsedTime * 0.1;
  plane.rotation.x = elapsedTime * 0.1;
  torus.rotation.x = elapsedTime * 0.1;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
