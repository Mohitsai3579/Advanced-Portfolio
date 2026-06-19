"use client"

import { useEffect, useRef, useState } from "react"

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  const [isHovered, setIsHovered] = useState(false)
  const [hoveredEl, setHoveredEl] = useState<HTMLElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Track coordinates
  const mouse = useRef({ x: 0, y: 0 })
  const dot = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0, w: 40, h: 40, r: "50%" })
  const prevRing = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // Hide the cursor globally on desktop
    const style = document.createElement("style")
    style.innerHTML = `
      @media (min-width: 768px) {
        body, a, button, input, textarea, select, [role="button"] {
          cursor: none !important;
        }
      }
    `
    document.head.appendChild(style)

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    const handleMouseEnter = () => {
      setIsVisible(true)
    }

    // Dynamic sniffer for clickable elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const interactive = target.closest("a, button, [role='button'], [data-cursor='magnetic'], input, textarea") as HTMLElement
      
      if (interactive) {
        setIsHovered(true)
        setHoveredEl(interactive)
      }
    }

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const interactive = target.closest("a, button, [role='button'], [data-cursor='magnetic'], input, textarea") as HTMLElement
      
      if (interactive) {
        setIsHovered(false)
        setHoveredEl(null)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseenter", handleMouseEnter)
    window.addEventListener("mouseover", handleMouseOver)
    window.addEventListener("mouseout", handleMouseOut)

    // Animation Loop
    let animationFrameId: number

    const updateCoordinates = () => {
      if (!dotRef.current || !ringRef.current) {
        animationFrameId = requestAnimationFrame(updateCoordinates)
        return
      }

      // 1. Update Core Dot immediately
      dot.current.x += (mouse.current.x - dot.current.x) * 0.4
      dot.current.y += (mouse.current.y - dot.current.y) * 0.4
      dotRef.current.style.transform = `translate3d(${dot.current.x}px, ${dot.current.y}px, 0)`

      // 2. Update Ring Follower coordinates
      let targetX = mouse.current.x
      let targetY = mouse.current.y
      let targetW = 40
      let targetH = 40
      let targetRadius = "50%"

      // If hovering over an interactive item, snap and wrap it
      if (isHovered && hoveredEl) {
        const rect = hoveredEl.getBoundingClientRect()
        targetX = rect.left + rect.width / 2
        targetY = rect.top + rect.height / 2
        targetW = rect.width + 16
        targetH = rect.height + 16
        
        // Snatch border radius
        const computedStyle = window.getComputedStyle(hoveredEl)
        targetRadius = computedStyle.borderRadius !== "0px" ? computedStyle.borderRadius : "6px"
      }

      // Spring physics (damped interpolation)
      const easeSpeed = isHovered ? 0.22 : 0.12
      ring.current.x += (targetX - ring.current.x) * easeSpeed
      ring.current.y += (targetY - ring.current.y) * easeSpeed
      ring.current.w += (targetW - ring.current.w) * 0.2
      ring.current.h += (targetH - ring.current.h) * 0.2
      
      // Calculate velocity for 3D squash & stretch tilt (only when not snapped)
      const vx = ring.current.x - prevRing.current.x
      const vy = ring.current.y - prevRing.current.y
      const speed = Math.sqrt(vx * vx + vy * vy)
      
      prevRing.current.x = ring.current.x
      prevRing.current.y = ring.current.y

      let transformStr = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%)`
      
      if (!isHovered && speed > 0.5) {
        // Calculate stretch and angle
        const stretch = Math.min(1.35, 1 + speed * 0.05)
        const squeeze = 1 / stretch
        const angle = Math.atan2(vy, vx)
        
        // Apply 3D matrix-like rotation and skew stretching
        transformStr += ` rotate(${angle}rad) scale(${stretch}, ${squeeze}) rotate(${-angle}rad)`
      }

      // Apply transformations to elements
      ringRef.current.style.transform = transformStr
      ringRef.current.style.width = `${ring.current.w}px`
      ringRef.current.style.height = `${ring.current.h}px`
      ringRef.current.style.borderRadius = targetRadius

      // If hovering, show a snapping border theme, otherwise default cyan ring
      if (isHovered) {
        ringRef.current.style.borderColor = "var(--primary, #a855f7)"
        ringRef.current.style.boxShadow = "0 0 15px rgba(168, 85, 247, 0.4)"
        ringRef.current.style.backgroundColor = "rgba(168, 85, 247, 0.04)"
      } else {
        ringRef.current.style.borderColor = "#06b6d4" // cyan-500
        ringRef.current.style.boxShadow = "0 0 8px rgba(6, 182, 212, 0.15)"
        ringRef.current.style.backgroundColor = "transparent"
      }

      animationFrameId = requestAnimationFrame(updateCoordinates)
    }

    updateCoordinates()

    return () => {
      style.remove()
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseenter", handleMouseEnter)
      window.removeEventListener("mouseover", handleMouseOver)
      window.removeEventListener("mouseout", handleMouseOut)
    }
  }, [isHovered, hoveredEl, isVisible])

  if (!isVisible) return null

  return (
    <>
      {/* 3D Cursor core dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 bg-cyan-400 rounded-full pointer-events-none z-50 mix-blend-screen shadow-[0_0_10px_#22d3ee] transition-opacity duration-300 hidden md:block"
      />
      {/* 3D Cursor outer elastic snapping ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 border border-cyan-500 pointer-events-none z-50 transition-colors duration-300 ease-out hidden md:block"
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          transform: "translate3d(0, 0, 0) translate(-50%, -50%)"
        }}
      />
    </>
  )
}
