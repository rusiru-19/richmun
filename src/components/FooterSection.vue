<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import ScrambleText from './ScrambleText.vue'
import CornerButton from './CornerButton.vue'
const root = ref(null)
let ctx
onMounted(() => {
  ctx = gsap.context(() => {
    gsap.from('.word', { yPercent: 100, ease: 'none',
      scrollTrigger: { trigger: root.value, start: 'top 80%', end: 'bottom bottom', scrub: true } })
  }, root.value)
})
onBeforeUnmount(() => ctx?.revert())
</script>
<template>
  <footer ref="root" class="foot" data-section data-theme="dark">
    <div class="cols">
      <div class="col dim"><ScrambleText text="> console --help" /><br /><ScrambleText text="> unlock secrets" /></div>
      <div class="col"><h4>Discover more</h4><a href="#">Story</a><a href="#">Journal</a><a href="#">Media</a><a href="#">Gallery</a></div>
      <div class="col"><h4>Join the conversation</h4><a href="#">Discord</a><a href="#">X / Twitter</a><a href="#">Instagram</a></div>
      <div class="col"><h4>More details</h4><a href="#">hello@yourbrand.com</a><CornerButton>Download brand book</CornerButton></div>
    </div>
    <div class="mark"><div class="display word">YourBrand</div></div>
    <div class="bar"><span>EN</span><span>Privacy · Terms</span><span>© 2026</span></div>
  </footer>
</template>
<style scoped>
.foot{background:#000;padding:9rem 9rem 4rem}
.cols{display:grid;grid-template-columns:repeat(4,1fr);min-height:35rem;border:1px solid var(--hair-d)}
.col{padding:2.4rem;display:flex;flex-direction:column;gap:1.2rem;align-items:flex-start;border-left:1px solid var(--hair-d)}
.col:first-child{border-left:0}.dim{opacity:.5}
h4{margin:0 0 1rem;font-weight:500;opacity:.5}
.mark{overflow:hidden;margin:6rem 0 2rem}
.word{font-size:30rem;text-align:center;white-space:nowrap}
.bar{display:flex;justify-content:space-between;padding-top:2rem;border-top:1px solid var(--hair-d)}
@media(max-width:767px){.foot{padding:6rem 3rem 8rem}.cols{grid-template-columns:1fr}.col{border-left:0;border-top:1px solid var(--hair-d)}.word{font-size:11rem}}
</style>
