import "./style.css";
import * as THREE from "three";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/**
 * Sizes
 */
const sizes = {
  width: 800,
  height: 600,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

/**
 * Useful functions on Vector3 (such as position)
 */

// Get distance between center of scene and object
console.log("length", mesh.position.length());

// Get distance between object and another object (V3)
console.log("length", mesh.position.distanceTo(camera.position));

// Reduce vector length() and reduce it until it's 1 (so 1 away from center)
console.log("length", mesh.position.normalize());

// You can change the order in which axes rotate, this might help for reaching certain angles
// Write new order in reorder function. You should do this BEFORE you rotate
mesh.rotation.reorder("ZYX");

// Quaternion: alternative way to rotate, mathematically more difficult but in practice it might work better

// You can tell any object to look at something
camera.lookAt(mesh.position);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

