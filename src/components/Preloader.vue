<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
const emit = defineEmits(['done'])
const root = ref(null), bar = ref(null), pct = ref(0), path = ref('/assets/boot.sys')
const files = ['/core/world.bin', '/tex/ground_01.ktx', '/audio/theme.ogg', '/fonts/display.woff2', '/scene/keep.glb', '/ui/hud.svg']
onMounted(() => {
  const s = { p: 0 }
  gsap.timeline({ onComplete: () => emit('done') })
    .to(s, { p: 100, duration: 2.6, ease: 'power2.inOut', onUpdate() {
      pct.value = Math.round(s.p)
      gsap.set(bar.value, { scaleX: s.p / 100 })
      path.value = files[Math.floor(s.p / 17) % files.length]
    } })
    .to(root.value, { autoAlpha: 0, duration: 0.3 })
})
</script>
<template>
  <div ref="root" class="pre">
    <div class="track"><i ref="bar" /></div>
    <div class="row">
      <span>▲▲ Loading – {{ String(pct).padStart(2, '0') }}%</span>
      <span class="path">{{ path }}</span>
    </div>
  </div>
</template>
<style scoped>
.pre{position:fixed;inset:0;z-index:100;background:#fff;color:#000;display:grid;place-content:center;cursor:none}
.track{width:87rem;max-width:80vw;height:1px;background:var(--track)}
.track i{display:block;height:1px;background:#000;transform-origin:left;transform:scaleX(0)}
.row{display:flex;justify-content:space-between;margin-top:1.4rem}
@media(max-width:767px){.track{width:18rem}.path{display:none}}
</style>
