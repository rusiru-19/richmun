<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import NotchCard from './NotchCard.vue'
import CornerButton from './CornerButton.vue'
import { cardPath } from '../composables/cardShape'

const emit = defineEmits(['theme'])
const root = ref(null), deck = ref(null)
// s = side (-1 left, +1 right), r = rank (how far from the centre it travels)
const others = [{ s: -1, r: 3 }, { s: -1, r: 2 }, { s: -1, r: 1 }, { s: 1, r: 1 }, { s: 1, r: 2 }, { s: 1, r: 3 }]
const battlefields = ['[Battlefield one]', '[Battlefield two]', '[Battlefield three]', '[Battlefield four]', '[Battlefield five]']
let ctx

const rem = () => parseFloat(getComputedStyle(document.documentElement).fontSize)
const mobile = () => window.innerWidth < 768

onMounted(() => {
  ctx = gsap.context(() => {
    const card = root.value.querySelector('.cardwrap')
    const faces = root.value.querySelectorAll('.face')
    const shape = { k: 1 }                                  // 1 = notched card, 0 = plain full-screen rectangle
    const applyShape = () => {
      const p = `path('${cardPath(gsap.getProperty(card, 'width'), gsap.getProperty(card, 'height'), shape.k)}')`
      faces.forEach((f) => (f.style.clipPath = p))
    }
    // card rectangle relative to the stage: a scaled copy of the deck slot, or the whole viewport
    const dims = () => ({ w: deck.value.offsetWidth, h: deck.value.offsetHeight, l: deck.value.offsetLeft, t: deck.value.offsetTop })
    const small = (s) => { const d = dims(); return { left: d.w * (1 - s) / 2, top: d.h * (1 - s) / 2, width: d.w * s, height: d.h * s } }
    const full = () => { const d = dims(); return { left: -d.l, top: -d.t, width: window.innerWidth, height: window.innerHeight } }

    gsap.set(card, { transformPerspective: 1800 })
    gsap.set('.sq', { xPercent: -50, yPercent: -50, scale: 0 })
    gsap.set('.other', { autoAlpha: 0, scale: 0.72 })
    gsap.set('.five', { autoAlpha: 0 })

    /* entrance, before the section pins */
    gsap.fromTo(card, { y: 160, rotate: -6, autoAlpha: 0 },
      { y: 0, rotate: -2.5, autoAlpha: 1, ease: 'power3.out',
        scrollTrigger: { trigger: root.value, start: 'top 80%', end: 'top 25%', scrub: true } })
    gsap.from('.side > *', { autoAlpha: 0, y: 30, duration: 0.8, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: root.value, start: 'top 55%' } })

    let theme = 'light'
    const tl = gsap.timeline({
      onUpdate: applyShape,
      scrollTrigger: {
        trigger: root.value, start: 'top top', end: '+=1150%', pin: true, scrub: 0.6, invalidateOnRefresh: true,
        onRefresh: applyShape,
        onUpdate: (self) => {
          const next = self.animation.time() > 1.3 ? 'dark' : 'light'
          if (next !== theme) { theme = next; root.value.dataset.theme = next; emit('theme', next) }
        }
      }
    })
    /* 1. side text fades, purple square grows behind the card, card shrinks */
    tl.to('.side', { autoAlpha: 0, y: -20, duration: 0.6 }, 0)
      .to('.sq', { scale: 1, ease: 'power1.inOut', duration: 1.3 }, 0.3)
      .to(card, { ...small(0.72), ease: 'power2.inOut', duration: 1.1 }, 0.5)
      .fromTo(card, { rotate: -2.5 }, { rotate: 0, duration: 1.1, immediateRender: false }, 0.5)
      .to('.other', { autoAlpha: 1, duration: 0.1 }, 1.5)

    /* 2. other cards spread to both sides, then fold back behind the main card */
    gsap.utils.toArray('.other').forEach((el) => {
      const s = +el.dataset.s, r = +el.dataset.r
      tl.to(el, { x: () => s * r * (mobile() ? 9 : 22) * rem(), y: () => r * 1.2 * rem(),
          rotation: s * r * 5, scale: 0.72 - r * 0.04, ease: 'power2.out', duration: 1.8 }, 1.6 + (r - 1) * 0.15)
        .to(el, { x: 0, y: 0, rotation: 0, scale: 0.72, ease: 'power2.inOut', duration: 1.4 }, 3.9 + (3 - r) * 0.15)
        .to(el, { autoAlpha: 0, duration: 0.1 }, 5.35)
    })
    tl.to(card, { ...small(0.8), ease: 'power2.out', duration: 0.6 }, 5.1)

    /* 3. the card flips (6.0 → 7.0) and its back side scales up into the next section (7.0 → 8.5) */
    tl.to(card, { rotationY: 180, ease: 'power2.inOut', duration: 1 }, 6.0)
      .set('.imgLayer', { autoAlpha: 0 }, 7.0)             // swap the hidden front face's content: image → five cards
      .set('.five', { autoAlpha: 1 }, 7.0)
      .to(card, { ...full(), ease: 'power2.inOut', duration: 1.5 }, 7.0)
      .to(shape, { k: 0, ease: 'power2.inOut', duration: 1.5 }, 7.0)
      .fromTo('.back img', { scale: 1.3 }, { scale: 1, ease: 'none', duration: 1.5 }, 7.0)
      .fromTo('.bf-text', { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.12 }, 8.3)

    /* 4. "Choose your battlefield" holds, then the card flips again to reveal the five cards */
    tl.to('.bf-text', { autoAlpha: 0, y: -40, duration: 0.3 }, 9.6)
      .to(card, { rotationY: 360, ease: 'power2.inOut', duration: 1.1 }, 9.8)
      .fromTo('.fc', { y: 120, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, stagger: 0.08, ease: 'power3.out' }, 10.7)
      .to({}, { duration: 0.5 })
    applyShape()
  }, root.value)
})
onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <section id="showcase" ref="root" class="show" data-section data-theme="light">
    <div class="sq" />

    <div class="side left">
      <h2 class="display t">WORD FROM SECRETARY GENERAL</h2>
      <p>Sajana Hasaranga [president, RichMUN]</p>
    </div>

    <div ref="deck" class="deck">
      <NotchCard v-for="(o, i) in others" :key="i" class="other" :data-s="o.s" :data-r="o.r" :style="{ zIndex: 4 - o.r }">
        <img :src="`https://picsum.photos/seed/deck-${i + 1}/900/900`" alt="" />
      </NotchCard>

      <!-- one two-sided card: front = notched image card (later the five cards), back = "Choose your battlefield" -->
      <div class="cardwrap">
        <figure class="face front">
          <div class="imgLayer">
            <img src="/sajji.png" alt="" />
            <span class="tag"><i class="dot" />[Card label]</span>
          </div>
          <div class="five">
            <NotchCard v-for="(b, i) in battlefields" :key="i" class="fc">
              <img :src="`https://picsum.photos/seed/battle-${i + 1}/600/900`" alt="" />
              <span class="lab"><i class="dot" />{{ b }}</span>
            </NotchCard>
          </div>
        </figure>
        <figure class="face back">
          <img src="https://picsum.photos/seed/battlefield-bg/1920/1080" alt="" />
          <div class="dim" />
          <h2 class="display bf-text bf1">Choose your</h2>
          <h2 class="display bf-text bf2">battlefield</h2>
        </figure>
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
.sq{position:absolute;left:50%;top:50%;width:120vmax;height:120vmax;background:#968adf;z-index:1}
.side{position:relative;z-index:2;display:flex;flex-direction:column;gap:2rem}
.left{align-items:flex-start}.left p{max-width:32rem;margin:0}
.right{align-items:flex-start;padding-left:2rem}
.t{font-size:8.4rem}
.meta{margin:0;padding-bottom:1rem;border-bottom:1px solid var(--hair-l);width:26rem}

.deck{position:relative;z-index:3;width:44rem;height:46rem}
.deck > .other{position:absolute;inset:0;width:100%;height:100%}

.cardwrap{position:absolute;left:0;top:0;width:100%;height:100%;z-index:10;transform-style:preserve-3d;color:#fff}
.face{position:absolute;inset:0;margin:0;overflow:hidden;backface-visibility:hidden;-webkit-backface-visibility:hidden;background:#968adf}
.back{transform:rotateY(180deg);background:#111}
.imgLayer,.five{position:absolute;inset:0}
.imgLayer img,.back > img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.tag{position:absolute;left:5rem;top:2rem}
.dim{position:absolute;inset:0;background:linear-gradient(to top,rgba(20,10,50,.85),rgba(20,10,50,.35))}
.bf-text{position:absolute;left:9rem;font-size:19rem;white-space:nowrap}
.bf1{bottom:30rem}.bf2{bottom:12rem}

.five{background:#6f56c9;display:flex;align-items:center;justify-content:center;gap:2rem;padding:0 6rem}
.five > .fc{flex:0 0 26rem;height:44rem}
.lab{position:absolute;left:1.6rem;bottom:1.6rem}

@media(max-width:767px){
  .show{grid-template-columns:1fr;grid-template-rows:auto auto;justify-items:center;align-content:center;gap:3rem;padding:0 3rem}
  .deck{width:30rem;height:32rem}.t{font-size:5.6rem}.right{display:none}
  .bf-text{left:3rem;font-size:7rem}.bf1{bottom:22rem}.bf2{bottom:14rem}
  .five{flex-direction:column;gap:1rem;padding:0 3rem}.five > .fc{flex:none;width:100%;height:9rem}
}
</style>