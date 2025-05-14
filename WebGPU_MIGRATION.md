# WebGPU Migration Journal

## Architecture Overview

### Dependency Graph

```sh
npx depcruise Source --progress --cache --metrics -T dot | dot -T svg > dependency-graph.svg
```

![Dependency Graph](/packages/engine/dependency-graph.svg)

### Source Lines of Code

```sh
sloc Source

---------- Result ------------

            Physical :  356381
              Source :  227809
             Comment :  94312
 Single-line comment :  11647
       Block comment :  82665
               Mixed :  815
 Empty block comment :  13
               Empty :  35088
               To Do :  12

Number of files read :  946

----------------------------
```

## Key Files & Components

Tracing the entire initialization + render path, with no options, starting from HelloWorld.html

```js
const viewer = new Cesium.Viewer("cesiumContainer");
```

Viewer.js
CesiumWidget.js (render loop)
FeatureDetection.js
Ellipsoid.js
Scene.js
`initializeFrame()`
Event.js
Context.js (WebGL2RenderingContext)
ShaderCache.js
TextureCache.js
loadKTX2.js (GPU texture format)
UniformState.js
PassState.js
RenderState.js
JobScheduler.js
FrameState.js
CreditDisplay.js
ComputeEngine.js
GlobeTranslucencyState.js
PrimitiveCollection.js
TweenCollection.js
DepthPlane.js
ClearCommand.js
SceneTransitioner.js
Color.js
GeographicProjection.js
Atmosphere.js
Fog.js
Camera.js
Matrix4.js
Cartesian3.js
Cartographic.js
PerspectiveFrustum.js
RequestScheduler.js
TaskProcessor.js
ShadowMap.js
InvertClassification.js
PostProcessStageCollection.js
BrdfLutGenerator.js
BoundingRectangle.js
Picking.js
View.js
SunLight.js
Globe.js
SkyBox.js
Sun.js
Moon.js
SkyAtmosphere.js
ImageryLayer.js
ScreenSpaceEventHandler.js
DataSourceCollection.js
DataSourceDisplay.js
EventHelper.js
Geocoder.js
SceneModePicker.js
ProjectionPicker.js
createDefaultImageryProviderViewModels.js
createDefaultTerrainProviderViewModels.js
BaseLayerPicker.js
ModelComponents.js
AnimationViewModel.js
Timeline.js
Resource.js

## WebGL Dependencies
