import { useEffect } from 'react'
import { gsap } from 'gsap'

// ScrollTrigger is optional; register when available (browser)
let ScrollRegistered = false
async function registerScroll() {
  if (typeof window === 'undefined') return
  if (ScrollRegistered) return
  try {
    const mod = await import('gsap/ScrollTrigger')
    gsap.registerPlugin(mod.ScrollTrigger)
    ScrollRegistered = true
  } catch (e) {
    // ignore if not available
  }
}

export function useGsapFadeIn(ref, opts = {}) {
  const { delay = 0, duration = 0.9, y = 16, stagger = 0.1 } = opts

  useEffect(() => {
    if (!ref || !ref.current) return
    let mounted = true
    registerScroll()

    const nodes = ref.current.querySelectorAll('.gsap-item')
    if (!nodes || nodes.length === 0) {
      // animate the container itself
      const t = gsap.fromTo(
        ref.current,
        { y, opacity: 0 },
        { y: 0, opacity: 1, duration, delay, ease: 'power3.out' }
      )
      return () => {
        try {
          mounted = false
          t && t.kill()
        } catch (e) {}
      }
    }

    const tween = gsap.fromTo(
      nodes,
      { y, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration,
        delay,
        stagger,
        ease: 'power3.out',
        scrollTrigger: ScrollRegistered
          ? { trigger: ref.current, start: 'top 85%', toggleActions: 'play none none reverse' }
          : undefined,
      }
    )

    return () => {
      try {
        mounted = false
        tween && tween.kill()
      } catch (e) {}
    }
  }, [ref, delay, duration, y, stagger])
}

export function useGsapSlideIn(ref, opts = {}) {
  const { delay = 0, duration = 0.85, x = -24 } = opts
  useEffect(() => {
    if (!ref || !ref.current) return
    let mounted = true
    registerScroll()
    const tween = gsap.fromTo(
      ref.current,
      { x, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration,
        delay,
        ease: 'power3.out',
        scrollTrigger: ScrollRegistered
          ? { trigger: ref.current, start: 'top 90%', toggleActions: 'play none none reverse' }
          : undefined,
      }
    )

    return () => {
      try {
        mounted = false
        tween && tween.kill()
      } catch (e) {}
    }
  }, [ref, delay, duration, x])
}

export default null
