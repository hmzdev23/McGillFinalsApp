import { useMemo } from 'react'
import { ChevronLeft, Download } from 'lucide-react'
import { EXAMS } from '../data/exams'
import ExamCard from './ExamCard'
import { downloadICS } from './calendarUtils'

function matchExams(chips) {
  const matched = []
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
  // Remove duplicates (same course+section appearing from multiple chip matches)
  const seen = new Set()
  return matched.filter(e => {
    const key = `${e.course}|${e.section}|${e.start}|${e.end}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function deduplicateExams(exams) {
  // Group by course + start + end + type (but not section)
  const groups = new Map()
  for (const exam of exams) {
    const key = `${exam.course}|${exam.start}|${exam.end}|${exam.type}`
    if (!groups.has(key)) {
      groups.set(key, { ...exam, sections: [exam.section] })
    } else {
      const existing = groups.get(key)
      if (!existing.sections.includes(exam.section)) {
        existing.sections.push(exam.section)
      }
    }
  }
  // But keep different exam types separate (lecture vs lab)
  return Array.from(groups.values())
}

function groupByDate(exams) {
  const groups = new Map()
  for (const exam of exams) {
    const dateKey = new Date(exam.start).toDateString()
    if (!groups.has(dateKey)) {
      groups.set(dateKey, [])
    }
    groups.get(dateKey).push(exam)
  }
  return groups
}

function formatGroupDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export default function Results({ courses, onBack }) {
  const { exams, dateGroups } = useMemo(() => {
    const matched = matchExams(courses)
    const deduped = deduplicateExams(matched)
    const sorted = deduped.sort((a, b) => new Date(a.start) - new Date(b.start))
    const groups = groupByDate(sorted)
    return { exams: sorted, dateGroups: groups }
  }, [courses])

  let cardIndex = 0

  return (
    <div className="results-page">
      <div className="results-topbar glass">
        <div className="topbar-left">
          <button className="back-link" onClick={onBack}>
            <ChevronLeft />
            Edit Courses
          </button>
          <span className="exam-count">
            <strong>{exams.length}</strong> exam{exams.length !== 1 ? 's' : ''} found
          </span>
        </div>
        {exams.length > 0 && (
          <button
            className="btn-export"
            onClick={() => downloadICS(exams, 'findmyexams-all.ics')}
          >
            <Download />
            Export All
          </button>
        )}
      </div>

      <div className="results-content">
        {exams.length === 0 ? (
          <div className="no-results">
            <h3>No exams found</h3>
            <p>None of your courses have exams in the April 2026 schedule. Double-check your course codes.</p>
          </div>
        ) : (
          <>
            <h2 className="results-heading">Your Exam Schedule</h2>
            <div className="stagger-children">
              {Array.from(dateGroups.entries()).map(([dateStr, group]) => (
                <div key={dateStr}>
                  <div className="date-group-label">{formatGroupDate(dateStr)}</div>
                  {group.map((exam) => {
                    const idx = cardIndex++
                    return (
                      <ExamCard
                        key={`${exam.course}-${exam.sections?.join(',') || exam.section}-${exam.type}`}
                        exam={exam}
                        style={{ animationDelay: `${idx * 0.06}s` }}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
