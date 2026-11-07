import { useEffect, useState } from 'react'

export interface DeviceProfile {
  isMobile: boolean
  isTouch: boolean
  /** viewport is taller than wide (phones in portrait) */
  isPortrait: boolean
  /** weak phone / data saver / reduced motion: use the lightest effects */
  isLowPower: boolean
}

function detectDevice(): DeviceProfile {
  if (typeof window === 'undefined') {
    return { isMobile: false, isTouch: false, isPortrait: false, isLowPower: false }
  }
  const isTouch =
    window.matchMedia('(pointer: coarse)').matches ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0
  const isSmallScreen = window.matchMedia('(max-width: 768px)').matches
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  )
  const isMobile = isSmallScreen || (isTouch && isMobileUA)
  const isPortrait = window.innerHeight > window.innerWidth

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nav = navigator as any
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const saveData = !!nav.connection?.saveData
  const weakCpu = typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4
  const weakRam = typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 2
  const isLowPower = reducedMotion || saveData || (isMobile && (weakCpu || weakRam))

  return { isMobile, isTouch, isPortrait, isLowPower }
}

/**
 * Detects whether the visitor is on a smartphone / touch device vs desktop PC,
 * sets `<html data-device="mobile|desktop" data-orientation="portrait|landscape">` so CSS can
 * optimize GPU layers, and returns reactive flags so components can adapt layout and animations.
 */
export function useDevice(): DeviceProfile {
  const [device, setDevice] = useState<DeviceProfile>(detectDevice)

  useEffect(() => {
    const update = () => {
      const next = detectDevice()
      const root = document.documentElement
      root.dataset.device = next.isMobile ? 'mobile' : 'desktop'
      root.dataset.orientation = next.isPortrait ? 'portrait' : 'landscape'
      root.dataset.power = next.isLowPower ? 'low' : 'normal'
      setDevice((prev) =>
        prev.isMobile === next.isMobile &&
        prev.isTouch === next.isTouch &&
        prev.isPortrait === next.isPortrait &&
        prev.isLowPower === next.isLowPower
          ? prev
          : next,
      )
    }
    update()
    window.addEventListener('resize', update, { passive: true })
    window.addEventListener('orientationchange', update, { passive: true })
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])

  return device
}
