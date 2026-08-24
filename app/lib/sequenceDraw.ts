export const FALLBACK_FILL = '#12100E'

export function sizeCanvas(canvas: HTMLCanvasElement) {
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  const w = Math.max(1, Math.round(rect.width * dpr))
  const h = Math.max(1, Math.round(rect.height * dpr))
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w
    canvas.height = h
  }
  const ctx = canvas.getContext('2d')
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  return ctx
}

/** Cover-fit draw. Returns true only if a loaded image was painted. */
export function drawCover(canvas: HTMLCanvasElement, img: HTMLImageElement | null | undefined): boolean {
  const ctx = sizeCanvas(canvas)
  if (!ctx) return false
  const dpr = window.devicePixelRatio || 1
  const cw = canvas.width / dpr
  const ch = canvas.height / dpr
  ctx.fillStyle = FALLBACK_FILL
  ctx.fillRect(0, 0, cw, ch)
  if (!img || !img.complete || img.naturalWidth === 0) return false
  const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight) * 0.82
  const dw = img.naturalWidth * scale
  const dh = img.naturalHeight * scale
  ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh)
  return true
}

export function clamp01(n: number) {
  return Math.min(1, Math.max(0, n))
}

export function scrollProgress(el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  const denom = Math.max(1, el.offsetHeight - window.innerHeight)
  return clamp01(-rect.top / denom)
}
