/**
 * @classdesc Wrapper over @type {GPUShaderModule}
 */
class WebGPUShaderModule {
  /**
   *
   * @param {object} options
   * @param {GPUDevice} options.device
   * @param {GPUShaderModuleDescriptor['label']} options.label
   * @param {GPUShaderModuleDescriptor['code']} options.code
   */
  constructor(options) {
    this._device = options.device;
    this._label = options.label;
    this._code = options.code;

    this._shaderModule = this._createShaderModule();
  }

  /**
   * @returns {GPUShaderModule}
   */
  _createShaderModule() {
    return this._device.createShaderModule({
      label: this._label,
      code: this._code,
    });
  }

  get shaderModule() {
    return this._shaderModule;
  }
}

export default WebGPUShaderModule;
