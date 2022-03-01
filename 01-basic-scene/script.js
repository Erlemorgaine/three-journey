const scene = new THREE.Scene();

const geom = new THREE.BoxGeometry(1, 1, 1);
const mat = new THREE.MeshBasicMaterial({ color: "green" });
const cube = new THREE.Mesh(geom, mat);

scene.add(cube);

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

/**
 * Params:
 *
 * fov: vertical angle (in degrees) of field of camera.
 * - with a large fov you can see far on left and right
 * - with a small one, you can see a small field very far away from you.
 *  and far objects will look more distorted
 *
 * aspectRatio: width / height of canvas
 *
 * renderer: Renders scene, but seen through camera pov
 *
 *
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Renderer
const canvas = document.getElementById("webgl");
const renderer = new THREE.WebGLRenderer({
  canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
