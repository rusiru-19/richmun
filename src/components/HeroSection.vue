<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrambleText from './ScrambleText.vue'
import { cardPath } from '../composables/cardShape'

// stops pinned sections from jumping when the phone's address bar hides / shows
ScrollTrigger.config({ ignoreMobileResize: true })

const props = defineProps({ ready: Boolean })
const emit = defineEmits(['theme'])
const root = ref(null)
let ctx

/* Parallax layers for the flipped section, listed FAR → NEAR. Files live in /public (p1.png … p5.png).
   p5 = background, p1 = closest to the camera. Reorder this array if the stacking looks wrong. */
const layers = ['p5', 'p4', 'p3', 'p2', 'p1']
const TITLE_ABOVE = 4          // title sits in front of this many layers (4 = behind only the nearest one)
// depth 0.15 (far) … 1 (near): how much each layer moves
const depthOf = (i) => +(0.15 + 0.85 * (i / (layers.length - 1))).toFixed(3)

/* ── mobile switch (phones < 768px wide) ── */
const isMobile = ref(window.innerWidth < 768)
const onResize = () => { isMobile.value = window.innerWidth < 768 }

/* ───────────────────────── GRAFFITI ─────────────────────────
   Files live in /public. Rename every `src` to your real file names.
   x / y  = position in % of the screen (top-left corner of the piece)
   w      = width in % of the screen
   r      = base rotation (deg)
   drift  = how far (px) the piece slowly wanders                                   */

/* SET 1 — on the DEBATE / DIPLOMACY. / SUPREMACY screen.
   layer: 'back'  = behind the headline, 'front' = drawn over the headline.
   Leaves together with the headline as you start to scroll. */
const graffiti = [
  { src: '/g1.png', layer: 'back',  x: -2, y: 2,  w: 26, r: 0,  drift: 30 },
  { src: '/g2.png', layer: 'front', x: 44, y: 10, w: 14, r: 4,  drift: 22 },
  { src: '/g4.png', layer: 'front', x: 20, y: 66, w: 18, r: -6, drift: 34 },
  { src: '/g5.png', layer: 'back',  x: -2, y: 50, w: 12, r: 0,  drift: 24 }
]
const gBack = graffiti.filter((g) => g.layer === 'back')
const gFront = graffiti.filter((g) => g.layer === 'front')

/* SET 2 — on the RichMUN'27 screen (desktop positions, matches your screenshot).
   Comes in as the card lands, leaves together with the RichMUN'27 text. */
const graffitiNext = [
  { src: '/g1.png',  x: -2, y: 34, w: 14, r: 0, drift: 22 },   // red + blue streaks, left of the card
  { src: '/g2.png',  x: 39, y: 35, w: 10, r: 0, drift: 18 },   // red doodle at the card's top-right corner
  { src: '/g3.png',  x: 81, y: 45, w: 7,  r: 0, drift: 20 },   // lightning bolt, right
  { src: '/g4.png',  x: 43, y: 76, w: 9,  r: 0, drift: 18 },   // star, under the card
  { src: '/g5.png',  x: 4,  y: 78, w: 9,  r: 0, drift: 22 }    // red + blue streaks, bottom left
]
/* SET 2 on phones: the card fills the width, so the pieces move to its edges and to free space.
   Card ≈ 8%–92% across, 34%–61% down. Same file order as above. */
const graffitiNextMobile = [
  { src: '/g1.png',  x: -4, y: 40, w: 16, r: 0, drift: 22 },   // streaks, bleeding off the left edge of the card
  { src: '/g2.png',  x: 76, y: 27, w: 14, r: 0, drift: 18 },   // doodle, above the card's top-right corner
  { src: '/g3.png',  x: 87, y: 50, w: 9,  r: 0, drift: 20 },   // lightning bolt, right edge
  { src: '/g4.png',  x: 7,  y: 20, w: 12, r: 0, drift: 18 },   // star, in the gap under the title
  { src: '/g5.png',  x: 68, y: 88, w: 22, r: 0, drift: 16 }    // streaks, bottom right corner
]
const nextSet = computed(() => (isMobile.value ? graffitiNextMobile : graffitiNext))

// phones get slightly bigger pieces so they stay visible
const gStyle = (g) => ({
  left: g.x + '%', top: g.y + '%', width: g.w * (isMobile.value ? 1.35 : 1) + '%', rotate: g.r + 'deg'
})

// dissolve grid: fewer, wider bars on phones (computed once on load)
const m0 = window.innerWidth < 768
const COLS = m0 ? 18 : 36, ROWS = m0 ? 13 : 9
// stencil cells for the dissolve; the middle row becomes the horizontal dashes
const cells = Array.from({ length: COLS * ROWS }, (_, i) => ({ h: Math.floor(i / COLS) === Math.floor(ROWS / 2) }))

const rem = () => parseFloat(getComputedStyle(document.documentElement).fontSize)
const mobile = () => window.innerWidth < 768

/* Phone layout of the small card: its size follows the screen height so the text underneath always fits.
   The card's bottom edge is passed to CSS (--card-bottom) so the text block sits right below it. */
const phoneCard = () => {
  const vh = window.innerHeight / rem()
  const top = Math.min(30, Math.max(24, vh * 0.34))
  const h = Math.min(24, Math.max(15, vh * 0.27))
  root.value?.style.setProperty('--card-bottom', top + h + 'rem')
  return { top, h }
}

// where the small card sits inside the next section
const slot = () => {
  if (mobile()) {
    const { top, h } = phoneCard()
    return { left: 3 * rem(), top: top * rem(), width: window.innerWidth - 6 * rem(), height: h * rem() }
  }
  return { left: 9 * rem(), top: 36 * rem(), width: 60 * rem(), height: 34 * rem() }
}
const full = () => ({ left: 0, top: 0, width: window.innerWidth, height: window.innerHeight })

onMounted(() => {
  window.addEventListener('resize', onResize)
  ctx = gsap.context(() => {
    const card = root.value.querySelector('.card')
    const faces = root.value.querySelectorAll('.face')
    const shape = { k: 0 }                       // 0 = full-screen rectangle, 1 = notched card
    const applyShape = () => {
      const p = `path('${cardPath(gsap.getProperty(card, 'width'), gsap.getProperty(card, 'height'), shape.k)}')`
      faces.forEach((f) => (f.style.clipPath = p))
    }
    gsap.set(card, { transformPerspective: 1800 })

    /* Graffiti: slow endless drift for BOTH sets. Independent of scroll.
       Bigger duration = slower motion. Half the distance on phones. */
    const reach = () => (mobile() ? 0.5 : 1)
    gsap.utils.toArray('.gfx').forEach((el, i) => {
      const d = +el.dataset.drift
      gsap.to(el, {
        x: () => gsap.utils.random(-d, d) * reach(),
        y: () => gsap.utils.random(-d, d) * reach(),
        rotation: () => gsap.utils.random(-3, 3),
        duration: gsap.utils.random(6, 9),
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        repeatRefresh: true,
        delay: i * 0.4
      })
    })

    let theme = 'dark'
    const tl = gsap.timeline({
      onUpdate: applyShape,
      scrollTrigger: {
        trigger: root.value, start: 'top top', end: '+=1000%', pin: true, scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const tm = self.animation.time()
          const next = (tm > 0.9 && tm < 2.9) || tm > 6.9 ? 'light' : 'dark'
          if (next !== theme) { theme = next; root.value.dataset.theme = next; emit('theme', next) }
        }
      }
    })
      /* A (0 → 1.5): frame shrinks into the notched, slightly tilted card and lands in the next section */
      .fromTo('.words, .metas', { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -80, duration: 0.35 }, 0)
      /* SET 1 graffiti leaves together with the headline */
      .to('.gfx-layer', { autoAlpha: 0, y: -80, duration: 0.35 }, 0)
      .to('.shade', { autoAlpha: 0, duration: 0.5 }, 0)
      .fromTo(card, { ...full(), rotationY: 0, rotationZ: 0 }, { ...slot(), rotationZ: -2.5, ease: 'power2.inOut', duration: 1.5 }, 0)
      .fromTo(shape, { k: 0 }, { k: 1, ease: 'power2.inOut', duration: 1.5 }, 0)
      .fromTo('.front img', { scale: 1.3 }, { scale: 1, ease: 'none', duration: 1.5 }, 0)
      .fromTo('.next', { yPercent: 100 }, { yPercent: 0, ease: 'power2.inOut', duration: 1.05 }, 0.45)
      .fromTo('.tag', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 1.25)
      /* SET 2 graffiti comes in one piece after another while the card lands */
      .fromTo('.gfx2-in', { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, ease: 'power2.out', duration: 0.5, stagger: 0.1 }, 1.0)

      /* B (2.0 → 3.6): card straightens, grows and flips into the next full-screen section */
      .to('.t, .logo, .about, .cap, .tag', { autoAlpha: 0, y: -40, duration: 0.3, stagger: 0.05 }, 2.0)
      /* SET 2 graffiti leaves together with the RichMUN'27 text */
      .to('.gfx2-layer', { autoAlpha: 0, y: -40, duration: 0.4 }, 2.0)
      .to(card, { ...full(), rotationY: 180, rotationZ: 0, ease: 'power2.inOut', duration: 1.4 }, 2.2)
      .to(shape, { k: 0, ease: 'power2.inOut', duration: 1.4 }, 2.2)
      .fromTo('.bt, .bc', { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.08 }, 3.4)

      /* C (3.4 → 6.1): parallax inside this same flipped section */
      .fromTo('.fog', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 3.4)
      .fromTo('.fog', { xPercent: -8 }, { xPercent: 8, ease: 'none', duration: 2.4 }, 3.7)
      .fromTo('.title', { y: 0 }, { y: -260, ease: 'none', duration: 2.4 }, 3.7)
      .to('.title', { autoAlpha: 0, duration: 0.5 }, 5.6)

      /* D (6.1 → 7.1): stencil dissolve to white, which hands over to the next section */
      .fromTo('.cell i', { scale: 0 }, { scale: 1, ease: 'none', duration: 0.5, stagger: { amount: 0.7, from: 'random' } }, 6.1)
      .fromTo('.fill', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 6.8)

    // layered parallax from your p-images: far layers barely move, near layers move the most
    gsap.utils.toArray('.back .px').forEach((el) => {
      const d = +el.dataset.d
      tl.fromTo(el, { scale: 1.08 + d * 0.22 }, { scale: 1, ease: 'none', duration: 1.4 }, 2.2)       // settles while the card flips
        .fromTo(el, { yPercent: d * 8 }, { yPercent: -d * 8, ease: 'none', duration: 2.4 }, 3.7)     // the parallax scroll
    })
    applyShape()
  }, root.value)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  ctx?.revert()
})

watch(() => props.ready, (r) => {
  if (!r) return
  gsap.from('.hero .w', { yPercent: 110, duration: 1.1, ease: 'power4.out', stagger: 0.12 })
  gsap.from('.hero .meta', { opacity: 0, duration: 0.8, delay: 0.6 })
  /* SET 1 graffiti fades / scales in one piece after another */
  gsap.fromTo('.hero .gfx-in',
    { autoAlpha: 0, scale: 0.85 },
    { autoAlpha: 1, scale: 1, duration: 1.6, ease: 'power3.out', stagger: 0.25, delay: 0.3 })
})
</script>

<template>
  <section id="hero" ref="root" class="hero" data-section data-theme="dark">
    <!-- SET 1: graffiti IN FRONT of the headline (z-index 4) -->
    <div class="gfx-layer gfx-front" aria-hidden="true">
      <div v-for="(g, i) in gFront" :key="'f' + i" class="gfx" :data-drift="g.drift" :style="gStyle(g)">
        <img class="gfx-in" :src="g.src" alt="" />
      </div>
    </div>

    <h1 class="display words">
      <span class="m"><span class="w">DEBATE</span></span>
      <span class="m diplomacy-word"><span class="w">DIPLOMACY.</span></span>
      <div class="gfx g3-overlay" data-drift="26" :style="gStyle({ x: 80, y: 40, w: 12, r: 0 })" aria-hidden="true">
        <img class="gfx-in" src="/g3.png" alt="" />
      </div>
      <span class="m supremacy-word redcolor"><span class="w">SUPREMACY</span></span>
    </h1>
    <p class="meta hint"><span class="dot" /><ScrambleText text="Scroll to explore" :reveal="false" /></p>

    <div class="next">
      <h2 class="display t">RichMUN'27</h2>
      <img class="logo" src="/logo.png" alt="RichMUN logo" />
      <div class="about">
        <p class="line blue">Challenges, rights and economic development.</p>
        <p class="line red">Challenges, rights and economic development.</p>
        <p class="para">Founded on Richmond College’s enduring legacy of excellence and leadership, RichMUN provides a dynamic platform for students to step into the shoes of international diplomats. Through rigorous debate, policy drafting, and high-stakes negotiation, delegates confront pressing global challenges—from international security and climate policy to human rights and economic development.</p>
      </div>
    </div>

    <div class="card">
      <figure class="face front">
        <img src="/HERO.png" alt="" />
        <div class="shade" />
        <figcaption class="tag"><span class="dot" />[Card label]</figcaption>
      </figure>
      <figure class="face back">
        <img v-for="(n, i) in layers" :key="n" class="px" :src="`/${n}.png`" alt=""
          :data-d="depthOf(i)" :style="{ zIndex: (i + 1) * 2 }" />
        <div class="fog" />
        <div class="title" :style="{ zIndex: TITLE_ABOVE * 2 + 1 }">
          <h2 class="display bt">[Next section title]</h2>
          <!-- <p class="bc"><span class="dot" />[Short caption for the next section]</p> -->
        </div>
      </figure>
    </div>

    <!-- SET 1: graffiti BEHIND the headline but above the photo card (z-index 2, after .card in the DOM) -->
    <div class="gfx-layer gfx-back" aria-hidden="true">
      <div v-for="(g, i) in gBack" :key="'b' + i" class="gfx" :data-drift="g.drift" :style="gStyle(g)">
        <img class="gfx-in" :src="g.src" alt="" />
      </div>
    </div>

    <!-- SET 2: graffiti on the RichMUN'27 screen, over the card (z-index 4) -->
    <div class="gfx2-layer" aria-hidden="true">
      <div v-for="(g, i) in nextSet" :key="'n' + i" class="gfx" :data-drift="g.drift" :style="gStyle(g)">
        <img class="gfx2-in" :src="g.src" alt="" />
      </div>
    </div>

    <div class="dis" aria-hidden="true"
      :style="{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }">
      <span v-for="(c, i) in cells" :key="i" class="cell" :class="c.h ? 'h' : 'v'"><i /></span>
    </div>
    <div class="fill" />
  </section>
</template>

<style scoped>
/* svh = the screen height with the phone's address bar showing, so nothing is cut off at the bottom */
.hero{position:relative;height:100vh;height:100svh;overflow:hidden;background:#ffffff;color:#000}

.words{position:absolute;left:9rem;bottom:15rem;z-index:3;font-size:19rem;color:#fff}
.m{display:block;overflow:hidden;position:relative}.w{display:block}
.diplomacy-word{z-index:1}.supremacy-word{z-index:3}
.g3-overlay{position:fixed!important;z-index:2!important;pointer-events:none}
.metas{position:absolute;left:9rem;bottom:6rem;z-index:3;color:#fff}
.desc{max-width:42rem;margin:0}
.hint{position:absolute;bottom:3.4rem;left:50%;transform:translateX(-50%);margin:0;z-index:3;color:#fff}
.redcolor{color:#fa0e50}
.next{position:absolute;inset:0;z-index:1;background:#fff;color:#000;will-change:transform}
.t{position:absolute;left:9rem;top:11rem;font-size:11rem;max-width:90rem}
.cap{position:absolute;left:9rem;top:71rem;margin:0}

/* logo, top right of the RichMUN'27 screen */
.logo{position:absolute;right:12%;top:24%;width:6vw;min-width:5rem;height:auto;object-fit:contain}

/* text block: blue line, red line, then the justified paragraph */
.about{position:absolute;left:78rem;top:38rem;max-width:34rem;margin:0}
.about p{margin:0}
.line{text-transform:uppercase;font-weight:700;line-height:1.35}
.blue{color:#1c1cc4}
.red{color:#fa0e50;margin-bottom:1.2rem}
.para{text-transform:uppercase;text-align:justify;text-justify:inter-word;line-height:1.5}

.card{position:absolute;left:0;top:0;width:100%;height:100%;z-index:2;transform-style:preserve-3d}
.face{position:absolute;inset:0;margin:0;overflow:hidden;backface-visibility:hidden;-webkit-backface-visibility:hidden;background:#111}
.face img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.face .px{inset:auto;left:0;top:-14%;width:108%;height:128%}   /* oversized so layers can move without showing gaps */
.back{transform:rotateY(180deg);color:#fff}
.shade{position:absolute;inset:0;background:linear-gradient(to top,#000 5%,transparent 60%)}
.dim{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.7),transparent 55%)}
.tag{position:absolute;left:5.6rem;top:2rem;color:#fff;margin:0}
.fog{position:absolute;z-index:5;left:-10%;width:120%;height:45%;bottom:20%;background:radial-gradient(60% 100% at 50% 100%,rgba(190,180,230,.25),transparent 70%)}
.title{position:absolute;inset:0}
.bt{position:absolute;left:9rem;bottom:12rem;font-size:14rem;max-width:120rem}
.dis{position:absolute;inset:0;z-index:5;display:grid;grid-template-columns:repeat(36,1fr);grid-template-rows:repeat(9,1fr);pointer-events:none}
.cell{position:relative}.cell i{position:absolute;display:block;background:#fff}
.v i{inset:2% 18%;border-radius:1rem}.h i{inset:36% 4%;border-radius:1rem}
.fill{position:absolute;inset:0;z-index:5;background:#fff;pointer-events:none}
.bc{position:absolute;left:9rem;bottom:7rem;margin:0}

/* graffiti */
.gfx-layer,.gfx2-layer{position:absolute;inset:0;pointer-events:none}
.gfx-back{z-index:2}     /* SET 1 behind: over the photo card, under the headline (3) */
.gfx-front{z-index:4}    /* SET 1 front: over the headline */
.gfx2-layer{z-index:4}   /* SET 2: over the small card on the RichMUN'27 screen */
.gfx{position:absolute;will-change:transform}
.gfx-in,.gfx2-in{display:block;width:100%;height:auto;opacity:0}   /* hidden until their entrance animation runs */

/* ───────────── phones ─────────────
   Sizes use vw so the long words always fit on one line:
   "DIPLOMACY." ≈ 5.8em wide, so 13.5vw keeps it inside the screen. */
@media(max-width:767px){
  .words{left:3rem;bottom:calc(10rem + env(safe-area-inset-bottom, 0px));font-size:13.5vw}
  /* lightning bolt: straddles the DIPLOMACY line (in front of it, behind SUPREMACY) */
  .g3-overlay{width:20%!important;left:62%!important;top:calc(100vh - 26rem)!important;top:calc(100svh - 26rem)!important}
  .hint{display:none}

  .t{left:3rem;top:9rem;font-size:14vw}                          /* "RichMUN'27" ≈ 5.4em → fits one line */
  .logo{right:3rem;top:17rem;width:5.5rem;min-width:0}           /* in the gap between title and card */
  /* text sits directly under the card; --card-bottom is set from the card's real size in the script */
  .about{left:3rem;right:3rem;max-width:none;top:calc(var(--card-bottom, 44rem) + 2rem)}
  .line,.para{font-size:1rem}
  .para{line-height:1.45}
  .tag{left:4.6rem;top:1.6rem}

  .bt{left:3rem;bottom:calc(12rem + env(safe-area-inset-bottom, 0px));font-size:7.4rem}
  .bc{left:3rem;bottom:7rem}
}
/* very short phones: drop the long paragraph so nothing runs off the bottom */
@media(max-width:767px) and (max-height:620px){ .para{display:none} }
</style>