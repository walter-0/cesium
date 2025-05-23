import {
  Frozen,
  Cartesian2,
  Cartesian3,
  Cartesian4,
  Matrix2,
  Matrix3,
  MetadataClassProperty,
  MetadataComponentType,
  MetadataTableProperty,
} from "../../index.js";
import MetadataTester from "../../../../Specs/MetadataTester.js";

describe("Scene/MetadataTableProperty", function () {
  if (!MetadataTester.isSupported()) {
    return;
  }

  const enums = {
    myEnum: {
      values: [
        {
          value: 0,
          name: "ValueA",
        },
        {
          value: 1,
          name: "ValueB",
        },
        {
          value: 999,
          name: "Other",
        },
      ],
    },
  };

  it("creates metadata table property", function () {
    const extras = {
      other: 0,
    };

    const extensions = {
      EXT_other_extension: {},
    };

    const property = new MetadataTableProperty({
      count: 2,
      property: {
        values: 0,
        extras: extras,
        extensions: extensions,
      },
      classProperty: MetadataClassProperty.fromJson({
        id: "property",
        property: {
          type: "SCALAR",
          componentType: "FLOAT32",
        },
      }),
      bufferViews: {
        0: new Uint8Array(8),
      },
    });

    expect(property.extras).toBe(extras);
    expect(property.extensions).toBe(extensions);
    expect(property.byteLength).toBe(8);
  });

  it("constructs properties with stringOffsets and arrayOffsets", function () {
    const extras = {
      other: 0,
    };

    const extensions = {
      EXT_other_extension: {},
    };

    const a = 97;
    const b = 98;
    const c = 99;
    const d = 100;
    const e = 101;

    const property = new MetadataTableProperty({
      count: 2,
      property: {
        values: 0,
        extras: extras,
        extensions: extensions,
        stringOffsetType: "UINT16",
        stringOffsets: 1,
        arrayOffsetType: "UINT8",
        arrayOffsets: 2,
      },
      classProperty: MetadataClassProperty.fromJson({
        id: "property",
        property: {
          type: "STRING",
          array: true,
        },
      }),
      bufferViews: {
        0: new Uint8Array([a, b, b, c, c, c, d, d, d, d, e, e, e, e, e]),
        1: new Uint8Array([0, 0, 1, 0, 3, 0, 6, 0, 10, 0, 15, 0]),
        2: new Uint8Array([0, 3, 5]),
      },
    });

    expect(property.extras).toBe(extras);
    expect(property.extensions).toBe(extensions);
    expect(property._stringOffsets._componentType).toBe(
      MetadataComponentType.UINT16,
    );
    expect(property._arrayOffsets._componentType).toBe(
      MetadataComponentType.UINT8,
    );
    expect(property.get(0)).toEqual(["a", "bb", "ccc"]);
    expect(property.get(1)).toEqual(["dddd", "eeeee"]);
    expect(property.byteLength).toBe(30);
  });

  it("constructs property with EXT_feature_metadata schema", function () {
    const extras = {
      other: 0,
    };

    const extensions = {
      EXT_other_extension: {},
    };

    const a = 97;
    const b = 98;
    const c = 99;
    const d = 100;
    const e = 101;

    const property = new MetadataTableProperty({
      count: 2,
      property: {
        bufferView: 0,
        extras: extras,
        extensions: extensions,
        offsetType: "UINT16",
        stringOffsetBufferView: 1,
        arrayOffsetBufferView: 2,
      },
      classProperty: MetadataClassProperty.fromJson({
        id: "property",
        property: {
          type: "STRING",
          array: true,
        },
      }),
      bufferViews: {
        0: new Uint8Array([a, b, b, c, c, c, d, d, d, d, e, e, e, e, e]),
        1: new Uint8Array([0, 0, 1, 0, 3, 0, 6, 0, 10, 0, 15, 0]),
        2: new Uint8Array([0, 0, 3, 0, 5, 0]),
      },
    });

    expect(property.extras).toBe(extras);
    expect(property.extensions).toBe(extensions);
    expect(property._stringOffsets._componentType).toBe(
      MetadataComponentType.UINT16,
    );
    expect(property._arrayOffsets._componentType).toBe(
      MetadataComponentType.UINT16,
    );
    expect(property.get(0)).toEqual(["a", "bb", "ccc"]);
    expect(property.get(1)).toEqual(["dddd", "eeeee"]);
    expect(property.byteLength).toBe(33);
  });

  it("creates with offset and scale", function () {
    const property = new MetadataTableProperty({
      count: 2,
      property: {
        values: 0,
        offset: [
          [-1, -1],
          [-1, -1],
        ],
        scale: [
          [2, 2],
          [2, 2],
        ],
      },
      classProperty: MetadataClassProperty.fromJson({
        id: "property",
        property: {
          type: "VEC2",
          componentType: "UINT8",
          normalized: true,
          array: true,
          count: 2,
          offset: [
            [-1, -1],
            [0, 0],
          ],
          scale: [
            [2, 2],
            [4, 4],
          ],
        },
      }),
      bufferViews: {
        0: new Uint8Array([0, 127, 127, 255, 0, 0, 255, 255]),
      },
    });

    expect(property.hasValueTransform).toBe(true);
    expect(property.offset).toEqual([-1, -1, -1, -1]);
    expect(property.scale).toEqual([2, 2, 2, 2]);
    expect(property.byteLength).toBe(8);
  });

  it("creates with offset and scale inherited from class property", function () {
    const property = new MetadataTableProperty({
      count: 2,
      property: {
        values: 0,
      },
      classProperty: MetadataClassProperty.fromJson({
        id: "property",
        property: {
          type: "VEC2",
          componentType: "UINT8",
          normalized: true,
          array: true,
          count: 2,
          offset: [
            [-1, -1],
            [-1, -1],
          ],
          scale: [
            [2, 2],
            [2, 2],
          ],
        },
      }),
      bufferViews: {
        0: new Uint8Array([0, 127, 127, 255, 0, 0, 255, 255]),
      },
    });

    expect(property.hasValueTransform).toBe(true);
    expect(property.offset).toEqual([-1, -1, -1, -1]);
    expect(property.scale).toEqual([2, 2, 2, 2]);
    expect(property.byteLength).toBe(8);
  });

  it("creates with default offset and scale", function () {
    const property = new MetadataTableProperty({
      count: 2,
      property: {
        values: 0,
      },
      classProperty: MetadataClassProperty.fromJson({
        id: "property",
        property: {
          type: "VEC2",
          componentType: "UINT8",
          normalized: true,
          array: true,
          count: 2,
        },
      }),
      bufferViews: {
        0: new Uint8Array([0, 127, 127, 255, 0, 0, 255, 255]),
      },
    });

    expect(property.hasValueTransform).toBe(false);
    expect(property.offset).toEqual([0, 0, 0, 0]);
    expect(property.scale).toEqual([1, 1, 1, 1]);
    expect(property.byteLength).toBe(8);
  });

  it("constructor throws without count", function () {
    expect(function () {
      return new MetadataTableProperty({
        property: {},
        classProperty: {},
        bufferViews: {},
      });
    }).toThrowDeveloperError();
  });

  it("constructor throws if count is less than 1", function () {
    expect(function () {
      return new MetadataTableProperty({
        count: 0,
        property: {},
        classProperty: {},
        bufferViews: {},
      });
    }).toThrowDeveloperError();
  });

  it("constructor throws without property", function () {
    expect(function () {
      return new MetadataTableProperty({
        count: 1,
        classProperty: {},
        bufferViews: {},
      });
    }).toThrowDeveloperError();
  });

  it("constructor throws without bufferViews", function () {
    expect(function () {
      return new MetadataTableProperty({
        count: 1,
        property: {},
        classProperty: {},
      });
    }).toThrowDeveloperError();
  });

  function testGetUint64(options) {
    options = options ?? Frozen.EMPTY_OBJECT;
    const disableBigIntSupport = options.disableBigIntSupport;
    const disableBigUint64ArraySupport = options.disableBigUint64ArraySupport;

    const originalValues = [
      BigInt(0), // eslint-disable-line
      BigInt(10), // eslint-disable-line
      BigInt("4611686018427387833"), // eslint-disable-line
      BigInt("18446744073709551615"), // eslint-disable-line
    ];

    let expectedValues = originalValues;

    if (disableBigUint64ArraySupport && disableBigIntSupport) {
      // Precision loss is expected if UINT64 is converted to JS numbers
      expectedValues = [0, 10, 4611686018427388000, 18446744073709552000];
    }

    const classProperty = {
      type: "SCALAR",
      componentType: "UINT64",
    };

    const property = MetadataTester.createProperty({
      property: classProperty,
      values: originalValues,
      disableBigUint64ArraySupport: disableBigUint64ArraySupport,
      disableBigIntSupport: disableBigIntSupport,
    });

    const length = originalValues.length;
    for (let i = 0; i < length; ++i) {
      const value = property.get(i);
      expect(value).toEqual(expectedValues[i]);
    }
  }

  function testGetInt64(options) {
    options = options ?? Frozen.EMPTY_OBJECT;
    const disableBigIntSupport = options.disableBigIntSupport;
    const disableBigInt64ArraySupport = options.disableBigInt64ArraySupport;

    const originalValues = [
      BigInt("-9223372036854775808"), // eslint-disable-line
      BigInt("-4611686018427387833"), // eslint-disable-line
      BigInt(-10), // eslint-disable-line
      BigInt(0), // eslint-disable-line
      BigInt(10), // eslint-disable-line
      BigInt("4611686018427387833"), // eslint-disable-line
      BigInt("9223372036854775807"), // eslint-disable-line
    ];

    let expectedValues = originalValues;

    if (disableBigInt64ArraySupport && disableBigIntSupport) {
      // Precision loss is expected if INT64 is converted to JS numbers
      expectedValues = [
        -9223372036854776000, -4611686018427388000, -10, 0, 10,
        4611686018427388000, 9223372036854776000,
      ];
    }

    const classProperty = {
      type: "SCALAR",
      componentType: "INT64",
    };

    const property = MetadataTester.createProperty({
      property: classProperty,
      values: originalValues,
      disableBigInt64ArraySupport: disableBigInt64ArraySupport,
      disableBigIntSupport: disableBigIntSupport,
    });

    const length = originalValues.length;
    for (let i = 0; i < length; ++i) {
      const value = property.get(i);
      expect(value).toEqual(expectedValues[i]);
    }
  }

  it("get returns UINT64 property as BigInt when BigUint64Array is not supported and BigInt is supported", function () {
    testGetUint64({
      disableBigUint64ArraySupport: true,
    });
  });

  it("get returns UINT64 property as number when BigUint64Array is not supported and BigInt is not supported", function () {
    testGetUint64({
      disableBigUint64ArraySupport: true,
      disableBigIntSupport: true,
    });
  });

  it("get returns INT64 property as BigInt when BigInt64Array is supported and BigInt is supported", function () {
    testGetInt64();
  });

  it("get returns INT64 property as BigInt when BigInt64Array is not supported and BigInt is supported", function () {
    testGetInt64({
      disableBigInt64ArraySupport: true,
    });
  });

  it("get returns INT64 property as number when BigInt64Array is not supported and BigInt is not supported", function () {
    testGetInt64({
      disableBigInt64ArraySupport: true,
      disableBigIntSupport: true,
    });
  });

  it("get returns single values", function () {
    // INT64 and UINT64 are tested above
    const properties = {
      propertyInt8: {
        type: "SCALAR",
        componentType: "INT8",
      },
      propertyUint8: {
        type: "SCALAR",
        componentType: "UINT8",
      },
      propertyInt16: {
        type: "SCALAR",
        componentType: "INT16",
      },
      propertyUint16: {
        type: "SCALAR",
        componentType: "UINT16",
      },
      propertyInt32: {
        type: "SCALAR",
        componentType: "INT32",
      },
      propertyUint32: {
        type: "SCALAR",
        componentType: "UINT32",
      },
      propertyFloat32: {
        type: "SCALAR",
        componentType: "FLOAT32",
      },
      propertyFloat64: {
        type: "SCALAR",
        componentType: "FLOAT64",
      },
      propertyBoolean: {
        type: "BOOLEAN",
      },
      propertyString: {
        type: "STRING",
      },
      propertyEnum: {
        type: "ENUM",
        enumType: "myEnum",
      },
    };

    const propertyValues = {
      propertyInt8: [-128, -10, 0, 10, 127],
      propertyUint8: [0, 10, 20, 30, 255],
      propertyInt16: [-32768, -10, 0, 10, 32767],
      propertyUint16: [0, 10, 20, 30, 65535],
      propertyInt32: [-2147483648, -10, 0, 10, 2147483647],
      propertyUint32: [0, 10, 20, 30, 4294967295],
      propertyFloat32: [-2.5, -1.0, 0.0, 700.0, Number.POSITIVE_INFINITY],
      propertyFloat64: [-234934.12, -1.0, 0.0, 700.0, Number.POSITIVE_INFINITY],
      propertyBoolean: [false, true, false, true, false],
      propertyString: ["おはようございます。😃", "a", "", "def", "0001"],
      propertyEnum: ["ValueA", "ValueB", "Other", "ValueA", "ValueA"],
    };

    for (const propertyId in properties) {
      if (properties.hasOwnProperty(propertyId)) {
        const property = MetadataTester.createProperty({
          property: properties[propertyId],
          values: propertyValues[propertyId],
          enums: enums,
        });

        const expectedValues = propertyValues[propertyId];
        const length = expectedValues.length;
        for (let i = 0; i < length; ++i) {
          const value = property.get(i);
          expect(value).toEqual(expectedValues[i]);
        }
      }
    }
  });

  it("get returns vector values", function () {
    const properties = {
      propertyInt8: {
        type: "VEC3",
        componentType: "INT8",
      },
      propertyUint8: {
        type: "VEC3",
        componentType: "UINT8",
      },
      propertyInt16: {
        type: "VEC3",
        componentType: "INT16",
      },
      propertyUint16: {
        type: "VEC3",
        componentType: "UINT16",
      },
      propertyInt32: {
        type: "VEC3",
        componentType: "INT32",
      },
      propertyUint32: {
        type: "VEC3",
        componentType: "UINT32",
      },
      propertyFloat32: {
        type: "VEC3",
        componentType: "FLOAT32",
      },
      propertyFloat64: {
        type: "VEC3",
        componentType: "FLOAT64",
      },
    };

    const propertyValues = {
      propertyInt8: [
        [-2, -1, 0],
        [1, 2, 3],
      ],
      propertyUint8: [
        [0, 1, 2],
        [3, 4, 5],
      ],
      propertyInt16: [
        [-2, -1, 0],
        [1, 2, 3],
      ],
      propertyUint16: [
        [0, 1, 2],
        [3, 4, 5],
      ],
      propertyInt32: [
        [-2, -1, 0],
        [1, 2, 3],
      ],
      propertyUint32: [
        [0, 1, 2],
        [3, 4, 5],
      ],
      propertyFloat32: [
        [-2.0, -1.0, 0.0],
        [1.0, 2.0, 3.0],
      ],
      propertyFloat64: [
        [-2.0, -1.0, 0.0],
        [1.0, 2.0, 3.0],
      ],
    };

    for (const propertyId in properties) {
      if (properties.hasOwnProperty(propertyId)) {
        const property = MetadataTester.createProperty({
          property: properties[propertyId],
          values: propertyValues[propertyId],
          enums: enums,
        });

        const expectedValues = propertyValues[propertyId];
        const length = expectedValues.length;
        for (let i = 0; i < length; ++i) {
          const value = property.get(i);
          expect(value).toEqual(Cartesian3.unpack(expectedValues[i]));
        }
      }
    }
  });

  it("get returns fixed size arrays", function () {
    const properties = {
      propertyInt64: {
        type: "SCALAR",
        componentType: "INT64",
        array: true,
        count: 3,
      },
      propertyUint64: {
        type: "SCALAR",
        componentType: "UINT64",
        array: true,
        count: 3,
      },
      propertyBoolean: {
        type: "BOOLEAN",
        array: true,
        count: 3,
      },
      propertyString: {
        type: "STRING",
        array: true,
        count: 3,
      },
      propertyEnum: {
        type: "ENUM",
        enumType: "myEnum",
        array: true,
        count: 3,
      },
      propertyUint32: {
        type: "SCALAR",
        componentType: "UINT32",
        array: true,
        count: 3,
      },
      propertyFloat32: {
        type: "SCALAR",
        componentType: "FLOAT32",
        array: true,
        count: 3,
      },
    };

    const propertyValues = {
      propertyInt64: [
        [BigInt(-2), BigInt(-1), BigInt(0)], // eslint-disable-line
        [BigInt(1), BigInt(2), BigInt(3)], // eslint-disable-line
      ],
      propertyUint64: [
        [BigInt(0), BigInt(1), BigInt(2)], // eslint-disable-line
        [BigInt(3), BigInt(4), BigInt(5)], // eslint-disable-line
      ],
      propertyBoolean: [
        [false, true, false],
        [true, false, true],
      ],
      propertyString: [
        ["a", "bc", "def"],
        ["dog", "cat", "😃😃😃"],
      ],
      propertyEnum: [
        ["ValueA", "ValueB", "Other"],
        ["ValueA", "ValueA", "ValueA"],
      ],
      propertyUint32: [
        [0, 1, 2],
        [3, 4, 5],
      ],
      propertyFloat32: [
        [-2.0, -1.0, 0.0],
        [1.0, 2.0, 3.0],
      ],
    };

    for (const propertyId in properties) {
      if (properties.hasOwnProperty(propertyId)) {
        const property = MetadataTester.createProperty({
          property: properties[propertyId],
          values: propertyValues[propertyId],
          enums: enums,
        });

        const expectedValues = propertyValues[propertyId];
        const length = expectedValues.length;
        for (let i = 0; i < length; ++i) {
          const value = property.get(i);
          expect(value).toEqual(expectedValues[i]);
        }
      }
    }
  });

  it("get returns variable size arrays", function () {
    const properties = {
      propertyInt8: {
        type: "SCALAR",
        componentType: "INT8",
        array: true,
      },
      propertyUint8: {
        type: "SCALAR",
        componentType: "UINT8",
        array: true,
      },
      propertyInt16: {
        type: "SCALAR",
        componentType: "INT16",
        array: true,
      },
      propertyUint16: {
        type: "SCALAR",
        componentType: "UINT16",
        array: true,
      },
      propertyInt32: {
        type: "SCALAR",
        componentType: "INT32",
        array: true,
      },
      propertyUint32: {
        type: "SCALAR",
        componentType: "UINT32",
        array: true,
      },
      propertyInt64: {
        type: "SCALAR",
        componentType: "INT64",
        array: true,
      },
      propertyUint64: {
        type: "SCALAR",
        componentType: "UINT64",
        array: true,
      },
      propertyFloat32: {
        type: "SCALAR",
        componentType: "FLOAT32",
        array: true,
      },
      propertyFloat64: {
        type: "SCALAR",
        componentType: "FLOAT64",
        array: true,
      },
      propertyBoolean: {
        type: "BOOLEAN",
        array: true,
      },
      propertyString: {
        type: "STRING",
        array: true,
      },
      propertyEnum: {
        type: "ENUM",
        enumType: "myEnum",
        array: true,
      },
    };

    // Tests empty arrays as well
    const propertyValues = {
      propertyInt8: [[-2], [-1, 0], [1, 2, 3], []],
      propertyUint8: [[0], [1, 2], [3, 4, 5], []],
      propertyInt16: [[-2], [-1, 0], [1, 2, 3], []],
      propertyUint16: [[0], [1, 2], [3, 4, 5], []],
      propertyInt32: [[-2], [-1, 0], [1, 2, 3], []],
      propertyUint32: [[0], [1, 2], [3, 4, 5], []],
      propertyInt64: [
        [BigInt(-2)], // eslint-disable-line
        [BigInt(-1), BigInt(0)], // eslint-disable-line
        [BigInt(1), BigInt(2), BigInt(3)], // eslint-disable-line
        [],
      ],
      propertyUint64: [
        [BigInt(0)], // eslint-disable-line
        [BigInt(1), BigInt(2)], // eslint-disable-line
        [BigInt(3), BigInt(4), BigInt(5)], // eslint-disable-line
        [],
      ],
      propertyFloat32: [[-2.0], [-1.0, 0.0], [1.0, 2.0, 3.0], []],
      propertyFloat64: [[-2.0], [-1.0, 0.0], [1.0, 2.0, 3.0], []],
      propertyBoolean: [[false], [true, false], [true, false, true], []],
      propertyString: [["a"], ["bc", "def"], ["dog", "cat", "😃😃😃"], []],
      propertyEnum: [
        ["ValueA"],
        ["ValueB", "Other"],
        ["ValueA", "ValueA", "ValueA"],
        [],
      ],
    };

    for (const propertyId in properties) {
      if (properties.hasOwnProperty(propertyId)) {
        const property = MetadataTester.createProperty({
          property: properties[propertyId],
          values: propertyValues[propertyId],
          enums: enums,
        });

        const expectedValues = propertyValues[propertyId];
        const length = expectedValues.length;
        for (let i = 0; i < length; ++i) {
          const value = property.get(i);
          expect(value).toEqual(expectedValues[i]);
        }
      }
    }
  });

  it("get returns arrays of vectors and matrices", function () {
    const properties = {
      propertyVec4: {
        type: "VEC4",
        componentType: "FLOAT32",
        array: true,
        count: 2,
      },
      propertyDVec2: {
        type: "VEC2",
        componentType: "FLOAT64",
        array: true,
      },
      propertyU8Mat3: {
        type: "MAT3",
        componentType: "UINT8",
        array: true,
        count: 2,
      },
      propertyDMat2: {
        type: "MAT2",
        componentType: "FLOAT64",
        array: true,
      },
    };

    // for unpacking results in expect()
    const mathTypes = {
      propertyVec4: Cartesian4,
      propertyDVec2: Cartesian2,
      propertyU8Mat3: Matrix3,
      propertyDMat2: Matrix2,
    };

    // prettier-ignore
    const propertyValues = {
      propertyVec4: [
        [
          1, 1, 0, 1,
          1, 1, 0, 1
        ],
        [
          1, 2, 3, 4,
          1, 2, 3, 4
        ]
      ],
      propertyDVec2: [
        [
          1, 2,
          3, 4,
          5, 6
        ],
        [1, 2]
      ],
      propertyU8Mat3: [
        [
          2, 0, 0, 0, 2, 0, 0, 0, 2,
          1, 2, 3, 1, 2, 3, 1, 2, 3
        ],
        [
          255, 128, 0, 0, 255, 0, 0, 255, 255,
          1, 2, 3, 4, 5, 6, 7, 8, 9
        ]
      ],
      propertyDMat2: [
        [
          1, 2, 3, 4,
          1, 0, 0, 1,
          0, 0, 0, 1,
        ],
        [
          1, 2, 1, 2,
          1, 0, 0, 2
        ]
      ]
    };

    for (const propertyId in properties) {
      if (properties.hasOwnProperty(propertyId)) {
        const property = MetadataTester.createProperty({
          property: properties[propertyId],
          values: propertyValues[propertyId],
        });

        const expectedValues = propertyValues[propertyId];
        const length = expectedValues.length;
        const MathType = mathTypes[propertyId];
        for (let i = 0; i < length; ++i) {
          const value = property.get(i);
          expect(value).toEqual(MathType.unpackArray(expectedValues[i]));
        }
      }
    }
  });

  it("get returns normalized value", function () {
    const propertyInt8 = MetadataTester.createProperty({
      property: {
        type: "SCALAR",
        componentType: "INT8",
        normalized: true,
      },
      values: [-127],
    });

    const propertyUint8 = MetadataTester.createProperty({
      property: {
        type: "SCALAR",
        componentType: "UINT8",
        normalized: true,
      },
      values: [255],
    });

    expect(propertyInt8.get(0)).toBe(-1.0);
    expect(propertyUint8.get(0)).toBe(1.0);
  });

  it("get applies offset/scale", function () {
    const propertyInt8 = MetadataTester.createProperty({
      property: {
        type: "SCALAR",
        componentType: "INT8",
        normalized: true,
        offset: 0.5,
        scale: 0.5,
      },
      values: [-127],
    });

    const propertyArrayOfVector = MetadataTester.createProperty({
      property: {
        type: "VEC3",
        componentType: "FLOAT32",
        array: true,
        count: 2,
        scale: [
          [2.0, 2.0, 2.0],
          [1.0, 1.0, 1.0],
        ],
      },
      values: [[1.0, 1.0, 1.0, 1.0, 2.0, 3.0]],
    });

    expect(propertyInt8.get(0)).toBe(0.0);
    expect(propertyArrayOfVector.get(0)).toEqual([
      new Cartesian3(2, 2, 2),
      new Cartesian3(1, 2, 3),
    ]);
  });

  it("get handles noData correctly", function () {
    const properties = {
      noDefault: {
        type: "SCALAR",
        componentType: "INT32",
        required: false,
        noData: -1,
      },
      hasDefault: {
        type: "SCALAR",
        componentType: "INT32",
        required: false,
        noData: -1,
        default: 100,
      },
      noDefaultVector: {
        type: "VEC2",
        componentType: "FLOAT32",
        required: false,
        noData: [0.0, 0.0],
      },
      hasDefaultVector: {
        type: "VEC2",
        componentType: "FLOAT32",
        required: false,
        noData: [0.0, 0.0],
        default: [100.0, 100.0],
      },
      noDefaultArray: {
        array: true,
        type: "SCALAR",
        componentType: "UINT8",
        count: 3,
        required: false,
        noData: [0, 0, 0],
      },
      hasDefaultArray: {
        array: true,
        type: "SCALAR",
        componentType: "UINT8",
        required: false,
        noData: [],
        default: [1, 1, 1],
      },
      noDefaultArrayOfVector: {
        array: true,
        type: "VEC2",
        componentType: "FLOAT32",
        count: 3,
        required: false,
        noData: [
          [0.0, 0.0],
          [0.0, 0.0],
        ],
      },
      hasDefaultArrayOfVector: {
        array: true,
        type: "VEC2",
        componentType: "FLOAT32",
        required: false,
        noData: [],
        default: [
          [1.0, 1.0],
          [1.0, 1.0],
        ],
      },
    };

    const propertyValues = {
      noDefault: [-1, 0],
      hasDefault: [-1, 0],
      noDefaultVector: [
        [0.0, 0.0],
        [0.0, 1.0],
      ],
      hasDefaultVector: [
        [0.0, 0.0],
        [0.0, 1.0],
      ],
      noDefaultArray: [
        [0, 0, 0],
        [1, 0, 0],
      ],
      hasDefaultArray: [[], [1, 2]],
      noDefaultArrayOfVector: [
        [0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        [1.0, 0.0, 1.0, 1.0, 0.0, 0.0],
      ],
      hasDefaultArrayOfVector: [[], [1.0, 0.0]],
    };

    const expectedValues = {
      noDefault: [undefined, 0],
      hasDefault: [100, 0],
      noDefaultVector: [undefined, new Cartesian2(0.0, 1.0)],
      hasDefaultVector: [
        new Cartesian2(100.0, 100.0),
        new Cartesian2(0.0, 1.0),
      ],
      noDefaultArray: [undefined, [1, 0, 0]],
      hasDefaultArray: [
        [1, 1, 1],
        [1, 2],
      ],
      noDefaultArrayOfVector: [
        undefined,
        [
          [1.0, 0.0],
          [1.0, 1.0],
          [0.0, 0.0],
        ],
      ],
      hasDefaultArrayOfVector: [
        [new Cartesian2(1.0, 1.0), new Cartesian2(1.0, 1.0)],
        [new Cartesian2(1.0, 0.0)],
      ],
    };

    for (const propertyId in properties) {
      if (properties.hasOwnProperty(propertyId)) {
        const property = MetadataTester.createProperty({
          property: properties[propertyId],
          values: propertyValues[propertyId],
        });

        const length = expectedValues.length;
        for (let i = 0; i < length; ++i) {
          const value = property.get(i);
          expect(value).toEqual(expectedValues[propertyId][i]);
        }
      }
    }
  });

  it("get throws without index", function () {
    const property = MetadataTester.createProperty({
      property: {
        type: "SCALAR",
        componentType: "FLOAT32",
      },
      values: [1.0, 2.0],
    });

    expect(function () {
      property.get();
    }).toThrowDeveloperError();
  });

  it("get throws if index is out of bounds", function () {
    const property = MetadataTester.createProperty({
      property: {
        type: "SCALAR",
        componentType: "FLOAT32",
      },
      values: [1.0, 2.0],
    });

    expect(property.get(0)).toBe(1.0);
    expect(property.get(1)).toBe(2.0);

    expect(function () {
      property.get(2);
    }).toThrowDeveloperError();
  });

  it("set sets scalar values", function () {
    const properties = {
      propertyInt8: {
        type: "SCALAR",
        componentType: "INT8",
      },
      propertyUint8: {
        type: "SCALAR",
        componentType: "UINT8",
      },
      propertyInt16: {
        type: "SCALAR",
        componentType: "INT16",
      },
      propertyUint16: {
        type: "SCALAR",
        componentType: "UINT16",
      },
      propertyInt32: {
        type: "SCALAR",
        componentType: "INT32",
      },
      propertyUint32: {
        type: "SCALAR",
        componentType: "UINT32",
      },
      propertyInt64: {
        type: "SCALAR",
        componentType: "INT64",
      },
      propertyUint64: {
        type: "SCALAR",
        componentType: "UINT64",
      },
      propertyFloat32: {
        type: "SCALAR",
        componentType: "FLOAT32",
      },
      propertyFloat64: {
        type: "SCALAR",
        componentType: "FLOAT64",
      },
      propertyBoolean: {
        type: "BOOLEAN",
      },
      propertyString: {
        type: "STRING",
      },
      propertyEnum: {
        type: "ENUM",
        enumType: "myEnum",
      },
    };

    const propertyValues = {
      propertyInt8: [0, 0, 0, 0, 0],
      propertyUint8: [0, 0, 0, 0, 0],
      propertyInt16: [0, 0, 0, 0, 0],
      propertyUint16: [0, 0, 0, 0, 0],
      propertyInt32: [0, 0, 0, 0, 0],
      propertyUint32: [0, 0, 0, 0, 0],
      propertyInt64: [BigInt(0), BigInt(0), BigInt(0), BigInt(0), BigInt(0)], // eslint-disable-line
      propertyUint64: [BigInt(0), BigInt(0), BigInt(0), BigInt(0), BigInt(0)], // eslint-disable-line
      propertyFloat32: [0.0, 0.0, 0.0, 0.0, 0.0],
      propertyFloat64: [0.0, 0.0, 0.0, 0.0, 0.0],
      propertyBoolean: [false, false, true, false, true],
      propertyString: ["", "", "", "", ""],
      propertyEnum: ["Other", "Other", "Other", "Other", "Other"],
    };

    const valuesToSet = {
      propertyInt8: [-128, -10, 0, 10, 127],
      propertyUint8: [0, 10, 20, 30, 255],
      propertyInt16: [-32768, -10, 0, 10, 32767],
      propertyUint16: [0, 10, 20, 30, 65535],
      propertyInt32: [-2147483648, -10, 0, 10, 2147483647],
      propertyUint32: [0, 10, 20, 30, 4294967295],
      propertyInt64: [
        BigInt("-9223372036854775808"), // eslint-disable-line
        BigInt("-4611686018427387833"), // eslint-disable-line
        BigInt(0), // eslint-disable-line
        BigInt("4611686018427387833"), // eslint-disable-line
        BigInt("9223372036854775807"), // eslint-disable-line
      ],
      propertyUint64: [
        BigInt(0), // eslint-disable-line
        BigInt(10), // eslint-disable-line
        BigInt(100), // eslint-disable-line
        BigInt("4611686018427387833"), // eslint-disable-line
        BigInt("18446744073709551615"), // eslint-disable-line
      ],
      propertyFloat32: [-2.5, -1.0, 0.0, 700.0, 38.0],
      propertyFloat64: [-234934.12, -1.0, 0.0, 700.0, Math.PI],
      propertyBoolean: [true, true, false, false, true],
      propertyString: ["おはようございます。😃", "a", "", "def", "0001"],
      propertyEnum: ["ValueA", "ValueB", "Other", "ValueA", "ValueA"],
    };

    for (const propertyId in properties) {
      if (properties.hasOwnProperty(propertyId)) {
        const property = MetadataTester.createProperty({
          property: properties[propertyId],
          values: propertyValues[propertyId],
          enums: enums,
        });

        const expectedValues = valuesToSet[propertyId];
        const length = expectedValues.length;
        for (let i = 0; i < length; ++i) {
          property.set(i, expectedValues[i]);
          let value = property.get(i);
          expect(value).toEqual(expectedValues[i]);
          // Test setting / getting again
          property.set(i, expectedValues[i]);
          value = property.get(i);
          expect(value).toEqual(expectedValues[i]);
        }
      }
    }
  });

  it("set sets vector values", function () {
    const properties = {
      propertyInt8: {
        type: "VEC3",
        componentType: "INT8",
      },
      propertyUint8: {
        type: "VEC3",
        componentType: "UINT8",
      },
      propertyInt16: {
        type: "VEC3",
        componentType: "INT16",
      },
      propertyUint16: {
        type: "VEC3",
        componentType: "UINT16",
      },
      propertyInt32: {
        type: "VEC3",
        componentType: "INT32",
      },
      propertyUint32: {
        type: "VEC3",
        componentType: "UINT32",
      },
      propertyFloat32: {
        type: "VEC3",
        componentType: "FLOAT32",
      },
      propertyFloat64: {
        type: "VEC3",
        componentType: "FLOAT64",
      },
    };

    const propertyValues = {
      propertyInt8: [
        [0, 0, 0],
        [0, 0, 0],
      ],
      propertyUint8: [
        [0, 0, 0],
        [0, 0, 0],
      ],
      propertyInt16: [
        [0, 0, 0],
        [0, 0, 0],
      ],
      propertyUint16: [
        [0, 0, 0],
        [0, 0, 0],
      ],
      propertyInt32: [
        [0, 0, 0],
        [0, 0, 0],
      ],
      propertyUint32: [
        [0, 0, 0],
        [0, 0, 0],
      ],
      propertyFloat32: [
        [0.0, 0.0, 0.0],
        [0.0, 0.0, 0.0],
      ],
      propertyFloat64: [
        [0.0, 0.0, 0.0],
        [0.0, 0.0, 0.0],
      ],
    };

    const valuesToSet = {
      propertyInt8: [new Cartesian3(-2, -1, 0), new Cartesian3(1, 2, 3)],
      propertyUint8: [new Cartesian3(0, 1, 2), new Cartesian3(3, 4, 5)],
      propertyInt16: [new Cartesian3(-2, -1, 0), new Cartesian3(1, 2, 3)],
      propertyUint16: [new Cartesian3(0, 1, 2), new Cartesian3(3, 4, 5)],
      propertyInt32: [new Cartesian3(-2, -1, 0), new Cartesian3(1, 2, 3)],
      propertyUint32: [new Cartesian3(0, 1, 2), new Cartesian3(3, 4, 5)],
      propertyFloat32: [
        new Cartesian3(-2.0, -1.0, 0.0),
        new Cartesian3(1.0, 2.0, 3.0),
      ],
      propertyFloat64: [
        new Cartesian3(-2.0, -1.0, 0.0),
        new Cartesian3(1.0, 2.0, 3.0),
      ],
    };

    for (const propertyId in properties) {
      if (properties.hasOwnProperty(propertyId)) {
        const property = MetadataTester.createProperty({
          property: properties[propertyId],
          values: propertyValues[propertyId],
          enums: enums,
        });
        const expectedValues = valuesToSet[propertyId];
        const length = expectedValues.length;
        for (let i = 0; i < length; ++i) {
          property.set(i, expectedValues[i]);
          let value = property.get(i);
          expect(value).toEqual(expectedValues[i]);
          // Test setting / getting again
          property.set(i, expectedValues[i]);
          value = property.get(i);
          expect(value).toEqual(expectedValues[i]);
        }
      }
    }
  });

  it("set sets fixed size arrays", function () {
    const properties = {
      propertyInt64: {
        type: "SCALAR",
        componentType: "INT64",
        array: true,
        count: 3,
      },
      propertyUint64: {
        type: "SCALAR",
        componentType: "UINT64",
        array: true,
        count: 3,
      },
      propertyBoolean: {
        type: "BOOLEAN",
        array: true,
        count: 3,
      },
      propertyString: {
        type: "STRING",
        array: true,
        count: 3,
      },
      propertyEnum: {
        type: "ENUM",
        enumType: "myEnum",
        array: true,
        count: 3,
      },
      propertyUint32: {
        type: "SCALAR",
        componentType: "UINT32",
        array: true,
        count: 3,
      },
      propertyFloat32: {
        type: "SCALAR",
        componentType: "FLOAT32",
        array: true,
        count: 2,
      },
    };

    const propertyValues = {
      propertyInt64: [
        [BigInt(0), BigInt(0), BigInt(0)], // eslint-disable-line
        [BigInt(0), BigInt(0), BigInt(0)], // eslint-disable-line
      ],
      propertyUint64: [
        [BigInt(0), BigInt(0), BigInt(0)], // eslint-disable-line
        [BigInt(0), BigInt(0), BigInt(0)], // eslint-disable-line
      ],
      propertyBoolean: [
        [false, false, false],
        [true, true, true],
      ],
      propertyString: [
        ["", "", ""],
        ["", "", ""],
      ],
      propertyEnum: [
        ["Other", "Other", "Other"],
        ["Other", "Other", "Other"],
      ],
      propertyUint32: [
        [0, 0, 0],
        [0, 0, 0],
      ],
      propertyFloat32: [
        [0.0, 0.0],
        [0.0, 0.0],
      ],
    };

    const valuesToSet = {
      propertyInt64: [
        [BigInt(-2), BigInt(-1), BigInt(0)], // eslint-disable-line
        [BigInt(1), BigInt(2), BigInt(3)], // eslint-disable-line
      ],
      propertyUint64: [
        [BigInt(0), BigInt(1), BigInt(2)], // eslint-disable-line
        [BigInt(3), BigInt(4), BigInt(5)], // eslint-disable-line
      ],
      propertyBoolean: [
        [false, true, false],
        [true, false, true],
      ],
      propertyString: [
        ["a", "bc", "def"],
        ["dog", "cat", "😃😃😃"],
      ],
      propertyEnum: [
        ["ValueA", "ValueB", "Other"],
        ["ValueA", "ValueA", "ValueA"],
      ],
      propertyUint32: [
        [1, 0, 0],
        [0, 2, 0],
      ],
      propertyFloat32: [
        [0.0, 0.5],
        [0.25, 0.25],
      ],
    };

    for (const propertyId in properties) {
      if (properties.hasOwnProperty(propertyId)) {
        const property = MetadataTester.createProperty({
          property: properties[propertyId],
          values: propertyValues[propertyId],
          enums: enums,
        });
        const expectedValues = valuesToSet[propertyId];
        const length = expectedValues.length;
        for (let i = 0; i < length; ++i) {
          property.set(i, expectedValues[i]);
          let value = property.get(i);
          expect(value).toEqual(expectedValues[i]);
          // Test setting / getting again
          property.set(i, expectedValues[i]);
          value = property.get(i);
          expect(value).toEqual(expectedValues[i]);
        }
      }
    }
  });

  it("set sets arrays of vectors and matrices", function () {
    const properties = {
      propertyVec4: {
        type: "VEC4",
        componentType: "FLOAT32",
        array: true,
        count: 2,
      },
      propertyDVec2: {
        type: "VEC2",
        componentType: "FLOAT64",
        array: true,
      },
      propertyU8Mat3: {
        type: "MAT3",
        componentType: "UINT8",
        array: true,
        count: 2,
      },
      propertyDMat2: {
        type: "MAT2",
        componentType: "FLOAT64",
        array: true,
      },
    };

    // prettier-ignore
    const propertyValues = {
      propertyVec4: [
        [
          1, 1, 0, 1,
          1, 1, 0, 1
        ],
        [
          1, 2, 3, 4,
          1, 2, 3, 4
        ]
      ],
      propertyDVec2: [
        [
          1, 2,
          3, 4,
          5, 6
        ],
        [1, 2]
      ],
      propertyU8Mat3: [
        [
          2, 0, 0, 0, 2, 0, 0, 0, 2,
          1, 2, 3, 1, 2, 3, 1, 2, 3
        ],
        [
          255, 128, 0, 0, 255, 0, 0, 255, 255,
          1, 2, 3, 4, 5, 6, 7, 8, 9
        ]
      ],
      propertyDMat2: [
        [
          1, 2, 3, 4,
          1, 0, 0, 1,
          0, 0, 0, 1,
        ],
        [
          1, 2, 1, 2,
          1, 0, 0, 2
        ]
      ]
    };

    const valuesToSet = {
      propertyVec4: [
        [new Cartesian4(1, 1, 0, 1), new Cartesian4(1, 1, 0, 1)],
        [new Cartesian4(1, 2, 3, 4), new Cartesian4(1, 2, 3, 4)],
      ],
      propertyDVec2: [
        [new Cartesian2(1, 2), new Cartesian2(3, 4), new Cartesian2(5, 6)],
        [new Cartesian2(1, 2)],
      ],
      propertyU8Mat3: [
        [
          new Matrix3(2, 0, 0, 0, 2, 0, 0, 0, 2),
          new Matrix3(1, 2, 3, 1, 2, 3, 1, 2, 3),
        ],
        [
          new Matrix3(255, 128, 0, 0, 255, 0, 0, 255, 255),
          new Matrix3(1, 2, 3, 4, 5, 6, 7, 8, 9),
        ],
      ],
      propertyDMat2: [
        [
          new Matrix2(1, 2, 3, 4),
          new Matrix2(1, 0, 0, 1),
          new Matrix2(0, 0, 0, 1),
        ],
        [new Matrix2(1, 2, 1, 2), new Matrix2(1, 0, 0, 2)],
      ],
    };

    for (const propertyId in properties) {
      if (properties.hasOwnProperty(propertyId)) {
        const property = MetadataTester.createProperty({
          property: properties[propertyId],
          values: propertyValues[propertyId],
        });
        const expectedValues = valuesToSet[propertyId];
        const length = expectedValues.length;
        for (let i = 0; i < length; ++i) {
          property.set(i, expectedValues[i]);
          let value = property.get(i);
          expect(value).toEqual(expectedValues[i]);
          // Test setting / getting again
          property.set(i, expectedValues[i]);
          value = property.get(i);
          expect(value).toEqual(expectedValues[i]);
        }
      }
    }
  });

  it("set sets variable size arrays with arrays of the same length", function () {
    const properties = {
      propertyInt8: {
        type: "SCALAR",
        componentType: "INT8",
        array: true,
      },
      propertyUint8: {
        type: "SCALAR",
        componentType: "UINT8",
        array: true,
      },
      propertyInt16: {
        type: "SCALAR",
        componentType: "INT16",
        array: true,
      },
      propertyUint16: {
        type: "SCALAR",
        componentType: "UINT16",
        array: true,
      },
      propertyInt32: {
        type: "SCALAR",
        componentType: "INT32",
        array: true,
      },
      propertyUint32: {
        type: "SCALAR",
        componentType: "UINT32",
        array: true,
      },
      propertyInt64: {
        type: "SCALAR",
        componentType: "INT64",
        array: true,
      },
      propertyUint64: {
        type: "SCALAR",
        componentType: "UINT64",
        array: true,
      },
      propertyFloat32: {
        type: "SCALAR",
        componentType: "FLOAT32",
        array: true,
      },
      propertyFloat64: {
        type: "SCALAR",
        componentType: "FLOAT64",
        array: true,
      },
      propertyBoolean: {
        type: "BOOLEAN",
        array: true,
      },
      propertyString: {
        type: "STRING",
        array: true,
      },
      propertyEnum: {
        type: "ENUM",
        enumType: "myEnum",
        array: true,
      },
    };

    const propertyValues = {
      propertyInt8: [[0], [0, 0], [0, 0, 0], []],
      propertyUint8: [[0], [0, 0], [0, 0, 0], []],
      propertyInt16: [[0], [0, 0], [0, 0, 0], []],
      propertyUint16: [[0], [0, 0], [0, 0, 0], []],
      propertyInt32: [[0], [0, 0], [0, 0, 0], []],
      propertyUint32: [[0], [0, 0], [0, 0, 0], []],
      propertyInt64: [
        [BigInt(0)], // eslint-disable-line
        [BigInt(0), BigInt(0)], // eslint-disable-line
        [BigInt(0), BigInt(0), BigInt(0)], // eslint-disable-line
        [],
      ],
      propertyUint64: [
        [BigInt(0)], // eslint-disable-line
        [BigInt(0), BigInt(0)], // eslint-disable-line
        [BigInt(0), BigInt(0), BigInt(0)], // eslint-disable-line
        [],
      ],
      propertyFloat32: [[0.0], [0.0, 0.0], [0.0, 0.0, 0.0], []],
      propertyFloat64: [[0.0], [0.0, 0.0], [0.0, 0.0, 0.0], []],
      propertyBoolean: [[false], [false, false], [false, false, false], []],
      propertyString: [[""], ["", ""], ["", "", ""], []],
      propertyEnum: [
        ["Other"],
        ["Other", "Other"],
        ["Other", "Other", "Other"],
        [],
      ],
    };

    const valuesToSet = {
      propertyInt8: [[-2], [-1, 0], [1, 2, 3], []],
      propertyUint8: [[0], [1, 2], [3, 4, 5], []],
      propertyInt16: [[-2], [-1, 0], [1, 2, 3], []],
      propertyUint16: [[0], [1, 2], [3, 4, 5], []],
      propertyInt32: [[-2], [-1, 0], [1, 2, 3], []],
      propertyUint32: [[0], [1, 2], [3, 4, 5], []],
      propertyInt64: [
        [BigInt(-2)], // eslint-disable-line
        [BigInt(-1), BigInt(0)], // eslint-disable-line
        [BigInt(1), BigInt(2), BigInt(3)], // eslint-disable-line
        [],
      ],
      propertyUint64: [
        [BigInt(0)], // eslint-disable-line
        [BigInt(1), BigInt(2)], // eslint-disable-line
        [BigInt(3), BigInt(4), BigInt(5)], // eslint-disable-line
        [],
      ],
      propertyFloat32: [[-2.0], [-1.0, 0.0], [1.0, 2.0, 3.0], []],
      propertyFloat64: [[-2.0], [-1.0, 0.0], [1.0, 2.0, 3.0], []],
      propertyBoolean: [[false], [true, false], [true, false, true], []],
      propertyString: [["a"], ["bc", "def"], ["dog", "cat", "😃😃😃"], []],
      propertyEnum: [
        ["ValueA"],
        ["ValueB", "Other"],
        ["ValueA", "ValueA", "ValueA"],
        [],
      ],
    };

    for (const propertyId in properties) {
      if (properties.hasOwnProperty(propertyId)) {
        const property = MetadataTester.createProperty({
          property: properties[propertyId],
          values: propertyValues[propertyId],
          enums: enums,
        });
        const expectedValues = valuesToSet[propertyId];
        const length = expectedValues.length;
        for (let i = 0; i < length; ++i) {
          property.set(i, expectedValues[i]);
          let value = property.get(i);
          expect(value).toEqual(expectedValues[i]);
          // Test setting / getting again
          property.set(i, expectedValues[i]);
          value = property.get(i);
          expect(value).toEqual(expectedValues[i]);
        }
      }
    }
  });

  it("set sets variable size arrays with arrays of different lengths", function () {
    const properties = {
      propertyInt8: {
        type: "SCALAR",
        componentType: "INT8",
        array: true,
      },
      propertyUint8: {
        type: "SCALAR",
        componentType: "UINT8",
        array: true,
      },
      propertyInt16: {
        type: "SCALAR",
        componentType: "INT16",
        array: true,
      },
      propertyUint16: {
        type: "SCALAR",
        componentType: "UINT16",
        array: true,
      },
      propertyInt32: {
        type: "SCALAR",
        componentType: "INT32",
        array: true,
      },
      propertyUint32: {
        type: "SCALAR",
        componentType: "UINT32",
        array: true,
      },
      propertyInt64: {
        type: "SCALAR",
        componentType: "INT64",
        array: true,
      },
      propertyUint64: {
        type: "SCALAR",
        componentType: "UINT64",
        array: true,
      },
      propertyFloat32: {
        type: "SCALAR",
        componentType: "FLOAT32",
        array: true,
      },
      propertyFloat64: {
        type: "SCALAR",
        componentType: "FLOAT64",
        array: true,
      },
      propertyBoolean: {
        type: "BOOLEAN",
        array: true,
      },
      propertyString: {
        type: "STRING",
        array: true,
      },
      propertyEnum: {
        type: "ENUM",
        enumType: "myEnum",
        array: true,
      },
    };

    const propertyValues = {
      propertyInt8: [[0], [0, 0], [0, 0, 0], []],
      propertyUint8: [[0], [0, 0], [0, 0, 0], []],
      propertyInt16: [[0], [0, 0], [0, 0, 0], []],
      propertyUint16: [[0], [0, 0], [0, 0, 0], []],
      propertyInt32: [[0], [0, 0], [0, 0, 0], []],
      propertyUint32: [[0], [0, 0], [0, 0, 0], []],
      propertyInt64: [
        [BigInt(0)], // eslint-disable-line
        [BigInt(0), BigInt(0)], // eslint-disable-line
        [BigInt(0), BigInt(0), BigInt(0)], // eslint-disable-line
        [],
      ],
      propertyUint64: [
        [BigInt(0)], // eslint-disable-line
        [BigInt(0), BigInt(0)], // eslint-disable-line
        [BigInt(0), BigInt(0), BigInt(0)], // eslint-disable-line
        [],
      ],
      propertyFloat32: [[0.0], [0.0, 0.0], [0.0, 0.0, 0.0], []],
      propertyFloat64: [[0.0], [0.0, 0.0], [0.0, 0.0, 0.0], []],
      propertyBoolean: [[false], [false, false], [false, false, false], []],
      propertyString: [[""], ["", ""], ["", "", ""], []],
      propertyEnum: [
        ["Other"],
        ["Other", "Other"],
        ["Other", "Other", "Other"],
        [],
      ],
    };

    const valuesToSet = {
      propertyInt8: [[1, 2, 3], [], [-2], [-1, 0]],
      propertyUint8: [[3, 4, 5], [0], [], [1, 2]],
      propertyInt16: [[], [1, 2, 3], [-2], [-1, 0]],
      propertyUint16: [[3, 4, 5], [1, 2], [], [0]],
      propertyInt32: [[1, 2, 3], [], [-2], [-1, 0]],
      propertyUint32: [[0], [3, 4, 5], [1, 2], []],
      propertyInt64: [
        [BigInt(-1), BigInt(0)], // eslint-disable-line
        [BigInt(-2)], // eslint-disable-line
        [],
        [BigInt(1), BigInt(2), BigInt(3)], // eslint-disable-line
      ],
      propertyUint64: [
        [BigInt(0)], // eslint-disable-line
        [],
        [BigInt(1), BigInt(2)], // eslint-disable-line
        [BigInt(3), BigInt(4), BigInt(5)], // eslint-disable-line
      ],
      propertyFloat32: [[-1.0, 0.0], [1.0, 2.0, 3.0], [], [-2.0]],
      propertyFloat64: [[-2.0], [1.0, 2.0, 3.0], [-1.0, 0.0], []],
      propertyBoolean: [[true, false, true], [], [false], [true, false]],
      propertyString: [[], ["bc", "def"], ["a"], ["dog", "cat", "😃😃😃"]],
      propertyEnum: [
        [],
        ["ValueA", "ValueA", "ValueA"],
        ["ValueA"],
        ["ValueB", "Other"],
      ],
    };

    for (const propertyId in properties) {
      if (properties.hasOwnProperty(propertyId)) {
        const property = MetadataTester.createProperty({
          property: properties[propertyId],
          values: propertyValues[propertyId],
          enums: enums,
        });
        const expectedValues = valuesToSet[propertyId];
        const length = expectedValues.length;
        for (let i = 0; i < length; ++i) {
          property.set(i, expectedValues[i]);
          let value = property.get(i);
          expect(value).toEqual(expectedValues[i]);
          // Test setting / getting again
          property.set(i, expectedValues[i]);
          value = property.get(i);
          expect(value).toEqual(expectedValues[i]);
        }
      }
    }
  });

  it("set throws if Infinity is given for FLOAT32 and FLOAT64", function () {
    const propertyFloat32 = MetadataTester.createProperty({
      property: {
        type: "SCALAR",
        componentType: "FLOAT32",
      },
      values: [0.0, 0.0],
    });

    const propertyFloat64 = MetadataTester.createProperty({
      property: {
        type: "SCALAR",
        componentType: "FLOAT64",
      },
      values: [0.0, 0.0],
    });

    expect(function () {
      propertyFloat32.set(0, Number.POSITIVE_INFINITY);
    }).toThrowDeveloperError();
    expect(function () {
      propertyFloat32.set(1, Number.NEGATIVE_INFINITY);
    }).toThrowDeveloperError();
    expect(function () {
      propertyFloat64.set(0, Number.POSITIVE_INFINITY);
    }).toThrowDeveloperError();
    expect(function () {
      propertyFloat32.set(1, Number.NEGATIVE_INFINITY);
    }).toThrowDeveloperError();

    expect(propertyFloat32.get(0)).toBe(0.0);
    expect(propertyFloat32.get(1)).toBe(0.0);
    expect(propertyFloat64.get(0)).toBe(0.0);
    expect(propertyFloat64.get(1)).toBe(0.0);
  });

  it("set throws if a NaN is given for FLOAT32 and FLOAT64", function () {
    const propertyFloat32 = MetadataTester.createProperty({
      property: {
        type: "SCALAR",
        componentType: "FLOAT32",
      },
      values: [0.0],
    });

    const propertyFloat64 = MetadataTester.createProperty({
      property: {
        type: "SCALAR",
        componentType: "FLOAT64",
      },
      values: [0.0],
    });

    expect(function () {
      propertyFloat32.set(0, NaN);
    }).toThrowDeveloperError();
    expect(function () {
      propertyFloat64.set(0, NaN);
    }).toThrowDeveloperError();

    expect(propertyFloat32.get(0)).toBe(0.0);
    expect(propertyFloat64.get(0)).toBe(0.0);
  });

  it("set sets value for normalized property", function () {
    const propertyInt8 = MetadataTester.createProperty({
      property: {
        type: "SCALAR",
        componentType: "INT8",
        normalized: true,
      },
      values: [0],
    });

    const propertyUint8 = MetadataTester.createProperty({
      property: {
        type: "SCALAR",
        componentType: "UINT8",
        normalized: true,
      },
      values: [255],
    });

    propertyInt8.set(0, -1.0);
    propertyUint8.get(0, 1.0);

    expect(propertyInt8.get(0)).toBe(-1.0);
    expect(propertyUint8.get(0)).toBe(1.0);
  });

  it("get applies offset/scale", function () {
    const propertyInt8 = MetadataTester.createProperty({
      property: {
        type: "SCALAR",
        componentType: "INT8",
        normalized: true,
        offset: 0.5,
        scale: 0.5,
      },
      values: [-127],
    });

    const propertyArrayOfVector = MetadataTester.createProperty({
      property: {
        type: "VEC3",
        componentType: "FLOAT32",
        array: true,
        count: 2,
        scale: [
          [2.0, 2.0, 2.0],
          [1.0, 1.0, 1.0],
        ],
      },
      values: [[1.0, 1.0, 1.0, 1.0, 2.0, 3.0]],
    });

    propertyInt8.set(0, 1.0);
    propertyArrayOfVector.set(0, [
      new Cartesian3(1, 1, 1),
      new Cartesian3(2, 4, 8),
    ]);

    expect(propertyInt8.get(0)).toBe(1.0);
    expect(propertyArrayOfVector.get(0)).toEqual([
      new Cartesian3(1, 1, 1),
      new Cartesian3(2, 4, 8),
    ]);
  });

  it("set throws without index", function () {
    const property = MetadataTester.createProperty({
      property: {
        type: "SCALAR",
        componentType: "FLOAT32",
      },
      values: [1.0, 2.0],
    });

    expect(function () {
      property.set();
    }).toThrowDeveloperError();
  });

  it("set throws if index is out of bounds", function () {
    const property = MetadataTester.createProperty({
      property: {
        type: "SCALAR",
        componentType: "FLOAT32",
      },
      values: [1.0, 2.0],
    });

    expect(function () {
      property.set(-1, 0.0);
    }).toThrowDeveloperError();

    property.set(0, 0.0);
    property.set(1, 0.0);

    expect(function () {
      property.set(2, 0.0);
    }).toThrowDeveloperError();
  });

  it("set throws if value doesn't conform to the class property", function () {
    const property = MetadataTester.createProperty({
      property: {
        type: "SCALAR",
        componentType: "FLOAT32",
        array: true,
        count: 3,
      },
      values: [[1.0, 2.0, 3.0]],
    });

    expect(function () {
      property.set(0, 8.0);
    }).toThrowDeveloperError();
  });

  it("getTypedArray returns typed array", function () {
    const propertyInt32 = {
      type: "SCALAR",
      componentType: "INT32",
      array: true,
      count: 3,
    };

    const propertyValues = [
      [-2, -1, 0],
      [1, 2, 3],
    ];

    const expectedTypedArray = new Int32Array([-2, -1, 0, 1, 2, 3]);

    const property = MetadataTester.createProperty({
      property: propertyInt32,
      values: propertyValues,
    });

    expect(property.getTypedArray()).toEqual(expectedTypedArray);
  });

  it("getTypedArray returns undefined if values are unpacked", function () {
    const propertyInt32 = {
      type: "SCALAR",
      componentType: "INT32",
      array: true,
    };

    const propertyValues = [
      [-2, -1, 0],
      [1, 2, 3],
    ];

    const expectedTypedArray = new Int32Array([-2, -1, 0, 1, 2, 3]);

    const property = MetadataTester.createProperty({
      property: propertyInt32,
      values: propertyValues,
    });

    expect(property.getTypedArray()).toEqual(expectedTypedArray);

    // Variable-size arrays are unpacked on set
    property.set(0, [-2, -1]);

    expect(property.getTypedArray()).toBeUndefined();
  });
});
