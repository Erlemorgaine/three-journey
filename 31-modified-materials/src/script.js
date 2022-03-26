import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

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
 * Loaders
 */
const textureLoader = new THREE.TextureLoader();
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

/**
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      //   console.log(child.name, child.material.map);
      if (child.name === "brevno_brevno_0") {
        child.material = material;
        child.customDepthMaterial = depthMaterial;
      }

      child.material.envMapIntensity = 1;
      child.material.needsUpdate = true;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.jpg",
  "/textures/environmentMaps/0/nx.jpg",
  "/textures/environmentMaps/0/py.jpg",
  "/textures/environmentMaps/0/ny.jpg",
  "/textures/environmentMaps/0/pz.jpg",
  "/textures/environmentMaps/0/nz.jpg",
]);
environmentMap.encoding = THREE.sRGBEncoding;

scene.background = environmentMap;
scene.environment = environmentMap;

/**
 * Material
 */

// Textures
const mapTexture = textureLoader.load("/plants/textures/brevno_baseColor.png");
mapTexture.encoding = THREE.sRGBEncoding;

const normalTexture = textureLoader.load("/plants/textures/brevno_normal.png");
const metalicRoughness = textureLoader.load(
  "/plants/textures/brevno_metallicRoughness.png"
);

// Material
const material = new THREE.MeshStandardMaterial({
  map: mapTexture,
  normalMap: normalTexture,
  roughnessMap: metalicRoughness,
});

/**
 * DephtMaterial
 * We create a depth material, because the shadow depth material doesn't automatically
 * change if we change the shader. So we need to create a custom depth material for the shadows.
 */

const depthMaterial = new THREE.MeshDepthMaterial({
  // This will encode the depth in RGBA channels to have more precision
  depthPacking: THREE.RGBADepthPacking,
});

// We update the time in this object, since we can't access material.uniforms in tick
// since it's not a shader material
const uniforms = {
  uTime: { value: 0 },
};

// In this way we can get access to the shader of the material.
// So, in order to use this on the material, we need to add the textures manually.
material.onBeforeCompile = (shader) => {
  // Actually the shader has a lot of uniforms, from the material
  shader.uniforms.uTime = uniforms.uTime;

  // We checked which incllude to use and which variables are in it
  // by looking at the three js src/renderers/shaders

  // Here we replace common, since we are pretty sure this is in every material
  // We use a mat2, since we only need it on 2 axes (x, z)
  shader.vertexShader = shader.vertexShader.replace(
    "#include <common>",
    `
    #include <common>

    uniform float uTime;

    mat2 get2dRotateMatrix(float _angle)
      {
          return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
      }`
  );

  // Also we only have to change the normals here to fix the shadow on the
  // material. The problem is that the normals don't rotate along with the rotation,
  // so they keep having the wrong direction.
  shader.vertexShader = shader.vertexShader.replace(
    "#include <beginnormal_vertex>",
    `
    #include <beginnormal_vertex>

      // This works since sin(uTime) returns a value between -1 and 1,
      // so the negative values take care of change of direction.
      // The wrapping sin takes care of the warping effect
    float angle = sin(position.z + sin(uTime) * PI * -1.0);
      mat2 rotateMatrix = get2dRotateMatrix(angle);

      objectNormal.xy *= rotateMatrix;
  `
  );

  // Also begin_vertex sounds like it would be in every material.
  // Also we know it has a transformed variable by looking at the begin_vertex file
  shader.vertexShader = shader.vertexShader.replace(
    "#include <begin_vertex>",
    `
      #include <begin_vertex>

      transformed.xy *= rotateMatrix;
      transformed.y += sin(uTime);
      transformed.x -= 2.0;
    `
  );
};

// This is to fix the drop shadow (so the shadow that is cast on other objects)
// You can see that the shadow below the log is moving. For the shadow on the material
// we have to fix the normals on the material (depthMaterial is not relevant here)
depthMaterial.onBeforeCompile = (shader) => {
  // Actually the shader has a lot of uniforms, from the material
  shader.uniforms.uTime = uniforms.uTime;

  // We checked which incllude to use and which variables are in it
  // by looking at the three js src/renderers/shaders

  // Here we replace common, since we are pretty sure this is in every material
  // We use a mat2, since we only need it on 2 axes (x, z)
  shader.vertexShader = shader.vertexShader.replace(
    "#include <common>",
    `
    #include <common>

    uniform float uTime;

    mat2 get2dRotateMatrix(float _angle)
      {
          return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
      }`
  );

  // Also begin_vertex sounds like it would be in every material.
  // Also we know it has a transformed variable by looking at the begin_vertex file
  shader.vertexShader = shader.vertexShader.replace(
    "#include <begin_vertex>",
    `
      #include <begin_vertex>
      
      // This works since sin(uTime) returns a value between -1 and 1,
      // so the negative values take care of change of direction
      float angle = position.z + sin(uTime) * PI * -1.0;
      mat2 rotateMatrix = get2dRotateMatrix(angle);

      transformed.xy *= rotateMatrix;
      transformed.y += sin(uTime);
      transformed.x -= 2.0;

    `
  );
};

/**
 * Models
 */
gltfLoader.load("/plants/scene.gltf", (gltf) => {
  // Model
  const mesh = gltf.scene.children[0];
  //   mesh.rotation.y = Math.PI * 0.5;
  mesh.scale.setScalar(0.01);
  mesh.position.z += 5;

  scene.add(mesh);

  // Update materials
  updateAllMaterials();
});

/**
 * Plane to check shadow
 */
// const plane = new THREE.Mesh(
//   new THREE.PlaneBufferGeometry(125, 15, 15),
//   new THREE.MeshStandardMaterial()
// );

// plane.rotation.y = Math.PI;
// plane.position.y = -5;
// plane.position.z = 12;
// plane.position.x = -5;

// scene.add(plane);

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight("#ffffff", 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.25, 2, -2.25);
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
camera.position.set(4, 1, -4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 1;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let prevTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const sinTime = Math.sin(elapsedTime);

  uniforms.uTime.value = elapsedTime;

  prevTime = sinTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
