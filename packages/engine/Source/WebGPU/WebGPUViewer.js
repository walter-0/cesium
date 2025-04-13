import defined from "../Core/defined";
import DeveloperError from "../Core/DeveloperError";
import WebGPUCesiumWidget from "./WebGPUCesiumWidget";

/**
 * @classdesc A base widget for building applications. It composites all of the standard Cesium widgets into one reusable package.
 */
class WebGPUViewer {
  /**
   * @param {Element|string} container
   * @param {object} options
   */
  constructor(container, options) {
    if (!defined(container)) {
      throw new DeveloperError("container is required.");
    }

    this._container = document.querySelector(container);

    const viewerContainer = document.createElement("div");
    viewerContainer.className = "cesium-viewer";
    this._container.appendChild(viewerContainer);

    const cesiumWidgetContainer = document.createElement("div");
    cesiumWidgetContainer.className = "cesium-viewer-cesiumWidgetContainer";
    viewerContainer.appendChild(cesiumWidgetContainer);

    this._cesiumWidget = new WebGPUCesiumWidget(cesiumWidgetContainer);
  }
}

export default WebGPUViewer;
