"use client"

import { useEffect, useState, useRef } from "react"
import { Palette, Check, X, RotateCcw } from "lucide-react"

interface Theme {
  name: string
  id: string
  background: string
  foreground: string
  primary: string
  card: string
  border: string
  ring: string
  isLight: boolean
}

const THEMES: Theme[] = [
  {
    name: "Deep Cyber",
    id: "deep-cyber",
    background: "oklch(0.05 0 0)", // Near black
    foreground: "oklch(0.98 0 0)",
    primary: "oklch(0.65 0.3 290)", // Cyber purple
    card: "rgba(8, 8, 8, 0.45)",
    border: "rgba(255, 255, 255, 0.08)",
    ring: "oklch(0.65 0.3 290)",
    isLight: false
  },
  {
    name: "Neon Light",
    id: "neon-light",
    background: "oklch(0.98 0.01 240)", // Off-white
    foreground: "oklch(0.15 0.02 240)", // Dark text
    primary: "oklch(0.6 0.22 280)", // Purple-violet
    card: "rgba(255, 255, 255, 0.7)",
    border: "rgba(0, 0, 0, 0.08)",
    ring: "oklch(0.6 0.22 280)",
    isLight: true
  },
  {
    name: "Cyberpunk",
    id: "cyberpunk",
    background: "oklch(0.04 0.02 300)", // Dark violet-blue
    foreground: "oklch(0.95 0.05 100)", // Toxic yellow
    primary: "oklch(0.85 0.25 100)", // Gold yellow
    card: "rgba(18, 12, 24, 0.6)",
    border: "rgba(235, 255, 0, 0.22)",
    ring: "oklch(0.85 0.25 100)",
    isLight: false
  },
  {
    name: "Retro Terminal",
    id: "retro-terminal",
    background: "oklch(0.03 0.01 140)", // Matrix black-green
    foreground: "oklch(0.86 0.18 140)", // Green text
    primary: "oklch(0.86 0.18 140)", // Phosphor green
    card: "rgba(4, 12, 6, 0.65)",
    border: "rgba(34, 197, 94, 0.22)",
    ring: "oklch(0.86 0.18 140)",
    isLight: false
  },
  {
    name: "Rose Gold",
    id: "rose-gold",
    background: "oklch(0.06 0.01 20)", // Rose-black
    foreground: "oklch(0.96 0.02 40)", // Warm text
    primary: "oklch(0.72 0.14 40)", // Rose gold
    card: "rgba(16, 12, 12, 0.6)",
    border: "rgba(244, 63, 94, 0.18)",
    ring: "oklch(0.72 0.14 40)",
    isLight: false
  }
]

const CUSTOM_COLOR_PRESETS = [
  { name: "Cyan", value: "#06b6d4" },
  { name: "Green", value: "#10b981" },
  { name: "Orange", value: "#f97316" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Emerald", value: "#059669" }
]

export function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTheme, setActiveTheme] = useState<string>("deep-cyber")
  const [customColor, setCustomColor] = useState<string>("")
  const panelRef = useRef<HTMLDivElement>(null)

  // Load theme configurations on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("portfolio-theme") || "deep-cyber"
    const savedCustomColor = localStorage.getItem("portfolio-custom-color") || ""

    setActiveTheme(savedTheme)
    
    const themeObj = THEMES.find((t) => t.id === savedTheme) || THEMES[0]
    applyThemeVariables(themeObj)

    if (savedCustomColor) {
      setCustomColor(savedCustomColor)
      applyCustomAccent(savedCustomColor)
    }

    // Close panel on outside click
    const handleOutsideClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [])

  const applyThemeVariables = (theme: Theme) => {
    const root = document.documentElement
    root.style.setProperty("--background", theme.background)
    root.style.setProperty("--foreground", theme.foreground)
    root.style.setProperty("--primary", theme.primary)
    root.style.setProperty("--ring", theme.ring)
    root.style.setProperty("--card", theme.card)
    root.style.setProperty("--border", theme.border)

    // Adjust dark/light classes
    if (theme.isLight) {
      root.classList.remove("dark")
      root.classList.add("light")
    } else {
      root.classList.remove("light")
      root.classList.add("dark")
    }
  }

  const applyCustomAccent = (color: string) => {
    const root = document.documentElement
    root.style.setProperty("--primary", color)
    root.style.setProperty("--ring", color)
  }

  const selectTheme = (themeId: string) => {
    setActiveTheme(themeId)
    const themeObj = THEMES.find((t) => t.id === themeId) || THEMES[0]
    applyThemeVariables(themeObj)
    localStorage.setItem("portfolio-theme", themeId)

    // Re-apply custom accent if we are selecting a theme and have custom colors active
    if (customColor) {
      applyCustomAccent(customColor)
    }
  }

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color)
    applyCustomAccent(color)
    localStorage.setItem("portfolio-custom-color", color)
  }

  const resetCustomColor = () => {
    setCustomColor("")
    localStorage.removeItem("portfolio-custom-color")
    // Re-apply original active theme colors
    const themeObj = THEMES.find((t) => t.id === activeTheme) || THEMES[0]
    applyThemeVariables(themeObj)
  }

  return (
    <div className="fixed left-6 bottom-24 z-50 md:block hidden" ref={panelRef}>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full border border-primary/20 bg-card/60 backdrop-blur-md flex items-center justify-center text-primary shadow-[0_0_20px_var(--primary)]/10 hover:shadow-[0_0_30px_var(--primary)]/35 transition-all duration-300 hover:scale-110 active:scale-95 group select-none pointer-events-auto"
        title="Theme Interface"
        data-cursor="magnetic"
      >
        <Palette className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
      </button>

      {/* Slide-out Theme Controller Panel */}
      {isOpen && (
        <div className="absolute left-16 bottom-0 w-76 p-5 rounded-3xl border border-primary/20 bg-background/90 backdrop-blur-2xl shadow-2xl flex flex-col gap-5 animate-in slide-in-from-left-5 duration-300 select-none pointer-events-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/10 pb-3">
            <span className="text-xs font-mono font-bold tracking-widest text-primary uppercase">
              THEME INTERFACE
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Theme Presets List */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
              PRESET STYLES
            </span>
            <div className="flex flex-col gap-1.5">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => selectTheme(theme.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    activeTheme === theme.id
                      ? "border-primary/40 bg-primary/10 text-primary shadow-inner"
                      : "border-border/30 bg-white/5 text-muted-foreground hover:border-primary/20 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {/* Visual dot representation of theme background/accent */}
                    <div className="flex items-center gap-0.5">
                      <div
                        className="w-2.5 h-2.5 rounded-full border border-white/10"
                        style={{
                          background: theme.id === "neon-light" ? "#f4f4f5" : "#0c0a09"
                        }}
                      />
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          background:
                            theme.id === "cyberpunk"
                              ? "#eab308"
                              : theme.id === "retro-terminal"
                              ? "#22c55e"
                              : theme.id === "rose-gold"
                              ? "#f43f5e"
                              : "#a855f7"
                        }}
                      />
                    </div>
                    <span>{theme.name}</span>
                  </div>
                  {activeTheme === theme.id && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Color Matrix */}
          <div className="flex flex-col gap-3 border-t border-border/10 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
                CUSTOM ACCENT
              </span>
              {customColor && (
                <button
                  onClick={resetCustomColor}
                  className="text-[10px] font-mono text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            {/* Custom preset selector nodes */}
            <div className="grid grid-cols-6 gap-2">
              {CUSTOM_COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handleCustomColorChange(preset.value)}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all hover:scale-115 cursor-pointer shadow-[0_0_15px]/10 ${
                    customColor === preset.value
                      ? "border-white shadow-[0_0_10px_var(--primary)]"
                      : "border-transparent"
                  }`}
                  style={{
                    backgroundColor: preset.value,
                    borderColor: customColor === preset.value ? "#ffffff" : "transparent"
                  }}
                  title={preset.name}
                >
                  {customColor === preset.value && (
                    <Check className="w-4 h-4 text-black drop-shadow-sm font-black" />
                  )}
                </button>
              ))}
            </div>

            {/* Custom browser color picker */}
            <div className="flex items-center gap-3 mt-1.5">
              <label
                htmlFor="theme-color-picker"
                className="text-xs font-mono text-muted-foreground cursor-pointer hover:text-foreground flex items-center gap-1.5"
              >
                <div
                  className="w-5 h-5 rounded-md border border-border/40 shadow-inner flex items-center justify-center shrink-0 overflow-hidden relative"
                  style={{
                    background: customColor || "var(--primary)"
                  }}
                >
                  <input
                    id="theme-color-picker"
                    type="color"
                    value={customColor || "#a855f7"}
                    onChange={(e) => handleCustomColorChange(e.target.value)}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  />
                </div>
                <span>Pick Custom Hex</span>
              </label>
              {customColor && (
                <span className="text-xs font-mono text-primary ml-auto">
                  {customColor.toUpperCase()}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
