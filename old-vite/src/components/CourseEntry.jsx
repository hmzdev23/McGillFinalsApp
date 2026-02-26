import { useState, useRef, useEffect, useMemo } from 'react'
import { ChevronLeft } from 'lucide-react'
import { EXAMS } from '../data/exams'

// Build a set of valid course codes + course-section combos
const validCourses = new Set(EXAMS.map(e => e.course.toUpperCase()))
const validCourseSections = new Set(
  EXAMS.map(e => `${e.course.toUpperCase()} ${e.section.toUpperCase()}`)
)

function normalize(input) {
  return input.toUpperCase().replace(/\s+/g, ' ').trim()
}

function parseCourseInput(raw) {
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

export default function CourseEntry({ initialCourses, onSubmit, onBack }) {
  const [chips, setChips] = useState(initialCourses.length > 0 ? initialCourses : [])
  const [input, setInput] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
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

  function removeChip(index) {
    setChips(prev => prev.filter((_, i) => i !== index))
  }

  function handleKeyDown(e) {
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
    <div className="course-entry">
      <div className="course-entry-inner">
        <button className="back-link" onClick={onBack}>
          <ChevronLeft />
          Back
        </button>
        <h2>Add your courses</h2>
        <p className="subtitle">
          Type a course code and press Enter. Add a section number to filter by section.
        </p>
        <div
          className="tag-input-wrapper"
          onClick={() => inputRef.current?.focus()}
        >
          {chips.map((chip, i) => (
            <span key={chip.display} className={`chip ${chip.valid ? '' : 'warning'}`}>
              {chip.display}
              {!chip.valid && (
                <span title="Not found in exam schedule" style={{ marginLeft: 2, fontSize: '0.65rem' }}>?</span>
              )}
              <button onClick={(e) => { e.stopPropagation(); removeChip(i) }} aria-label="Remove">
                &times;
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={chips.length === 0 ? 'e.g. COMP 251, MATH 141...' : 'Add another...'}
            spellCheck={false}
            autoCapitalize="characters"
          />
        </div>
        <p className="input-hint">
          Press Enter to add · Use "COMP 251 001" for a specific section
        </p>
        <button
          className="btn-find"
          disabled={!hasValid}
          onClick={handleSubmit}
        >
          Find My Exams
        </button>
      </div>
    </div>
  )
}
