import WebGPUContext from "./WebGPUContext.js";

/**
 * @classdesc The container for all 3D graphical objects and state in a Cesium virtual scene.
 */
class WebGPUScene {
  /**
   * @param {object} options
   * @param {HTMLCanvasElement} options.canvas
   */
  constructor(options) {
    /**
     * @type {HTMLCanvasElement}
     * @private
     */
    this._canvas = options.canvas;
    /**
     * @type {WebGPUContext}
     * @private
     */
    this._context = new WebGPUContext(this._canvas);
    this._observer = null;
  }

  async initialize() {
    await this._context.initialize();

    this._observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const canvas = /** @type {HTMLCanvasElement} */ (entry.target);
        const width = entry.borderBoxSize[0].inlineSize;
        const height = entry.borderBoxSize[0].blockSize;
        canvas.width = Math.max(
          1,
          Math.min(width, this._context.device.limits.maxTextureDimension2D),
        );
        canvas.height = Math.max(
          1,
          Math.min(height, this._context.device.limits.maxTextureDimension2D),
        );
      }
      this._context.render();
    });

    this._observer.observe(this._canvas);
  }
}

export default WebGPUScene;
