import * as THREE from "three";

/**
 *
 * Shapes
 * - Simple shapes: ok
 * - Complex shapes: less ok, since we have to invent / find the mathematical
 * - formula for it
 *
 * SCENE:
 * - On the left side: the particles spiral
 * - On the right side: text for simple shapes + some shapes (3d)
 *   and text for complex shape with picture of Fusione
 *
 * @param {*} scene
 * @param {*} textureLoader
 */
export const slide3 = (scene, textureLoader, camera, controls, renderer) => {
  const ambientLight = new THREE.AmbientLight("hsl(290, 0%,70%)", 0.8);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(
    "hsl(221, 100%, 75%)",
    0.6
  );

  directionalLight.position.set(1, 2, 3);
  scene.add(directionalLight);

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
    const radius = 0.6;

    if (i % 3 === 0) {
      // x
      angle = Math.PI * 2 * i * step;
      positions[i] = Math.cos(angle) * radius;
    } else if (i % 3 === 2) {
      // z
      positions[i] = Math.sin(angle) * radius;
    } else {
      // y
      positions[i] = i * step * 0.5 - particleAmount * step;
    }

    colors[i] = Math.random();
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
  particles.position.set(-2, 0, 0);
  particles.rotation.x = Math.PI * -0.05;
  scene.add(particles);

  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.13, 0.13, 0.13),
    new THREE.MeshStandardMaterial()
  );
  cube.position.y = 0.6;
  scene.add(cube);

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 16, 16),
    new THREE.MeshStandardMaterial()
  );
  sphere.position.y = 0.32;
  scene.add(sphere);

  const cone = new THREE.Mesh(
    new THREE.ConeBufferGeometry(0.1, 0.15, 32),
    new THREE.MeshStandardMaterial()
  );
  cone.position.y = 0.05;

  scene.add(cone);

  const torus = new THREE.Mesh(
    new THREE.TorusBufferGeometry(0.07, 0.03, 16, 32),
    new THREE.MeshStandardMaterial()
  );
  torus.position.y = -0.28;

  scene.add(torus);

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(0.15, 0.15),
    new THREE.MeshStandardMaterial()
  );
  plane.position.y = -0.6;

  scene.add(plane);

  const clock = new THREE.Clock();

  const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    particles.rotation.y = elapsedTime * 0.1;

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
  };

  tick();
};
