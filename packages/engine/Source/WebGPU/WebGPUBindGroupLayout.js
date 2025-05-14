/**
 * @classdesc Wrapper over @type {GPUBindGroupLayout}
 */
class WebGPUBindGroupLayout {
  /**
   *
   * @param {object} options
   * @param {GPUDevice} options.device
   * @param {GPUBindGroupLayoutDescriptor['entries']} options.entries
   * @param {GPUBindGroupLayoutDescriptor['label']} options.label
   */
  constructor(options) {
    this._device = options.device;
    this._label = options.label;
    this._entries = options.entries || [];
    this._bindGroupLayout = this._createBindGroupLayout();
  }

  /**
   *
   * @returns {GPUBindGroupLayout}
   */
  _createBindGroupLayout() {
    return this._device.createBindGroupLayout({
      label: this._label,
      entries: this._entries,
    });
  }

  get bindGroupLayout() {
    return this._bindGroupLayout;
  }
}

export default WebGPUBindGroupLayout;
