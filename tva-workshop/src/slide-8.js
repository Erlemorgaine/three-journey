import * as THREE from "three";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";

// Passes
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

/**
 *
 * Glow
 *
 * Glow is possible, but it remains difficult especially
 * - when objects have to rotate
 * - When some objects in the scene have glow, some don't, and theye're overlapping
 * - when they are complex shapes
 *
 * @param {*} scene
 * @param {*} textureLoader
 */
export const slide8 = (scene, textureLoader, camera, controls, renderer) => {
  /**
   * Sizes
   */
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  // BUT if pixelratio > 2, antialiasing is not necessary
  const retina = renderer.getPixelRatio() === 2;

  // In this way you can check if a browser supports WebGL2
  const supportsWebGl2 = renderer.capabilities.isWebGL2;

  // Render target: gets width, height and options.
  // This is exactly the same code as in EffectComposer.js
  const defaultRenderTarget = new THREE.WebGLRenderTarget(800, 600, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    stencilBuffer: false,
  });

  // This is how to make render target work with antialiasing.
  // Instead of this you apparently should use:
  // withAntiAliasRenderTarget.samples = 2; // (or more than 2, not clear)
  // But this doesn't work for me :()
  const withAntiAliasRenderTarget = new THREE.WebGLMultisampleRenderTarget(
    800,
    600,
    {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: false,
    }
  );

  /**
   * Lights
   */
  const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.set(1024, 1024);
  directionalLight.shadow.camera.far = 15;
  directionalLight.shadow.normalBias = 0.05;
  directionalLight.position.set(0.25, 2, -1.25);
  scene.add(directionalLight);

  const ambientLight = new THREE.AmbientLight("hsl(209, 50%, 20%)", 0.5);
  scene.add(ambientLight);

  /**
   * Fonts
   * - One loader can instantiate multiple fonts
   */
  const fontLoader = new FontLoader();
  fontLoader.load("/fonts/DM_Sans_Regular.json", (font) => {
    const bevelThickness = 0.03;
    const line1Geometry = new TextGeometry("Making things glow is", {
      font,
      size: 0.2,
      height: 0.05, // Depth of font
      curveSegments: 5, // This determines the triangles, so better performance if lower
      bevelEnabled: true,
      bevelThickness,
      bevelSize: 0.002,
      bevelOffset: 0,
      bevelSegments: 3, // This is about segments of rounding of characters in z dimension
    });

    const line2Geometry = new TextGeometry("DIFFICULT", {
      font,
      size: 0.2,
      height: 0.05, // Depth of font
      curveSegments: 5, // This determines the triangles, so better performance if lower
      bevelEnabled: true,
      bevelThickness,
      bevelSize: 0.002,
      bevelOffset: 0,
      bevelSegments: 3, // This is about segments of rounding of characters in z dimension
    });

    // This gives us access to geometry.boundingBox;
    // The bounding box consists of a min and max value (both Vector3), that, when
    // subtracted against each other, return the widht, height and depth of the box
    line1Geometry.computeBoundingBox();
    line2Geometry.computeBoundingBox();

    // .... But... we can also use the center method of BufferGeometry
    line1Geometry.center();
    line2Geometry.center();

    const line1Material = new THREE.MeshStandardMaterial({
      color: "hsl(209, 100%, 50%)",
    });
    const line2Material = new THREE.MeshBasicMaterial({
      color: "hsl(200, 100%, 50%)",
    });

    const line1 = new THREE.Mesh(line1Geometry, line1Material);
    const line2 = new THREE.Mesh(line2Geometry, line2Material);

    line1.position.y = 1;
    line2.position.y = 0.5;

    scene.add(line1, line2);
  });

  // By default, three js uses WebGLRenderTarget, our defaultRenderTarget
  const effectComposer = new EffectComposer(
    renderer,
    retina || !supportsWebGl2 ? defaultRenderTarget : withAntiAliasRenderTarget
  );
  effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  effectComposer.setSize(sizes.width, sizes.height);

  const renderPass = new RenderPass(scene, camera);
  //   renderPass.clear = false;
  effectComposer.addPass(renderPass);

  //   // Creates a black and white dot screen
  //   const dotScreenPass = new DotScreenPass();

  //   // Enable or disable a pass: it won't be used
  //   dotScreenPass.enabled = true;
  //   effectComposer.addPass(dotScreenPass);

  //   // Glitches the screen every now and then
  //   const glitchPass = new GlitchPass();
  //   // glitchPass.goWild = true; // Continues glitching
  //   glitchPass.enabled = false;
  //   effectComposer.addPass(glitchPass);

  //   // Kind of refracts the RGB channels on the edges
  //   const rgbShiftPass = new ShaderPass(RGBShiftShader);
  //   rgbShiftPass.enabled = false;
  //   effectComposer.addPass(rgbShiftPass);

  // Params: resolution, strength, radius, threshold
  const unrealBloomPass = new UnrealBloomPass(
    new THREE.Vector2(sizes.width, sizes.height),
    1,
    1.5,
    0
  );
  unrealBloomPass.enabled = true;
  effectComposer.addPass(unrealBloomPass);

  /**
   * Animate
   */
  const clock = new THREE.Clock();

  const tick = () => {
    // Update controls
    controls.update();

    // Render
    //   renderer.render(scene, camera);
    effectComposer.render();

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
  };

  tick();
};
