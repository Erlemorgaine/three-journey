import "./style.css";

import * as dat from "lil-gui";

import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

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
 * AxesHelper
 */

// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/textures/matcaps/8.png");

/**
 * Fonts
 * - One loader can instantiate multiple fonts
 */
const fontLoader = new FontLoader();
fontLoader.load("/fonts/DM_Sans_Regular.json", (font) => {
  const bevelSize = 0.02;
  const bevelThickness = 0.03;
  const textGeometry = new TextGeometry("TVA Workshop Digital - 3D", {
    font,
    size: 0.25,
    height: 0.1, // Depth of font
    curveSegments: 5, // This determines the triangles, so better performance if lower
    bevelEnabled: true,
    bevelThickness,
    bevelSize,
    bevelOffset: 0,
    bevelSegments: 3, // This is about segments of rounding of characters in z dimension
  });

  // This gives us access to geometry.boundingBox;
  // The bounding box consists of a min and max value (both Vector3), that, when
  // subtracted against each other, return the widht, height and depth of the box
  textGeometry.computeBoundingBox();
  // We only move the geometry, not the mesh, so that mesh will rotate on its center
  // In BufferGeometry, we can use translate
  //   textGeometry.translate(
  //     (textGeometry.boundingBox.max.x - bevelSize) * -0.5,
  //     (textGeometry.boundingBox.max.y - bevelSize) * -0.5,
  //     (textGeometry.boundingBox.max.z - bevelThickness) * -0.5
  //   );
  // But now it's not exactly in the center. This is becayse we have a bevel size of 0.02,
  // so the boundingBox doesn't start at 0, 0, 0

  // .... But... we can also use the center method of BufferGeometry
  textGeometry.center();

  const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
  const text = new THREE.Mesh(textGeometry, textMaterial);

  scene.add(text);
});

/**
 * Textures
 */
 const particleTexture = textureLoader.load("/textures/particles/6.png");
 
 /**
  * Particle setup
  */
 
 // You will see this geometry, made up of n particles
 // const particleGeometry = new THREE.SphereBufferGeometry(1, 32, 32);
 const particleGeometry = new THREE.BufferGeometry();
 const particleAmount = 1000; // Vertices
 
 const positions = new Float32Array(particleAmount * 3);
 
 // Colors * 3, because it's rgb
 const colors = new Float32Array(particleAmount * 3);
 
 let angle;
 const step = 0.01;
 
 for (let i = 0; i < particleAmount * 3; i++) {

   // Combine with commented out animation
   positions[i] = (Math.random() - 0.5) * 10;
 
   // if (i % 3 === 2) {
   //   colors[i] = 1;
   // } else {
   colors[i] = Math.random();
   // }
 }
 
 particleGeometry.setAttribute(
   "position",
   new THREE.BufferAttribute(positions, 3)
 );
 
 particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
 
 const particlesMaterial = new THREE.PointsMaterial({
   size: 0.2, // Size of the particle
   // Creates perspective: how the particle looks at a certain distance from camera
   // Putting false makes all particles size of size
   sizeAttenuation: true,
   color: "hsl(330, 100%, 70%)", // Leaving baseCOlor with vertexColors mixes both
   vertexColors: true, // Indicates the colors in the geometry attributes should be used
   alphaMap: particleTexture,
   transparent: true,
   // This makes sure that pixels that are transparent (0, its default value) are not rendered
   // Fixes the bug that when a pixel is transparent but on top of the pixel of another
   // object that is drawn later, it will not show the pixel of the other object
   // More or less same result as depthWrite. But: doesn't work on pixels that are almost transparent
   // alphaTest: 0.001,
 
   // With depthTesting, the renderer will just turn off its trying to guess which object is closer to camera
   // dephtTest: false
 
   // DepthWrite: false: tells that the particles written to the depth buffer should not be drawn.
   // It's a good solution.
 
   // Possible alternative: blending.
   // BUT can be bad for performance
   depthWrite: false,
   blending: THREE.AdditiveBlending, // Makes overlaying pixels very bright
 });
 
 // Points
 const particles = new THREE.Points(particleGeometry, particlesMaterial);
 scene.add(particles);

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

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();