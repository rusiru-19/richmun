import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ref } from 'vue'

gsap.registerPlugin(ScrollTrigger)

export const scrollProgress = ref(0)
let lenis

export function initSmoothScroll() {
  lenis = new Lenis({ lerp: 0.085 })
  lenis.on('scroll', (e) => { ScrollTrigger.update(); scrollProgress.value = e.progress })
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  return lenis
}
export const stopScroll = () => lenis?.stop()
export const startScroll = () => lenis?.start()
export const scrollTo = (target) => lenis?.scrollTo(target, { duration: 1.6 })
export { gsap, ScrollTrigger }
