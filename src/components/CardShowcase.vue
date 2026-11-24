<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import CornerButton from './CornerButton.vue'

const emit = defineEmits(['theme'])
const root = ref(null), deck = ref(null)
// s = side (-1 left, +1 right), r = rank (how far from the centre it travels)
const others = [
  { s: -1, r: 5 },
  { s: -1, r: 4 },
  { s: -1, r: 3 },
  { s: -1, r: 2 },
  { s: -1, r: 1 },
  { s: 1, r: 1 },
  { s: 1, r: 2 },
  { s: 1, r: 3 },
  { s: 1, r: 4 },
  { s: 1, r: 5 },
]
const battlefields = ['[Battlefield one]', '[Battlefield two]', '[Battlefield three]', '[Battlefield four]', '[Battlefield five]']
let ctx

const rem = () => parseFloat(getComputedStyle(document.documentElement).fontSize)
const mobile = () => window.innerWidth < 768

onMounted(() => {
  ctx = gsap.context(() => {
    const card = root.value.querySelector('.cardwrap')
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
      scrollTrigger: {
        trigger: root.value, start: 'top top', end: '+=1150%', pin: true, scrub: 0.6, invalidateOnRefresh: true,
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
  const s = +el.dataset.s
  const r = +el.dataset.r

  tl.to(el, {
    x: () => s * r * (mobile() ? 4.5 : 12) * rem(),
    y: () => r * 0.7 * rem(),
    rotation: s * r * 2.5,
    scale: 0.72 - r * 0.025,
    ease: 'power2.out',
    duration: 1.8
  }, 1.6 + (r - 1) * 0.1)

  .to(el, {
    x: 0,
    y: 0,
    rotation: 0,
    scale: 0.72,
    ease: 'power2.inOut',
    duration: 1.4
  }, 3.9 + (5 - r) * 0.1)

  .to(el, {
    autoAlpha: 0,
    duration: 0.1
  }, 5.35)
})
    tl.to(card, { ...small(0.8), ease: 'power2.out', duration: 0.6 }, 5.1)

    /* 3. the card flips (6.0 → 7.0) and its back side scales up into the next section (7.0 → 8.5) */
    tl.to(card, { rotationY: 180, ease: 'power2.inOut', duration: 1 }, 6.0)
      .set('.imgLayer', { autoAlpha: 0 }, 7.0)             // swap the hidden front face's content: image → five cards
      .set('.five', { autoAlpha: 1 }, 7.0)
      .to(card, { ...full(), borderRadius: 0, ease: 'power2.inOut', duration: 1.5 }, 7.0)
      .fromTo('.back img', { scale: 1.3 }, { scale: 1, ease: 'none', duration: 1.5 }, 7.0)
      .fromTo('.bf-text', { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.12 }, 8.3)

    /* 4. "Choose your battlefield" holds, then the card flips again to reveal the five cards */
    tl.to('.bf-text', { autoAlpha: 0, y: -40, duration: 0.3 }, 9.6)
      .to(card, { rotationY: 360, ease: 'power2.inOut', duration: 1.1 }, 9.8)
      .fromTo('.fc', { y: 120, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, stagger: 0.08, ease: 'power3.out' }, 10.7)
      .to({}, { duration: 0.5 })
  }, root.value)
})
onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <section id="showcase" ref="root" class="show" data-section data-theme="light">
    <div class="sq" />

    <div class="side left">
      <h2 class="display t">WORD FROM SECRETARY <span class="bluecolor">GENERAL</span></h2>
      <p>Sajana Hasaranga [president, RichMUN]</p>
    </div>

    <div ref="deck" class="deck">
      <div v-for="(o, i) in others" :key="i" class="other plain" :data-s="o.s" :data-r="o.r" :style="{ zIndex: 4 - o.r }">
        <img :src="`Semika.png`" alt="" />
      </div>

      <!-- one two-sided card: front = notched image card (later the five cards), back = "Choose your battlefield" -->
      <div class="cardwrap ">
        <figure class="face front">
          <div class="imgLayer">
            <img src="/Semika.png" alt="" />
          </div>
          <div class="five ">
            <div v-for="(b, i) in battlefields" :key="i" class="fc plain">
              <img :src="`https://picsum.photos/seed/battle-${i + 1}/600/900`" alt="" />
              <span class="lab"><i class="dot" />{{ b }}</span>
            </div>
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

<div class="side right quote">
  <span class="quote-icon">“</span>
  <p>Lat ekata gihin chu parak dan enm</p>
</div>
  </section>
</template>

<style scoped>
.show{position:relative;height:100vh;overflow:hidden;background:#fff;color:#000;
  display:grid;grid-template-columns:1fr auto 1fr;gap:6rem;align-items:center;padding:0 9rem}
.sq{position:absolute;left:50%;top:50%;width:120vmax;height:120vmax;background:#0B1659;z-index:1}
.side{position:relative;z-index:2;display:flex;flex-direction:column;gap:2rem}
.left{align-items:flex-start}.left p{max-width:32rem;margin:0}
.right{align-items:flex-start;padding-left:2rem}
.t{font-size:8.4rem}
.meta{margin:0;padding-bottom:1rem;border-bottom:1px solid var(--hair-l);width:26rem}

.deck{position:relative;z-index:3;width:36rem;height:50.4rem}   /* 5:7, same ratio as your card image */
.plain {
  position: relative;
  overflow: hidden;
  border-radius: 1.2rem;
  background: #111;

  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.10),
    0 12px 20px rgba(0, 0, 0, 0.14),
    0 25px 45px rgba(0, 0, 0, 0.20);

  filter: drop-shadow(0 15px 20px rgba(35, 20, 90, 0.16));
}

.deck > .other{position:absolute;inset:0;width:100%;height:100%}
.cardwrap {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 10;

  transform-style: preserve-3d;
  color: #fff;
  border-radius: 1.2rem;

  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.10),
    0 15px 25px rgba(0, 0, 0, 0.16),
    0 35px 60px rgba(0, 0, 0, 0.22),
    0 50px 100px rgba(0, 0, 0, 0.14);

  filter: drop-shadow(0 25px 35px rgba(80, 55, 160, 0.18));
}
.dropshadow{  border-radius: 1.2rem;
    box-shadow:
    0 4px 5px rgba(0, 0, 0, 0.08),
    0 15px 20px rgba(0, 0, 0, 0.12),
    0 35px 50px rgba(0, 0, 0, 0.18),
    0 50px 100px rgba(0, 0, 0, 0.12);
   filter: drop-shadow(0 25px 35px rgba(80, 55, 160, 0.18));}
.face{position:absolute;inset:0;margin:0;overflow:hidden;border-radius:inherit;backface-visibility:hidden;-webkit-backface-visibility:hidden;background:#968adf}
.back{transform:rotateY(180deg);background:#111}
.imgLayer,.five{position:absolute;inset:0}
.imgLayer img,.back > img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.tag{position:absolute;left:2rem;top:2rem}
.dim{position:absolute;inset:0;background:linear-gradient(to top,rgba(20,10,50,.85),rgba(20,10,50,.35))}
.bf-text{position:absolute;left:9rem;font-size:19rem;white-space:nowrap}
.bf1{bottom:30rem}.bf2{bottom:12rem}
.bluecolor{color:#0B1659}
.five{background:#6f56c9;display:flex;align-items:center;justify-content:center;gap:1.6rem;padding:0 3rem}
.five > .fc{flex:0 0 27rem;height:37.8rem}
.lab{position:absolute;left:1.6rem;bottom:1.6rem}

@media(max-width:767px){
  .show{grid-template-columns:1fr;grid-template-rows:auto auto;justify-items:center;align-content:center;gap:3rem;padding:0 3rem}
  .deck{width:24rem;height:33.6rem}.t{font-size:5.6rem}.right{display:none}
  .bf-text{left:3rem;font-size:7rem}.bf1{bottom:22rem}.bf2{bottom:14rem}
  .five{flex-direction:column;gap:1rem;padding:0 3rem}.five > .fc{flex:none;width:100%;height:9rem}
}
.quote {
  position: relative;
  max-width: 35rem;
  padding-left: 2rem;
}

.quote-icon {
  display: block;
  font-family: Georgia, serif;
  font-size: 10rem;
  line-height: 0.65;
  font-weight: 700;
  color: #0B1659;
}

.quote p {
  font-family: Georgia, serif;
  font-size: clamp(2.5rem, 4.5vw, 5.5rem);
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: -0.045em;
  margin: 0;
  color: #111;
}
</style>