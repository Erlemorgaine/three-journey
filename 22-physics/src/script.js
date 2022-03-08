import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import CANNON, { Vec3 } from "cannon";

/**
 * Stuff that we're not doing here but can be nice to use: Constraints. See docs.
 * Also: using workers to use different threads on the CPU (physics uses CPU).
 * Also: try Physijs, which uses Ammo.js You create both Three and physics object at the same time.
 */

/**
 * Debug
 */
const gui = new dat.GUI();
const debugObject = {
  createSphere() {
    createSphere(Math.random() * 0.35 + 0.15, {
      x: (Math.random() - 0.5) * 3,
      y: Math.random() * 3 + 2,
      z: (Math.random() - 0.5) * 3,
    });
  },
  createBoxes() {
    createBoxes(Math.random(), Math.random(), Math.random(), {
      x: (Math.random() - 0.5) * 3,
      y: Math.random() * 3 + 2,
      z: (Math.random() - 0.5) * 3,
    });
  },
  reset() {
    // Remove everything in scene
    objectsToUpdate.forEach((obj) => {
      obj.body.removeEventListener("collide", playHitSound);
      world.removeBody(obj.body);
      scene.remove(obj.mesh);
    });

    objectsToUpdate = [];
  },
};

gui.add(debugObject, "createSphere");
gui.add(debugObject, "createBoxes");
gui.add(debugObject, "reset");

const sphereRadius = 0.5;
const floorRotation = Math.PI * -0.5;

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const hitSound = new Audio("/sounds/hit.mp3");
const playHitSound = (collision) => {
  const impactStrength = collision.contact.getImpactVelocityAlongNormal();
  // Whenever a new box falls, reset sound playing, so that sounds don't wait on each other
  hitSound.currentTime = 0;

  let volume = 1 - 1 / (impactStrength * 0.6);

  if (volume < 0) volume = 0;
  if (volume > 1) volume = 1;

  hitSound.volume = volume;

  hitSound.play();
};

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.png",
  "/textures/environmentMaps/0/nx.png",
  "/textures/environmentMaps/0/py.png",
  "/textures/environmentMaps/0/ny.png",
  "/textures/environmentMaps/0/pz.png",
  "/textures/environmentMaps/0/nz.png",
]);

/**
 * Physics
 *
 * To use physics in a 3D scene, we need to create a world that's kinda like our scene,
 * but it calculates and predicts the movements of the objects on our scene.
 * Then, we copy those movements to our scene.
 */
const world = new CANNON.World();

// Add gravitiy to our world. The gravity constant on earth is -9.82
world.gravity.set(0, -9.82, 0);

// This is to improve performance by making sure that objects are not
// tested against other objects, i.e. 'go to sleep', when they are not / hardly moving.
// When they start moving (e.g. when they collide), they wake up and are tested again
world.allowSleep = true;
// You can also control sleepSpeedLimit and sleepTimeLimit, to control at
// what(low) speed and time objects go to sleep

// Broadphase determines how bodies collision is calculated.
// Default: naive broadphase, in which every body is calculated against every other body
// This is not very performant. Better to use SAPBroadphase (uses random axes) or
// GridBroadPhase (which uses a grid), though you can have problems when objects are moving really fast
world.broadphase = new CANNON.SAPBroadphase(world);

// Materials: are like Three js materials, but they set the properties for what happens if two bodies collide
// const concreteMaterial = new CANNON.Material("concrete");
// const plasticMaterial = new CANNON.Material("plastic");
const defaultMaterial = new CANNON.Material("default"); // easy: just use this everywhere

// const concretePlasticContactMaterial = new CANNON.ContactMaterial(
//   concreteMaterial,
//   plasticMaterial,
//   {
//     friction: 0.1, // low value makes body stop quick
//     restitution: 0.6, // how much an object is bouncing
//   }
// );

// easy: just use this everywhere
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1, // low value makes body stop quick
    restitution: 0.6, // how much an object is bouncing
  }
);

// in this way all bodies use this material and you dont need to set material on bodies
world.defaultContactMaterial = defaultContactMaterial;

// world.addContactMaterial(concretePlasticContactMaterial);

// We add bodies to the physics world (like our meshes in the 3D scene).
// Bodies are objects that fall and collide with other bodies.
// Bodies have a shape (like geometry)
// const sphereShape = new CANNON.Sphere(sphereRadius);
// const sphereBody = new CANNON.Body({
//   mass: 1, // How heavy the body is
//   position: new CANNON.Vec3(0, 2, 0),
//   shape: sphereShape,
//   material: plasticMaterial,
// });

// For applyForce, see in tick function
// Params:
// - vec3 (force)
// - position where to push the object
// sphereBody.applyLocalForce(
//   new CANNON.Vec3(150, 0, 0),
//   new CANNON.Vec3(0, 0, 0)
// );

// Cannon plane is infinite
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body({
  mass: 0, // When mass = 0, the body won't move
  shape: floorShape,
  //   material: concreteMaterial,
  // We keep the position in the center by not providing it
});

// You can add a lot of shapes to 1 body, with body.addShape()
// In CANNON, for rotation they only support quaternion

floorBody.quaternion.setFromAxisAngle(
  new Vec3(1, 0, 0), // We rotate x, see Three js plane
  // ATTENTION: if axis (param 1) is negative, rotation should be positive, and vice versa,
  // to have the 'above earth' side of plane face up
  floorRotation
);

// world.addBody(sphereBody);
world.addBody(floorBody);

/**
 * Test sphere
 */
// const sphere = new THREE.Mesh(
//   new THREE.SphereGeometry(sphereRadius, 32, 32),
//   new THREE.MeshStandardMaterial({
//     metalness: 0.3,
//     roughness: 0.4,
//     envMap: environmentMapTexture,
//     envMapIntensity: 0.5,
//   })
// );
// sphere.castShadow = true;
// sphere.position.y = 0.5;
// scene.add(sphere);

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#777777",
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  })
);
floor.receiveShadow = true;
floor.rotation.x = floorRotation;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
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
camera.position.set(-3, 3, 3);
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

let objectsToUpdate = [];

const sphereGeom = new THREE.SphereGeometry(1, 32, 32);
const sphereMat = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
  envMapIntensity: 0.5,
});

const boxGeom = new THREE.BoxGeometry(1, 1, 1);
const boxMat = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
  envMapIntensity: 0.5,
});

const createSphere = (radius, position) => {
  const sphere = new THREE.Mesh(sphereGeom, sphereMat);

  sphere.scale.setScalar(radius);
  sphere.castShadow = true;
  sphere.position.copy(position);
  scene.add(sphere);

  // For a Box (body), you have to provide the half extent which is basically
  // width, height and depth * 0.5 respectively
  // Like this: new CANNON.Box(new Vec3(width * 0.5, height * 0.5, z * 0.5))
  const sphereShape = new CANNON.Sphere(radius);
  const sphereBody = new CANNON.Body({
    mass: 1, // How heavy the body is
    shape: sphereShape,
  });

  sphereBody.position.copy(position);
  sphereBody.addEventListener("collide", playHitSound);

  world.addBody(sphereBody);
  objectsToUpdate.push({ mesh: sphere, body: sphereBody });
};

const createBoxes = (width, height, depth, position) => {
  const box = new THREE.Mesh(boxGeom, boxMat);

  box.scale.set(width, height, depth);
  box.castShadow = true;
  box.position.copy(position);
  scene.add(box);

  // For a Box (body), you have to provide the half extent which is basically
  // width, height and depth * 0.5 respectively
  // Like this: new CANNON.Box(new Vec3(width * 0.5, height * 0.5, z * 0.5))
  const boxShape = new CANNON.Box(
    new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5)
  );
  const boxBody = new CANNON.Body({
    mass: 1, // How heavy the body is
    shape: boxShape,
  });

  boxBody.position.copy(position);

  // Listen to event in physics world
  // It would be good to to this with throttle
  boxBody.addEventListener("collide", playHitSound);

  world.addBody(boxBody);
  objectsToUpdate.push({ mesh: box, body: boxBody });
};

createSphere(0.5, { x: 0, y: 2, z: 0 });

/**
 * Animate
 */
const clock = new THREE.Clock();
let oldElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  // Apply force for a constant, light wind
  //   sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position);

  // Update physics world with step function and params
  // - fixed timestamp: 1 / 60 because we run at 60 frames per second (will give same result for high frame screens)
  // - time passed since last step (prev tick)
  // - Amount of iterations the world can make to catch up with potential delay in the world
  world.step(1 / 60, deltaTime, 3);

  //   sphere.position.copy(sphereBody.position);

  objectsToUpdate.forEach((object) => {
    object.mesh.position.copy(object.body.position);
    // Also rotate object according to physics
    object.mesh.quaternion.copy(object.body.quaternion);
  });

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
