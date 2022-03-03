import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

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
 * Fog
 * Params:
 * - color
 * - where fog starts in relation to camera
 * - where fog is fully opague in relation to camera
 */
const fogColor = "hsl(220, 30%, 50%)";
const fog = new THREE.Fog(fogColor, 1, 15);
scene.fog = fog;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const doorColorTex = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTex = textureLoader.load("/textures/door/alpha.jpg");
const doorAOTex = textureLoader.load("/textures/door/ambientOcclusion.jpg");
const doorHeightTex = textureLoader.load("/textures/door/height.jpg");
const doorNormalTex = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTex = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTex = textureLoader.load("/textures/door/roughness.jpg");

/**
 * House
 * We assume 1 unit === 1m
 */
const house = new THREE.Group();
scene.add(house);

// Walls
const houseHeight = 2.5;
const houseWidth = 4;
const walls = new THREE.Mesh(
  new THREE.BoxBufferGeometry(houseWidth, houseHeight, houseWidth),
  new THREE.MeshStandardMaterial({ color: "hsl(30, 40%, 50%)" })
);

walls.position.y = houseHeight * 0.5;

house.add(walls);

// Roof
const roofHeight = 1;
const roof = new THREE.Mesh(
  new THREE.ConeBufferGeometry(3.25, roofHeight, 4),
  new THREE.MeshStandardMaterial({ color: "hsl(10, 50%, 30%)" })
);

roof.position.y = houseHeight + roofHeight * 0.5;
roof.rotation.y = Math.PI * 0.25;

scene.add(roof);

// Door

const doorHeight = 2;

const door = new THREE.Mesh(
  // Add subdivision (more vertices) for height map
  new THREE.PlaneBufferGeometry(2.5, doorHeight, 50, 50),
  new THREE.MeshStandardMaterial({
    transparent: true,
    map: doorColorTex,
    alphaMap: doorAlphaTex,
    aoMap: doorAOTex,
    displacementMap: doorHeightTex,
    displacementScale: 0.15,
    roughnessMap: doorRoughnessTex,
    metalnessMap: doorMetalnessTex,
    normalMap: doorNormalTex,
  })
);

// This is necessary to provide uv mapping coordinates for ambient occlusion map
door.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);

door.position.z = houseWidth * 0.5 + 0.01;
door.position.y = doorHeight * 0.5;
house.add(door);

// Bushes

const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
  color: "hsl(100, 50%, 30%)",
});

const bushes = [];

[
  { scale: [0.5, 0.5, 0.5], position: [0.8, 0.2, 2.2] },
  { scale: [0.25, 0.25, 0.25], position: [1.4, 0.1, 2.1] },
  { scale: [0.4, 0.4, 0.4], position: [-0.8, 0.1, 2.2] },
  { scale: [0.15, 0.15, 0.15], position: [-1, 0.05, 2.6] },
].forEach((bushConf) => {
  const bush = new THREE.Mesh(bushGeometry, bushMaterial);

  bush.scale.set(...bushConf.scale);
  bush.position.set(...bushConf.position);

  bushes.push(bush);
  house.add(bush);
});

// Graves
const graves = new THREE.Group();
scene.add(graves);

const graveHeight = 0.8;
const graveGeometry = new THREE.BoxBufferGeometry(0.6, graveHeight, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({
  color: "hsl(100, 0%, 40%)",
});

for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2;

  // Radius should be from 3 to 9
  const radius = 3 + Math.random() * 6;

  // By default, when using Math.sin and Math.cos, the radius is 1
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.set(x, graveHeight * 0.4, z);
  grave.rotation.y = Math.PI * (Math.random() - 0.5) * 0.2;
  grave.rotation.z = Math.PI * (Math.random() - 0.5) * 0.2;

  graves.add(grave);
}

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: "#a9c388" })
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("hsl(230, 80%, 70%)", 0.3);
// gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight("hsl(230, 80%, 70%)", 0.3);
moonLight.position.set(4, 5, -2);
// gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
// gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
// gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
// gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);
scene.add(moonLight);

// Door light
// Params 1, 7: intensity, distance
const doorLight = new THREE.PointLight("hsl(30, 100%, 70%)", 1.5, 7);
doorLight.position.set(0, doorHeight + 0.3, 2.7);
house.add(doorLight);

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
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(fogColor);

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
