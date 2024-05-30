/**
* For ShaderMaterial, we don't need: 
* precision mediump float
*/

// mediump is about float precision. 
// Highp is not performant, lowp can give not nice results and bugs
precision mediump float;

uniform vec3 uResolution; // viewport resolution (in pixels)
uniform float uTime;  // shader playback time (in seconds)

varying vec2 vUv;

vec3 palette(float d){
	return mix(vec3(0.2, 0.7 ,0.9),vec3(1.0, 1.0 ,1.0), d);
}

vec2 rotate(vec2 p, float a){
	float c = cos(a);
    float s = sin(a);
    return p*mat2(c,s,-s,c);
}

float map(vec3 p){
    // Changing i kinda change patterns and certainly changes size
    for( int i = 0; i<10; ++i){
        float t = 2.0*0.2;
        p.xz =rotate(p.xz,t);
        p.xy =rotate(p.xy,t*1.89);
        p.xz = abs(p.xz); // Removing this creates only small dot!
        p.xz-=0.2; // Reducing this reduces scale a lot so that small star remains
	}
	return dot(sign(p),p)/5.;
}

vec4 rm (vec3 ro, vec3 rd){
    float t = 0.0;
    vec3 col = vec3(0.0);
    float d;

    // i: Amount of very clearly defined particles or sth
    for(float i =0.0; i<44.0; i++){
		vec3 p = ro + rd*t;
        d = map(p)*0.5;
        if(d<0.02){
            break;
        }
        if(d>100.0){
        	break;
        }
        //col+=vec3(0.6,0.8,0.8)/(400.*(d));
        col+=palette(length(p)*0.1)/(100.0*(d));
        t+=d;
    }
    return vec4(col, 1.0 / (d * 30.0)); // OPACITY
}

void main()
{


    vec2 uv = (gl_FragCoord.xy - (uResolution.xy / 2.0)) / uResolution.x;
	vec3 ro = vec3(0.,0.,-50.);
    // ro.xz = rotate(ro.xz,uTime);
    vec3 cf = normalize(-ro);
    vec3 cs = normalize(cross(cf,vec3(0.,1.,0.)));
    vec3 cu = normalize(cross(cf,cs));
    
    vec3 uuv = ro+cf*3. + uv.x*cs + uv.y*cu;
    
    vec3 rd = normalize(uuv-ro);
    
    vec4 col = rm(ro,rd);
    
    
    gl_FragColor = col;
    // gl_FragColor = vec4(1.0, 0.5, 0.5, 1.0);
}


// // This comes from vertex shader
// varying vec3 vPosition;

// uniform vec3 uColor;
// // uniform float uTime;

// // This is to use textures
// uniform sampler2D uTexture;

// void main()
// {
//     float alphax = vPosition.x > 0.0 ? (0.5 - vPosition.x) : (0.5 + vPosition.x);
//     float alphay = vPosition.y > 0.0 ? (0.5 - vPosition.y) : (0.5 + vPosition.y);

//     // Here you can see interpolation between values
//     // This is pretty cool! The higer the random value (the higher the peak, 
//     // the more it goes towards the color using vRandom)
//     gl_FragColor = vec4(vPosition.y + uColor.r, uColor.g, uColor.b, alphax + alphay);
// }