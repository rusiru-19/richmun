<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import NotchCard from './NotchCard.vue'
import CornerButton from './CornerButton.vue'

const emit = defineEmits(['theme'])
const root = ref(null)
// s = side (-1 left, +1 right), r = rank (how far from the centre it travels)
const others = [{ s: -1, r: 3 }, { s: -1, r: 2 }, { s: -1, r: 1 }, { s: 1, r: 1 }, { s: 1, r: 2 }, { s: 1, r: 3 }]
let ctx

const rem = () => parseFloat(getComputedStyle(document.documentElement).fontSize)
const mobile = () => window.innerWidth < 768

onMounted(() => {
  ctx = gsap.context(() => {
    /* entrance, before the section pins */
    gsap.fromTo('.cardwrap', { y: 160, rotate: -6, autoAlpha: 0 },
      { y: 0, rotate: -2.5, autoAlpha: 1, ease: 'power3.out',
        scrollTrigger: { trigger: root.value, start: 'top 80%', end: 'top 25%', scrub: true } })
    gsap.from('.side > *', { autoAlpha: 0, y: 30, duration: 0.8, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: root.value, start: 'top 55%' } })

    gsap.set('.sq', { xPercent: -50, yPercent: -50, scale: 0 })
    gsap.set('.other', { autoAlpha: 0, scale: 0.72 })

    let theme = 'light'
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root.value, start: 'top top', end: '+=500%', pin: true, scrub: 0.6, invalidateOnRefresh: true,
        onUpdate: (self) => {                       // frame turns white once the purple has filled the screen
          const next = self.animation.time() > 1.3 ? 'dark' : 'light'
          if (next !== theme) { theme = next; root.value.dataset.theme = next; emit('theme', next) }
        }
      }
    })
    /* 1. side text fades out */
    tl.to('.side', { autoAlpha: 0, y: -20, duration: 0.6 }, 0)
      /* 2. purple square grows from the centre, behind the card */
      .to('.sq', { scale: 1, ease: 'power1.inOut', duration: 1.3 }, 0.3)
      /* 3. main card gets smaller (not too small) and straightens */
      .to('.main', { scale: 0.72, ease: 'power2.inOut', duration: 1.1 }, 0.5)
      .fromTo('.cardwrap', { rotate: -2.5 }, { rotate: 0, duration: 1.1, immediateRender: false }, 0.5)
      .to('.other', { autoAlpha: 1, duration: 0.1 }, 1.5)

    /* 4. other cards spread out from behind it to both sides… then fold back */
    gsap.utils.toArray('.other').forEach((el) => {
      const s = +el.dataset.s, r = +el.dataset.r
      tl.to(el, {
          x: () => s * r * (mobile() ? 9 : 22) * rem(), y: () => r * 1.2 * rem(),
          rotation: s * r * 5, scale: 0.72 - r * 0.04, ease: 'power2.out', duration: 1.8
        }, 1.6 + (r - 1) * 0.15)
        .to(el, { x: 0, y: 0, rotation: 0, scale: 0.72, ease: 'power2.inOut', duration: 1.4 }, 3.9 + (3 - r) * 0.15)
        .to(el, { autoAlpha: 0, duration: 0.1 }, 5.35)
    })
    /* 5. only the main card remains */
    tl.to('.main', { scale: 0.8, ease: 'power2.out', duration: 0.6 }, 5.1)
      .to({}, { duration: 0.3 })
  }, root.value)
})
onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <section id="showcase" ref="root" class="show" data-section data-theme="light">
    <div class="sq" />

    <div class="side left">
      <h2 class="display t">[Section title]</h2>
      <p>[Two or three sentences introducing this character, place or collection.]</p>
    </div>

    <div class="deck">
      <NotchCard v-for="(o, i) in others" :key="i" class="other" :data-s="o.s" :data-r="o.r"
        :style="{ zIndex: 4 - o.r }">
        <img :src="`https://picsum.photos/seed/deck-${i + 1}/900/900`" alt="" />
      </NotchCard>

      <div class="cardwrap">
        <NotchCard class="main card">
          <img src="https://picsum.photos/seed/showcase-card/900/900" alt="" />
          <span class="tag"><i class="dot" />[Card label]</span>
        </NotchCard>
      </div>
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
.show{position:relative;height:100vh;overflow:hidden;background:#fff;color:#000;
  display:grid;grid-template-columns:1fr auto 1fr;gap:6rem;align-items:center;padding:0 9rem}
.sq{position:absolute;left:50%;top:50%;width:120vmax;height:120vmax;background:#6f56c9;z-index:1}
.side{position:relative;z-index:2;display:flex;flex-direction:column;gap:2rem}
.left{align-items:flex-start}.left p{max-width:32rem;margin:0}
.right{align-items:flex-start;padding-left:2rem}
.t{font-size:8.4rem}
.meta{margin:0;padding-bottom:1rem;border-bottom:1px solid var(--hair-l);width:26rem}

.deck{position:relative;z-index:3;width:44rem;height:46rem}
.deck > .other{position:absolute;inset:0;width:100%;height:100%}
.cardwrap{position:absolute;inset:0;z-index:10}
.card{width:100%;height:100%}
.tag{position:absolute;left:5rem;top:2rem;color:#fff}

@media(max-width:767px){
  .show{grid-template-columns:1fr;grid-template-rows:auto auto;justify-items:center;align-content:center;gap:3rem;padding:0 3rem}
  .deck{width:30rem;height:32rem}.t{font-size:5.6rem}.right{display:none}
}
</style>