/**
* For ShaderMaterial, we don't need: 
* precision mediump float
*/

// mediump is about float precision. 
// Highp is not performant, lowp can give not nice results and bugs
precision mediump float;

// This comes from vertex shader
varying float vRandom;
varying vec3 vPosition;

uniform vec3 uColor;
uniform float uTime;

// This is to use textures
uniform sampler2D uTexture;

void main()
{
    float alphax = vPosition.x > 0.0 ? (0.5 - vPosition.x) : (0.5 + vPosition.x);
    float alphay = vPosition.y > 0.0 ? (0.5 - vPosition.y) : (0.5 + vPosition.y);

    // Here you can see interpolation between values
    // This is pretty cool! The higer the random value (the higher the peak, 
    // the more it goes towards the color using vRandom)
    gl_FragColor = vec4(vPosition.y + uColor.r, uColor.g, vRandom + uColor.b, alphax + alphay);
}