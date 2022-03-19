 uniform float uPointSize;
 uniform float uTime;

 attribute float aPointscale;
 attribute vec3 aRandomness;

 varying vec3 vColor;

 void main() {
            vec4 model = modelMatrix  * vec4(position, 1.0);

            // model.xyz += aRandomness;

            float particleAngle = atan(model.x, model.z);
            float distanceFromCenter = length(model.xz);

            
            // The further the particle is from the center, the smaller the angle
            // with with it's rotating should be, since we want the center to rotate faster.
            // We multiply it by time since distance should increase by time
            float angleOffset = (1.0 / distanceFromCenter) * uTime * 0.2;
            particleAngle += angleOffset;

            // We multiply by distance since it's the radius
            model.x = cos(particleAngle) * distanceFromCenter;
            model.z = sin(particleAngle) * distanceFromCenter;

            // Apply randomness here, so that while animating the randomness stays the same
            // (when applying before it can get stretched)
            // BUT i think i liked it better when applying it before, see above
            model.xyz += aRandomness;
            
            vec4 modelViewPosition = viewMatrix * model;
            vec4 modelViewProjectionPosition = projectionMatrix * modelViewPosition;

            gl_Position = modelViewProjectionPosition;

            /**
             *  Here we set the point size
             * This can have different result based on the devicePixelRatio
             */
             gl_PointSize = uPointSize * aPointscale;

             // This takes care of size attenuation (size of points in perspective)
             // We took it from three.js, there 1.0 is actually scale, it handles that the particle 
             // adjusts for different screensizes, but we won't do that now
             gl_PointSize *= ( 2.0 / -modelViewPosition.z );
            

            vColor = color;
      }