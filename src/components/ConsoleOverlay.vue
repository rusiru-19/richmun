<script setup>
import { ref, watch, nextTick } from 'vue'
import gsap from 'gsap'
const props = defineProps({ open: Boolean })
const emit = defineEmits(['close'])
const root = ref(null), inp = ref(null), log = ref(null)
const typed = ref(''), popup = ref(null)
const out = ref(['> session opened', '> pick a command or type one'])
// Replace with CMS-driven commands later.
const commands = [
  { cmd: 'about', text: '[Rich text for the "about" command.]' },
  { cmd: 'factions', text: '[Rich text for the "factions" command.]' },
  { cmd: 'world', text: '[Rich text for the "world" command.]' },
  { cmd: 'secret', text: '[Hidden lore goes here.]' }
]
const run = async (c) => {
  const cmd = c.trim().toLowerCase(); if (!cmd) return
  out.value.push('> ' + cmd)
  const f = commands.find((x) => x.cmd === cmd)
  if (f) popup.value = f; else out.value.push('command not found: ' + cmd)
  typed.value = ''; await nextTick(); log.value.scrollTop = log.value.scrollHeight
}
watch(() => props.open, async (o) => {
  await nextTick()
  if (o) {
    gsap.set(root.value, { display: 'block', autoAlpha: 1 })
    gsap.timeline().fromTo('.bgsvg', { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 0.45, ease: 'power3.out' })
      .fromTo('.cont', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 })
    inp.value?.focus()
  } else {
    gsap.to(root.value, { autoAlpha: 0, duration: 0.2, onComplete: () => { gsap.set(root.value, { display: 'none' }); popup.value = null } })
  }
})
</script>

<template>
  <div ref="root" class="con">
    <div class="backdrop" @click="emit('close')" />
    <div class="panel">
      <svg class="bgsvg" viewBox="0 0 522 479" preserveAspectRatio="none">
        <path d="M0 0H522V479H0V300L12 290V190L0 180Z" fill="#000" stroke="#333" vector-effect="non-scaling-stroke" />
      </svg>
      <div class="cont">
        <header>
          <small>Session 0x4F2A</small>
          <span class="title">&gt;_ Terminal</span>
          <i class="bar" />
          <button aria-label="Close console" @click="emit('close')">✕</button>
        </header>
        <div ref="log" class="log"><p v-for="(l, i) in out" :key="i">{{ l }}</p></div>
        <ul class="cmds"><li v-for="c in commands" :key="c.cmd"><button @click="run(c.cmd)">{{ c.cmd }}</button></li></ul>
        <label class="in" @click="inp.focus()">
          <b>&gt;_</b>
          <span class="fake">{{ typed }}<i class="caret" /><u v-if="!typed">type a command</u></span>
          <input ref="inp" v-model="typed" @keydown.enter="run(typed)" autocomplete="off" spellcheck="false" />
          <kbd>Enter</kbd>
        </label>
      </div>
    </div>
    <div v-if="popup" class="pop">
      <header><span>{{ popup.cmd }}</span><button @click="popup = null">✕</button></header>
      <p>{{ popup.text }}</p>
    </div>
  </div>
</template>

<style scoped>
.con{position:fixed;inset:0;z-index:90;display:none}
.backdrop{position:absolute;inset:0;background:rgba(0,0,0,.72)}
.panel{position:absolute;left:7rem;bottom:3rem;width:52rem;aspect-ratio:522/479}
.bgsvg{position:absolute;inset:0;width:100%;height:100%}
.cont{position:absolute;inset:0;padding:1.6rem 1.8rem 1.6rem 2.4rem;display:flex;flex-direction:column;gap:1rem}
header{display:flex;align-items:center;gap:1rem;justify-content:space-between}
small{opacity:.5}.title{border:1px solid #fff;padding:.3rem .8rem}
.bar{flex:1;height:1.2rem;background:repeating-linear-gradient(90deg,#fff 0 1px,transparent 1px 3px,#fff 3px 5px,transparent 5px 6px);opacity:.6}
.log{flex:1;overflow:auto;opacity:.85}.log p{margin:.3rem 0}
.cmds{list-style:none;margin:0;padding:0;border:1px solid var(--divider);display:flex;flex-wrap:wrap}
.cmds li{border-right:1px solid var(--divider)}.cmds button{padding:.8rem 1.2rem}.cmds button:hover{background:var(--lime);color:#000}
.in{position:relative;display:flex;align-items:center;gap:1rem;border:1px solid var(--divider);padding:.8rem 1rem}
.fake{flex:1;display:flex;align-items:center}.fake u{opacity:.5;text-decoration:none;margin-left:.4rem}
.caret{width:.7rem;height:1.2rem;background:#fff;animation:blink 1s steps(2) infinite}
@keyframes blink{50%{opacity:0}}
.in input{position:absolute;inset:0;width:100%;opacity:.01;border:0;background:none;color:#fff}
kbd{background:#fff;color:#000;padding:.2rem .7rem;font-family:inherit}
.pop{position:absolute;left:62rem;bottom:8rem;width:44rem;background:#000;border:1px solid var(--peri);color:var(--peri)}
.pop header{padding:.8rem 1.2rem;border-bottom:1px solid var(--peri)}.pop p{padding:1.4rem 1.2rem;margin:0;line-height:1.5}
@media(max-width:767px){.panel{left:1.2rem;right:1.2rem;width:auto;bottom:1.2rem}.pop{left:1.2rem;right:1.2rem;width:auto;bottom:auto;top:8rem}}
</style>
