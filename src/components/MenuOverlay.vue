<script setup>
import { ref, watch, nextTick } from 'vue'
import gsap from 'gsap'
import { scrollTo } from '../composables/useSmoothScroll'
import { muted, toggleAudio } from '../composables/useAudio'

const props = defineProps({ open: Boolean, active: String })
const emit = defineEmits(['close', 'console'])
const root = ref(null)

const items = [
  { id: 'hero', label: 'Conference' }, { id: 'showcase', label: 'Committees' }, { id: 'footer', label: 'Register' }
]
const blobs = [[8, 20, 38], [14, 60, 44], [4, 85, 40], [22, 40, 46], [10, 5, 36], [26, 75, 42]]
let tl

watch(() => props.open, async (o) => {
  await nextTick(); tl?.kill()
  if (o) {
    gsap.set(root.value, { display: 'block' })
    tl = gsap.timeline()
      // gooey wipe: blobs merge through the SVG filter, then the panel slides in
      .fromTo('.blob', { scale: 0 }, { scale: 1.6, duration: 0.8, ease: 'power3.inOut', stagger: 0.05 })
      .fromTo('.under', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.1)
      .fromTo('.panel', { xPercent: -100 }, { xPercent: 0, duration: 0.6, ease: 'power3.out' }, 0.4)
      .fromTo('.strip', { xPercent: -300 }, { xPercent: 0, duration: 0.6, ease: 'power3.out' }, 0.45)
      .fromTo('.item span', { yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: 'power4.out', stagger: 0.05 }, 0.6)
      .to('.blob', { autoAlpha: 0, duration: 0.3 }, 0.95)
  } else {
    tl = gsap.timeline({ onComplete: () => gsap.set(root.value, { display: 'none' }) })
      .to('.panel, .strip', { xPercent: -110, duration: 0.45, ease: 'power3.in' })
      .to('.under', { autoAlpha: 0, duration: 0.25 }, 0.2)
  }
})
const go = (id) => { emit('close'); setTimeout(() => scrollTo('#' + id), 500) }


</script>

<template>
  <div ref="root" class="menu">
    <svg width="0" height="0" style="position:absolute"><defs>
      <filter id="goo"><feGaussianBlur in="SourceGraphic" stdDeviation="14" result="b" />
        <feColorMatrix in="b" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" /></filter>
    </defs></svg>
    <div class="under" @click="emit('close')" />
    <div class="goo"><i v-for="(b, i) in blobs" :key="i" class="blob"
      :style="{ left: b[0] + '%', top: b[1] + '%', width: b[2] + 'vmax', height: b[2] + 'vmax' }" /></div>

    <aside class="panel">
      <nav class="nav">
        <a v-for="(it, i) in items" :key="it.id" class="item" :class="{ on: active === it.id }" href="#" @click.prevent="go(it.id)">
          <span class="display">{{ it.label }}</span><em v-if="active === it.id">Page {{ String(i + 1).padStart(3, '0') }}</em>
        </a>
      </nav>
      <div class="row">
        <div><h4>RichMUN</h4><a href="#hero" @click.prevent="go('hero')">The conference</a><a href="#showcase" @click.prevent="go('showcase')">Committees</a><a href="#footer" @click.prevent="go('footer')">Registration</a></div>
        <div><h4>For delegates</h4><a href="#footer" @click.prevent="go('footer')">Join the conference ↗</a></div>
      </div>
      <div class="misc"><span>© 2026</span><span><i class="dot" />Delegates welcome</span></div>
    </aside>

    <div class="strip">
      <button aria-label="Close menu" @click="emit('close')">✕</button>
      <b>RM</b>
      <div>
        <button :class="{ off: muted }" aria-label="Toggle sound" @click="toggleAudio">♪</button>
        <button aria-label="Console" @click="emit('console')">&gt;_</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.menu{position:fixed;inset:0;z-index:80;display:none}
.under{position:absolute;inset:0;background:linear-gradient(90deg,rgba(5,5,15,.78),rgba(5,5,15,.48))}
.goo{position:absolute;inset:0;filter:url(#goo);pointer-events:none;overflow:hidden}
.blob{position:absolute;border-radius:50%;background:rgba(111,70,220,.72);transform:translate(-50%,-50%)}
.panel{position:absolute;left:1.2rem;top:1.2rem;bottom:1.2rem;width:60rem;background:#000;border-radius:2.4rem;
  display:grid;grid-template-rows:1fr auto auto;overflow:hidden}
.nav{padding:3rem 3rem 2rem;display:flex;flex-direction:column;justify-content:center}
.item{position:relative;display:block;overflow:hidden;padding:.4rem 1.4rem;transition:transform .2s,background .2s,color .2s}
.item span{display:block;font-size:6.4rem}
.item:hover{background:#fff;color:#000;transform:translateY(-.2rem)}
.item.on{background:var(--lime);color:#000;clip-path:polygon(0 0,100% 0,100% calc(100% - 1.6rem),calc(100% - 1.6rem) 100%,0 100%)}
.item em{position:absolute;right:2.4rem;top:1rem;font-style:normal}
.row{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid var(--divider)}
.row>div{padding:2rem 3rem;display:flex;flex-direction:column;gap:.6rem}.row>div+div{border-left:1px solid var(--divider)}
h4{margin:0 0 .8rem;font-weight:500;opacity:.5}
.misc{display:flex;justify-content:space-between;padding:1.6rem 3rem;border-top:1px solid var(--divider)}
.strip{position:absolute;left:62.4rem;top:1.2rem;bottom:1.2rem;width:4.6rem;background:#000;border-radius:2.4rem;color:#fff;
  display:flex;flex-direction:column;justify-content:space-between;align-items:center;padding:1.4rem 0}
.strip div{display:flex;flex-direction:column;gap:1.4rem}.strip .off{opacity:.4}
@media(max-width:767px){.panel{width:calc(100% - 7.4rem)}.item span{font-size:4.8rem}.strip{left:auto;right:1.2rem}}
</style>
