 varying vec3 vColor;
 
 void main() {

     // gl_PointCoord comes out of the box in the fragment shader when using points
     vec2 pointsUv = gl_PointCoord;

     // Code for circle with sharp edge
    // float sharpCircle = step(distance(pointsUv, vec2(0.5)), 0.25);

    // Code for circle with blurry edge
    float blurryCircle = 1.0 - distance(pointsUv, vec2(0.5)) * 2.0;

    // Code for kind of point light
    // NB This is bad for performance, since the higher the power, the smaller the part you
    // use of the plane, so the bigger the plane needs to be
    float pointLightCircle = 1.0 - distance(pointsUv, vec2(0.5));
    pointLightCircle = pow(pointLightCircle, 5.0);

    // Here, instead of using pointLightCircle with alpha, we paint the 'transparent'
    // area black. We do this because Bruno wanted us to use the mix, neither version is better
    // for performance.
    vec3 mixColor = mix(vec3(0.0), vColor, pointLightCircle);

    // gl_FragColor = vec4(vColor, pointLightCircle);
    gl_FragColor = vec4(mixColor, 1.0);

}