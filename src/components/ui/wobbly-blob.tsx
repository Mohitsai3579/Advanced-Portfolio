"use client"

import { useEffect, useRef } from "react"

interface WobblyBlobProps {
  className?: string
  baseRadius?: number
  speed?: number
  colorRange?: [number, number] // HSL hue range, e.g. [160, 280] for teal to purple
}

export function WobblyBlob({
  className = "",
  baseRadius = 180,
  speed = 1.0,
  colorRange = [160, 270] // Default cyan-teal to indigo-purple
}: WobblyBlobProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let width = 0
    let height = 0

    // Mouse state for interactive rotation and scaling
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      active: false,
      lastMoveTime: 0
    }

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      width = canvas.width = rect.width * window.devicePixelRatio
      height = canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    // Set up resize observer to adjust canvas dynamically
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas()
    })
    resizeObserver.observe(canvas)
    resizeCanvas()

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      // Calculate coordinates relative to canvas center (-1 to 1)
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      mouse.targetX = (e.clientX - centerX) / (rect.width / 2)
      mouse.targetY = (e.clientY - centerY) / (rect.height / 2)
      mouse.active = true
      mouse.lastMoveTime = Date.now()
    }

    const handleMouseLeave = () => {
      mouse.targetX = 0
      mouse.targetY = 0
      mouse.active = false
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)

    // Configuration parameters for the 3D sphere
    const latitudes = 28 // Number of horizontal rings
    const longitudes = 56 // Points per ring
    let time = 0

    // Main animation loop
    const animate = () => {
      // Clear the canvas
      const displayWidth = width / window.devicePixelRatio
      const displayHeight = height / window.devicePixelRatio
      ctx.clearRect(0, 0, displayWidth, displayHeight)

      // Smoothly interpolate mouse positions (spring easing)
      mouse.x += (mouse.targetX - mouse.x) * 0.06
      mouse.y += (mouse.targetY - mouse.y) * 0.06

      // Increment time for waves/rotations
      time += 0.012 * speed

      // Slowly return target to 0 if mouse goes idle (unhovered / no activity)
      if (mouse.active && Date.now() - mouse.lastMoveTime > 3000) {
        mouse.targetX *= 0.98
        mouse.targetY *= 0.98
      }

        // Parallax position shift: entire blob shifts slightly to follow the cursor (attraction effect)
        const maxShift = 55
        const centerX = (displayWidth / 2) + Math.max(-1.5, Math.min(1.5, mouse.x)) * maxShift
        const centerY = (displayHeight / 2) + Math.max(-1.5, Math.min(1.5, mouse.y)) * maxShift

        // Adapt sphere base radius based on container size (mobile friendly)
        const adaptiveRadius = Math.min(baseRadius, Math.min(displayWidth, displayHeight) * 0.35)

        // 3D rotation angles: continuous base rotation + deeper cursor tilt
        const rotY = time * 0.12 + Math.max(-2, Math.min(2, mouse.x)) * 1.5
        const rotX = time * 0.06 + Math.max(-2, Math.min(2, mouse.y)) * 1.5

      const cosY = Math.cos(rotY)
      const sinY = Math.sin(rotY)
      const cosX = Math.cos(rotX)
      const sinX = Math.sin(rotX)

      // Camera focal length for projection
      const cameraDistance = 500

      // Grid data structure to hold projected coordinates
      const grid: Array<Array<{
        sx: number
        sy: number
        z2: number
        color: string
        size: number
        alpha: number
      }>> = []

      // Flat list of dots for depth sorting
      const dots: Array<{
        sx: number
        sy: number
        z2: number
        color: string
        size: number
        alpha: number
      }> = []

      // Generate points on the sphere and apply wobble noise
      for (let lat = 1; lat < latitudes; lat++) {
        const theta = (lat / latitudes) * Math.PI
        const sinTheta = Math.sin(theta)
        const cosTheta = Math.cos(theta)
        const ringPoints = []

        for (let lon = 0; lon <= longitudes; lon++) {
          const phi = (lon / longitudes) * 2 * Math.PI

          // Multi-harmonic wobbly noise (periodic in phi so it's seamless)
          const wave1 = Math.sin(theta * 3 + time * 1.5) * Math.cos(phi * 2 - time * 1.2) * 16
          const wave2 = Math.cos(theta * 5 - time * 2.2) * Math.sin(phi * 3 + time * 1.8) * 8
          const wave3 = Math.sin(theta * 1.5 + time * 0.8) * Math.cos(phi * 1 - time * 0.5) * 6
          const wave4 = Math.sin(time * 0.4) * 8 // subtle overall breathing

          // Extra liquid deformation pulling the sphere outward towards the cursor (magnetic attraction)
          let mouseDeform = 0
          if (mouse.active) {
            // 3D vector representing cursor direction (projected)
            const mouseAngleY = mouse.x * 1.3
            const mouseAngleX = mouse.y * 1.3
            const mx = Math.sin(mouseAngleY) * Math.cos(mouseAngleX)
            const my = Math.sin(mouseAngleX)
            const mz = Math.cos(mouseAngleY) * Math.cos(mouseAngleX)

            // 3D normal vector of the point on the sphere surface
            const nx = sinTheta * Math.cos(phi)
            const ny = cosTheta
            const nz = sinTheta * Math.sin(phi)

            // Dot product represents alignment with the cursor direction
            const alignment = nx * mx + ny * my + nz * mz
            if (alignment > 0.3) {
              const pullFactor = (alignment - 0.3) / 0.7
              mouseDeform = pullFactor * pullFactor * 32 * (1 + 0.25 * Math.sin(time * 4))
            }
          }

          const r = adaptiveRadius + wave1 + wave2 + wave3 + wave4 + mouseDeform

          // 3D Cartesian coordinates (Y-up)
          const x = r * sinTheta * Math.cos(phi)
          const y = r * cosTheta
          const z = r * sinTheta * Math.sin(phi)

          // 3D Rotation matrices
          // Rotate Y
          const x1 = x * cosY - z * sinY
          const z1 = x * sinY + z * cosY
          // Rotate X
          const y2 = y * cosX - z1 * sinX
          const z2 = y * sinX + z1 * cosX

          // 2D Perspective Projection
          const scale = cameraDistance / (cameraDistance + z2)
          const sx = centerX + x1 * scale
          const sy = centerY + y2 * scale

          // Depth maps to a 0.0 - 1.0 range (front to back)
          const maxExtent = adaptiveRadius + 40
          const depth = (z2 + maxExtent) / (2 * maxExtent)
          
          // Elements closer to the camera are larger and opaque
          const alpha = Math.max(0.04, Math.min(0.9, 0.85 - depth * 0.65))
          const size = Math.max(0.6, (1.2 + 2.0 * (1 - depth)) * scale)

          // Dynamic colors: shift hue across the sphere's rings and animate over time
          const hueBase = colorRange[0]
          const hueDelta = colorRange[1] - colorRange[0]
          const hue = (hueBase + (lat / latitudes) * hueDelta + Math.sin(phi + time) * 15) % 360
          const color = `hsla(${hue}, 85%, 55%, ${alpha})`

          const point = { sx, sy, z2, color, size, alpha }
          ringPoints.push(point)

          // Render dots selectively to prevent visual clutter (every 2nd point)
          if (lon % 2 === 0) {
            dots.push(point)
          }
        }
        grid.push(ringPoints)
      }

      // 1. Draw Ring Lines (concentric bands)
      ctx.shadowBlur = 0 // Optimization: Turn off shadow blur during bulk drawing
      for (let i = 0; i < grid.length; i++) {
        const ring = grid[i]
        ctx.beginPath()
        for (let j = 0; j < ring.length; j++) {
          const pt = ring[j]
          if (j === 0) ctx.moveTo(pt.sx, pt.sy)
          else ctx.lineTo(pt.sx, pt.sy)
        }
        ctx.closePath()

        // Ring colors blend across the gradient, with low line opacity for elegance
        const latRatio = i / grid.length
        const ringHue = colorRange[0] + latRatio * (colorRange[1] - colorRange[0])
        ctx.strokeStyle = `hsla(${ringHue}, 75%, 50%, 0.12)`
        ctx.lineWidth = 0.6
        ctx.stroke()
      }

      // 2. Depth Sort & Draw Particles (dots)
      dots.sort((a, b) => b.z2 - a.z2)

      dots.forEach((dot) => {
        // Draw the main particle core
        ctx.beginPath()
        ctx.arc(dot.sx, dot.sy, dot.size, 0, Math.PI * 2)
        ctx.fillStyle = dot.color
        ctx.fill()

        // For front-facing particles, add a secondary soft glowing backdrop
        if (dot.z2 < -20) {
          ctx.beginPath()
          ctx.arc(dot.sx, dot.sy, dot.size * 2.2, 0, Math.PI * 2)
          // Extract base hsla and lower the alpha for a soft glow
          const glowColor = dot.color.replace(/[\d.]+\)$/, `${dot.alpha * 0.22})`)
          ctx.fillStyle = glowColor
          ctx.fill()
        }
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      resizeObserver.disconnect()
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [baseRadius, speed, colorRange])

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full pointer-events-none ${className}`}
    />
  )
}
