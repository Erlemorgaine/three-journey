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
- normal: (is purple-ish). Adds details based on lighting. Not dependent on vertices. More performant than vertices, so try to use this instead of height if you can
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

- _MeshNormalMaterial_: Makes use of the normal attribute (property on normal), i.e. the direction of the outside points on the face of of the material (think of arrows on sphere). NormalMaterial shows that representation. We can use it in combination with light reflection. If normal is pointing towards direction of light, the face is lightened up.

- _MeshMatcapMaterial_: It will take a texture and use normals to pick a color from the texture and apply it to the geometry. It will decide the color based on the normals relative to the camera: if you use it on a sphere and turn the camera, you will always see the same result. So: we can simulate light without having lights in scene.

- _MeshDepthMaterial_: When geometry is close to camera it becomes whiter, further away it gets blacker.

### Materials with light

_MeshLambertMaterial_: Most simple material that has to do with light. It can have blurry lights, but it is very performant.

_MeshPhongMaterial_: Very similar to Lambert, but the blurry lines are gone, and more strong light reflection

_MeshStandardMaterial_: Supports light the best, met useful params like metalness and roughness. It uses PBR.

_MeshPhysicalMaterial_: Is same as _MeshStandardMaterial_, but with a clear coat effect (above object). This makes it more realistic, depending on what you want to do. But it's less performant than _MeshStandardMaterial_.

### Env maps

Checkout HDRIHaven, they have a lot of nice env maps. Also, you don't need to have a license for them, but if you want you can credit them.
To convert HDR files to cube maps, go to HDRI-to-CubeMap github tool.

## Cameras

_ArrayCamera_: Does multiple renders for multiple areas, shows split screens.
_StereoCamera_: Uses 2 cameras (2 renders) that mimic eyes, you can use it for VR.
_CubeCamera_: 6 renders, Three js uses this to make env maps.

## Controls

_DeviceOrientationControls_: Good for phone, you will see the camera move when your device moves.
But, iOs stopped supporting it.

_FlyControls_: Flying as in spaceship.

_FirstPersonControls_: Like FlyControls, but the 'bird'/'plane' can't rotate on the z axis.

_PointerLockControls_: I don't completely get this, but it's like navigating in an open world game.

_TrackballControls_: Like OrbitControls, but there is no limit to the movement.

_TransformControls_: Have nothing to do with the camera. You can use it to create an editor, you can move objects.

_DragControls_: Also has nothing to do with the camera. You can drag objects.

## Lights

_AmbientLight_: Comes from all directions, so if setting only this, seems like MeshBasicMaterial

_RectAreaLight_: Cool light

_HemiSphereLight_: Also cool light

_SpotLight_: Also cool light, like spotlight

_Point_: Also cool light, comes from 1 point

You can use light helpers (there are helpers for each light) to help you position the light. For spotLightHelper, you have to call helper.update() in the requestAnimationFrame.

## Physics

Sometimes you can choose a 2d library for 3D physics animations, better for performance. But if you want to move up en down (not stay on a plane), you'll have to choose a 3D library.

Good libraries:

- Ammo.js
- Cannon.js
- Oimo.js

## 3D model formats

GLTF is becoming the standard. But, for simple models like models only with particles, you don't need it.

# Blender

_Areas_ are part of screen.

- There is a timeline for animations
- Outliner, where you can see all objects in scene (top right)
- Properties areas

You can change the area by clicking the buttons in top left.
You can split areas by going in left corner (crosshair), then dragging.
Use shortcuts, BUT: shortcuts are area sensitive.
For _tracking_, i.e. going up / down / left / right: use 2 fingers + Shift
For _dollying_ (zoom): 2 zingers + cmd.
To reset view, press shift + c.
