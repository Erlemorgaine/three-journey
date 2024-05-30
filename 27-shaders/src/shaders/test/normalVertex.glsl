
/**
* For ShaderMaterial, we don't need: 
* projectionMatrix
* viewMatrix
* modelMatrix
* position
* uv
*/

// Applies transformation based on clip space (space in which object exists)
uniform mat4 projectionMatrix;

// Applies transformations based on camera position / rotation / fov / near / far
uniform mat4 viewMatrix;

// Applies transformations based on mesh position / rotation / scale
// Removing this will stop showing anything
uniform mat4 modelMatrix;

// This is a mix between viewMatrix and modelMatrix
uniform mat4 modelViewMatrix;

uniform vec2 uFrequency;
uniform float uTime;
uniform vec3 uResolution;

// This is the vertex created in BufferAttribute
attribute vec3 position;
attribute float aRandom;
attribute vec2 uv;

// This will be sent to fragment shader
varying vec3 vPosition;
varying vec2 vUv;

// We cannot print here because it's not handled by the CPU, but by the GPU, that does 
// everything in parallel
void main()
{

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    // This determines position of vertices
    // Vec4 because xyz & w is for something with perspective
    // When removing projectionMatrix, viewMatrix, modelMatrix, we see what happens to plane
    // They should be in order
    // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

    gl_Position = projectionPosition;

    // Setup varying
    vPosition = position;
    vUv = uv;
}