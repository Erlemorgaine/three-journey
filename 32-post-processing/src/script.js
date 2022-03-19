import "./style.css";
import * as THREE from "three";
import { LinearFilter, RGBAFormat } from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as dat from "lil-gui";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";

// Passes
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { DotScreenPass } from "three/examples/jsm/postprocessing/DotScreenPass";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

// Shaders
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader";

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
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
const textureLoader = new THREE.TextureLoader();

/**
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      child.material.envMapIntensity = 2.5;
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
 * Models
 */
gltfLoader.load("/models/DamagedHelmet/glTF/DamagedHelmet.gltf", (gltf) => {
  gltf.scene.scale.set(2, 2, 2);
  gltf.scene.rotation.y = Math.PI * 0.5;
  scene.add(gltf.scene);

  updateAllMaterials();
});

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.25, 3, -2.25);
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

  // Update effect composer
  effectComposer.setSize(sizes.width, sizes.height);
  effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
renderer.toneMappingExposure = 1.5;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Post processing
 */

// NB: The effect composer doesn't support outputEncoding, to enforce it you need to put the
// correct shader in a pass at the end
// ALSO, when you have more than the render pass, antialiasing won't work, since
// WebGLRenderTarget doesn't support it, and EffectComposer uses WebGLRenderTarget OOTB.
// It works with no (other) pass, since then just the normal render will be used.

// Multiple solutions:
// - There is a type of render target that handles antialias, but won't work for all browsers
// - Use a pass to do antialias. But this is less perfomant (the more passes the less performance)
// - Mix of previous two solutions

// BUT if pixelratio > 2, antialiasing is not necessary
const retina = renderer.getPixelRatio() === 2;

// In this way you can check if a browser supports WebGL2
const supportsWebGl2 = renderer.capabilities.isWebGL2;

// Render target: gets width, height and options.
// This is exactly the same code as in EffectComposer.js
const defaultRenderTarget = new THREE.WebGLRenderTarget(800, 600, {
  minFilter: LinearFilter,
  magFilter: LinearFilter,
  format: RGBAFormat,
});

// This is how to make render target work with antialiasing.
// Instead of this you apparently should use:
// withAntiAliasRenderTarget.samples = 2; // (or more than 2, not clear)
// But this doesn't work for me :()
const withAntiAliasRenderTarget = new THREE.WebGLMultisampleRenderTarget(
  800,
  600,
  {
    minFilter: LinearFilter,
    magFilter: LinearFilter,
    format: RGBAFormat,
  }
);

// By default, three js uses WebGLRenderTarget, our defaultRenderTarget
const effectComposer = new EffectComposer(
  renderer,
  retina || !supportsWebGl2 ? defaultRenderTarget : withAntiAliasRenderTarget
);
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
effectComposer.setSize(sizes.width, sizes.height);

const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);

// Creates a black and white dot screen
const dotScreenPass = new DotScreenPass();

// Enable or disable a pass: it won't be used
dotScreenPass.enabled = false;
effectComposer.addPass(dotScreenPass);

// Glitches the screen every now and then
const glitchPass = new GlitchPass();
// glitchPass.goWild = true; // Continues glitching
glitchPass.enabled = false;
effectComposer.addPass(glitchPass);

// Kind of refracts the RGB channels on the edges
const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.enabled = false;
effectComposer.addPass(rgbShiftPass);

// Params: resolution, strength, radius, threshold
const unrealBloomPass = new UnrealBloomPass(
  new THREE.Vector2(sizes.width, sizes.height),
  1,
  1,
  0.5
);
unrealBloomPass.enabled = false;
effectComposer.addPass(unrealBloomPass);

gui.add(unrealBloomPass, "enabled");
gui.add(unrealBloomPass, "strength").min(0).max(2).step(0.01);
gui.add(unrealBloomPass, "radius").min(0).max(2).step(0.01);
gui.add(unrealBloomPass, "threshold").min(0).max(1).step(0.01);

// Creating our own passes

// TintPass

const TintShader = {
  uniforms: {
    // The effect composer will automatically add the render target containing the previous render to the shader
    tDiffuse: { value: null },
    uTint: { value: new THREE.Vector3() },
  },
  vertexShader: `
    varying vec2 vUv;

    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

      vUv = uv;
  }`,
  fragmentShader: `
  uniform sampler2D tDiffuse;
  uniform vec3 uTint;


    varying vec2 vUv;


    void main() {
        vec4 color = texture2D(tDiffuse, vUv);

        color.rgb += uTint;
      gl_FragColor = color;
  }`,
};

const tintPass = new ShaderPass(TintShader);
effectComposer.addPass(tintPass);

gui.add(tintPass.material.uniforms.uTint.value, "x").min(0).max(1).name("red");
gui
  .add(tintPass.material.uniforms.uTint.value, "y")
  .min(0)
  .max(1)
  .name("green");
gui.add(tintPass.material.uniforms.uTint.value, "z").min(0).max(1).name("blue");

// Wave Shader

const WaveShader = {
  uniforms: {
    // The effect composer will automatically add the render target containing the previous render to the shader
    tDiffuse: { value: null },
    uTime: { value: 0 },
  },
  vertexShader: `
    varying vec2 vUv;

    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

      vUv = uv;
  }`,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uTime;

    varying vec2 vUv;

    void main() {
        vec2 newUv = vec2(vUv.x, vUv.y + sin(vUv.x * 10.0 + uTime) * 0.1);
        vec4 color = texture2D(tDiffuse, newUv);

        gl_FragColor = color;
  }`,
};

const wavePass = new ShaderPass(WaveShader);
wavePass.enabled = false;
effectComposer.addPass(wavePass);

// Broken glass effect

// Wave Shader

const GlassShader = {
  uniforms: {
    // The effect composer will automatically add the render target containing the previous render to the shader
    tDiffuse: { value: null },
    uNormalMap: { value: null },
  },
  vertexShader: `
    varying vec2 vUv;

    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

      vUv = uv;
  }`,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform sampler2D uNormalMap;

    varying vec2 vUv;

    void main() {
        // * 2 - 1 because we need to go from 1 to -1 for texture
        vec3 normalColor = texture2D(uNormalMap, vUv).xyz * 2.0 - 1.0;

        // The * 0.1 makes the effect less strong
        vec2 newUv = vUv + normalColor.xy * 0.1;
        vec4 color = texture2D(tDiffuse, newUv);

        // Normalising direction to 1
        vec3 lightDirection = normalize(vec3(-1.0, 1.0, 0.0));

        // Dot project checks if vectors are pointing toward each other??
        // Anyway, the lightness adds light to one side of the beehive figure
        float lightness = dot(normalColor, lightDirection);

        // Clamp is to make sure we stay between 0 and 1
        lightness = clamp(lightness, 0.0, 1.0);

        // color.rgb += lightness;

        gl_FragColor = color;
  }`,
};

const glassPass = new ShaderPass(GlassShader);
glassPass.material.uniforms.uNormalMap.value = textureLoader.load(
  "/textures/interfaceNormalMap.png"
);

// glassPass.enabled = false;
effectComposer.addPass(glassPass);

// NB: The effect composer doesn't support outputEncoding,
// to enforce it you need to put this shader with shaderpass
const gammaCorrectPass = new ShaderPass(GammaCorrectionShader);
// gammaCorrectPass.enabled = false;
effectComposer.addPass(gammaCorrectPass);

if (!supportsWebGl2) {
  // Use this pass even later, for Safari to be able to have passes and antialiasing
  const smaaPass = new SMAAPass(sizes.width, sizes.height);
  // smaaPass.enabled = false;
  effectComposer.addPass(smaaPass);
}

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update wavePass uTime
  wavePass.material.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  //   renderer.render(scene, camera);
  effectComposer.render();

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
