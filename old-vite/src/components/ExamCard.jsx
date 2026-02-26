import { Clock, MapPin } from 'lucide-react'
import { googleCalUrl, downloadICS } from './calendarUtils'

function formatDate(isoStr) {
  const d = new Date(isoStr)
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

function formatTime(isoStr) {
  const d = new Date(isoStr)
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function isMultiDay(start, end) {
  const s = new Date(start)
  const e = new Date(end)
  return s.toDateString() !== e.toDateString()
}

function getBadgeInfo(type) {
  const t = type.toUpperCase()
  if (t.includes('TAKE-HOME')) return { label: 'Take-Home', className: 'badge-take-home' }
  if (t.includes('TIMED EXAM')) return { label: 'Online Timed', className: 'badge-timed' }
  if (t.includes('ONLINE - ORAL')) return { label: 'Online Oral', className: 'badge-oral' }
  if (t.includes('LAB EXAM')) return { label: 'Lab Exam', className: 'badge-lab' }
  if (t.includes('ORAL')) return { label: 'Oral', className: 'badge-oral' }
  if (t.includes('IN DEPARTMENT')) return { label: 'Departmental', className: 'badge-dept' }
  if (t.includes('FORMAL EXAM')) return { label: 'In-Person', className: 'badge-in-person' }
  return { label: 'Exam', className: 'badge-in-person' }
}

function getDuration(type) {
  const match = type.match(/(\d+)\s*(HOURS?|DAYS?|WEEK)/i)
  if (match) {
    const num = match[1]
    const unit = match[2].toUpperCase()
    if (unit.startsWith('HOUR')) return `${num}h`
    if (unit.startsWith('DAY')) return `${num}-day`
    if (unit === 'WEEK') return `${num}-week`
  }
  return null
}

function getCampusShort(type) {
  if (type.includes('MAC CAMPUS')) return 'Macdonald Campus'
  if (type.includes('D.T. CAMPUS')) return 'Downtown Campus'
  return null
}

// Google "G" logo
const GoogleLogo = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
)

// Apple logo
const AppleLogo = () => (
  <svg width="12" height="14" viewBox="0 0 814 1000" fill="currentColor">
    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57.8-155.5-127.4c-58.3-81.1-105.6-207.6-105.6-328 0-192.8 125.8-295.2 249.5-295.2 65.8 0 120.8 43.4 162.1 43.4 39.2 0 100.2-46 174.6-46 28.2 0 130 2.6 197 99.2zm-234.7-182c31.2-36.9 53.4-88.1 53.4-139.3 0-7.1-.6-14.3-1.9-20.1-50.9 1.9-110.8 33.9-147.1 76.5-27.5 31.5-56.7 82.7-56.7 134.6 0 7.8.6 15.6 1.3 18.1 2.6.3 6.4.6 10.2.6 46.2 0 104.4-30.5 140.8-70.4z" />
  </svg>
)

export default function ExamCard({ exam, style }) {
  const badge = getBadgeInfo(exam.type)
  const campus = getCampusShort(exam.type)
  const multiDay = isMultiDay(exam.start, exam.end)
  const duration = getDuration(exam.type)
  const isOnline = exam.type.toUpperCase().includes('ONLINE')

  const sectionLabel = exam.sections
    ? `Sections ${exam.sections.join(', ')}`
    : `Section ${exam.section}`

  return (
    <div className="exam-card" style={style}>
      <div className="card-header">
        <div>
          <span className="card-course">
            {exam.course}
            <span className="card-section">{sectionLabel}</span>
          </span>
        </div>
        <span className={`badge ${badge.className}`}>
          {badge.label}
          {duration && ` · ${duration}`}
        </span>
      </div>

      <div className="card-title">{exam.title}</div>

      {multiDay ? (
        <div className={`card-time-window ${exam.type.includes('TIMED') ? 'window-timed' : ''}`}>
          <div className="window-label">
            {exam.type.includes('TAKE-HOME') ? 'Availability Window' : 'Exam Window'}
          </div>
          <div className="window-dates">
            {formatDate(exam.start)} {formatTime(exam.start)} &rarr; {formatDate(exam.end)} {formatTime(exam.end)}
          </div>
        </div>
      ) : isOnline ? (
        <div className={`card-time-window ${exam.type.includes('TIMED') ? 'window-timed' : ''}`}>
          <div className="window-label">Exam Window</div>
          <div className="window-dates">
            {formatDate(exam.start)} &middot; {formatTime(exam.start)} &ndash; {formatTime(exam.end)}
          </div>
        </div>
      ) : (
        <div className="card-time">
          <Clock />
          <span>{formatDate(exam.start)} &middot; {formatTime(exam.start)} &ndash; {formatTime(exam.end)}</span>
        </div>
      )}

      {campus && (
        <div className="card-campus">
          <MapPin />
          <span>{campus}</span>
        </div>
      )}

      <div className="card-footer">
        <a
          className="cal-btn"
          href={googleCalUrl(exam)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <GoogleLogo />
          Google Calendar
        </a>
        <button
          className="cal-btn"
          onClick={() => downloadICS([exam], `${exam.course.replace(/\s/g, '-')}-final.ics`)}
        >
          <AppleLogo />
          Apple Calendar
        </button>
      </div>
    </div>
  )
}
