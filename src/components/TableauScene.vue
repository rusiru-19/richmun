<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import ScrambleText from './ScrambleText.vue'
const props = defineProps({ id: String, image: String, prevImage: String, text: String, caption: String })
const root = ref(null)
let ctx
// Same vertex count on both ends so the folder silhouette morphs into the full screen.
const FOLDER = 'polygon(30% 38%, 42% 38%, 46% 42%, 70% 42%, 70% 62%, 30% 62%)'
const FULL   = 'polygon(0% 0%, 100% 0%, 100% 0%, 100% 0%, 100% 100%, 0% 100%)'
onMounted(() => {
  ctx = gsap.context(() => {
    gsap.timeline({ scrollTrigger: { trigger: root.value, start: 'top top', end: '+=250%', pin: true, scrub: 0.6 } })
      .fromTo('.mask', { clipPath: FOLDER }, { clipPath: FULL, ease: 'power2.inOut', duration: 1 })
      .fromTo('.mask img', { scale: 1.35 }, { scale: 1, ease: 'none', duration: 1 }, 0)
      .from('.copy', { autoAlpha: 0, y: 30, duration: 0.3 }, 0.7)
  }, root.value)
})
onBeforeUnmount(() => ctx?.revert())
</script>
<template>
  <section :id="id" ref="root" class="scene" data-section data-theme="dark">
    <img class="under" :src="prevImage" alt="" />
    <div class="mask"><img :src="image" alt="" /></div>
    <div class="copy">
      <p class="display line">{{ text }}</p>
      <p class="cap"><span class="dot" /><ScrambleText :text="caption" :reveal="false" /></p>
    </div>
  </section>
</template>
<style scoped>
.scene{position:relative;height:100vh;overflow:hidden;background:#000}
.under,.mask,.mask img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.under{filter:brightness(.5)}
.mask{overflow:hidden;clip-path:polygon(30% 38%,42% 38%,46% 42%,70% 42%,70% 62%,30% 62%)}
.copy{position:absolute;left:9rem;bottom:8rem;max-width:70rem}
.line{font-size:6.4rem}
.cap{margin-top:1.6rem}
@media(max-width:767px){.copy{left:3rem;right:3rem;bottom:6rem}.line{font-size:4rem}}
</style>
