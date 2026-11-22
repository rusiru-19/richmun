<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import CornerButton from './CornerButton.vue'
import ScrambleText from './ScrambleText.vue'

const TARGET = new Date('2027-03-01T00:00:00Z').getTime()   // ← set your launch date here
const left = ref(0)
let timer
const tick = () => (left.value = Math.max(0, TARGET - Date.now()))
onMounted(() => { tick(); timer = setInterval(tick, 1000) })
onBeforeUnmount(() => clearInterval(timer))

const pad = (n) => String(n).padStart(2, '0')
const parts = computed(() => {
  const s = Math.floor(left.value / 1000)
  return [['Days', Math.floor(s / 86400)], ['Hours', Math.floor((s % 86400) / 3600)],
          ['Minutes', Math.floor((s % 3600) / 60)], ['Seconds', s % 60]]
})
</script>

<template>
  <footer id="footer" class="foot" data-section data-theme="dark">
    <p class="kick"><span class="dot" />[Launch label]</p>
    <div class="count">
      <div v-for="[label, v] in parts" :key="label" class="unit">
        <b class="display">{{ pad(v) }}</b>
        <span>{{ label }}</span>
      </div>
    </div>
    <CornerButton>[Main action]</CornerButton>

    <div class="cols">
      <div class="col"><h4>Discover more</h4><a href="#"><ScrambleText text="Story" :reveal="false" /></a><a href="#"><ScrambleText text="Journal" :reveal="false" /></a></div>
      <div class="col"><h4>Join the conversation</h4><a href="#">Discord</a><a href="#">X / Twitter</a><a href="#">Instagram</a></div>
      <div class="col"><h4>More details</h4><a href="#">hello@yourbrand.com</a></div>
    </div>
    <div class="bar"><span>EN</span><span>Privacy · Terms</span><span>© 2026</span></div>
  </footer>
</template>

<style scoped>
.foot{background:#000;padding:14rem 9rem 4rem;display:flex;flex-direction:column;align-items:flex-start;gap:4rem}
.kick{margin:0}
.count{display:flex;gap:6rem;width:100%;justify-content:space-between}
.unit{display:flex;flex-direction:column;gap:1.2rem}
.unit b{font-size:27rem;font-variant-numeric:tabular-nums}
.cols{display:grid;grid-template-columns:repeat(3,1fr);width:100%;border:1px solid var(--hair-d);margin-top:4rem}
.col{padding:2.4rem;display:flex;flex-direction:column;gap:1.2rem;border-left:1px solid var(--hair-d)}.col:first-child{border-left:0}
h4{margin:0 0 1rem;font-weight:500;opacity:.5}
.bar{display:flex;justify-content:space-between;width:100%;padding-top:2rem;border-top:1px solid var(--hair-d)}
@media(max-width:767px){.foot{padding:10rem 3rem 8rem}.count{display:grid;grid-template-columns:1fr 1fr;gap:3rem}
  .unit b{font-size:11rem}.cols{grid-template-columns:1fr}.col{border-left:0;border-top:1px solid var(--hair-d)}}
</style>
