const VERT = `#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

/** Global low-quality / CRT-style pass (mod lowquality colorTransform + screen grit). */
const LOWQ_FRAG = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 outColor;
uniform sampler2D uTex;
uniform vec2 iResolution;
uniform float iTime;

void main() {
  vec2 uv = v_uv;
  float ab = 0.0012 + 0.0004 * sin(iTime * 4.2);
  float r = texture(uTex, uv + vec2(ab, 0.0)).r;
  float g = texture(uTex, uv).g;
  float b = texture(uTex, uv - vec2(ab, 0.0)).b;
  vec3 col = vec3(r, g, b);
  col = pow(col, vec3(0.92));
  col *= vec3(1.08, 1.04, 1.1);
  col = clamp(col, 0.0, 1.0);
  float scan = 0.88 + 0.12 * sin(uv.y * iResolution.y * 1.25 + iTime * 12.0);
  col *= scan;
  float vig = smoothstep(1.15, 0.35, length(uv - 0.5) * 1.35);
  col *= vig;
  float grain = fract(sin(dot(uv * iResolution.xy + iTime, vec2(12.9898, 78.233))) * 43758.5453);
  col += (grain - 0.5) * 0.04;
  outColor = vec4(col, 1.0);
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(s) ?? "post shader compile failed");
  }
  return s;
}

function link(gl: WebGL2RenderingContext, vs: WebGLShader, fs: WebGLShader) {
  const p = gl.createProgram()!;
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(p) ?? "post shader link failed");
  }
  return p;
}

export class PostProcessRenderer {
  canvas: HTMLCanvasElement;
  gl: WebGL2RenderingContext;
  program: WebGLProgram;
  texture: WebGLTexture;
  private _buf: WebGLBuffer;
  private _composite: HTMLCanvasElement;
  private _compositeCtx: CanvasRenderingContext2D;
  iTime = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const gl = canvas.getContext("webgl2", { alpha: false, antialias: false });
    if (!gl) throw new Error("WebGL2 required for post-processing");
    this.gl = gl;

    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    this._buf = buf;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, LOWQ_FRAG);
    this.program = link(gl, vs, fs);
    const loc = gl.getAttribLocation(this.program, "a_pos");
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    this.texture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    this._composite = document.createElement("canvas");
    this._compositeCtx = this._composite.getContext("2d", { alpha: true })!;
  }

  resize(w: number, h: number) {
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    if (this._composite.width !== w || this._composite.height !== h) {
      this._composite.width = w;
      this._composite.height = h;
    }
  }

  update(dt: number) {
    this.iTime += dt;
  }

  /** Composite bg + char at output resolution, then run global post shader. */
  draw(
    bg: HTMLCanvasElement,
    char: HTMLCanvasElement,
    outW: number,
    outH: number,
  ) {
    this.resize(outW, outH);

    const c = this._compositeCtx;
    c.clearRect(0, 0, outW, outH);
    // Scale each layer to full frame (bg/char buffers may differ when pixel toggles differ).
    c.drawImage(bg, 0, 0, outW, outH);
    c.drawImage(char, 0, 0, outW, outH);

    const gl = this.gl;
    gl.viewport(0, 0, outW, outH);
    gl.useProgram(this.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buf);
    const loc = gl.getAttribLocation(this.program, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._composite);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

    gl.uniform1i(gl.getUniformLocation(this.program, "uTex"), 0);
    gl.uniform2f(gl.getUniformLocation(this.program, "iResolution"), outW, outH);
    gl.uniform1f(gl.getUniformLocation(this.program, "iTime"), this.iTime);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}
