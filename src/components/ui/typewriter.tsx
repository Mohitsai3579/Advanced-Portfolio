"use client"

import { useEffect, useState } from "react"

interface TypewriterProps {
  words: string[]
  typeSpeed?: number
  deleteSpeed?: number
  delaySpeed?: number
}

export function Typewriter({
  words,
  typeSpeed = 100,
  deleteSpeed = 50,
  delaySpeed = 1500
}: TypewriterProps) {
  const [text, setText] = useState("")
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (words.length === 0) return

    let timer: NodeJS.Timeout
    const currentWord = words[wordIndex]

    if (isDeleting) {
      // Deleting character
      timer = setTimeout(() => {
        setText(currentWord.substring(0, text.length - 1))
      }, deleteSpeed)
    } else {
      // Typing character
      timer = setTimeout(() => {
        setText(currentWord.substring(0, text.length + 1))
      }, typeSpeed)
    }

    // Handlers
    if (!isDeleting && text === currentWord) {
      // Pause before deleting
      timer = setTimeout(() => {
        setIsDeleting(true)
      }, delaySpeed)
    } else if (isDeleting && text === "") {
      setIsDeleting(false)
      setWordIndex((prev) => (prev + 1) % words.length)
    }

    return () => clearTimeout(timer)
  }, [text, isDeleting, wordIndex, words, typeSpeed, deleteSpeed, delaySpeed])

  return (
    <span className="relative">
      <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
        {text}
      </span>
      <span className="ml-1 inline-block w-[3px] h-[1em] bg-primary animate-pulse vertical-middle align-middle" />
    </span>
  )
}
