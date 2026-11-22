<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
const root = ref(null), strip = ref(null)
const shots = Array.from({ length: 10 }, (_, i) => `https://picsum.photos/seed/portrait-${i + 1}/500/700`)
let ctx
onMounted(() => {
  ctx = gsap.context(() => {
    gsap.to(strip.value, { x: () => -(strip.value.scrollWidth - window.innerWidth + 90), ease: 'none',
      scrollTrigger: { trigger: root.value, start: 'top top', end: '+=300%', pin: true, scrub: 0.6, invalidateOnRefresh: true } })
  }, root.value)
})
onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <section id="gallery" ref="root" class="gal" data-section data-theme="light">
    <h2 class="display t">[Gallery heading]</h2>
    <p class="d">[Two or three sentences describing the gallery.]</p>
    <p class="c"><span class="dot" />[Gallery caption]</p>
    <div ref="strip" class="strip"><img v-for="(s, i) in shots" :key="i" :src="s" alt=""
      :style="{ marginTop: (i % 2 ? 4 : 0) + 'rem' }" /></div>
  </section>
</template>

<style scoped>
.gal{position:relative;height:100vh;overflow:hidden;background:#fff;color:#000;padding:11rem 9rem 0}
.t{font-size:11rem}.d{max-width:38rem;margin:2rem 0 0 auto}.c{position:absolute;left:9rem;top:30rem;margin:0}
.strip{position:absolute;left:9rem;bottom:6rem;display:flex;gap:2rem;align-items:flex-start;will-change:transform}
.strip img{height:36rem;width:auto;border-radius:1.2rem}
@media(max-width:767px){.gal{padding:9rem 3rem 0}.t{font-size:6.4rem}.d{margin:2rem 0 0}.c{top:32rem;left:3rem}.strip{left:3rem;bottom:8rem}.strip img{height:30rem}}
</style>
