"use client"

import { useEffect, useState } from "react"

export function Preloader() {
  const [progress, setProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

  useEffect(() => {
    let currentProgress = 0
    const interval = setInterval(() => {
      // Simulate realistic spring-damping loading speed:
      // Starts fast, slows down at 50% to simulate processing, crawls at 85% to build anticipation, and then reaches 100%
      let increment = 1
      if (currentProgress < 45) {
        increment = Math.floor(Math.random() * 6) + 4 // Quick jumps of 4% to 9%
      } else if (currentProgress < 80) {
        increment = Math.floor(Math.random() * 3) + 1 // Slow down to 1% to 3%
      } else if (currentProgress < 99) {
        // Slow crawl near the end
        increment = Math.random() > 0.4 ? 1 : 0
      } else {
        increment = 1
      }

      currentProgress = Math.min(100, currentProgress + increment)
      setProgress(currentProgress)

      if (currentProgress >= 100) {
        clearInterval(interval)
        // Give the user a brief moment to see the "100%" before starting the exit slide
        setTimeout(() => {
          setIsLoaded(true)
        }, 400)
      }
    }, 45) // Quick tick rates for smooth progression (~1.5s total time)

    return () => clearInterval(interval)
  }, [])

  // Lock scroll bar during load phase, release when page is revealed
  useEffect(() => {
    if (!isLoaded) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isLoaded])

  // Unmount completely from DOM after transition finishes
  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => {
        setIsHidden(true)
      }, 850) // Matches transition duration
      return () => clearTimeout(timer)
    }
  }, [isLoaded])

  if (isHidden) return null

  return (
    <div
      className="fixed inset-0 w-full h-full bg-black z-[9999] flex flex-col items-center justify-center pointer-events-auto"
      style={{
        transform: isLoaded ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 0.8s cubic-bezier(0.85, 0, 0.15, 1)",
      }}
    >
      {/* Mesh Grid Backdrop Overlay */}
      <div className="absolute inset-0 bg-grid-mesh opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none" />

      {/* Cybernetic center glowing orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none animate-pulse" />

      <div className="relative flex flex-col items-center select-none text-center">
        {/* Glowing Counter */}
        <h2 className="text-8xl md:text-9xl font-black font-sans tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-primary to-purple-600 drop-shadow-[0_0_30px_rgba(6,182,212,0.3)] animate-pulse">
          {progress}%
        </h2>

        {/* Linear Loading Bar */}
        <div className="w-56 md:w-64 h-[2px] bg-white/10 rounded-full mt-6 overflow-hidden relative border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-primary to-purple-600 rounded-full transition-all duration-100 ease-out shadow-[0_0_8px_rgba(6,182,212,0.6)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Decrypting status updates */}
        <p className="text-xs font-mono tracking-widest text-muted-foreground/60 uppercase mt-4 flex items-center gap-1.5 min-h-[16px]">
          {progress < 30 && "Establishing uplink"}
          {progress >= 30 && progress < 65 && "Decrypting system components"}
          {progress >= 65 && progress < 90 && "Synchronizing 3D interfaces"}
          {progress >= 90 && progress < 100 && "Calibrating grid matrices"}
          {progress === 100 && "Link online"}
          <span className="w-1.5 h-3 bg-cyan-400 animate-pulse inline-block" />
        </p>
      </div>
    </div>
  )
}
