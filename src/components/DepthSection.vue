<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'

const emit = defineEmits(['theme'])
const root = ref(null)
const COLS = 36, ROWS = 9
// stencil cells for the dissolve: row 4 becomes the horizontal "dash" row, like the reference
const cells = Array.from({ length: COLS * ROWS }, (_, i) => ({ h: Math.floor(i / COLS) === 4 }))
let ctx

onMounted(() => {
  ctx = gsap.context(() => {
    let theme = 'dark'
    gsap.timeline({
      scrollTrigger: {
        trigger: root.value, start: 'top top', end: '+=450%', pin: true, scrub: 0.6,
        onUpdate: (self) => {
          const next = self.animation.time() > 3.0 ? 'light' : 'dark'   // frame turns dark once the white takes over
          if (next !== theme) { theme = next; root.value.dataset.theme = next; emit('theme', next) }
        }
      }
    })
      /* 1. parallax (0 → 2.4): far / mid / near layers move at different speeds */
      .fromTo('.far', { yPercent: 0, scale: 1.05 }, { yPercent: -6, scale: 1.2, ease: 'none', duration: 2.4 }, 0)
      .fromTo('.mid', { yPercent: 18 }, { yPercent: -12, ease: 'none', duration: 2.4 }, 0)
      .fromTo('.near', { yPercent: 45 }, { yPercent: -35, ease: 'none', duration: 2.4 }, 0)
      .fromTo('.fog', { xPercent: -8 }, { xPercent: 8, ease: 'none', duration: 2.4 }, 0)
      .fromTo('.title', { y: 0 }, { y: -260, ease: 'none', duration: 2.4 }, 0)
      .to('.title', { autoAlpha: 0, duration: 0.5 }, 1.9)
      /* 2. dissolve (2.4 → 3.6): stencil bars cover the image at random, then fill to white */
      .fromTo('.cell i', { scale: 0 }, { scale: 1, ease: 'none', duration: 0.5, stagger: { amount: 0.7, from: 'random' } }, 2.4)
      .fromTo('.fill', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 3.2)
      .to({}, { duration: 0.2 })
  }, root.value)
})
onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <section id="depth" ref="root" class="depth" data-section data-theme="dark">
    <!-- same image the hero card flipped to, so the hand-off is seamless -->
    <img class="far" src="https://picsum.photos/seed/next-world/1920/1080" alt="" />

    <!-- procedural ridges as mid / near planes: swap for cut-out PNGs of your own art -->
    <svg class="mid" viewBox="0 0 1600 400" preserveAspectRatio="none">
      <path d="M0 400V210Q160 120 320 190T640 150T960 200T1280 140T1600 190V400Z" fill="rgba(14,10,30,.72)" /></svg>
    <div class="fog" />
    <svg class="near" viewBox="0 0 1600 400" preserveAspectRatio="none">
      <path d="M0 400V250Q220 170 420 240T820 200T1200 250T1600 210V400Z" fill="#050408" /></svg>

    <div class="title">
      <h2 class="display bt">[Next section title]</h2>
      <p class="bc"><span class="dot" />[Short caption for the next section]</p>
    </div>

    <div class="dis" aria-hidden="true">
      <span v-for="(c, i) in cells" :key="i" class="cell" :class="c.h ? 'h' : 'v'"><i /></span>
    </div>
    <div class="fill" />
  </section>
</template>

<style scoped>
.depth{position:relative;height:100vh;overflow:hidden;background:#000;color:#fff}
.far{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;will-change:transform}
.mid,.near{position:absolute;left:-5%;width:110%;height:70%;bottom:-2%;will-change:transform}
.near{height:55%}
.fog{position:absolute;left:-10%;width:120%;height:45%;bottom:20%;
  background:radial-gradient(60% 100% at 50% 100%,rgba(190,180,230,.25),transparent 70%);will-change:transform}
.title{position:absolute;left:0;right:0;bottom:0;height:100%;pointer-events:none}
.bt{position:absolute;left:9rem;bottom:12rem;font-size:14rem;max-width:120rem}
.bc{position:absolute;left:9rem;bottom:7rem;margin:0}

.dis{position:absolute;inset:0;display:grid;grid-template-columns:repeat(36,1fr);grid-template-rows:repeat(9,1fr);pointer-events:none}
.cell{position:relative}
.cell i{position:absolute;display:block;background:#fff}
.v i{inset:2% 18%;border-radius:1rem}
.h i{inset:36% 4%;border-radius:1rem}
.fill{position:absolute;inset:0;background:#fff;pointer-events:none}

@media(max-width:767px){.bt{left:3rem;bottom:12rem;font-size:7.4rem}.bc{left:3rem;bottom:7rem}
  .dis{grid-template-columns:repeat(18,1fr)}.cell:nth-child(n+163){display:none}}
</style>