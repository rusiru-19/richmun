<script setup>
import { scrollProgress, scrollTo } from '../composables/useSmoothScroll'
import ScrambleText from './ScrambleText.vue'
import { muted, toggleAudio } from '../composables/useAudio'
defineProps({
  sections: Array,                         // [{ id, label }]
  active: String,
  theme: { type: String, default: 'dark' } // 'dark' section => white lines
})
defineEmits(['menu', 'console'])
</script>
<template>
  <div class="frame" :class="theme">
    <div class="border" />
    <header class="top">
      <i class="fill" :style="{ transform: `translateX(${(scrollProgress - 1) * 100}%)` }" />
      <button class="burger" aria-label="Menu" @click="$emit('menu')"><b /><b /></button>
      <nav>
        <button v-for="s in sections" :key="s.id" :class="{ on: active === s.id }" @click="scrollTo('#' + s.id)">
          <span v-if="active === s.id" class="dot" /><ScrambleText :text="s.label" :reveal="false" />
        </button>
      </nav>
    </header>
    <aside class="side">
      <div class="logo">◢◣</div>
      <div class="tools">
        <button class="audio" :class="{ off: muted }" aria-label="Toggle sound" @click="toggleAudio"><i v-for="n in 5" :key="n" /></button>
        <button aria-label="Console" @click="$emit('console')">&gt;_</button>
      </div>
    </aside>
  </div>
</template>
<style scoped>
.frame{position:fixed;inset:0;z-index:50;pointer-events:none;color:var(--fg);transition:color .4s;--fg:#fff;--line:var(--hair-d)}
.frame.light{--fg:#000;--line:var(--hair-l)}
.frame>*{pointer-events:none}.frame button{pointer-events:auto}
.border{position:absolute;inset:1.2rem;border:1px solid var(--line);border-radius:2.4rem}
.top{position:absolute;top:1.2rem;left:1.2rem;right:1.2rem;height:4.6rem;border-bottom:1px solid var(--line);
  border-radius:2.4rem 2.4rem 0 0;overflow:hidden;display:flex;align-items:center}
.fill{position:absolute;inset:0;background:var(--fg);opacity:.06;border-right:1px solid var(--fg)}
.burger{width:6.7rem;height:100%;display:flex;flex-direction:column;justify-content:center;gap:.6rem;padding-left:2.4rem;position:relative}
.burger b{display:block;height:1px;background:var(--fg);width:2.2rem}.burger b+b{width:1.4rem}
nav{position:absolute;left:50%;transform:translateX(-50%);display:flex;gap:3.2rem}
nav button{opacity:.4;transition:opacity .2s}nav button.on,nav button:hover{opacity:1}
.side{position:absolute;top:5.8rem;bottom:1.2rem;left:1.2rem;width:4.6rem;border-right:1px solid var(--line);
  display:flex;flex-direction:column;justify-content:space-between;align-items:center;padding:1.4rem 0}
.tools{display:flex;flex-direction:column;gap:1.6rem;align-items:center}
.audio{display:flex;gap:2px;align-items:center;height:1.6rem}
.audio i{width:1px;height:100%;background:var(--fg);transform-origin:center;animation:eq 1s ease-in-out infinite alternate}
.audio i:nth-child(2n){animation-delay:.2s}.audio i:nth-child(3n){animation-delay:.4s}
.audio.off i{animation:none;transform:scaleY(.2)}
@keyframes eq{from{transform:scaleY(.2)}to{transform:scaleY(1)}}
@media(max-width:767px){nav,.side{display:none}}
</style>
