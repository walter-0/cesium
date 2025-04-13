import DeveloperError from "../Core/DeveloperError.js";
import defined from "../Core/defined.js";
import WebGPUScene from "./WebGPUScene.js";

/**
 * @classdesc A widget containing a cesium scene
 */
class WebGPUCesiumWidget {
  /**
   * @param {Element|string} container
   * @param {object} options
   */
  constructor(container, options) {
    if (!defined(container)) {
      throw new DeveloperError("container is required.");
    }

    this._container = container;
    this._element = document.createElement("div");
    this._element.className = "cesium-widget";
    container.appendChild(this._element);
    this._canvas = document.createElement("canvas");
    this._element.appendChild(this._canvas);

    this._scene = new WebGPUScene({
      canvas: this._canvas,
    });

    this._scene.initialize();
  }
}

export default WebGPUCesiumWidget;
