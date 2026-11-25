<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
const msg = ref('')
const check = () => {
  const w = window.innerWidth, h = window.innerHeight
  // Landscape phones are supported; only warn on genuinely unusable viewport sizes.
  if (w < 320 || h < 260) msg.value = 'Expand the window to continue'
  else if (w >= 768 && w / h > 3.5) msg.value = 'Expand the window to continue'
  else msg.value = ''
}
onMounted(() => {
  check()
  window.addEventListener('resize', check, { passive: true })
  window.addEventListener('orientationchange', check, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', check)
  window.removeEventListener('orientationchange', check)
})
</script>
<template><div v-if="msg" class="g"><p>{{ msg }}</p></div></template>
<style scoped>.g{position:fixed;inset:0;z-index:200;background:#000;display:grid;place-content:center;text-align:center;padding:2rem}</style>
