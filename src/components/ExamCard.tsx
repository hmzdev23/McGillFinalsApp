import React from 'react'
import { Clock, MapPin, Download } from 'lucide-react'
import { googleCalUrl, downloadICS } from '../lib/calendarUtils'
import type { Exam } from '../data/types'

function formatDate(isoStr: string): string {
  const d = new Date(isoStr)
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

function formatTime(isoStr: string): string {
  const d = new Date(isoStr)
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function isMultiDay(start: string, end: string): boolean {
  const s = new Date(start)
  const e = new Date(end)
  return s.toDateString() !== e.toDateString()
}

function getBadgeInfo(type: string): { label: string; className: string } {
  const t = type.toUpperCase()
  // Using the cream/obsidian/red palette
  if (t.includes('TAKE-HOME')) return { label: 'Take-Home', className: 'text-obsidian bg-obsidian/5 border-obsidian/20' }
  if (t.includes('TIMED EXAM')) return { label: 'Online Timed', className: 'text-obsidian bg-obsidian/5 border-obsidian/20' }
  if (t.includes('ONLINE - ORAL')) return { label: 'Online Oral', className: 'text-obsidian bg-obsidian/5 border-obsidian/20' }
  if (t.includes('LAB EXAM')) return { label: 'Lab Exam', className: 'text-obsidian bg-obsidian/5 border-obsidian/20' }
  if (t.includes('ORAL')) return { label: 'Oral', className: 'text-obsidian bg-obsidian/5 border-obsidian/20' }
  if (t.includes('IN DEPARTMENT')) return { label: 'Departmental', className: 'text-mcgill bg-mcgill/5 border-mcgill/20' }
  if (t.includes('FORMAL EXAM')) return { label: 'In-Person', className: 'text-cream bg-obsidian border-transparent' }
  return { label: 'Exam', className: 'text-obsidian border-obsidian/20' }
}

function getDuration(type: string): string | null {
  const match = type.match(/(\d+)\s*(HOURS?|DAYS?|WEEK)/i)
  if (match) {
    const num = match[1]
    const unit = match[2].toUpperCase()
    if (unit.startsWith('HOUR')) return `${num}h`
    if (unit.startsWith('DAY')) return `${num} Days`
    if (unit === 'WEEK') return `${num} Weeks`
  }
  return null
}

function getCampusShort(type: string): string | null {
  if (type.includes('MAC CAMPUS')) return 'Macdonald Campus'
  if (type.includes('D.T. CAMPUS')) return 'Downtown Campus'
  return null
}

interface ExamCardProps {
  exam: Exam;
  style?: React.CSSProperties;
}

export default function ExamCard({ exam, style }: ExamCardProps) {
  const badge = getBadgeInfo(exam.type)
  const campus = getCampusShort(exam.type)
  const multiDay = isMultiDay(exam.start, exam.end)
  const duration = getDuration(exam.type)
  const isOnline = exam.type.toUpperCase().includes('ONLINE')

  const sectionLabel = exam.sections
    ? `Sections ${exam.sections.join(', ')}`
    : `Section ${exam.section}`

  return (
    <article
      className="group py-8 md:py-12 border-b border-obsidian/10 flex flex-col lg:flex-row gap-8 lg:gap-16 justify-between items-start lg:items-center hover:bg-obsidian/[0.02] transition-colors duration-500 px-4 md:px-8 -mx-4 md:-mx-8"
      style={style}
    >
      {/* Left: Course Identity */}
      <div className="flex-[2] flex flex-col gap-2">
        <div className="flex items-center gap-3 font-body text-xs uppercase tracking-widest opacity-60">
          <span>{exam.course}</span>
          <span className="w-1 h-1 rounded-full bg-obsidian"></span>
          <span>{sectionLabel}</span>
        </div>
        <h3 className="font-display text-4xl md:text-5xl tracking-tight leading-none">
          {exam.title}
        </h3>

        <div className="flex flex-wrap items-center gap-3 mt-4">
          <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-body font-bold border border-current ${badge.className}`}>
            {badge.label}
          </span>
          {duration && (
            <span className="text-xs font-body opacity-60">
              {duration} Duration
            </span>
          )}
        </div>
      </div>

      {/* Right: Logistics & Actions */}
      <div className="flex-1 flex flex-col gap-6 w-full lg:w-auto">
        <div className="flex flex-col gap-3 font-body text-sm">
          {multiDay ? (
            <div className="flex items-start gap-3">
              <Clock width={18} strokeWidth={1.5} className="opacity-40 shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="uppercase tracking-widest text-[10px] opacity-40 mb-1">
                  {exam.type.includes('TAKE-HOME') ? 'Availability Window' : 'Exam Window'}
                </span>
                <span>{formatDate(exam.start)} {formatTime(exam.start)}</span>
                <span className="opacity-40 text-xs">until</span>
                <span>{formatDate(exam.end)} {formatTime(exam.end)}</span>
              </div>
            </div>
          ) : isOnline ? (
            <div className="flex items-center gap-3">
              <Clock width={18} strokeWidth={1.5} className="opacity-40 shrink-0" />
              <span>{formatDate(exam.start)} · {formatTime(exam.start)} – {formatTime(exam.end)}</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Clock width={18} strokeWidth={1.5} className="opacity-40 shrink-0" />
              <span>{formatDate(exam.start)} · {formatTime(exam.start)} – {formatTime(exam.end)}</span>
            </div>
          )}

          {campus && (
            <div className="flex items-center gap-3">
              <MapPin width={18} strokeWidth={1.5} className="opacity-40 shrink-0" />
              <span>{campus}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 mt-2 pt-6 border-t border-obsidian/10">
          <a
            className="text-xs uppercase tracking-widest font-body hover:text-mcgill transition-colors flex items-center gap-2"
            href={googleCalUrl(exam)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Cal
          </a>
          <span className="opacity-20">|</span>
          <button
            className="text-xs uppercase tracking-widest font-body hover:text-mcgill transition-colors flex items-center gap-2 cursor-pointer"
            onClick={() => downloadICS([exam], `${exam.course.replace(/\s/g, '-')}-final.ics`)}
          >
            Apple Cal
          </button>
        </div>
      </div>
    </article>
  )
}
