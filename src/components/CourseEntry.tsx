'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { EXAMS } from '../data/exams'
import type { CourseChip } from '../data/types'

// Build a set of valid course codes + course-section combos
const validCourses = new Set(EXAMS.map(e => e.course.toUpperCase()))
const validCourseSections = new Set(
  EXAMS.map(e => `${e.course.toUpperCase()} ${e.section.toUpperCase()}`)
)

function normalize(input: string): string {
  return input.toUpperCase().replace(/\s+/g, ' ').trim()
}

function parseCourseInput(raw: string): CourseChip {
  const normalized = normalize(raw)
  // Try full "COMP 251 001" format first
  const fullMatch = normalized.match(/^([A-Z]{3,4}\s+\d{3}[A-Z0-9]{0,3})\s+(\d{3}[A-Z]?\d?)$/)
  if (fullMatch) {
    const course = fullMatch[1]
    const section = fullMatch[2]
    const key = `${course} ${section}`
    return {
      display: key,
      course,
      section,
      valid: validCourseSections.has(key)
    }
  }
  // Try just course code "COMP 251"
  const courseMatch = normalized.match(/^([A-Z]{3,4}\s+\d{3}[A-Z0-9]{0,3})$/)
  if (courseMatch) {
    const course = courseMatch[1]
    return {
      display: course,
      course,
      section: null,
      valid: validCourses.has(course)
    }
  }
  return { display: normalized, course: normalized, section: null, valid: false }
}

interface CourseEntryProps {
  initialCourses: CourseChip[];
  onSubmit: (courses: CourseChip[]) => void;
  onBack: () => void;
}

export default function CourseEntry({ initialCourses, onSubmit, onBack }: CourseEntryProps) {
  const [chips, setChips] = useState<CourseChip[]>(initialCourses.length > 0 ? initialCourses : [])
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const [mounted, setMounted] = useState(false)
  const [placeholder, setPlaceholder] = useState('TYPE COURSE CODE E.G. COMP 251...')

  useEffect(() => {
    setMounted(true)

    // Responsive placeholder
    const handleResize = () => {
      setPlaceholder(window.innerWidth < 768 ? 'TYPE COURSE CODE' : 'TYPE COURSE CODE E.G. COMP 251...')
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    // Focus after component mounts and animation starts
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const hasValid = useMemo(() => chips.some(c => c.valid), [chips])

  function addChip() {
    const trimmed = input.trim()
    if (!trimmed) return
    const parsed = parseCourseInput(trimmed)
    // Don't add duplicates
    if (chips.find(c => c.display === parsed.display)) {
      setInput('')
      return
    }
    setChips(prev => [...prev, parsed])
    setInput('')
  }

  function removeChip(index: number) {
    setChips(prev => prev.filter((_, i) => i !== index))
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addChip()
    }
    if (e.key === 'Backspace' && input === '' && chips.length > 0) {
      removeChip(chips.length - 1)
    }
  }

  function handleSubmit() {
    if (hasValid) {
      onSubmit(chips)
    }
  }

  return (
    <div className={`min-h-screen w-full bg-cream transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'} flex flex-col`}>

      {/* Editorial Nav */}
      <nav className="w-full px-6 py-8 md:px-12 flex justify-between items-center relative z-10">
        <button
          onClick={onBack}
          className="group flex items-center gap-2 text-xs uppercase tracking-widest hover:opacity-60 transition-opacity duration-500 cursor-pointer"
        >
          <ArrowLeft width={16} strokeWidth={1.5} className="group-hover:-translate-x-1 transition-transform" />
          <span>Return</span>
        </button>
        <span className="font-display text-xl tracking-tighter italic opacity-40">FindMyExams</span>
      </nav>

      {/* Main Entry Area */}
      <div className="flex-1 flex flex-col justify-center max-w-screen-lg mx-auto w-full px-6 pb-32">
        <h2 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[0.9] font-light italic mb-12">
          What are you <span className="not-italic text-mcgill">studying?</span>
        </h2>

        {/* Massive Input Block */}
        <div className="relative mb-16">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            spellCheck={false}
            autoCapitalize="characters"
            className="w-full bg-transparent border-b-2 border-obsidian pb-4 text-3xl md:text-5xl font-display placeholder-obsidian/20 text-obsidian outline-none focus:border-mcgill transition-colors duration-500 uppercase"
          />
          <span className="absolute right-0 bottom-4 text-xs font-body uppercase tracking-widest opacity-40 transition-opacity">
            Press Enter
          </span>
        </div>

        {/* Selected Chips */}
        <div className="flex flex-wrap gap-3 min-h-[50px]">
          {chips.map((chip, i) => (
            <span
              key={chip.display}
              className={`group flex items-center gap-2 px-4 py-2 rounded-full border border-obsidian text-xs uppercase tracking-widest transition-colors duration-300 font-body
                ${chip.valid ? 'hover:bg-obsidian hover:text-cream' : 'border-mcgill text-mcgill bg-mcgill/5'}
              `}
            >
              <span>{chip.display}</span>
              {!chip.valid && (
                <span title="Not found in exact layout. Double check?" className="italic opacity-70">?</span>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); removeChip(i) }}
                className={`ml-1 opacity-50 group-hover:opacity-100 transition-opacity cursor-pointer ${!chip.valid && "opacity-100"}`}
                aria-label="Remove"
              >
                <X width={14} strokeWidth={2} />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className={`fixed bottom-0 left-0 w-full p-6 md:p-12 flex justify-end transition-all duration-700 transform ${hasValid ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <button
          onClick={handleSubmit}
          disabled={!hasValid}
          className="flex items-center gap-4 px-8 py-5 bg-obsidian text-cream hover:bg-mcgill hover:text-white transition-colors duration-500 rounded-full group cursor-pointer shadow-2xl"
        >
          <span className="text-sm uppercase tracking-widest font-body font-medium">Generate Schedule</span>
          <ArrowRight width={20} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform duration-500" />
        </button>
      </div>

    </div>
  )
}
