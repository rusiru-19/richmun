import { ref } from 'vue'
import gsap from 'gsap'

// Background music + hover blips. Browsers only allow sound after a click, so enableAudio()
// is called from the preloader's "Enter with sound" button.
const MUSIC_URL = '/audio/theme.wav'     // ← replace with your own track (mp3/ogg/wav) in /public/audio
const VOLUME = 0.5

export const muted = ref(true)
let ctx, music
const fade = { v: 0 }

const ensureCtx = () => {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
}
const ensureMusic = () => {
  if (!music) { music = new Audio(MUSIC_URL); music.loop = true; music.preload = 'auto'; music.volume = 0 }
  return music
}
let fadeTween
const fadeTo = (target, dur, done) => {
  fadeTween?.kill()
  fadeTween = gsap.to(fade, { v: target, duration: dur, ease: 'power1.out',
    onUpdate: () => { if (music) music.volume = fade.v }, onComplete: done })
}

export const preloadMusic = () => ensureMusic()          // start buffering while the loader runs

export function enableAudio() {                          // must run inside a click handler
  ensureCtx(); muted.value = false
  ensureMusic().play().catch((e) => console.warn('Music could not start:', e.message))
  fadeTo(VOLUME, 2.5)
}
export function disableAudio() {
  muted.value = true
  fadeTo(0, 0.6, () => music?.pause())
}
export const toggleAudio = () => (muted.value ? enableAudio() : disableAudio())

// pause when the tab is hidden, resume when it is back
document.addEventListener('visibilitychange', () => {
  if (!music || muted.value) return
  document.hidden ? music.pause() : music.play().catch(() => {})
})

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
