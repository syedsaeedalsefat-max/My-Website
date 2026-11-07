import { useEffect, useState } from 'react'

export interface DeviceProfile {
  isMobile: boolean
  isTouch: boolean
}

function detectDevice(): DeviceProfile {
  if (typeof window === 'undefined') {
    return { isMobile: false, isTouch: false }
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
  return { isMobile, isTouch }
}

/**
 * Detects whether the visitor is on a smartphone / touch device vs desktop PC,
 * sets `<html data-device="mobile|desktop">` so CSS can optimize GPU layers,
 * and returns reactive flags so components can adapt layout and animations.
 */
export function useDevice(): DeviceProfile {
  const [device, setDevice] = useState<DeviceProfile>(detectDevice)

  useEffect(() => {
    const update = () => {
      const next = detectDevice()
      document.documentElement.dataset.device = next.isMobile ? 'mobile' : 'desktop'
      setDevice((prev) =>
        prev.isMobile === next.isMobile && prev.isTouch === next.isTouch ? prev : next,
      )
    }
    update()
    window.addEventListener('resize', update, { passive: true })
    return () => window.removeEventListener('resize', update)
  }, [])

  return device
}
