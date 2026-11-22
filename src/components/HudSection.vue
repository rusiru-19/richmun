<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
const root = ref(null), p = ref(0)
const modules = ['CORE.SYS', 'TERRAIN.MAP', 'WEATHER.NET', 'FACTION.DB', 'SIGNAL.RELAY', 'ARCHIVE.07']
const shown = computed(() => Math.floor(p.value * modules.length * 1.15))
const pct = computed(() => String(Math.round(p.value * 100)).padStart(2, '0'))
const lat = computed(() => (35.6895 + p.value * 0.42).toFixed(4))
const lon = computed(() => (139.6917 - p.value * 0.31).toFixed(4))
const temp = computed(() => (21 + p.value * 11).toFixed(1))
let ctx
onMounted(() => {
  ctx = gsap.context(() => {
    gsap.timeline({ scrollTrigger: { trigger: root.value, start: 'top top', end: '+=250%', pin: true, scrub: 0.6,
      onUpdate: (s) => (p.value = s.progress) } })
      .fromTo('.s1', { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.3 })
      .to('.s1', { autoAlpha: 0, y: -60, duration: 0.3 }, 0.9)
      .fromTo('.s2', { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 1.1)
      .to({}, { duration: 0.3 })
  }, root.value)
})
onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <section id="hud" ref="root" class="hud" data-section data-theme="dark">
    <img src="https://picsum.photos/seed/hud-city/1920/1080" alt="" />
    <h2 class="display s s1">[First strapline]</h2>
    <h2 class="display s s2">[Second strapline]</h2>
    <div class="readout">
      <p>//Initializing… Loading…[{{ pct }}%]</p>
      <p v-for="m in modules.slice(0, shown)" :key="m">&gt; {{ m }} ........ OK</p>
      <p class="co">LAT {{ lat }} / LON {{ lon }}</p>
      <p>TEMP {{ temp }}°C</p>
    </div>
  </section>
</template>

<style scoped>
.hud{position:relative;height:100vh;overflow:hidden;background:#000}
img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.35}
.s{position:absolute;left:9rem;top:30%;font-size:12rem;max-width:100rem}
.readout{position:absolute;right:9rem;bottom:8rem;min-width:30rem;line-height:1.6}
.readout p{margin:0}.co{margin-top:1.2rem!important}
@media(max-width:767px){.s{left:3rem;font-size:6.4rem}.readout{left:3rem;right:auto;bottom:6rem}}
</style>
