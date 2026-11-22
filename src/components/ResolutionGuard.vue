<script setup>
import { ref, onMounted } from 'vue'
const msg = ref('')
const check = () => {
  const w = innerWidth, h = innerHeight
  if (w < 768 && w > h) msg.value = 'Rotate your device to portrait'
  else if (w >= 768 && (w / h > 3 || h < 400)) msg.value = 'This resolution is not supported'
  else msg.value = ''
}
onMounted(() => { check(); addEventListener('resize', check) })
</script>
<template><div v-if="msg" class="g"><p>{{ msg }}</p></div></template>
<style scoped>.g{position:fixed;inset:0;z-index:200;background:#000;display:grid;place-content:center;text-align:center}</style>
