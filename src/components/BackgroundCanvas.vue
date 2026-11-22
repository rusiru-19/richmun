<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

const canvas = ref(null)
let gl = null
let frame = 0
let resizeHandler = null
let pointerHandler = null

onMounted(() => {
  const cv = canvas.value
  gl = cv.getContext('webgl', {
    antialias: false,
    alpha: false,
    powerPreference: 'low-power'
  })

  if (!gl) {
    cv.classList.add('no-gl')
    return
  }

  const vertexSource = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}'
  const fragmentSource = `precision mediump float;
    uniform vec2 r;
    uniform float t,s;
    uniform vec2 m;
    float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float n(vec2 p){
      vec2 i=floor(p),f=fract(p);
      f=f*f*(3.-2.*f);
      return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);
    }
    float fbm(vec2 p){
      float v=0.,a=.5;
      for(int i=0;i<5;i++){v+=a*n(p);p=p*2.03+1.7;a*=.5;}
      return v;
    }
    void main(){
      vec2 p=(gl_FragCoord.xy-.5*r)/r.y;
      p+=m*.04;
      float tt=t*.05;
      vec2 q=vec2(
        fbm(p*1.5+vec2(tt,s*.15)),
        fbm(p*1.5-vec2(tt*.7,-s*.1)+5.2)
      );
      float f=fbm(p*2.+q*2.2+vec2(0.,s*.25));
      vec3 c=vec3(.016,.016,.035);
      c=mix(c,vec3(.10,.10,.95),smoothstep(.5,.9,f)*.85);
      c=mix(c,vec3(.42,.12,.9),smoothstep(.55,.95,q.y)*.45);
      float rs=fbm(p*vec2(4.,1.2)+q*3.-tt*1.5);
      c=mix(c,vec3(1.,.16,.32),smoothstep(.72,.76,rs)*.6);
      float dk=fbm(p*3.+7.);
      c*=mix(.35,1.,smoothstep(.3,.6,dk));
      c*=1.-.55*length(p*vec2(.8,1.));
      c+=(h(gl_FragCoord.xy+fract(t)*91.)-.5)*.07;
      gl_FragColor=vec4(max(c,0.),1.);
    }`

  const compile = (type, source) => {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader)
      return null
    }
    return shader
  }

  const vs = compile(gl.VERTEX_SHADER, vertexSource)
  const fs = compile(gl.FRAGMENT_SHADER, fragmentSource)
  if (!vs || !fs) {
    cv.classList.add('no-gl')
    return
  }

  const program = gl.createProgram()
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    cv.classList.add('no-gl')
    return
  }

  gl.useProgram(program)
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),
    gl.STATIC_DRAW
  )
  const position = gl.getAttribLocation(program, 'p')
  gl.enableVertexAttribArray(position)
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

  const resolution = gl.getUniformLocation(program, 'r')
  const time = gl.getUniformLocation(program, 't')
  const scroll = gl.getUniformLocation(program, 's')
  const mouse = gl.getUniformLocation(program, 'm')

  const resize = () => {
    const scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.5
    cv.width = Math.ceil(window.innerWidth * scale)
    cv.height = Math.ceil(window.innerHeight * scale)
    gl.viewport(0, 0, cv.width, cv.height)
  }
  resize()
  resizeHandler = resize
  window.addEventListener('resize', resizeHandler)

  let mx = 0, my = 0, tx = 0, ty = 0
  pointerHandler = (event) => {
    tx = event.clientX / window.innerWidth * 2 - 1
    ty = -(event.clientY / window.innerHeight * 2 - 1)
  }
  window.addEventListener('pointermove', pointerHandler)

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const draw = (now) => {
    mx += (tx - mx) * 0.04
    my += (ty - my) * 0.04
    gl.uniform2f(resolution, cv.width, cv.height)
    gl.uniform1f(time, reduceMotion ? 12 : now / 1000)
    gl.uniform1f(scroll, window.scrollY / Math.max(1, window.innerHeight))
    gl.uniform2f(mouse, mx, my)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
    frame = window.requestAnimationFrame(draw)
  }
  frame = window.requestAnimationFrame(draw)
})

onBeforeUnmount(() => {
  if (frame) window.cancelAnimationFrame(frame)
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
  if (pointerHandler) window.removeEventListener('pointermove', pointerHandler)
})
</script>

<template>
  <canvas ref="canvas" class="ink-background" aria-hidden="true" />
</template>

<style scoped>
.ink-background {
  position: fixed;
  inset: 0;
  z-index: 0;
  display: block;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.ink-background.no-gl {
  background:
    radial-gradient(60% 60% at 30% 40%, #1b1fb8, transparent 70%),
    radial-gradient(50% 50% at 80% 70%, #4a148f, transparent 70%),
    #07070c;
}
</style>
