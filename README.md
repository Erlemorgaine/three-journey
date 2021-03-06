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

## Raycaster

Raycaster literally casts a ray that intersects objects. needs an origin and a direction, both Vector3.
You can go through 1 object multiple times! E.g. going horizontally a torusgeometry.

## 3D model formats

GLTF is becoming the standard. But, for simple models like models only with particles, you don't need it.

## Blender

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
To select everything, A
To unselect everything, AA
To select in a rectangle, B
To select in a circle, C
To leave circle select, Esc
To open object panel, shift + A
To delete object, X
Open panel to change object, F9
To focus on object, /
To hide object, H
To hide non-selected objects, Shift + H
To show all hidden objects, Alt + H,
To show / hide menu on left, T
To change position, rotation, scale: G, R, S + moving on trackpad
To change on a certain axis G, R, S + X, Y, Z
To exclude an axis, add Shift, e.g. G + Shift + Z
To change mode, Ctrl + Tab
To toggle object / edit mode, Tab
To change nodes, edges, faces, hold G pressed
To go to material menu, Z
To open search, F3

### Rendering engines

Eevee is standard. Cycles is very realistic, but not performant (when you are animating)

## Debug panel

You can hide or show gui by using gui.hide () or gui.show(). You can customize this to do it on a certain key, e.g. H, by listening to the keydown event.
Also, you can start out with a closed panel by passing { closed: true } to dat.GUI.
You can also provide width and height.

## Performance

First thing to test: FPS, i.e. on what framerate it will be running (on a lot of devices it's 60). You can use stats.js to measure this.

You can also run Chrome without FPS limit. In this case chrome will run as fast as it can. See 'Performance' tutorial to check which command you have to run to do this. You might have to open Chrome with the command twice.
Why do this: if you unlock the frame rate and the frame rate is still close to 60 fps (like, 70-80), there is definitely a performance problem.
NB if you test this, do it with the window fullsize.

For GPU: you should have as little _draw calls_ as possible. To measure draw calls, you can use Spector.js extension. THIS IS REALLY COOL! It gives you a lot of information on your scene. The boxes saying 'drawElements' are draw calls.

Also: renderer.info().

Dispose of geometries when the scene is still there but you don't need a geometry anymore! Three.js has a whole page about this. In short, you need to call scene.remove(geometry) and geometry.dispose().

About lights: AVOID THEM! Or use cheap ones, like AmbientLight, HemisphereLight, DirectionalLight.
Also, avoid adding or removing lights, because then the materials supporting lights will have to recompile.

Also: AVOID SHADOWS! Use baked shadows if you can. Or, if you use them, optimise shadow maps by using a camera helper: use it to adjust the shadow.camera near / far, size the shadowmap etc. Also, use castShadow and receiveShadow wisely (i.e. don't use them if you don't need to).
Also, deactivate autoUpdate shadow if the scene (shadows) doesn't move a lot

### TEXTURES

- Use a texture that's as small as possible to stay within GPU memory limits. NB Weight of file doesn't matter. it's really the resolution that matters.

- Also, always keep a power of 2 resolution (because of mipmapping)

- Interesting: try to use the 'basis' format for images (but it's not easy)

### Geometries

- Don't update vertices (in the tick functions)!! Do it with vertex shaders.

- Reuse geometry and material. With different sizes, you can scale the geometries.

- If the geometries are not moving (independently?), you can _merge_ geometries. This will reduce the draw calls. You can du this with the BufferGeometryUtils, see script.js in performance for example.

### Materials

- Reuse materials

- PhysicalMaterial and StandardMaterial are bad for performance. Try to use lambert or phong.

### Meshes

- You can use InstancedMesh, to reuse 1 geometry for multiple geometries on 1 mesh, but still transform every single geometry by using a Matrix4. Use .setPosition, .makeScale, and .makeRotationFromQuaternion.
  Also use DynamicDrawUsage when you're going to update the matrices on every tick.

### Models

- Use low poly models, and for details use normalMaps.

- Use DracoCompression (although they can lead to a freeze when uncompressing the models).

- If you can, use gzip files, i.e. compression on server side.

### Cameras

- reduce near / far or fov (only counts for scenes in which there are many objects and it's okay to not see all of them)

### Renderer

- Don't use default pixel ratio, instead never more than 2
- Don't use antialias if you don't actually see an alias

### Shaders

- Specify precision! lowp / highp. You can set it on the ShaderMaterial as a property: precision: 'lowp'

- Avoid if statements

- make use of being able to do variable.xy, variable.xyz

- Use textures instead of Perlin noises

- For values that remain constant, use defines (with #define). Instead of putting them in the shader, you can use them in defines property on ShaderMaterial (but then don't change them! Since the shader will recompile.)

- Try to do calculations in vertex shader instead of in fragment shader (since we have less vertices than fragments)
