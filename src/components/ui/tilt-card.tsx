"use client"

import React, { useRef, useState } from "react"

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  maxTilt?: number
  scale?: number
}

export function TiltCard({
  children,
  maxTilt = 15,
  scale = 1.02,
  className = "",
  ...props
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<React.CSSProperties>({
    transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
    transition: "transform 0.5s ease"
  })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left // Mouse position X within element
    const y = e.clientY - rect.top  // Mouse position Y within element
    
    // Normalized position from -0.5 to 0.5
    const normX = x / rect.width - 0.5
    const normY = y / rect.height - 0.5

    // Rotation angles
    const rotateX = -normY * maxTilt
    const rotateY = normX * maxTilt

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`,
      transition: "transform 0.1s ease" // Fast tracking
    })
  }

  const handleMouseLeave = () => {
    setStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.5s ease-out" // Smooth return
    })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={`will-change-transform ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
