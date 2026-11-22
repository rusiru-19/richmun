import gsap from 'gsap'
const GLYPHS = '!<>-_\\/[]{}=+*^?#0123456789'

// Characters cycle random glyphs, resolving left -> right.
export function scramble(el, text, duration = 0.6) {
  const state = { p: 0 }
  return gsap.to(state, {
    p: 1, duration, ease: 'none',
    onUpdate() {
      const k = Math.floor(state.p * text.length)
      let out = text.slice(0, k)
      for (let i = k; i < text.length; i++)
        out += text[i] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0]
      el.textContent = out
    },
    onComplete() { el.textContent = text }
  })
}
