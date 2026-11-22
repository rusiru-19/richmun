<script setup>
// Static card with the same silhouette. Wrap any image/content: <NotchCard><img …></NotchCard>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { cardPath } from '../composables/cardShape'
const el = ref(null)
let ro
onMounted(() => {
  const apply = () => { el.value.style.clipPath = `path('${cardPath(el.value.offsetWidth, el.value.offsetHeight, 1)}')` }
  ro = new ResizeObserver(apply); ro.observe(el.value); apply()
})
onBeforeUnmount(() => ro?.disconnect())
</script>
<template><div ref="el" class="nc"><slot /></div></template>
<style scoped>.nc{position:relative;overflow:hidden}.nc :deep(img){display:block;width:100%;height:100%;object-fit:cover}</style>
