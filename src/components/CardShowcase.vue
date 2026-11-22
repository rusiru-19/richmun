<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import NotchCard from './NotchCard.vue'
import CornerButton from './CornerButton.vue'
const root = ref(null)
let ctx
onMounted(() => {
  ctx = gsap.context(() => {
    gsap.fromTo('.cardwrap', { y: 160, rotate: -6, autoAlpha: 0 },
      { y: 0, rotate: -2.5, autoAlpha: 1, ease: 'power3.out',
        scrollTrigger: { trigger: root.value, start: 'top 80%', end: 'top 25%', scrub: true } })
    gsap.to('.cardwrap img', { yPercent: -8, scale: 1.12, ease: 'none',
      scrollTrigger: { trigger: root.value, start: 'top bottom', end: 'bottom top', scrub: true } })
    gsap.from('.side > *', { autoAlpha: 0, y: 30, duration: 0.8, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: root.value, start: 'top 55%' } })
  }, root.value)
})
onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <section id="showcase" ref="root" class="show" data-section data-theme="light">
    <div class="side left">
      <h2 class="display t">[Section title]</h2>
      <p>[Two or three sentences introducing this character, place or collection.]</p>
    </div>

    <div class="cardwrap">
      <NotchCard class="card">
        <img src="https://picsum.photos/seed/showcase-card/900/900" alt="" />
        <span class="tag"><i class="dot" />[Card label]</span>
      </NotchCard>
    </div>

    <div class="side right">
      <p class="meta"><i class="dot" />[Detail one]</p>
      <p class="meta"><i class="dot" />[Detail two]</p>
      <p class="meta"><i class="dot" />[Detail three]</p>
      <CornerButton theme="light">[Action]</CornerButton>
    </div>
  </section>
</template>

<style scoped>
.show{min-height:110vh;background:#fff;color:#000;display:grid;grid-template-columns:1fr auto 1fr;gap:6rem;align-items:center;padding:12rem 9rem}
.side{display:flex;flex-direction:column;gap:2rem}
.left{align-items:flex-start}.left p{max-width:32rem;margin:0}
.right{align-items:flex-start;padding-left:2rem}
.t{font-size:8.4rem}
.meta{margin:0;padding-bottom:1rem;border-bottom:1px solid var(--hair-l);width:26rem}
.cardwrap{will-change:transform}
.card{width:44rem;height:46rem}
.tag{position:absolute;left:5rem;top:2rem;color:#fff}
@media(max-width:767px){.show{grid-template-columns:1fr;padding:10rem 3rem;gap:4rem}.card{width:100%;height:34rem}.t{font-size:5.6rem}}
</style>