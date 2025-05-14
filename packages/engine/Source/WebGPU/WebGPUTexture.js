/**
 * @classdesc Wrapper over @type {GPUTexture}
 */
class WebGPUTexture {
  /**
   *
   * @param {object} options
   * @param {GPUDevice} options.device
   * @param {GPUTextureDescriptor['label']} options.label
   * @param {GPUTextureDescriptor['format']} options.format
   * @param {number} options.width
   * @param {number} options.height
   * @param {GPUAllowSharedBufferSource} options.source
   * @param {number} options.depthOrArrayLayers
   * @param {GPUTextureDescriptor['mipLevelCount']} options.mipLevelCount
   * @param {GPUTextureDescriptor['sampleCount']} options.sampleCount
   * @param {GPUTextureDescriptor['dimension']} options.dimension
   * @param {GPUTextureDescriptor['usage']} options.usage
   */
  constructor(options) {
    this._device = options.device;
    this._label = options.label;
    this._format = options.format || "rgba8unorm";
    this._width = options.width;
    this._height = options.height;
    this._depthOrArrayLayers = options.depthOrArrayLayers;
    this._mipLevelCount = options.mipLevelCount || 1;
    this._sampleCount = options.sampleCount || 1;
    this._dimension = options.dimension || "2d";
    this._usage =
      options.usage ||
      GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST;

    this._texture = this._createTexture();

    if (options.source) {
      this.update(options.source);
    }
  }

  /**
   *
   * @returns {GPUTexture}
   */
  _createTexture() {
    return this._device.createTexture({
      label: this._label,
      size: {
        width: this._width,
        height: this._height,
        depthOrArrayLayers: this._depthOrArrayLayers || 1,
      },
      format: this._format,
      usage: this._usage,
      mipLevelCount: this._mipLevelCount,
      sampleCount: this._sampleCount,
      dimension: this._dimension,
    });
  }

  /**
   *
   * @param {GPUAllowSharedBufferSource} source
   * @param {object} options
   */
  update(source, options = {}) {
    this._device.queue.writeTexture(
      { texture: this._texture },
      source,
      { bytesPerRow: this._width * 4 },
      { width: this._width, height: this._height },
    );
  }

  /**
   *
   * @param {GPUTextureViewDescriptor} options
   * @returns {GPUTextureView}
   */
  createView(options = {}) {
    return this._texture.createView({
      format: options.format || this._format,
      dimension: options.dimension,
      aspect: options.aspect,
      baseMipLevel: options.baseMipLevel || 0,
      mipLevelCount: options.mipLevelCount,
      baseArrayLayer: options.baseArrayLayer || 0,
      arrayLayerCount: options.arrayLayerCount,
    });
  }

  destroy() {
    this._texture.destroy();
    this._texture = undefined;
    return undefined;
  }
}

export default WebGPUTexture;
