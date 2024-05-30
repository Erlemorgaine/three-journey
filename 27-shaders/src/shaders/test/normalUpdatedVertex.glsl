
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
varying vec3 vView;

// We cannot print here because it's not handled by the CPU, but by the GPU, that does 
// everything in parallel
void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec2 frequency = vec2(2.0, 0.0);

    // Make waves by moving vertices z value based on x and y axis
    float elevation = sin(modelPosition.x * frequency.x * 2.0) * 0.05 
        + sin(modelPosition.y * frequency.y * 2.0) * 0.05;

    modelPosition.z += elevation;

    
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    // This determines position of vertices
    // Vec4 because xyz & w is for something with perspective
    // When removing projectionMatrix, viewMatrix, modelMatrix, we see what happens to plane
    // They should be in order
    // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

    vec4 viewM = viewMatrix * vec4(1.0);
    vec3 view = vec3(viewM.x, viewM.y, viewM.z);

    gl_Position = projectionPosition;

    // Setup varying
    vPosition = position;
    vView = view;
    vUv = uv;
}