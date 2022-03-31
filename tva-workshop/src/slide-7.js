import * as THREE from "three";

import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

/**
 *
 * Texts
 *
 * - We struggled to find a way that works across all browsers and
 *   with everything we wanted (e.g. underline).
 * - HTML is (for now) difficult. In theory it's doable, but we have to
 *   figure it out better (it will be a formazione project).
 * - Most doable for now: blocks of text that can have variation
 *   between lines, but no variation within lines (e.g. no bold,
 *   italic etc)
 * - I also had problems with the font conversion, CO2.
 *
 * @param {*} scene
 * @param {*} textureLoader
 */
export const slide7 = (scene, textureLoader, camera, controls, renderer) => {
  const matcapTexture1 = textureLoader.load("/textures/matcaps/2.jpeg");
  const matcapTexture2 = textureLoader.load("/textures/matcaps/4.jpeg");
  const matcapTexture3 = textureLoader.load("/textures/matcaps/5.jpeg");

  /**
   * Fonts
   * - One loader can instantiate multiple fonts
   */
  const fontLoader = new FontLoader();
  fontLoader.load("/fonts/DM_Sans_Regular.json", (font) => {
    const bevelSize = 0.02;
    const bevelThickness = 0.03;
    const line1Geometry = new TextGeometry("Something like this", {
      font,
      size: 0.15,
      height: 0.1, // Depth of font
      curveSegments: 5, // This determines the triangles, so better performance if lower
      bevelEnabled: true,
      bevelThickness,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 3, // This is about segments of rounding of characters in z dimension
    });

    const line2Geometry = new TextGeometry("is fairly easy", {
      font,
      size: 0.15,
      height: 0.1, // Depth of font
      curveSegments: 5, // This determines the triangles, so better performance if lower
      bevelEnabled: true,
      bevelThickness,
      bevelSize: 0.012,
      bevelOffset: 0,
      bevelSegments: 3, // This is about segments of rounding of characters in z dimension
    });

    const line3Geometry = new TextGeometry("to do", {
      font,
      size: 0.15,
      height: 0.1, // Depth of font
      curveSegments: 5, // This determines the triangles, so better performance if lower
      bevelEnabled: true,
      bevelThickness,
      bevelSize: 0.0002,
      bevelOffset: 0,
      bevelSegments: 3, // This is about segments of rounding of characters in z dimension
    });

    // This gives us access to geometry.boundingBox;
    // The bounding box consists of a min and max value (both Vector3), that, when
    // subtracted against each other, return the widht, height and depth of the box
    line1Geometry.computeBoundingBox();
    line2Geometry.computeBoundingBox();
    line3Geometry.computeBoundingBox();

    // .... But... we can also use the center method of BufferGeometry
    line1Geometry.center();
    line2Geometry.center();
    line3Geometry.center();

    const line1Material = new THREE.MeshMatcapMaterial({
      matcap: matcapTexture1,
    });
    const line2Material = new THREE.MeshMatcapMaterial({
      matcap: matcapTexture2,
    });
    const line3Material = new THREE.MeshMatcapMaterial({
      matcap: matcapTexture3,
    });
    const line1 = new THREE.Mesh(line1Geometry, line1Material);
    const line2 = new THREE.Mesh(line2Geometry, line2Material);
    const line3 = new THREE.Mesh(line3Geometry, line3Material);

    line1.position.set(1.1, 1, 0);
    line2.position.set(1.1, 0.75, 0);
    line3.position.set(1.1, 0.5, 0);

    scene.add(line1, line2, line3);
  });

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
