/**
 * @classdesc Wrapper over @type {GPURenderPipeline}
 */
class WebGPURenderPipeline {
  /**
   *
   * @param {object} options
   * @param {GPUDevice} options.device
   * @param {GPURenderPipelineDescriptor['label']} options.label
   * @param {GPURenderPipelineDescriptor['layout']} options.layout
   * @param {GPURenderPipelineDescriptor['vertex']['module']} options.vertexShader
   * @param {GPURenderPipelineDescriptor['vertex']['buffers']} options.vertexBuffers
   * @param {GPURenderPipelineDescriptor['fragment']} options.fragmentShader
   * @param {GPUFragmentState['targets']} options.colorFormats
   * @param {GPUPrimitiveState['topology']} options.primitiveTopology
   * @param {GPUPrimitiveState['cullMode']} options.cullMode
   * @param {GPURenderPipelineDescriptor['depthStencil']} options.depthStencil
   */
  constructor(options) {
    this._device = options.device;
    this._label = options.label;
    this._layout = options.layout;
    this._vertexShader = options.vertexShader;
    this._fragmentShader = options.fragmentShader;
    this._colorFormats = options.colorFormats;
    this._vertexBuffers = options.vertexBuffers || [];
    this._depthStencil = options.depthStencil;
    this._primitiveTopology = options.primitiveTopology;
    this._cullMode = options.cullMode;

    this._pipeline = this._createRenderPipeline();
  }

  /**
   * @returns {GPURenderPipeline}
   */
  _createRenderPipeline() {
    return this._device.createRenderPipeline({
      label: this._label,
      layout: this._layout,
      vertex: {
        module: this._vertexShader,
        entryPoint: "main",
        buffers: this._vertexBuffers,
      },
      fragment: this._fragmentShader ?? undefined,
      primitive: {
        topology: this._primitiveTopology,
        cullMode: this._cullMode,
      },
      depthStencil: this._depthStencil,
    });
  }

  get pipeline() {
    return this._pipeline;
  }
}

export default WebGPURenderPipeline;
