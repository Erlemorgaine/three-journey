# NOTES

All these projects are exercises from the Three Journey course by Bruno Simon

- _Bounding Box_: Three js uses sphere bounding by default.

- _Frustum Culling_: It's about rendering / not rendering an object that is behind the camera.
  Three JS uses bounding box to calculate which objects are in camera view.

## Geometries

- All geometries inherit from BufferGeometry class
- In animations, usually we want to move the mesh, not the geometry
- There's a cool geometry, ShapeGeometry, that you can give curves
- If you create a custom geometry with vertices and you want to reuse vertices (more performant), use BufferGeometry.index. See docs for example.

## Textures

- color / albedo: provides color
- alpha: white parts are shown, black parts arent shown
- height / displacement: moves vertices. Towards white: vertices go up, towards black: vertices move down
- normal: (is purple-ish). Adds details based on lighting. Not dependent on vertices.
- ao map: puts 'fake shadows' in crevices to increase contrast
- metalness: white: metallic, black: not metallic. Used to create reflection
- roughness: often goes together with metalness. Is about amount of light dissipation (smoothness of surface). Also black and white

All this is based on PBR principles (Physical Based Rendering), used among many 3D software.

### Mip-mapping

Mipmapping takes the texture, returns a version of the texture of half the size, then again half size, etc until it has a 1 by one texture. It'll send all those textures to the GPU, and the GPU will use different versions of the texture depending on how much of the pixels we can see. This will result in that you see some parts of the texture blurry sometimes.

Algorithms that to that:

- Minification algorithm: applies when pixels of rendering are smaller than pixels of texture. This happens e.g. when you zoom out on the object so that it seems very small

### Texture optimisation

GPU has storage limites, and each pixel will be sent to the GPU. So textures should be as small as possible in size! (Is different from weight).
Also, because of mipmapping, text resolution should be power of 2: 512 / 1024 / etc. Otherwise THREE.js will resize image by itself.

When you want alpha in your objects, you have to decide if it's better to use a png (with alpha), or two jps for alpha and color (in terms of weight etc).

For normal texture, it's usually better to use png, since it shouldn't loose data.

Sometimes you can use RGB channels to reuse 1 image for different results, by having R/G/B masks. E.g. also to use alpha. This can improve performance a lot.

Texture websites: see lesson links. Also: Substance Designer.

## Materials

- _Matcap_: You can find them on github and use them for matcap material, it's really cool. But check the license.
