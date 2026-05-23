const VERT = `#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const TRIPPY_FRAG = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 outColor;
uniform float iTime;
uniform vec2 iResolution;
uniform float booming;
uniform vec3 uCol;

void main() {
  vec2 fragCoord = v_uv * iResolution;
  vec2 point = (booming * fragCoord - iResolution) / max(iResolution.x, iResolution.y);
  for (int i = 1; i < 11; i++) {
    vec2 iter = point;
    float fi = float(i);
    iter.x += 2.5 / fi * sin(fi * point.y + (iTime / 3.0) + 0.3 * fi);
    iter.y += 1.6 / fi * cos(fi * point.x + (iTime / 4.0) + 0.3 * fi);
    point = iter;
  }
  vec3 COLOR = vec3(1.1, 1.0, 1.1);
  vec3 col = vec3(
    uCol.r - abs(cos(point.x)),
    uCol.g - abs(cos(point.x + point.y)),
    uCol.b - cos(sin(point.y))
  ) * COLOR;
  outColor = vec4(col, 1.0);
}`;

const EPILEPSY_FRAG = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 outColor;
uniform float iTime;

vec3 hue2rgb(float c) {
  vec3 rgb = clamp(abs(mod(c * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  rgb = rgb * rgb * (3.0 - 2.0 * rgb);
  return mix(vec3(1.0), rgb, 1.0);
}

void main() {
  float hue = fract(iTime * 2.3);
  outColor = vec4(hue2rgb(hue), 1.0);
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(s) ?? "shader compile failed");
  }
  return s;
}

function link(
  gl: WebGL2RenderingContext,
  vs: WebGLShader,
  fs: WebGLShader,
) {
  const p = gl.createProgram()!;
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(p) ?? "shader link failed");
  }
  return p;
}

export class BackgroundRenderer {
  canvas: HTMLCanvasElement;
  gl: WebGL2RenderingContext;
  trippy: WebGLProgram;
  epilepsy: WebGLProgram;
  mode = "trippy";
  iTime = 0;
  booming = 1.4;
  colors: [number, number, number] = [0.1, 1.1, 1.0];
  private _buf: WebGLBuffer;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const gl = canvas.getContext("webgl2", { alpha: false, antialias: false });
    if (!gl) throw new Error("WebGL2 required for background shaders");
    this.gl = gl;

    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    this._buf = buf;
    this.trippy = this._program(TRIPPY_FRAG);
    this.epilepsy = this._program(EPILEPSY_FRAG);
  }

  private _program(fragSrc: string) {
    const gl = this.gl;
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, fragSrc);
    const prog = link(gl, vs, fs);
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buf);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    return prog;
  }

  setMode(mode: string) {
    this.mode = mode;
  }

  setColors(r: number, g: number, b: number) {
    this.colors = [r, g, b];
  }

  update(dt: number) {
    this.iTime += dt;
    this.booming += (1.4 - this.booming) * 0.1;
  }

  draw() {
    const gl = this.gl;
    const w = this.canvas.width;
    const h = this.canvas.height;
    gl.viewport(0, 0, w, h);

    if (this.mode === "green") {
      gl.clearColor(0x7b / 255, 0xcf / 255, 0x0c / 255, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return;
    }

    const prog = this.mode === "epilepsy" ? this.epilepsy : this.trippy;
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buf);
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    gl.uniform1f(gl.getUniformLocation(prog, "iTime"), this.iTime);
    gl.uniform2f(gl.getUniformLocation(prog, "iResolution"), w, h);

    if (this.mode === "trippy") {
      gl.uniform1f(gl.getUniformLocation(prog, "booming"), this.booming);
      gl.uniform3f(
        gl.getUniformLocation(prog, "uCol"),
        this.colors[0],
        this.colors[1],
        this.colors[2],
      );
    }

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}
