import * as THREE from "three";

import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

// 1, 2, 3, 5, 10
export const slide1 = (scene, textureLoader, camera, controls, renderer) => {
  /**
   * HTML
   */
  document.getElementById

  const matcapTexture = textureLoader.load("/textures/matcaps/1.jpeg");

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

    // .... But... we can also use the center method of BufferGeometry
    textGeometry.center();

    const textMaterial = new THREE.MeshMatcapMaterial({
      matcap: matcapTexture,
    });
    const text = new THREE.Mesh(textGeometry, textMaterial);

    scene.add(text);
  });

  /**
   * Textures
   */
  // 2, 8
  const particleTexture = textureLoader.load("/textures/particles/2.png");

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
   * Animate
   */
  const clock = new THREE.Clock();

  const tick = () => {
    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
  };

  tick();
};
