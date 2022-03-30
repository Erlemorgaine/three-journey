import * as THREE from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { Camera } from "three";

/**
 * 3D models
 * - Like CTM, don't make models ourselves but reuse ones we find online
 * - But: this will cost some money
 * - Also: the weight can be a problem, especially for mobile.
 * - Weight has to do with amount of vertices.
 * - Solutions: We have to load separate textures for mobile
 * - Use simple / polygon shapes
 * - Also when we choose the model, the format is important:
 *   We want GLTF models!
 * - Also, the surface quality is important (cloud). It's difficult to do this.
 * - The knowledge we have right now: getting a model from the internet,
 *   changing it's lighting, metalness, roughness. The knowledge that we miss:
 *   making textures ourselves. We will have to see per model if we need
 *   an external person.
 *
 * SCENE:
 * - Show wireframes of a simple model and of the cloud
 *
 * @param {*} scene
 * @param {*} textureLoader
 */
export const slide4 = (scene, textureLoader, camera, controls, renderer) => {
  const material = new THREE.MeshBasicMaterial({
    wireframe: true,
    color: "hsl(50, 100%, 90%)",
  });

  // Add cube
  const cube = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), material);
  cube.position.set(-2.5, 1, 0);

  scene.add(cube);

  // Add sphere
  const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.35, 16, 16),
    material
  );
  sphere.position.set(-1, 1, 0);
  scene.add(sphere);

  // Add complex model
  const gltfLoader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  gltfLoader.setDRACOLoader(dracoLoader);

  gltfLoader.load("/models/sky/cloud/scene.gltf", (model) => {
    const object = model.scene.children[0];
    object.material = material;
    object.scale.setScalar(5);
    object.position.set(-2, -1.2, 0);

    scene.add(object);
  });

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
