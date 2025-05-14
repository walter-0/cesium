/**
 * @classdesc Wrapper over @type {GPUBindGroup}
 */
class WebGPUBindGroup {
  /**
   *
   * @param {object} options
   * @param {GPUDevice} options.device
   * @param {GPUBindGroupDescriptor['entries']} options.entries
   * @param {GPUBindGroupDescriptor['label']} options.label
   * @param {GPUBindGroupDescriptor['layout']} options.layout
   */
  constructor(options) {
    this._device = options.device;
    this._label = options.label;
    this._layout = options.layout;
    this._entries = options.entries || [];

    this._bindGroup = this._createBindGroup();
  }

  /**
   * @returns {GPUBindGroup}
   */
  _createBindGroup() {
    return this._device.createBindGroup({
      label: this._label,
      layout: this._layout,
      entries: this._entries,
    });
  }

  get bindGroup() {
    return this._bindGroup;
  }
}

export default WebGPUBindGroup;
