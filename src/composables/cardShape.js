// Card silhouette from the reference: rounded corners + a stepped notch on the left edge.
// k = 0 → plain full-screen rectangle, k = 1 → full card shape (so it can be tweened).
export function cardPath(w, h, k = 1) {
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
  const r = 2.4 * rem * k        // corner radius
  const d = 2.6 * rem * k        // how far the upper part is inset from the left
  const c = 1.6 * rem * k        // height of the diagonal step
  const sy = h * 0.38            // where the step sits on the left edge
  return `M${d + r} 0 H${w - r} Q${w} 0 ${w} ${r} V${h - r} Q${w} ${h} ${w - r} ${h} ` +
         `H${r} Q0 ${h} 0 ${h - r} V${sy + c} L${d} ${sy} V${r} Q${d} 0 ${d + r} 0 Z`
}
