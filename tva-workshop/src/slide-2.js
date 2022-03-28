import * as THREE from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * Intro slide:
 * - At the start of CTM I was still a bit of a Noob
 * - Now I know way more thanks to Bruno Simon
 *
 * SCENE:
 * - 2 models of CTM
 * - Photof of Bruno with heart
 *
 * @param {*} scene
 * @param {*} textureLoader
 */
export const slide2 = (scene, textureLoader, camera, controls, renderer) => {
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const ambientLight = new THREE.AmbientLight("hsl(221, 40%, 95%)", 0.8);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(
    "hsl(221, 100%, 75%)",
    0.6
  );

  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  const gltfLoader = new GLTFLoader();

  gltfLoader.load("/models/sky/feathers/scene.gltf", (model) => {
    const object = model.scene.children[0];
    object.scale.setScalar(0.6);
    object.position.set(0.75, 1.5, -2);
    object.rotation.y = Math.PI * 0.5;

    scene.add(object);
  });

  gltfLoader.load("/models/earth/plant/scene.gltf", (model) => {
    const object = model.scene.children[0];

    object.scale.setScalar(0.009);
    object.position.set(-3, -3.5, 1);
    object.rotation.z = Math.PI;
    object.rotation.y = 0.3;

    scene.add(object);
  });
};
