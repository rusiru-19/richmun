// Scales the whole site with viewport width. Everything is sized in rem.
export function useScale() {
  const apply = () => {
    const w = window.innerWidth
    const mobile = w < 768
    const raw = w / (mobile ? 375 : 1600)
    const s = Math.min(Math.max(raw, mobile ? 0.85 : 0.64), mobile ? 2.73 : 1.2)
    document.documentElement.style.fontSize = s * 10 + 'px'
  }
  apply()
  window.addEventListener('resize', apply)
}
