 uniform float uPointSize;

 attribute float aPointscale;

 varying vec3 vColor;
 
 void main() {
            vec4 model = modelMatrix  * vec4(position, 1.0);
            vec4 view = viewMatrix * model;
            vec4 projection = projectionMatrix * view;

            gl_Position = projection;

            /**
             *  Here we set the point size
             * This can have different result based on the devicePixelRatio
             */
            gl_PointSize = uPointSize * aPointscale;

            vColor = color;
      }