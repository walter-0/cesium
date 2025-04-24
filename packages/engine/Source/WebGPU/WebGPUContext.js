import DeveloperError from "../Core/DeveloperError.js";

/**
 *
 * @classdesc Responsible for initializing the WebGPU Context
 * @public
 */
class WebGPUContext {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    /**
     * @type {HTMLCanvasElement}
     * @private
     */
    this._canvas = canvas;
    /**
     * @type {?GPUAdapter}
     * @private
     */
    this._adapter = null;
    /**
     * @type {?GPUDevice}
     */
    this.device = null;
    /**
     * @type {?GPUCanvasContext}
     * @private
     */
    this._context = null;
    this._initialized = false;
  }

  async initialize() {
    if (!navigator.gpu) {
      throw new DeveloperError("WebGPU is not supported by this browser");
    }

    const adapter = await navigator.gpu?.requestAdapter({
      powerPreference: "high-performance",
    });

    if (!adapter) {
      throw new DeveloperError("Couldn't request WebGPU adapter");
    }

    const device = await adapter?.requestDevice();

    if (!device) {
      throw new DeveloperError("Couldn't request GPU device");
    }

    const context = this._canvas?.getContext("webgpu");
    const format = navigator.gpu.getPreferredCanvasFormat();

    if (this._canvas && context) {
      context.configure({
        device,
        format,
      });

      this._adapter = adapter;
      this.device = device;
      this._context = context;
      this._format = format;
      this._initialized = true;
      this._module = this.createShaderModule();
      this._pipeline = this.createRenderPipeline();
      /**
       * @type {GPURenderPassDescriptor}
       */
      this._renderPassDescriptor = {
        label: "basic canvas renderPass",
        colorAttachments: [
          {
            view: this._context.getCurrentTexture().createView(),
            clearValue: [0.8, 0.8, 0.8, 1],
            loadOp: "clear",
            storeOp: "store",
          },
        ],
      };
    }
  }

  createShaderModule() {
    return this.device.createShaderModule({
      label: "initial red triangle shader",
      code: /* wgsl */ `
        @vertex fn vs(
          @builtin(vertex_index) vertexIndex : u32
        ) -> @builtin(position) vec4f {
          let pos = array(
            vec2f(0.0, 0.5),
            vec2f(-0.5, -0.5),
            vec2f(0.5, -0.5)
          );

          return vec4f(pos[vertexIndex], 0.0, 1.0);

        }

        @fragment fn fs() -> @location(0) vec4f {
          return vec4f(1.0, 0.0, 0.0, 1.0);
        }
      `,
    });
  }

  createRenderPipeline() {
    return this.device.createRenderPipeline({
      label: "red triangle pipeline",
      layout: "auto",
      vertex: {
        module: this._module,
      },
      fragment: {
        module: this._module,
        targets: [{ format: this._format }],
      },
    });
  }

  render() {
    this._renderPassDescriptor.colorAttachments[0].view = this._context
      .getCurrentTexture()
      .createView();

    const encoder = this.device.createCommandEncoder({ label: "encoder" });

    const pass = encoder.beginRenderPass(this._renderPassDescriptor);
    pass.setPipeline(this._pipeline);
    pass.draw(3);
    pass.end();

    const commandBuffer = encoder.finish();
    this.device.queue.submit([commandBuffer]);
  }
}

export default WebGPUContext;
