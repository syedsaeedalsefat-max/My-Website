import { useEffect, useRef } from 'react'
import { useDevice } from '../utils/useDevice'

type Token = { text: string; color: string }
type CodeLine = { indent: number; tokens: Token[] }

const C = {
  green: '#22ff77',
  cyan: '#00e5ff',
  blue: '#38bdf8',
  pink: '#ff2a85',
  purple: '#a855f7',
  white: '#f1f5f9',
}

// Dense C++ & Cyber Security code blocks matching the reference video
const CODE_SNIPPETS: CodeLine[][] = [
  [
    { indent: 0, tokens: [{ text: '//When we know objectPtr is of type MyClass *', color: C.green }] },
    {
      indent: 0,
      tokens: [
        { text: 'MyClass ', color: C.blue },
        { text: '*myClass = ', color: C.white },
        { text: 'dynamic_cast', color: C.cyan },
        { text: '<MyClass*>(objectPtr);', color: C.white },
      ],
    },
    {
      indent: 0,
      tokens: [
        { text: 'if', color: C.pink },
        { text: '(myClass != ', color: C.white },
        { text: 'NULL', color: C.cyan },
        { text: ')', color: C.white },
      ],
    },
    { indent: 1, tokens: [{ text: 'myClass->', color: C.white }, { text: 'myFunc', color: C.pink }, { text: '();', color: C.white }] },
    { indent: 0, tokens: [] },
    {
      indent: 0,
      tokens: [
        { text: 'MyClassChild ', color: C.blue },
        { text: 'myClass;', color: C.white },
      ],
    },
    {
      indent: 0,
      tokens: [
        { text: 'MyClassChild ', color: C.blue },
        { text: '*myClassChild = &myClass;', color: C.white },
      ],
    },
    {
      indent: 0,
      tokens: [
        { text: 'MyClass ', color: C.blue },
        { text: '*objectPtr = ', color: C.white },
        { text: 'dynamic_cast', color: C.cyan },
        { text: '<MyClass*>(myClassChild);', color: C.white },
      ],
    },
  ],
  [
    {
      indent: 0,
      tokens: [
        { text: 'class ', color: C.cyan },
        { text: 'person', color: C.green },
      ],
    },
    { indent: 0, tokens: [{ text: '{', color: C.white }] },
    {
      indent: 1,
      tokens: [
        { text: 'char ', color: C.cyan },
        { text: 'name[', color: C.white },
        { text: '20', color: C.pink },
        { text: '];', color: C.white },
      ],
    },
    {
      indent: 1,
      tokens: [
        { text: 'int ', color: C.cyan },
        { text: 'id;', color: C.white },
      ],
    },
    { indent: 0, tokens: [{ text: 'public:', color: C.cyan }] },
    {
      indent: 1,
      tokens: [
        { text: 'void ', color: C.blue },
        { text: 'getdetails', color: C.pink },
        { text: '(){}', color: C.white },
      ],
    },
    { indent: 0, tokens: [{ text: '};', color: C.white }] },
    { indent: 0, tokens: [] },
    {
      indent: 0,
      tokens: [
        { text: 'int ', color: C.blue },
        { text: 'main', color: C.pink },
        { text: '()', color: C.white },
      ],
    },
    { indent: 0, tokens: [{ text: '{', color: C.white }] },
    {
      indent: 1,
      tokens: [
        { text: 'person p1; ', color: C.white },
        { text: '//p1 is an object', color: C.green },
      ],
    },
    {
      indent: 1,
      tokens: [
        { text: 'return ', color: C.pink },
        { text: '0;', color: C.cyan },
      ],
    },
    { indent: 0, tokens: [{ text: '}', color: C.white }] },
  ],
  [
    { indent: 0, tokens: [{ text: '#include <iostream>', color: C.green }] },
    {
      indent: 0,
      tokens: [
        { text: 'using namespace ', color: C.cyan },
        { text: 'std;', color: C.white },
      ],
    },
    { indent: 0, tokens: [] },
    {
      indent: 0,
      tokens: [
        { text: 'int ', color: C.blue },
        { text: 'main', color: C.pink },
        { text: '()', color: C.white },
      ],
    },
    { indent: 0, tokens: [{ text: '{', color: C.white }] },
    {
      indent: 1,
      tokens: [
        { text: 'int ', color: C.cyan },
        { text: 'a = 3, b = 4;', color: C.white },
      ],
    },
    { indent: 1, tokens: [{ text: '// INCREMENT', color: C.green }] },
    {
      indent: 1,
      tokens: [
        { text: 'cout ', color: C.cyan },
        { text: '<< "Value of a1 is PRE INCREMENTED : " << ++a << "\\n";', color: C.white },
      ],
    },
    {
      indent: 1,
      tokens: [
        { text: 'cout ', color: C.cyan },
        { text: '<< "Value of a1 is POST INCREMENTED : " << b++ << "\\n";', color: C.white },
      ],
    },
    {
      indent: 1,
      tokens: [
        { text: 'cout ', color: C.cyan },
        { text: '<< "Value of a1 is changed after using once : " << b << "\\n";', color: C.white },
      ],
    },
    { indent: 0, tokens: [{ text: '}', color: C.white }] },
  ],
  [
    { indent: 0, tokens: [{ text: '#include <stdio.h>', color: C.green }] },
    {
      indent: 0,
      tokens: [
        { text: 'void ', color: C.blue },
        { text: 'func1', color: C.pink },
        { text: '()', color: C.white },
      ],
    },
    { indent: 0, tokens: [{ text: '{', color: C.white }] },
    {
      indent: 1,
      tokens: [
        { text: 'printf', color: C.pink },
        { text: '("Inside func1()\\n");', color: C.green },
      ],
    },
    { indent: 0, tokens: [{ text: '}', color: C.white }] },
    {
      indent: 0,
      tokens: [
        { text: 'void ', color: C.blue },
        { text: 'func2', color: C.pink },
        { text: '()', color: C.white },
      ],
    },
    { indent: 0, tokens: [{ text: '{', color: C.white }] },
    {
      indent: 1,
      tokens: [
        { text: 'printf', color: C.pink },
        { text: '("Inside func2()\\n");', color: C.green },
      ],
    },
    { indent: 0, tokens: [{ text: '}', color: C.white }] },
  ],
  [
    { indent: 0, tokens: [{ text: '// assigning a new value to a', color: C.green }] },
    { indent: 0, tokens: [{ text: 'a = 5, b = 5;', color: C.white }] },
    { indent: 0, tokens: [{ text: '// DECREMENT', color: C.green }] },
    {
      indent: 0,
      tokens: [
        { text: 'cout ', color: C.cyan },
        { text: '<< "Value of a1 is PRE DECREMENTED : " << --a << "\\n";', color: C.white },
      ],
    },
    {
      indent: 0,
      tokens: [
        { text: 'cout ', color: C.cyan },
        { text: '<< "Value of a1 is POST DECREMENTED : " << b-- << "\\n";', color: C.white },
      ],
    },
    {
      indent: 0,
      tokens: [
        { text: 'cout ', color: C.cyan },
        { text: '<< a + b << "\\n"; ', color: C.white },
        { text: '//Add', color: C.green },
      ],
    },
    {
      indent: 0,
      tokens: [
        { text: 'cout ', color: C.cyan },
        { text: '<< a - b << "\\n"; ', color: C.white },
        { text: '//Subtract', color: C.green },
      ],
    },
    {
      indent: 0,
      tokens: [
        { text: 'cout ', color: C.cyan },
        { text: '<< a * b << "\\n"; ', color: C.white },
        { text: '//Multiply', color: C.green },
      ],
    },
  ],
  [
    {
      indent: 0,
      tokens: [
        { text: 'void ', color: C.blue },
        { text: 'myFunc', color: C.pink },
        { text: '(int intVal, float realVal)', color: C.white },
      ],
    },
    { indent: 0, tokens: [{ text: '{', color: C.white }] },
    {
      indent: 1,
      tokens: [
        { text: 'std::cout ', color: C.cyan },
        { text: '<< intVal << ', color: C.white },
        { text: 'std::endl;', color: C.cyan },
      ],
    },
    {
      indent: 1,
      tokens: [
        { text: 'std::cout ', color: C.cyan },
        { text: '<< realVal << ', color: C.white },
        { text: 'std::endl;', color: C.cyan },
      ],
    },
    {
      indent: 1,
      tokens: [
        { text: '/* constructor */ ', color: C.green },
        { text: 'MyClass();', color: C.white },
      ],
    },
    {
      indent: 1,
      tokens: [
        { text: '/* destructor */  ', color: C.green },
        { text: '~MyClass();', color: C.white },
      ],
    },
    { indent: 0, tokens: [{ text: '}', color: C.white }] },
  ],
  [
    { indent: 0, tokens: [{ text: '#include <openssl/evp.h>', color: C.green }] },
    {
      indent: 0,
      tokens: [
        { text: 'int ', color: C.blue },
        { text: 'verify_signature', color: C.pink },
        { text: '(const uint8_t *payload, size_t len)', color: C.white },
      ],
    },
    { indent: 0, tokens: [{ text: '{', color: C.white }] },
    {
      indent: 1,
      tokens: [
        { text: 'if ', color: C.pink },
        { text: '(!check_digest(payload, len))', color: C.white },
      ],
    },
    {
      indent: 2,
      tokens: [
        { text: 'return ', color: C.pink },
        { text: 'ERR_UNAUTHORIZED;', color: C.cyan },
      ],
    },
    {
      indent: 1,
      tokens: [
        { text: 'cout ', color: C.cyan },
        { text: '<< "[SEC] Frame integrity verified\\n";', color: C.white },
      ],
    },
    {
      indent: 1,
      tokens: [
        { text: 'return ', color: C.pink },
        { text: '0;', color: C.green },
      ],
    },
    { indent: 0, tokens: [{ text: '}', color: C.white }] },
  ],
  [
    {
      indent: 0,
      tokens: [
        { text: 'MyClass ', color: C.blue },
        { text: '*constCastTest = ', color: C.white },
        { text: 'const_cast', color: C.cyan },
        { text: '<MyClass*>(constMyClass);', color: C.white },
      ],
    },
    {
      indent: 0,
      tokens: [
        { text: 'constCastTest->', color: C.white },
        { text: 'myFunc', color: C.pink },
        { text: '();', color: C.white },
      ],
    },
    {
      indent: 0,
      tokens: [
        { text: 'int ', color: C.cyan },
        { text: 'counter, howmuch;', color: C.white },
      ],
    },
    {
      indent: 0,
      tokens: [
        { text: 'cin ', color: C.pink },
        { text: '>> howmuch;', color: C.white },
      ],
    },
    {
      indent: 0,
      tokens: [
        { text: 'while ', color: C.pink },
        { text: '(counter < howmuch) counter++;', color: C.white },
      ],
    },
  ],
]

type Sprite = {
  canvas: HTMLCanvasElement
  w: number
  h: number
}

/** Pre-render a code block into an offscreen canvas at a specific scale & depth blur. */
function createCodeSprite(
  lines: CodeLine[],
  scale: number,
  blurPx: number,
  opacity: number,
  dpr: number,
): Sprite {
  const canvas = document.createElement('canvas')
  const pad = Math.ceil(blurPx * 3 + 14)
  const fontSize = Math.round(13.5 * scale)
  const lineHeight = Math.round(20 * scale)
  const cssW = Math.round(490 * scale) + pad * 2
  const cssH = lines.length * lineHeight + pad * 2

  canvas.width = Math.ceil(cssW * dpr)
  canvas.height = Math.ceil(cssH * dpr)
  const ctx = canvas.getContext('2d')
  if (!ctx) return { canvas, w: cssW, h: cssH }

  ctx.save()
  ctx.scale(dpr, dpr)
  if (blurPx > 0) {
    ctx.filter = `blur(${blurPx}px)`
  }
  ctx.globalAlpha = opacity
  ctx.font = `600 ${fontSize}px "JetBrains Mono", Consolas, monospace`
  ctx.textBaseline = 'top'

  lines.forEach((line, idx) => {
    let x = pad + line.indent * Math.round(20 * scale)
    const y = pad + idx * lineHeight

    line.tokens.forEach((tok) => {
      ctx.fillStyle = tok.color
      ctx.shadowColor = tok.color
      ctx.shadowBlur = blurPx === 0 ? 7 : 3
      ctx.fillText(tok.text, x, y)
      x += ctx.measureText(tok.text).width
    })
  })

  ctx.restore()
  return { canvas, w: cssW, h: cssH }
}

/** Pre-render a deep background blurred bokeh code-streak cluster (simulating distant code blocks). */
function createBokehCluster(seed: number, dpr: number): Sprite {
  const canvas = document.createElement('canvas')
  const cssW = 360
  const cssH = 230
  canvas.width = Math.ceil(cssW * dpr)
  canvas.height = Math.ceil(cssH * dpr)
  const ctx = canvas.getContext('2d')
  if (!ctx) return { canvas, w: cssW, h: cssH }

  const palette = [C.blue, C.cyan, C.green, C.pink, C.purple, C.white]
  let s = seed * 9301 + 49297
  const rand = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }

  ctx.save()
  ctx.scale(dpr, dpr)
  ctx.filter = 'blur(3.2px)'
  for (let row = 0; row < 12; row++) {
    const y = 14 + row * 16
    let x = 16 + Math.floor(rand() * 3) * 16
    const segments = 2 + Math.floor(rand() * 4)
    for (let seg = 0; seg < segments; seg++) {
      const w = 18 + rand() * 64
      const color = palette[Math.floor(rand() * palette.length)]
      ctx.fillStyle = color
      ctx.globalAlpha = 0.25 + rand() * 0.42
      ctx.fillRect(x, y, w, 4.5)
      x += w + 8 + rand() * 14
      if (x > 330) break
    }
  }
  ctx.restore()
  return { canvas, w: cssW, h: cssH }
}

type FloatingNode = {
  sprite: Sprite
  x: number
  y: number
  vx: number
  vy: number
  spanW: number
  spanH: number
}

/**
 * 3D Multi-Depth Cyber Code Background Video Engine.
 * Recreates the exact dark navy/indigo depth-of-field C++ & Cyber code animation from the reference video.
 */
export default function CyberCodeBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { isMobile, isLowPower } = useDevice()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    let rafId = 0
    let width = window.innerWidth
    let height = window.innerHeight
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.0 : 1.5)

    // Pre-build sprites once so the animation loop only does fast GPU drawImage calls
    const bokehSprites = [1, 2, 3, 4].map((seed) => createBokehCluster(seed, dpr))
    const farSprites = CODE_SNIPPETS.map((s) =>
      createCodeSprite(s, isMobile ? 0.54 : 0.68, isMobile ? 1.5 : 2.6, 0.48, dpr),
    )
    const midSprites = CODE_SNIPPETS.map((s) =>
      createCodeSprite(s, isMobile ? 0.70 : 0.88, isMobile ? 0.6 : 1.0, 0.75, dpr),
    )
    const nearSprites = CODE_SNIPPETS.map((s) =>
      createCodeSprite(s, isMobile ? 0.85 : 1.05, 0, 0.98, dpr),
    )

    let nodes: FloatingNode[] = []

    const buildScene = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      nodes = []
      const spanW = Math.max(width * 1.35, 750)
      const spanH = Math.max(height * 1.3, 680)

      // Layer 0: Dense bokeh code streaks in the deep background (trimmed on phones for butter-smooth 60fps)
      const bokehCount = isLowPower ? 6 : isMobile ? 10 : 24
      for (let i = 0; i < bokehCount; i++) {
        const sprite = bokehSprites[i % bokehSprites.length]
        nodes.push({
          sprite,
          x: ((i * 211) % spanW) - 140,
          y: ((i * 137) % spanH) - 100,
          vx: -(14 + (i % 4) * 3),
          vy: -1.8,
          spanW,
          spanH,
        })
      }

      // Layer 1: Far blurred code blocks
      const farCount = isLowPower ? 4 : isMobile ? 6 : 12
      for (let i = 0; i < farCount; i++) {
        const sprite = farSprites[i % farSprites.length]
        nodes.push({
          sprite,
          x: (i / farCount) * spanW - 160,
          y: ((i * 193) % spanH) - 110,
          vx: -(24 + (i % 3) * 4),
          vy: -3.2,
          spanW,
          spanH,
        })
      }

      // Layer 2: Mid-depth soft-focus code blocks
      const midCount = isLowPower ? 3 : isMobile ? 5 : 9
      for (let i = 0; i < midCount; i++) {
        const sprite = midSprites[(i + 3) % midSprites.length]
        nodes.push({
          sprite,
          x: (i / midCount) * spanW - 180,
          y: ((i * 251 + 60) % spanH) - 100,
          vx: -(38 + (i % 3) * 5),
          vy: -4.8,
          spanW,
          spanH,
        })
      }

      // Layer 3: Sharp foreground syntax-highlighted code blocks
      const nearCount = isLowPower ? 3 : isMobile ? 4 : 7
      for (let i = 0; i < nearCount; i++) {
        const sprite = nearSprites[i % nearSprites.length]
        nodes.push({
          sprite,
          x: (i / nearCount) * spanW - 150,
          y: ((i * 179 + 30) % spanH) - 80,
          vx: -(54 + (i % 3) * 6),
          vy: -6.2,
          spanW,
          spanH,
        })
      }
    }

    buildScene()
    window.addEventListener('resize', buildScene)

    let lastTime = performance.now()

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now

      // Deep midnight navy/indigo gradient matching reference video
      const bgGrad = ctx.createLinearGradient(0, 0, width, height)
      bgGrad.addColorStop(0, '#040614')
      bgGrad.addColorStop(0.5, '#08102e')
      bgGrad.addColorStop(1, '#040717')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, width, height)

      const glowGrad = ctx.createRadialGradient(
        width * 0.62,
        height * 0.48,
        20,
        width * 0.62,
        height * 0.48,
        Math.max(width, height) * 0.65,
      )
      glowGrad.addColorStop(0, 'rgba(42, 76, 185, 0.36)')
      glowGrad.addColorStop(0.45, 'rgba(28, 42, 115, 0.2)')
      glowGrad.addColorStop(1, 'rgba(4, 6, 20, 0)')
      ctx.fillStyle = glowGrad
      ctx.fillRect(0, 0, width, height)

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        n.x += n.vx * dt
        n.y += n.vy * dt

        if (n.x + n.sprite.w < -120) {
          n.x += n.spanW + 120
        }
        if (n.y + n.sprite.h < -120) {
          n.y += n.spanH + 120
        }

        // Only draw sprites that intersect the visible viewport
        if (
          n.x < width + 40 &&
          n.x + n.sprite.w > -40 &&
          n.y < height + 40 &&
          n.y + n.sprite.h > -40
        ) {
          ctx.drawImage(n.sprite.canvas, n.x, n.y, n.sprite.w, n.sprite.h)
        }
      }

      rafId = window.requestAnimationFrame(render)
    }

    rafId = window.requestAnimationFrame(render)

    return () => {
      window.cancelAnimationFrame(rafId)
      window.removeEventListener('resize', buildScene)
    }
  }, [isMobile, isLowPower])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    />
  )
}
