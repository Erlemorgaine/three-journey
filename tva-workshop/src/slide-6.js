import * as THREE from "three";

/**
 *
 * Interactivity
 * - Adding camera rotation, pan, (on entire scene) and zoom is very easy
 * - Clicking / hovering pretty doable, but again doesn't work well with
 *   models with a lot of vertices
 * - Especially if you both have a scene that has an animation
 *   (e.g. rotation) AND objects overlapping each other AND
 *   interaction, it gets difficult
 * - Cloud for CTM was a problem, I had to optimise to make it work
 *
 * SCENE:
 * - Clickable object
 *
 * @param {*} scene
 * @param {*} textureLoader
 */
export const slide6 = (scene, textureLoader, camera, controls, renderer) => {
  const particleTexture = textureLoader.load("/textures/particles/4.png");

  const ambientLight = new THREE.HemisphereLight(
    "hsl(10, 100%, 50%)",
    "hsl(230, 100%, 50%)",
    1
  );
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(
    "hsl(221, 100%, 75%)",
    0.5
  );

  directionalLight.position.set(10, 10, 10);
  scene.add(directionalLight);

  const sphereGeometry = new THREE.SphereBufferGeometry(0.5, 32, 32);
  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: "hsl(20, 100%, 50%)",
    roughness: 0.5,
    metalness: 0.5,
  });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.name = "sphere";
  scene.add(sphere);

  directionalLight.position.set(10, 10, 10);
  scene.add(directionalLight);

  const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(0.25, 0.25),
    new THREE.MeshBasicMaterial({
      transparent: true,
      alphaMap: particleTexture,
    })
  );

  scene.add(plane);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  let prevColor;

  function onPointerMove(event) {
    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // update the picking ray with the camera and pointer position
    raycaster.setFromCamera(pointer, camera);

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects([sphere]);

    plane.position.set(
      pointer.x * 2 * (window.innerWidth / window.innerHeight),
      pointer.y * 2,
      1
    );

    // console.log(intersects[0]);
    if (intersects[0] && intersects[0].object.name === "sphere") {
      document.body.style.cursor = "pointer";
      if (!prevColor) {
        prevColor = sphere.material.color.clone();
        sphere.material.color.r = prevColor.r + 0.4;
        sphere.material.color.g = prevColor.g + 0.4;
        sphere.material.color.b = prevColor.b + 0.4;
      }
    } else {
      if (prevColor) sphere.material.color = prevColor;
      prevColor = null;
      document.body.style.cursor = "initial";
    }
  }

  function onClick(event) {
    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children);

    // console.log(intersects[0]);
    if (intersects[0] && intersects[0].object.name === "sphere") {
      sphere.material.color.set(`hsl(${Math.random() * 360}, 100%, 50%)`);
      ambientLight.color.set(`hsl(${Math.random() * 360}, 100%, 50%)`);
      ambientLight.groundColor.set(`hsl(${Math.random() * 360}, 100%, 50%)`);

      prevColor = sphere.material.color;
    }
  }

  window.addEventListener("pointermove", onPointerMove);
  document.addEventListener("click", onClick);

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
