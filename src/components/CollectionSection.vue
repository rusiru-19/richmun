<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from '../composables/useSmoothScroll'
const root = ref(null), n = ref(0)
let ctx
onMounted(() => {
  ctx = gsap.context(() => {
    ScrollTrigger.create({ trigger: root.value, start: 'top 60%', once: true, onEnter: () => {
      const o = { v: 0 }
      gsap.to(o, { v: 10, duration: 1.8, ease: 'power2.out', onUpdate: () => (n.value = Math.round(o.v)) })
    } })
    gsap.utils.toArray('.im').forEach((el) =>
      gsap.fromTo(el, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 90%', end: 'top 45%', scrub: true } }))
  }, root.value)
})
onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <section id="collection" ref="root" class="col" data-section data-theme="dark">
    <div class="display big">{{ n }}K</div>
    <h2 class="display name">[Collection name]</h2>
    <p class="launch"><span class="dot" />[Launch label] — [00.00.0000]</p>
    <figure class="im a"><img src="https://picsum.photos/seed/close-a/700/900" alt="" /><figcaption>[Caption]</figcaption></figure>
    <figure class="im b"><img src="https://picsum.photos/seed/close-b/800/600" alt="" /><figcaption>[Caption]</figcaption></figure>
  </section>
</template>

<style scoped>
.col{position:relative;min-height:130vh;background:#000;padding:14rem 9rem}
.big{font-size:42rem}
.name{font-size:7rem;margin-top:2rem}
.launch{margin-top:2rem}
figure{margin:0;position:absolute}figcaption{margin-top:.8rem}
img{width:100%;height:auto}
.a{right:12rem;top:16rem;width:34rem}
.b{right:30rem;top:62rem;width:44rem}
@media(max-width:767px){.col{padding:10rem 3rem}.big{font-size:19rem}.name{font-size:4.4rem}
  figure{position:static;width:100%;margin-top:3rem}}
</style>
