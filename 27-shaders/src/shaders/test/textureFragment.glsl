// mediump is about float precision. 
// Highp is not performant, lowp can give not nice results and bugs
precision mediump float;

uniform vec3 uColor;

// This is to use textures
uniform sampler2D uTexture;

varying vec2 vUv;
varying float vElevation;
varying float vRandom;


void main()
{
    // First param: texture, second: uv coordinate that corresponds with current vertex 
    // vElevation is sin / cos, so goes from -1.0 tot 1.0 
    // (and actually -0.2 to 0.2, since we multiplied it)
   vec4 textureColor = texture2D(uTexture, vUv) + vElevation * 2.0;

   // Do this to only change rgb, not opacity
    // textureColor.rgb *= vElevation * 2.0 + 0.5;
    // textureColor.r *= vUv.x;
    // textureColor.b += vUv.y;

    textureColor.r += uColor.r - 0.5;
    textureColor.g += uColor.g;
    textureColor.b += uColor.b;
    textureColor.a = vRandom + 0.5;

    gl_FragColor = vec4(textureColor.r, textureColor.b, textureColor.g, textureColor.a);

    // You can debug by showing values with gl_FragColor
}