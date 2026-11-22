<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import CornerButton from './CornerButton.vue'
import ScrambleText from './ScrambleText.vue'
import { scrollTo } from '../composables/useSmoothScroll'
const root = ref(null)
let ctx
onMounted(() => {
  ctx = gsap.context(() => {
    gsap.from('.date', { yPercent: 100, duration: 1.2, ease: 'power4.out',
      scrollTrigger: { trigger: root.value, start: 'top 60%' } })
  }, root.value)
})
onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <section id="cta" ref="root" class="cta" data-section data-theme="dark">
    <h2 class="display q">[Closing question?]</h2>
    <CornerButton>[Main action]</CornerButton>
    <nav class="links">
      <a href="#" @click.prevent="scrollTo('#scene-1')"><ScrambleText text="Scene one" :reveal="false" /></a>
      <a href="#" @click.prevent="scrollTo('#scene-2')"><ScrambleText text="Scene two" :reveal="false" /></a>
      <a href="#" @click.prevent="scrollTo('#scene-3')"><ScrambleText text="Scene three" :reveal="false" /></a>
    </nav>
    <div class="mask"><div class="display date">[00.00.00]</div></div>
  </section>
</template>

<style scoped>
.cta{min-height:100vh;background:#000;padding:16rem 9rem 4rem;display:flex;flex-direction:column;align-items:flex-start;gap:3.4rem}
.q{font-size:11rem;max-width:100rem}
.links{display:flex;gap:3rem}
.mask{overflow:hidden;margin-top:auto;width:100%}
.date{font-size:28rem;white-space:nowrap}
@media(max-width:767px){.cta{padding:12rem 3rem 8rem}.q{font-size:6.4rem}.date{font-size:10rem}}
</style>
