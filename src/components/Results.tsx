'use client'

import React, { useMemo, useEffect, useState } from 'react'
import { ArrowLeft, Download } from 'lucide-react'
import { EXAMS } from '../data/exams'
import type { Exam, CourseChip } from '../data/types'
import ExamCard from './ExamCard'
import { downloadICS } from '../lib/calendarUtils'

function matchExams(chips: CourseChip[]): Exam[] {
  const matched: Exam[] = []
  for (const chip of chips) {
    if (!chip.valid) continue
    const courseUpper = chip.course.toUpperCase()
    const filtered = EXAMS.filter(e => {
      if (e.course.toUpperCase() !== courseUpper) return false
      if (chip.section) {
        return e.section.toUpperCase() === chip.section.toUpperCase()
      }
      return true
    })
    matched.push(...filtered)
  }
  // Remove duplicates
  const seen = new Set<string>()
  return matched.filter(e => {
    const key = `${e.course}|${e.section}|${e.start}|${e.end}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function deduplicateExams(exams: Exam[]): Exam[] {
  // Group by course + start + end + type
  const groups = new Map<string, Exam>()
  for (const exam of exams) {
    const key = `${exam.course}|${exam.start}|${exam.end}|${exam.type}`
    if (!groups.has(key)) {
      groups.set(key, { ...exam, sections: exam.section ? [exam.section] : [] })
    } else {
      const existing = groups.get(key)!
      if (exam.section && !existing.sections!.includes(exam.section)) {
        existing.sections!.push(exam.section)
      }
    }
  }
  return Array.from(groups.values())
}

function groupByDate(exams: Exam[]): Map<string, Exam[]> {
  const groups = new Map<string, Exam[]>()
  for (const exam of exams) {
    const dateKey = new Date(exam.start).toDateString()
    if (!groups.has(dateKey)) {
      groups.set(dateKey, [])
    }
    groups.get(dateKey)!.push(exam)
  }
  return groups
}

function formatGroupDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

interface ResultsProps {
  courses: CourseChip[];
  onBack: () => void;
}

export default function Results({ courses, onBack }: ResultsProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const { exams, dateGroups } = useMemo(() => {
    const matched = matchExams(courses)
    const deduped = deduplicateExams(matched)
    const sorted = deduped.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    const groups = groupByDate(sorted)
    return { exams: sorted, dateGroups: groups }
  }, [courses])

  return (
    <div className={`min-h-[100dvh] w-full bg-cream transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>

      {/* Editorial Nav */}
      <nav className="absolute top-0 left-0 w-full z-50 px-6 py-6 md:px-12 flex justify-between items-center mix-blend-multiply pointer-events-none">

        <div className="pointer-events-auto flex items-center gap-6">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-xs uppercase tracking-widest hover:opacity-60 transition-opacity duration-500 cursor-pointer"
          >
            <ArrowLeft width={16} strokeWidth={1.5} className="group-hover:-translate-x-1 transition-transform" />
            <span>Edit</span>
          </button>
          <span className="opacity-20 hidden md:block">|</span>
          <span className="font-display text-xl tracking-tighter italic opacity-40 hidden md:block">FindMyExams</span>
        </div>

        {exams.length > 0 && (
          <button
            onClick={() => downloadICS(exams, 'findmyexams-all.ics')}
            className="pointer-events-auto group flex items-center gap-2 text-xs uppercase tracking-widest hover:text-mcgill transition-colors duration-500 cursor-pointer"
          >
            <span>Export All</span>
            <Download width={14} strokeWidth={1.5} />
          </button>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="max-w-screen-2xl mx-auto w-full px-6 pt-32 pb-32 md:px-12">
        {exams.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h2 className="font-display text-6xl md:text-8xl tracking-tight leading-[0.9] font-light italic mb-8 opacity-20">
              0 Exams
            </h2>
            <p className="font-body text-lg font-light opacity-60 max-w-md">
              None of your courses appear in the April 2026 scheduling bloc. Double-check your course codes.
            </p>
          </div>
        ) : (
          <div className="mb-24">
            <div className="flex justify-between items-end border-b border-obsidian/20 pb-12 mb-16">
              <h1 className="font-display text-6xl md:text-8xl tracking-tight leading-[0.9] font-light">
                Your <span className="italic">Schedule</span>
              </h1>
              <span className="font-body text-xs uppercase tracking-widest opacity-40 text-right">
                {exams.length} Exam{exams.length !== 1 ? 's' : ''} Documented
              </span>
            </div>

            <div className="flex flex-col gap-24">
              {Array.from(dateGroups.entries()).map(([dateStr, group]) => (
                <section key={dateStr} className="relative">
                  {/* Huge date header */}
                  <div className="bg-cream py-4 mb-8 -mx-6 px-6 md:-mx-12 md:px-12">
                    <h2 className="font-display text-4xl md:text-5xl italic tracking-tight text-mcgill">
                      {formatGroupDate(dateStr)}
                    </h2>
                  </div>

                  {/* Exams List */}
                  <div className="flex flex-col">
                    {group.map((exam) => (
                      <ExamCard
                        key={`${exam.course}-${exam.sections?.join(',') || exam.section}-${exam.type}`}
                        exam={exam}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        )}
      </main>

    </div>
  )
}
