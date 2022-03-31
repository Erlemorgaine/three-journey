
// Defines are like constants, theyll never change;
#define PI 3.1415926535897932384626433832795

varying vec2 vUv;

float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}


//	Classic Perlin 2D Noise 
//	by Stefan Gustavson
//
vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

void main()
{
    // uv goes from 0,0 bottom left to 1,1 top right

    // Pattern 1
    gl_FragColor = vec4(vUv, 1.0, 1.0);


    // Pattern 2
    gl_FragColor = vec4(vUv, 0.0, 1.0);


    // Pattern 3
    // (Pattern 4 is with y)
    // float strength = vUv.x;

    // gl_FragColor = vec4(vec3(strength),  1.0);


    // Pattern 5
    // float strength = 1.0 - vUv.y;

    // gl_FragColor = vec4(vec3(strength),  1.0);


    // Pattern 6
    // float strength = vUv.y * 10.0;

    // gl_FragColor = vec4(vec3(strength),  1.0);


    // Pattern 7
    // mod = modulo
    // float strength = mod(vUv.y * 10.0, 1.0) ;

    // gl_FragColor = vec4(vec2(strength), 1.0,  1.0);


    // Pattern 8
    
    // float strength = mod(vUv.y * 10.0, 1.0); 

    // // strength = strength > 0.5 ? 1.0 : 0.0 ;
    // // ... BUT... conditions are bad for performance. Use instead a step function
    // strength = step(strength, 0.5);

    // gl_FragColor = vec4(vec2(strength), 0.5,  1.0);


    // Pattern 9
    
    // float strength = mod(vUv.y * 10.0, 1.0); 
    // strength = step(strength, 0.2);

    // gl_FragColor = vec4(vec2(strength), 0.5,  1.0);


    // Pattern 10
    
    // float strength = mod(vUv.x * 10.0, 1.0); 
    // strength = step(strength, 0.2);

    // gl_FragColor = vec4(vec2(strength), 0.5,  1.0);



    // Pattern 11
    
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0)); 
    // strength += step(0.8, mod(vUv.y * 10.0, 1.0)); 

    // gl_FragColor = vec4(vec3(strength),  1.0);


    // Pattern 12
    
    // It's like an || operation: only where the lines cross each other 
    // the result of the * operation is 1
    // (with + operator it would have been 2)
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0)); 
    // strength *= step(0.8, mod(vUv.y * 10.0, 1.0)); 


    // gl_FragColor = vec4(vec3(strength),  1.0);


    // Pattern 13
    
    // float strength = step(0.4, mod(vUv.x * 10.0, 1.0)); 
    // strength *= step(0.8, mod(vUv.y * 10.0, 1.0)); 


    // gl_FragColor = vec4(vec3(strength),  1.0);


      // Pattern 14
    
    // float barx = step(0.4, mod(vUv.x * 10.0, 1.0)); 
    // barx *= step(0.8, mod(vUv.y * 10.0, 1.0)); 

    // float bary = step(0.4, mod(vUv.y * 10.0, 1.0)); 
    // bary *= step(0.8, mod(vUv.x * 10.0, 1.0)); 

    // float strength = barx + bary;


    // gl_FragColor = vec4(vec3(strength),  1.0);



     // Pattern 15
    
    // // Get crosses by offsetting outcome of vuv * 10 by 0.2
    // float barx = step(0.4, mod(vUv.x * 10.0 - 0.2, 1.0)); 
    // barx *= step(0.8, mod(vUv.y * 10.0, 1.0)); 

    // float bary = step(0.4, mod(vUv.y * 10.0 - 0.2, 1.0)); 
    // bary *= step(0.8, mod(vUv.x * 10.0, 1.0)); 

    // float strength = barx + bary;


    // gl_FragColor = vec4(vec3(strength),  1.0);


     // Pattern 16
    
    // float strength = abs(vUv.x - 0.5);

    // gl_FragColor = vec4(vec3(strength),  1.0);


    //  // Pattern 17
    
    // // Get minimum between two values
    // float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

    // gl_FragColor = vec4(vec3(strength),  1.0);


    //  // Pattern 18
    
    // // Get max between two values
    // float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

    // gl_FragColor = vec4(vec3(strength),  1.0);


     // Pattern 19
     
    // // Get max between two values
    // // Other way
    // // float strength = max(step(0.25, abs(vUv.x - 0.5)), step(0.25, abs(vUv.y - 0.5)));
    // float strength = step(0.25, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));


    // gl_FragColor = vec4(vec3(strength),  1.0);


    // Pattern 20
     
    // My solution
    // float strength = 1.0 - (step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5))) + step(max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)), 0.15));

    // Solution in tutorial:
    // float square1 = 1.0 - step(0.25, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    // float square2 = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
    // float strength  = square1 * square2;


    // gl_FragColor = vec4(vec3(strength),  1.0);


    // // Pattern 21

    // // Solution in tutorial:
    // float strength  = vUv.x - mod(vUv.x, 0.1);
    // // Tutorial solution
    // // float strength = floor(vUv.x * 10.0) * 0.1;


    // gl_FragColor = vec4(vec3(strength),  1.0);


    //  // Pattern 22

    // // Solution in tutorial:
    // float strength  = (vUv.x - mod(vUv.x, 0.1)) * (vUv.y - mod(vUv.y, 0.1) );
    // // Tutorial solution
    // // float strength = floor(vUv.x * 10.0) * 0.1;


    // gl_FragColor = vec4(vec3(strength),  1.0);


    // // Pattern 23
    
    // // This function mimics randomness,but you will always get the same result
    // float strength = rand(vUv);

    // gl_FragColor = vec4(vec3(strength),  1.0);


    // // Pattern 24
    
    // // This function mimics randomness,but you will always get the same result
    // float strength = rand(vec2(
    //     floor(vUv.x * 10.0) * 0.1, 
    //     floor(vUv.y * 10.0) * 0.1
    // ));

    // gl_FragColor = vec4(vec3(strength),  1.0);



     // Pattern 25
    
    // This function mimics randomness,but you will always get the same result
    // float strength = rand(vec2(
    //     floor(vUv.x * 10.0) * 0.1, 
    //     floor(vUv.y * 10.0 + vUv.x * 5.0) * 0.1
    // ));

    // gl_FragColor = vec4(vec3(strength),  1.0);



    //  // Pattern 26

    // // Tutorial solution: length of vector, i.e. of the line
    // // when drawing point (x, y) on the plane
    // float strength = length(vUv);

    // gl_FragColor = vec4(vec3(strength),  1.0);


    // // Pattern 27

    // // Tutorial solution: length of vector, i.e. of the line
    // // when drawing point (x, y) on the plane
    // float strength = length(vUv - 0.5);

    // // Or: distance. Provides distance between vUv and point (for x and y)
    // strength = distance(vUv, vec2(0.5));
    // strength = distance(vUv, vec2(0.25));


    // gl_FragColor = vec4(vec3(strength),  1.0);



    // // Pattern 28

    // // Distance. Provides distance between vUv and point (for x and y)
    // float strength = 1.0 - distance(vUv, vec2(0.5));


    // gl_FragColor = vec4(vec3(strength),  1.0);


    // // Pattern 29

    // // This one is really nice, like a pointlight
    // float strength = 0.02 / distance(vUv, vec2(0.5)) - 0.05;


    // gl_FragColor = vec4(vec3(strength),  1.0);



    // // Pattern 30

    // // This one is really nice, like a pointlight
    // float strength = 0.1 / distance(vec2(vUv.x , vUv.y * 5.0 ), vec2(0.5, 2.5));


    // gl_FragColor = vec4(vec3(strength),  1.0);


    // // Pattern 31

    // // This one is really nice, like a pointlight
    // float strength = 0.25 / distance(vec2(vUv.x * 2.0, vUv.y * 10.0 ), vec2(1.0, 5.0));
    // strength *= 0.25 / distance(vec2(vUv.y * 2.0, vUv.x * 10.0 ), vec2(1.0, 5.0));


    // gl_FragColor = vec4(vec3(strength),  1.0);


    // // Pattern 32

    // // This one is really nice, like a pointlight

    // vec2 rotatedUv = rotate(vUv, PI * 0.25, vec2(0.5));

    // float strength = 0.25 / distance(vec2(rotatedUv.x * 2.0, rotatedUv.y * 10.0 ), vec2(1.0, 5.0));
    // strength *= 0.25 / distance(vec2(rotatedUv.y * 2.0, rotatedUv.x * 10.0 ), vec2(1.0, 5.0));


    // gl_FragColor = vec4(vec3(strength),  1.0);


    // // Pattern 33

    // // This one is really nice, like a pointlight

    // float strength = step(0.25, length(vUv - 0.5));


    // gl_FragColor = vec4(vec3(strength),  1.0);


    // // Pattern 34

    // float strength = abs(distance(vUv, vec2(0.5)) - 0.25);

    // gl_FragColor = vec4(vec3(strength),  1.0);


    // // Pattern 35

    // float strength = step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));

    // gl_FragColor = vec4(vec3(strength),  1.0);


    //  // Pattern 36

    // float strength = step(abs(distance(vUv, vec2(0.5)) - 0.25), 0.01);

    // gl_FragColor = vec4(vec3(strength),  1.0);


    //   // Pattern 37

    // // The multiplication inside sin decides amount of waves (frequency)
    // vec2 waveUv = vec2(vUv.x, vUv.y + sin(vUv.x * 30.0) * 0.1);

    // float strength = step(abs(distance(waveUv, vec2(0.5)) - 0.25), 0.01);

    // gl_FragColor = vec4(vec3(strength),  1.0);


    //  // Pattern 38

    // // The multiplication inside sin decides amount of waves (frequency)
    // vec2 waveUv = vec2(vUv.x + sin(vUv.y * 30.0) * 0.1, vUv.y + sin(vUv.x * 30.0) * 0.1);

    // float strength = step(abs(distance(waveUv, vec2(0.5)) - 0.25), 0.01);

    // gl_FragColor = vec4(vec3(strength),  1.0);


    //  // Pattern 39

    // // The multiplication inside sin decides amount of waves (frequency)
    // vec2 waveUv = vec2(vUv.x + sin(vUv.y * 100.0) * 0.1, vUv.y + sin(vUv.x * 100.0) * 0.1);

    // float strength = step(abs(distance(waveUv, vec2(0.5)) - 0.25), 0.01);

    // gl_FragColor = vec4(vec3(strength),  1.0);


    //  // Pattern 40

    // // This is to get the angle of a vector 2, but i don't entirely get the math
    // // I think it goes from 0 on y axis with x = 0 to PI * 0.5 on x axis with y = 1
    // float strength = atan(vUv.x, vUv.y);

    // gl_FragColor = vec4(vec3(strength),  1.0);


 //  // Pattern 41

    // // This is to get the angle of a vector 2, but i don't entirely get the math
    // // I think it goes from 0 on y axis with x = 0 to PI * 0.5 on x axis with y = 1

    // float strength = atan(vUv.x - 0.5, vUv.y - 0.5);

    // gl_FragColor = vec4(vec3(strength),  1.0);



    //  // Pattern 42

    // // This is to get the angle of a vector 2, but i don't entirely get the math
    // // I think it goes from 0 on y axis with x = 0 to PI * 0.5 on x axis with y = 1

    // // This (angle - PI) goes from 0 to PI * 2, i think. We have to make it go from 0 to 1
    // float strength = (atan(vUv.x - 0.5, vUv.y - 0.5) + PI) / (PI * 2.0);

    // gl_FragColor = vec4(vec3(strength),  1.0);


    // // Pattern 43

    // // This (angle - PI) goes from 0 to PI * 2, i think. We have to make it go from 0 to 1
    // float strength = (atan(vUv.x - 0.5, vUv.y - 0.5) + PI) / (PI * 2.0);
    // strength = mod(strength * 20.0, 1.0);

    // gl_FragColor = vec4(vec3(strength),  1.0);


    //  // Pattern 44

    // // This (angle - PI) goes from 0 to PI * 2, i think. We have to make it go from 0 to 1
    // float strength = (atan(vUv.x - 0.5, vUv.y - 0.5) + PI) / (PI * 2.0);
    // strength = sin(strength * 100.0);

    // gl_FragColor = vec4(vec3(strength),  1.0);


    //  // Pattern 45

    // float angle = (atan(vUv.x - 0.5, vUv.y - 0.5) + PI) / (PI * 2.0);
    // float sinusoid = sin(angle * 100.0);

    // Add the waved angle to the radius
    // // Varying the multiplying factor can have really nice results
    // float radius = 0.25 + sinusoid * 0.25;
    // float strength = 1.0 - step(0.01, abs(distance(vec2(vUv.x, vUv.y ), vec2(0.5)) - radius));

    // gl_FragColor = vec4(vec3(strength),  1.0);


    // // Pattern 46

    // // Perlin noise
    // float strength = cnoise(vUv * 10.0);

    // gl_FragColor = vec4(vec3(strength),  1.0);


    // // Pattern 47

    // // Perlin noise
    // // To get sharp lines we can actually do 0.0, since perlin noise goes from -something to +something
    // float strength = step(0.0, cnoise(vUv * 10.0));

    // gl_FragColor = vec4(vec3(strength),  1.0);


    //  // Pattern 48

    // // Perlin noise
    // // Cool glowing lines
    // // float strength = cnoise(vUv * 10.0);
    // float strength = 1.0 - abs(cnoise(vUv * 10.0));

    // gl_FragColor = vec4(vec3(strength),  1.0);


    // // Pattern 49

    // // Perlin noise
    // // Cool glowing lines
    // // float strength = cnoise(vUv * 10.0);
    // float strength = sin(cnoise(vUv * 10.0) * 20.0);

    // gl_FragColor = vec4(vec3(strength),  1.0);


    //  // Pattern 50

    // // Perlin noise
    // // Cool glowing lines
    // // float strength = cnoise(vUv * 10.0);
    // float strength = step(0.95, sin(cnoise(vUv * 10.0) * 20.0));

    // gl_FragColor = vec4(strength , strength, strength,  1.0);


     // Pattern 50 COLOR

    // Perlin noise
    // Cool glowing lines
    // float strength = cnoise(vUv * 10.0);
    float strength = step(0.75, sin(cnoise(vUv * 10.0) * 20.0));

    vec3 black = vec3(0.0);
    vec3 uvColor = vec3(vUv, 0.0);

    // We have to clamp the strength, so that the values for the colors
    // don't go below 0 or above 1. Because if they do, you can get bugs with colors
    // (they will get extrapolated and look white)
    strength = clamp(strength, 0.0, 1.0);

    // If strength >= 0 we get black, otherwise we get uv color
    vec3 mixedColor = mix(black, vec3(1.0), strength);

    gl_FragColor = vec4(mixedColor,  1.0);

}
