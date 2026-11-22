<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import ScrambleText from './ScrambleText.vue'
import { cardPath } from '../composables/cardShape'

const props = defineProps({ ready: Boolean })
const emit = defineEmits(['theme'])
const root = ref(null)
let ctx

const rem = () => parseFloat(getComputedStyle(document.documentElement).fontSize)
const mobile = () => window.innerWidth < 768

// where the small card sits inside the next section
const slot = () => ({
  left: (mobile() ? 3 : 9) * rem(),
  top: (mobile() ? 32 : 36) * rem(),
  width: (mobile() ? window.innerWidth / rem() - 6 : 60) * rem(),
  height: (mobile() ? 20 : 34) * rem()
})
const full = () => ({ left: 0, top: 0, width: window.innerWidth, height: window.innerHeight })

onMounted(() => {
  ctx = gsap.context(() => {
    const card = root.value.querySelector('.card')
    const faces = root.value.querySelectorAll('.face')
    const shape = { k: 0 }                       // 0 = full-screen rectangle, 1 = notched card
    const applyShape = () => {
      const p = `path('${cardPath(gsap.getProperty(card, 'width'), gsap.getProperty(card, 'height'), shape.k)}')`
      faces.forEach((f) => (f.style.clipPath = p))
    }
    gsap.set(card, { transformPerspective: 1800 })

    let theme = 'dark'
    gsap.timeline({
      onUpdate: applyShape,
      scrollTrigger: {
        trigger: root.value, start: 'top top', end: '+=550%', pin: true, scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const tm = self.animation.time()
          const next = tm > 0.9 && tm < 2.9 ? 'light' : 'dark'
          if (next !== theme) { theme = next; root.value.dataset.theme = next; emit('theme', next) }
        }
      }
    })
      /* A (0 → 1.5): frame shrinks into the notched, slightly tilted card and lands in the next section */
      .fromTo('.words, .metas', { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -80, duration: 0.35 }, 0)
      .to('.shade', { autoAlpha: 0, duration: 0.5 }, 0)
      .fromTo(card, { ...full(), rotationY: 0, rotationZ: 0 }, { ...slot(), rotationZ: -2.5, ease: 'power2.inOut', duration: 1.5 }, 0)
      .fromTo(shape, { k: 0 }, { k: 1, ease: 'power2.inOut', duration: 1.5 }, 0)
      .fromTo('.front img', { scale: 1.3 }, { scale: 1, ease: 'none', duration: 1.5 }, 0)
      .fromTo('.next', { yPercent: 100 }, { yPercent: 0, ease: 'power2.inOut', duration: 1.05 }, 0.45)
      .fromTo('.tag', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 1.25)

      /* B (2.0 → 3.6): card straightens, grows and flips into the next full-screen section */
      .to('.t, .b, .cap, .tag', { autoAlpha: 0, y: -40, duration: 0.3, stagger: 0.05 }, 2.0)
      .to(card, { ...full(), rotationY: 180, rotationZ: 0, ease: 'power2.inOut', duration: 1.4 }, 2.2)
      .to(shape, { k: 0, ease: 'power2.inOut', duration: 1.4 }, 2.2)
      .fromTo('.back img', { scale: 1.25 }, { scale: 1, ease: 'none', duration: 1.4 }, 2.2)
      .fromTo('.bt, .bc', { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.08 }, 3.4)
      .to({}, { duration: 0.3 })
    applyShape()
  }, root.value)
})
onBeforeUnmount(() => ctx?.revert())

watch(() => props.ready, (r) => {
  if (!r) return
  gsap.from('.hero .w', { yPercent: 110, duration: 1.1, ease: 'power4.out', stagger: 0.12 })
  gsap.from('.hero .meta', { opacity: 0, duration: 0.8, delay: 0.6 })
})
</script>

<template>
  <section id="hero" ref="root" class="hero" data-section data-theme="dark">
    <h1 class="display words">
      <span class="m"><span class="w">Keep</span></span>
      <span class="m"><span class="w">Protect</span></span>
      <span class="m"><span class="w">Reimagine</span></span>
    </h1>
    <div class="metas"><p class="meta desc">[Brand description — one or two sentences about your world.]</p></div>
    <p class="meta hint"><span class="dot" /><ScrambleText text="Scroll to explore" :reveal="false" /></p>

    <div class="next">
      <h2 class="display t">[Story title]</h2>
      <p class="b">[One sentence describing your world and what people do in it.]</p>
      <p class="cap"><span class="dot" />Watch trailer</p>
    </div>

    <div class="card">
      <figure class="face front">
        <img src="https://picsum.photos/seed/ruin-sky/1920/1080" alt="" />
        <div class="shade" />
        <figcaption class="tag"><span class="dot" />[Card label]</figcaption>
      </figure>
      <figure class="face back">
        <img src="https://picsum.photos/seed/next-world/1920/1080" alt="" />
        <div class="dim" />
        <h2 class="display bt">[Next section title]</h2>
        <p class="bc"><span class="dot" />[Short caption for the next section]</p>
      </figure>
    </div>
  </section>
</template>

<style scoped>
.hero{position:relative;height:100vh;overflow:hidden;background:#000;color:#000}

.words{position:absolute;left:9rem;bottom:15rem;z-index:3;font-size:19rem;color:#fff}
.m{display:block;overflow:hidden}.w{display:block}
.metas{position:absolute;left:9rem;bottom:6rem;z-index:3;color:#fff}
.desc{max-width:42rem;margin:0}
.hint{position:absolute;bottom:3.4rem;left:50%;transform:translateX(-50%);margin:0;z-index:3;color:#fff}

.next{position:absolute;inset:0;z-index:1;background:#fff;color:#000;will-change:transform}
.t{position:absolute;left:9rem;top:11rem;font-size:11rem;max-width:90rem}
.b{position:absolute;left:78rem;top:38rem;max-width:34rem;margin:0}
.cap{position:absolute;left:9rem;top:71rem;margin:0}

.card{position:absolute;left:0;top:0;width:100%;height:100%;z-index:2;transform-style:preserve-3d}
.face{position:absolute;inset:0;margin:0;overflow:hidden;backface-visibility:hidden;-webkit-backface-visibility:hidden;background:#111}
.face img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.back{transform:rotateY(180deg);color:#fff}
.shade{position:absolute;inset:0;background:linear-gradient(to top,#000 5%,transparent 60%)}
.dim{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.7),transparent 55%)}
.tag{position:absolute;left:5.6rem;top:2rem;color:#fff;margin:0}
.bt{position:absolute;left:9rem;bottom:12rem;font-size:14rem;max-width:120rem}
.bc{position:absolute;left:9rem;bottom:7rem;margin:0}

@media(max-width:767px){
  .words{left:3rem;bottom:14rem;font-size:9.6rem}
  .metas{left:3rem;right:3rem;bottom:6rem}.hint{display:none}
  .t{left:3rem;top:10rem;font-size:6.4rem}
  .b{left:3rem;top:56rem;max-width:none;right:3rem}
  .cap{left:3rem;top:53rem}
  .tag{left:4.6rem;top:1.6rem}
  .bt{left:3rem;bottom:12rem;font-size:7.4rem}.bc{left:3rem;bottom:7rem}
}
</style>
