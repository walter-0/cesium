import defined from "../Core/defined";

/**
 * @classdesc Wrapper over @type {GPUBuffer}
 */
class WebGPUBuffer {
  /**
   *
   * @param {object} options
   * @param {GPUDevice} options.device
   * @param {string} options.label
   * @param {number} options.sizeInBytes
   * @param {GPUBufferUsageFlags} options.usage
   * @param {object} options.data
   */
  constructor(options) {
    this._device = options.device;
    this._usage =
      options.usage || GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST;
    this._sizeInBytes = options.sizeInBytes;
    this._label = options.label;
    this._buffer = this._createBuffer(options.data);
  }

  _createBuffer(data) {
    const buffer = this._device.createBuffer({
      label: this._label,
      size: this._sizeInBytes,
      usage: this._usage,
      mappedAtCreation: defined(data),
    });

    if (defined(data)) {
      const arrayBuffer = buffer.getMappedRange();
      new Uint8Array(arrayBuffer).set(new Uint8Array(data));
      buffer.unmap();
    }

    return buffer;
  }

  update(data, offsetInBytes = 0) {
    this._device.queue.writeBuffer(
      this._buffer,
      offsetInBytes,
      data instanceof ArrayBuffer ? data : data.buffer,
      data instanceof ArrayBuffer ? 0 : data.byteOffset,
      data.byteLength,
    );
  }

  resize(newSizeinBytes, preserveData = true) {
    if (newSizeinBytes === this._sizeInBytes) {
      return;
    }

    const oldBuffer = this._buffer;
    const oldSize = this._sizeInBytes;
    this._sizeInBytes = newSizeinBytes;

    if (preserveData && oldBuffer) {
      const newBuffer = this._device.createBuffer({
        label: this._label,
        size: newSizeinBytes,
        usage: this._usage,
      });

      const commandEncoder = this._device.createCommandEncoder();
      commandEncoder.copyBufferToBuffer(
        oldBuffer,
        0,
        newBuffer,
        0,
        Math.min(oldSize, newSizeinBytes),
      );
      this._device.queue.submit([commandEncoder.finish()]);
      this._buffer = newBuffer;
    } else {
      // new empty buffer
      this._buffer = this._device.createBuffer({
        label: this._label,
        size: newSizeinBytes,
        usage: this._usage,
      });
    }
  }

  get buffer() {
    return this._buffer;
  }

  get sizeInBytes() {
    return this._sizeInBytes;
  }

  get usage() {
    return this._usage;
  }

  destroy() {
    this._buffer = undefined;
    return undefined;
  }
}

export default WebGPUBuffer;
