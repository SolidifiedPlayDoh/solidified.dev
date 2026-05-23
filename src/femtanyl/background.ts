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

const SOUNDWAVE_FRAG = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 outColor;
uniform float iTime;
uniform vec2 iResolution;

void main() {
  vec2 uv = v_uv;
  float t = iTime * 1.1;
  float w = sin((uv.x + uv.y * cos(uv.x + uv.y)) * 50.0 + t * 5.4);
  w += sin((uv.x + uv.x * cos(uv.x - uv.y)) * 50.0 + t * 20.4);
  float p = sin((uv.y + uv.x * sin(uv.x)) * 30.0 + t * 3.0);
  vec3 col = vec3(w * 0.5 + 0.5, p * 0.4 + 0.35, sin(t + uv.x * 8.0) * 0.35 + 0.45);
  col = clamp(col * 1.35, 0.0, 1.0);
  float bar = step(0.35, abs(sin(uv.y * 40.0 + t * 90.0)));
  col *= 0.65 + 0.35 * bar;
  outColor = vec4(col, 1.0);
}`;

const INFINITE_DOOR_FRAG = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 outColor;
uniform float iTime;
uniform vec2 iResolution;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  vec2 st = (v_uv - 0.5) * 2.0;
  float ang = iTime * 0.35;
  mat2 rot = mat2(cos(ang), -sin(ang), sin(ang), cos(ang));
  st = rot * st;
  float n = noise(st * 8.0 + iTime * 0.4);
  vec3 col = vec3(n * 0.9, n * 0.35, 1.0 - n * 0.7);
  col *= 0.8 + 0.2 * sin(iTime * 2.0 + st.x * 10.0);
  outColor = vec4(col, 1.0);
}`;

const VORTEX_FRAG = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 outColor;
uniform float iTime;

float zig(vec2 p, float n, float r) {
  float l = length(p);
  l += sin(n * atan(p.y, p.x)) * 0.48;
  return 1.0 - step(r, l);
}

void main() {
  vec2 uv = (v_uv - 0.5) * 2.0;
  float t = iTime;
  uv *= 0.5 * vec2(sin(t / 17.0), cos(t / 19.0));
  float a = zig(uv, 160.0 * sin(t / 12.0), 0.5 * sin(t / 17.0));
  float b = zig(uv, 128.0 * sin(t / 16.0), 0.5 * sin(t / 13.0));
  float c = zig(uv, 256.0 * sin(t / 15.0), 0.5 * sin(t / 11.0));
  vec3 col = vec3(a + b, b + c, c + a) * 1.2;
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
  soundwave: WebGLProgram;
  infiniteDoor: WebGLProgram;
  vortex: WebGLProgram;
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
    this.soundwave = this._program(SOUNDWAVE_FRAG);
    this.infiniteDoor = this._program(INFINITE_DOOR_FRAG);
    this.vortex = this._program(VORTEX_FRAG);
  }

  private _progForMode(): WebGLProgram {
    switch (this.mode) {
      case "epilepsy":
        return this.epilepsy;
      case "soundwave":
        return this.soundwave;
      case "infiniteDoor":
        return this.infiniteDoor;
      case "vortex":
        return this.vortex;
      default:
        return this.trippy;
    }
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

    if (this.mode === "black") {
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return;
    }

    if (this.mode === "green") {
      gl.clearColor(0x7b / 255, 0xcf / 255, 0x0c / 255, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return;
    }

    const prog = this._progForMode();
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
