<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import { enableAudio, preloadMusic } from '../composables/useAudio'

const emit = defineEmits(['done'])
const root = ref(null), bar = ref(null), pct = ref(0), path = ref('/assets/boot.sys'), loaded = ref(false)
const files = ['/core/world.bin', '/tex/ground_01.ktx', '/audio/theme.wav', '/fonts/display.woff2', '/scene/keep.glb', '/ui/hud.svg']

onMounted(() => {
  preloadMusic()
  const s = { p: 0 }
  gsap.to(s, { p: 100, duration: 2.6, ease: 'power2.inOut',
    onUpdate() {
      pct.value = Math.round(s.p)
      gsap.set(bar.value, { scaleX: s.p / 100 })
      path.value = files[Math.floor(s.p / 17) % files.length]
    },
    onComplete: () => { loaded.value = true }       // wait here: the visitor chooses sound or no sound
  })
})

// the click is what lets the browser start the music
const enter = (withSound) => {
  if (withSound) enableAudio()
  gsap.to(root.value, { autoAlpha: 0, duration: 0.5, onComplete: () => emit('done') })
}
</script>

<template>
  <div ref="root" class="pre">
    <div class="track"><i ref="bar" /></div>
    <div class="row">
      <span>▲▲ Loading – {{ String(pct).padStart(2, '0') }}%</span>
      <span class="path">{{ path }}</span>
    </div>
    <div class="gate" :class="{ on: loaded }">
      <button class="go" :disabled="!loaded" @click="enter(true)"><span class="ring" />Click to enter · with sound</button>
      <button class="alt" :disabled="!loaded" @click="enter(false)">Enter without sound</button>
    </div>
  </div>
</template>

<style scoped>
.pre{position:fixed;inset:0;z-index:100;background:#fff;color:#000;display:grid;place-content:center}
.track{width:87rem;max-width:80vw;height:1px;background:var(--track)}
.track i{display:block;height:1px;background:#000;transform-origin:left;transform:scaleX(0)}
.row{display:flex;justify-content:space-between;margin-top:1.4rem}
.gate{position:absolute;left:0;right:0;top:75vh;display:flex;flex-direction:column;align-items:center;gap:1.4rem;
  opacity:0;transform:translateY(1rem);transition:opacity .5s,transform .5s;pointer-events:none}
.gate.on{opacity:1;transform:none;pointer-events:auto}
.go{display:flex;align-items:center;gap:1.2rem;padding:1.2rem 2.4rem;border:1px solid #000;transition:background .2s}
.go:hover{background:var(--lime)}
.alt{opacity:.5;text-decoration:underline}.alt:hover{opacity:1}
.ring{width:1.4rem;height:1.4rem;border:1px solid #000;border-radius:50%;animation:pulse 1.4s ease-out infinite}
@keyframes pulse{from{box-shadow:0 0 0 0 rgba(0,0,0,.45)}to{box-shadow:0 0 0 1.2rem rgba(0,0,0,0)}}
@media(max-width:767px){.track{width:18rem}.path{display:none}}
</style>
