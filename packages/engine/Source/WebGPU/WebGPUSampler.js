/**
 * @classdesc Wrapper over @type {GPUSampler}
 */
class WebGPUSampler {
  /**
   *
   * @param {object} options
   * @param {GPUDevice} options.device
   * @param {GPUSamplerDescriptor['label']} options.label
   * @param {GPUSamplerDescriptor['addressModeU']} options.addressModeU
   * @param {GPUSamplerDescriptor['addressModeV']} options.addressModeV
   * @param {GPUSamplerDescriptor['addressModeW']} options.addressModeW
   * @param {GPUSamplerDescriptor['magFilter']} options.magFilter
   * @param {GPUSamplerDescriptor['minFilter']} options.minFilter
   * @param {GPUSamplerDescriptor['mipmapFilter']} options.mipmapFilter
   * @param {GPUSamplerDescriptor['maxAnisotropy']} options.maxAnisotropy
   */
  constructor(options) {
    this._device = options.device;
    this._label = options.label;

    this._addressModeU = options.addressModeU || "clamp-to-edge";
    this._addressModeV = options.addressModeV || "clamp-to-edge";
    this._addressModeW = options.addressModeW || "clamp-to-edge";
    this._magFilter = options.magFilter || "linear";
    this._minFilter = options.minFilter || "linear";
    this._mipmapFilter = options.mipmapFilter || "linear";
    this._maxAnisotropy = options.maxAnisotropy || 1;

    this._sampler = this._createSampler();
  }

  _createSampler() {
    return this._device.createSampler({
      label: this._label,
      addressModeU: this._addressModeU,
      addressModeV: this._addressModeV,
      addressModeW: this._addressModeW,
      magFilter: this._magFilter,
      minFilter: this._minFilter,
      mipmapFilter: this._mipmapFilter,
      maxAnisotropy: this._maxAnisotropy,
    });
  }

  get sampler() {
    return this._sampler;
  }
  destroy() {
    this._sampler = undefined;
    return undefined;
  }
}

export default WebGPUSampler;
