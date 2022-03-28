import * as THREE from "three";

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
export const slide4 = (scene, textureLoader) => {};
