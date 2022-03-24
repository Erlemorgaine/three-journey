import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GeometryUtils } from "three/examples/jsm/utils/GeometryUtils";


/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

/**
 *
 * Mouse movement
 *
 */

// const cursor = { x: 0, y: 0 };

// window.addEventListener("mousemove", (e) => {
//   // We want the move value to be between 0 and 1
//   // AND we want it to go form negative to positive
//   cursor.x = e.clientX / sizes.width - 0.5;

//   // y goes from positive to negative
//   cursor.y = -(e.clientY / sizes.height - 0.5);
// });

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Scene
const scene = new THREE.Scene();

// Object
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
scene.add(mesh);

// Camera
// Don't use extreme values for near and far, because then z-fighting might occur:
// the GPU doesn't know which object to put in front if they have close to the same z values
// Better between at most 0.1 and 100
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);

// Params: left, right, top, buttom, since the camera does a 'parallel render'
// For these values you should have the aspect ration of the canvas, because the camera
// parallel view needs to correspons with the canvas to not stretch / squeeze objects
const aspectRatio = sizes.width / sizes.height;
// const camera = new THREE.OrthographicCamera(
//   -1 * aspectRatio,
//   1 * aspectRatio,
//   1,
//   -1,
//   0.1,
//   100
// );
// camera.position.x = 2;
// camera.position.y = 2;
camera.position.z = 3;
scene.add(camera);

/**
 * Controls
 */

const controls = new OrbitControls(camera, canvas);

// Adds inertia. But for this to work. controls should be updated on each frame.
controls.enableDamping = true;
// You can change the point that the camera focuses on. Call update whenever you changed controls
controls.target.y = 1;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Use this to rotate camera around an object
  // Since it moves in a wave on x and z axes
  // By multiplying result we move further away from cube
  // Math.PI to do a full rotation from canvas boundary to canvas boundary
  //   camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
  //   camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
  //   camera.position.y = cursor.y * 5;

  //  This makes it look like the cube stays in place, since you're focusing on it constantly
  //   camera.lookAt(mesh.position);

  // Update objects
  //   mesh.rotation.y = elapsedTime;

  // Render
  renderer.render(scene, camera);

  controls.update();

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
