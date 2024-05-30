// Auroras by nimitz 2017 (twitter: @stormoid)
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License
// Contact the author for other licensing options

// NB TO make hash function work, use glsl 3.0
// How to: https://hub.packtpub.com/getting-started-opengl-es-30-using-glsl-30/
precision mediump float;

uniform vec3 uResolution;           // viewport resolution (in pixels)
uniform float uTime;

varying vec2 vUv;
varying vec3 vView;

mat2 mm2(in float a){float c = cos(a), s = sin(a);return mat2(c,s,-s,c);}
mat2 m2 = mat2(0.95534, 0.29552, -0.29552, 0.95534);
float tri(in float x){return clamp(abs(fract(x)-.5),0.01,0.49);}
vec2 tri2(in vec2 p){return vec2(tri(p.x)+tri(p.y),tri(p.y+tri(p.x)));}

float triNoise2d(in vec2 p, float spd)
{
    float z=1.8;
    float z2=2.5;
	float rz = 0.;
    p *= mm2(p.x*0.06);
    vec2 bp = p;
	for (float i=0.; i<5.; i++ )
	{
        vec2 dg = tri2(bp*1.85)*.75;
        dg *= mm2(uTime*spd);
        p -= dg/z2;

        bp *= 1.3;
        z2 *= .45;
        z *= .42;
		p *= 1.21 + (rz-1.0)*.02;
        
        rz += tri(p.x+tri(p.y))*z;
        p*= -m2;
	}
    return clamp(1./pow(rz*29., 1.3),0.,.55);
}

float hash21(in vec2 n){ return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453); }
vec4 aurora(vec3 ro, vec3 rd)
{
    vec4 col = vec4(0);
    vec4 avgCol = vec4(0);
    
    for(float i=0.;i<50.;i++)
    {
        // was gl_FragCoord
        // float of = 0.006*hash21(vUv.xy)*smoothstep(0.,15., i);

        float of = 0.006*hash21(vUv.xy)*smoothstep(0.,15., i);
        float pt = ((.8+pow(i,1.4)*.002)-ro.y)/(rd.y*2.+0.4);
        pt -= of;
    	vec3 bpos = ro + pt*rd;
        vec2 p = bpos.zx;
        float rzt = triNoise2d(p, 0.06);
        vec4 col2 = vec4(0,0,0, rzt);
        col2.rgb = (sin(1.-vec3(2.15,-.5, 1.2)+i*0.043)*0.5+0.5)*rzt;
        avgCol =  mix(avgCol, col2, .5);
        col += avgCol*exp2(-i*0.065 - 2.5)*smoothstep(0.,5., i);
        
    }
    
    col *= (clamp(rd.y*15.+.4,0.,1.));
    return col*1.8;
}


//-------------------Background and Stars--------------------

vec3 bg(in vec3 rd)
{
    float sd = dot(normalize(vec3(-0.5, -0.6, 0.9)), rd)*0.5+0.5;
    sd = pow(sd, 5.);
    vec3 col = mix(vec3(0.05,0.1,0.2), vec3(0.1,0.05,0.2), sd);
    return col*.1;
}
//-----------------------------------------------------------


void main()
{
    // was gl_FragCoord
	// vec2 q = gl_FragCoord.xy / uResolution.xy;
    vec2 q = vUv.xy;

    vec2 p = q - 0.5;
	p.x*=uResolution.x/uResolution.y;
    
    vec3 ro = vec3(0,0,-6.7);
    vec3 rd = normalize(vec3(p,1.3));
    
    // vec3 mouse = (vView * uResolution.x * -0.1) / uResolution -.5;
    // vec3 mouse = vec3(0.5) / uResolution -.5;

    // mouse = (mouse==vec3(-.5))?mouse=vec3(-0.1,0.1,0.1):mouse;
	// mouse.x *= uResolution.x/uResolution.y;
    // rd.yz *= mm2(mouse.y);
    // rd.xz *= mm2(mouse.x + sin(uTime*0.05)*0.2);
    
    vec3 col = vec3(0.);
    vec3 brd = rd;
    float fade = smoothstep(0.,0.01,abs(brd.y))*0.1+0.9;
    // float fade = 1.0;
    
    col = bg(rd)*fade;

    vec4 aur = smoothstep(0.,1.5,aurora(ro,rd))*fade;
    col = col*(1.-aur.a) + aur.rgb;

    float xAlpha = 1.0 - distance(abs(vUv.x - 0.5), 0.0) * 2.5;
    float yAlpha = 1.0 - distance(abs(vUv.y - 0.5), 0.0) * 2.5;

    float circleAlpha = distance(vUv, vec2(0.5)) * 1.5;
    
	gl_FragColor = vec4(col, min(xAlpha, yAlpha)  * 2.0);
	gl_FragColor = vec4(col, 1.0);
    gl_FragColor = vec4(vUv.x, vUv.y, 0.5, min(xAlpha, yAlpha) * 2.0);
}