<script setup>
import { ref, onMounted } from 'vue'
import { scramble } from '../composables/scramble'
const props = defineProps({ text: String, reveal: { type: Boolean, default: true } })
const layer = ref(null)
const run = () => layer.value && scramble(layer.value, props.text, 0.5)
onMounted(() => {
  if (!props.reveal) return
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { run(); io.disconnect() } })
  io.observe(layer.value)
})
</script>
<template>
  <!-- invisible spacer holds the real width; animation layer sits on top -->
  <span class="st" @mouseenter="run">
    <span class="sp">{{ text }}</span>
    <span ref="layer" class="ly" aria-hidden="true">{{ text }}</span>
  </span>
</template>
<style scoped>
.st{position:relative;display:inline-block}
.sp{visibility:hidden}
.ly{position:absolute;inset:0;white-space:nowrap}
</style>
