import { clone, Context } from "@cesium/engine";

import createCanvas from "./createCanvas.js";
import createFrameState from "./createFrameState.js";
import getWebGLStub from "./getWebGLStub.js";

function createContext(options, canvasWidth, canvasHeight) {
  // clone options so we can change properties
  options = clone(options ?? {});
  options.webgl = clone(options.webgl ?? {});
  options.webgl.antialias = options.webgl.antialias ?? false;
  if (!!window.webglStub) {
    options.getWebGLStub = getWebGLStub;
  }

  const canvas = createCanvas(canvasWidth, canvasHeight);
  const context = new Context(canvas, options);

  if (!!window.webglValidation) {
    context.validateShaderProgram = true;
    context.validateFramebuffer = true;
    context.logShaderCompilation = true;
    context.throwOnWebGLError = true;
  }

  const us = context.uniformState;
  us.update(createFrameState(context));

  // Add function for test
  context.destroyForSpecs = function () {
    document.body.removeChild(context.canvas);
    return context.destroy();
  };

  return context;
}
export default createContext;
