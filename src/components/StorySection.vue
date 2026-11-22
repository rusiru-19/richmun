<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
const root = ref(null)
let ctx
onMounted(() => {
  ctx = gsap.context(() => {
    gsap.utils.toArray('[data-speed]').forEach((el) =>
      gsap.to(el, { yPercent: -parseFloat(el.dataset.speed) * 30, ease: 'none',
        scrollTrigger: { trigger: root.value, scrub: true, start: 'top bottom', end: 'bottom top' } }))
  }, root.value)
})
onBeforeUnmount(() => ctx?.revert())
</script>

<!-- The title, body and trailer card now live in HeroSection's pinned stage. -->
<template>
  <section id="story" ref="root" class="story" data-section data-theme="light">
    <figure class="c1" data-speed="1"><img src="https://picsum.photos/seed/char-one/600/800" alt="" /><figcaption>[Caption]</figcaption></figure>
    <figure class="c2" data-speed="0.2"><img src="https://picsum.photos/seed/world-two/700/500" alt="" /><figcaption>[Caption]</figcaption></figure>
    <figure class="c3" data-speed="0.7"><img src="https://picsum.photos/seed/place-three/600/700" alt="" /><figcaption>[Caption]</figcaption></figure>
  </section>
</template>

<style scoped>
.story{position:relative;min-height:150vh;background:#fff;color:#000;padding:14rem 9rem}
figure{margin:0;position:absolute}
figcaption{margin-top:.8rem}
img{width:100%;height:auto}
.c1{right:12rem;top:14rem;width:34rem}
.c2{left:22rem;top:50rem;width:42rem}
.c3{right:9rem;top:86rem;width:32rem}
@media(max-width:767px){.story{min-height:auto;padding:8rem 3rem}
  figure{position:static;width:100%;margin-bottom:3rem}}
</style>
