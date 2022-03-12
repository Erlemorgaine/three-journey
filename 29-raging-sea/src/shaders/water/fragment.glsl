uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;


varying float vElevation;


void main() {
    // Since the elevation can be quite small (e.g. 0.1), it might be that we never reach
    // the value 1 for each color. So we use an offset and multiplier.
    float tweakerElevation = (vElevation + uColorOffset) * uColorMultiplier ;
    vec3 waveColor = mix(uDepthColor, uSurfaceColor, tweakerElevation);

    gl_FragColor = vec4(waveColor, 1.0);
}