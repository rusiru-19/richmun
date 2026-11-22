import { ref } from 'vue'
// Sound is off until the visitor opts in (browsers require a click anyway).
export const muted = ref(true)
let ctx

export function toggleAudio() {
  muted.value = !muted.value
  if (!muted.value && !ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
}
// tiny synthesized hover blip: no audio files needed
export function blip(freq = 1100) {
  if (muted.value || !ctx) return
  const o = ctx.createOscillator(), g = ctx.createGain()
  o.type = 'square'; o.frequency.value = freq; g.gain.value = 0.015
  o.connect(g).connect(ctx.destination)
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08)
  o.start(); o.stop(ctx.currentTime + 0.09)
}
export function initHoverSounds() {
  document.addEventListener('mouseover', (e) => { if (e.target.closest?.('a,button')) blip() })
}
