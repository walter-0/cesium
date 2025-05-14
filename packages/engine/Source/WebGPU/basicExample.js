// import WebGPUContext from "./WebGPUContext";
// import WebGPUShaderModule from "./WebGPUShaderModule";
// import WebGPURenderPipeline from "./WebGPURenderPipeline";

// const renderTriangle = (device, context, format) => {
//   const vertexShader = new WebGPUShaderModule({
//     device: device,
//     label: "basic triangle vertex shader",
//     code: /* wgsl */ `
//       struct VertexOutput {
//         @builtin(position) position: vec4f,
//         @location(0) color: vec4f,
//       };

//       @vertex
//       fn main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
//         var pos = array<vec2f, 3>(
//           vec2f(0.0, 0.5),
//           vec2f(-0.5, -0.5),
//           vec2f(0.0, -0.5)
//         );

//         var colors = array<vec3f, 3>(
//           vec3f(1.0, 0.0, 0.0), // red
//           vec3f(0.0, 1.0, 0.0), // green
//           vec3f(0.0, 0.0, 1.0)  // blue
//         );

//         var output: VertexOutput;
//         output.position = vec4f(pos[vertexIndex], 0.0, 1.0);
//         output.color = vec4f(colors[vertexIndex], 1.0);
//         return output;
//       }
//     `,
//   });

//   // const fragmentShader = new WebGPUShaderModule({
//   //   device: device,
//   //   label: "basic triangle fragment shader",
//   //   code: /* wgsl */ `
//   //     @fragment
//   //     fn main(@location(0) color: vec4f) -> @location(0) vec4f {
//   //       return color;
//   //     }
//   //   `,
//   // });

//   // const pipelineLayout = "auto";

//   //   const renderPipeline = new WebGPURenderPipeline({
//   //     device: device,
//   //     label: "basic triangle pipeline",
//   //     vertexShader: vertexShader.shaderModule,
//   //     fragmentShader: fragmentShader.shaderModule,
//   //     colorFormats: [format],
//   //     primitiveTopology: "triangle-list",
//   //     cullMode: "none",
//   //   });
//   // };

//   // export const createBasicExample = async (canvas) => {
//   //   const context = new WebGPUContext(canvas);
//   //   await context.initialize();

//   //   const device = context.device;
//   //   const format = navigator.gpu.getPreferredCanvasFormat();
//   //   renderTriangle(device, context.context, format);
// };
