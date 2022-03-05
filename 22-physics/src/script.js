import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import CANNON, { Vec3 } from "cannon";

/**
 * Debug
 */
const gui = new dat.GUI();

const sphereRadius = 0.5;
const floorRotation = Math.PI * -0.5;

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.png",
  "/textures/environmentMaps/0/nx.png",
  "/textures/environmentMaps/0/py.png",
  "/textures/environmentMaps/0/ny.png",
  "/textures/environmentMaps/0/pz.png",
  "/textures/environmentMaps/0/nz.png",
]);

/**
 * Physics
 *
 * To use physics in a 3D scene, we need to create a world that's kinda like our scene,
 * but it calculates and predicts the movements of the objects on our scene.
 * Then, we copy those movements to our scene.
 */
const world = new CANNON.World();

// Add gravitiy to our world. The gravity constant on earth is -9.82
world.gravity.set(0, -9.82, 0);

// We add bodies to the physics world (like our meshes in the 3D scene).
// Bodies are objects that fall and collide with other bodies.
// Bodies have a shape (like geometry)
const sphereShape = new CANNON.Sphere(sphereRadius);
const sphereBody = new CANNON.Body({
  mass: 1, // How heavy the body is
  position: new CANNON.Vec3(0, 3, 0),
  shape: sphereShape,
});

// Cannon plane is infinite
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body({
  mass: 0, // When mass = 0, the body won't move
  shape: floorShape,
  // We keep the position in the center by not providing it
});

// You can add a lot of shapes to 1 body, with body.addShape()
// In CANNON, for rotation they only support quaternion

floorBody.quaternion.setFromAxisAngle(
  new Vec3(1, 0, 0), // We rotate x, see Three js plane
  // ATTENTION: if axis (param 1) is negative, rotation should be positive, and vice versa,
  // to have the 'above earth' side of plane face up
  floorRotation
);

world.addBody(sphereBody);
world.addBody(floorBody);

/**
 * Test sphere
 */
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(sphereRadius, 32, 32),
  new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  })
);
sphere.castShadow = true;
sphere.position.y = 0.5;
scene.add(sphere);

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#777777",
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  })
);
floor.receiveShadow = true;
floor.rotation.x = floorRotation;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

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
camera.position.set(-3, 3, 3);
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
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let oldElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  // Update physics world with step function and params
  // - fixed timestamp: 1 / 60 because we run at 60 frames per second (will give same result for high frame screens)
  // - time passed since last step (prev tick)
  // - Amount of iterations the world can make to catch up with potential delay in the world
  world.step(1 / 60, deltaTime, 3);

  sphere.position.copy(sphereBody.position);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
