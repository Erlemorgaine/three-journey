import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";

/**
 * Loaders
 */

const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

/**
 * Base
 */
// Debug
const gui = new dat.GUI();
const debugObject = {
  envMapIntensity: 5,
};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const updateMaterials = () => {
  scene.traverse((child) => {
    if (child.isMesh && child.material instanceof THREE.MeshStandardMaterial) {
      // We don't have to do this, handled by scene.environment
      //   child.material.envMap = envMap;
      // You can crank this up to check if environment map is applied well
      child.material.envMapIntensity = debugObject.envMapIntensity;

      // Don't do this normally! Bad for performance!
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

/**
 * Environment map
 */
const envMap = cubeTextureLoader.load([
  "/textures/environmentMaps/1/px.jpg",
  "/textures/environmentMaps/1/nx.jpg",
  "/textures/environmentMaps/1/py.jpg",
  "/textures/environmentMaps/1/ny.jpg",
  "/textures/environmentMaps/1/pz.jpg",
  "/textures/environmentMaps/1/nz.jpg",
]);

// Environment map uses LinearEncoding by default, since we use rRGBEncoding in the renderer we also want to use it with the env map
// ALL textures you can see should use sRGBEncoding. NOT the ones you can't see, such as normalMap.
// But, the GLTFLoader does this for us!
envMap.encoding = THREE.sRGBEncoding;
scene.background = envMap;

// Applies env map on every material
scene.environment = envMap;

gui
  .add(debugObject, "envMapIntensity")
  .min(0)
  .max(10)
  .step(0.001)
  .onFinishChange(updateMaterials);

/**
 * Model
 */
// gltfLoader.load("/models/Coffee/Double_Hot_Chocolate.glb", (model) => {
gltfLoader.load("/models/FlightHelmet/gLTF/FlightHelmet.gltf", (model) => {
  model.scene.scale.setScalar(8);
  //   model.scene.scale.setScalar(0.3);

  model.scene.position.y = -2;
  scene.add(model.scene);

  updateMaterials();
});

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight("#fff", 4.5);
directionalLight.position.set(-0.4, 0.8, -0.5);
directionalLight.castShadow = true;

// Optimise shadow
directionalLight.shadow.camera.far = 15;

// Increase quality of shadow
directionalLight.shadow.mapSize.set(1024, 1024);
scene.add(directionalLight);

// const lightCameraHelper = new THREE.CameraHelper(
//   directionalLight.shadow.camera
// );
// scene.add(lightCameraHelper);

gui
  .add(directionalLight, "intensity")
  .min(0)
  .max(10)
  .step(0.001)
  .name("lightIntensity");

gui
  .add(directionalLight.position, "x")
  .min(-5)
  .max(5)
  .step(0.001)
  .name("lightX");

gui
  .add(directionalLight.position, "y")
  .min(-5)
  .max(5)
  .step(0.001)
  .name("lightY");

gui
  .add(directionalLight.position, "z")
  .min(-5)
  .max(5)
  .step(0.001)
  .name("lightZ");

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
camera.position.set(4, 1, -4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */

// Antialiasing: fixes the problem of edges having a stairlike effect (e.g. instead of round)
// because the renderer has to choose which pixels are within the geometry, and which not.
// One solution: resize the renderer to x2 and then scale down, so that the pixel sizes becmome smaller.
// This is called Super Sampling (SSAA). But with this solution you have to render 4x more pixels.
// It only works if you don't have a lot in your scene.
// Other solution: Multisampling (MSAA), only use 2x as much pixels on the edges.
// This is activated by antialias: true. Do this when you instatiate!!

// BUT!!! best to activate this only for pixelRatio > 1, since above that we don't need it
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Default: LinearEncoding. But this handles light way better.
renderer.outputEncoding = THREE.sRGBEncoding;

// This is to make PBR lights that are consistent across multiple software
// (like Blender and Three.js)
renderer.physicallyCorrectLights = true;

// Tonemapping: using algorithms to achieve the effect of using HDR (where rgb values can go above 1)
// Kinda rusty/dusty/desertlike
renderer.toneMapping = THREE.ReinhardToneMapping;

// More contrast
renderer.toneMapping = THREE.CineonToneMapping;

// Also more contrast
renderer.toneMapping = THREE.ACESFilmicToneMapping;

// Here we can add more light to the scene
renderer.toneMappingExposure = 2;

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

gui
  .add(renderer, "toneMapping", {
    No: THREE.NoToneMapping,
    linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACES: THREE.ACESFilmicToneMapping,
  })
  .onFinishChange(() => {
    // We have to convert it back to a number since dat.gui returned it to us as a string
    renderer.toneMapping = +renderer.toneMapping;

    // NB Bruno says that we also have to call needsUpdate on al material in order to apply
    // the new tonemapping to the materials, but for me it seems to work also without doing that.
    // In any case, to do that we need to call updateAllMaterials() and in there, call child.material.needsUpdate = true
  });

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
