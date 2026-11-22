<script setup>
defineProps({ theme: { type: String, default: 'dark' } })
</script>
<template>
  <button class="cb" :class="theme"><span><slot /></span></button>
</template>
<style scoped>
.cb{--cut:1.2rem;position:relative;padding:1.3rem 2.4rem;color:var(--c);
  clip-path:polygon(0 0,calc(100% - var(--cut)) 0,100% var(--cut),100% 100%,var(--cut) 100%,0 calc(100% - var(--cut)));
  background:var(--c);transition:color .25s}
.cb::before{content:'';position:absolute;inset:1px;background:var(--bg);transition:background .25s;
  clip-path:polygon(0 0,calc(100% - var(--cut)) 0,100% var(--cut),100% 100%,var(--cut) 100%,0 calc(100% - var(--cut)))}
.cb span{position:relative;z-index:1}
.dark{--c:#fff;--bg:#000}
.dark:hover{--bg:var(--lime);color:#000}
.light{--c:#000;--bg:#fff}
.light:hover{--bg:#000;color:#fff}
</style>
