import type { Exam } from '../data/types'

// Format: 20261215T140000 (Montreal local time)
function toICSDate(isoStr: string): string {
  const d = new Date(isoStr)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
}

// Format for Google Calendar: 20261215T140000/20261215T170000
function toGoogleDate(startISO: string, endISO: string): string {
  return `${toICSDate(startISO)}/${toICSDate(endISO)}`
}

function buildDescription(exam: Exam): string {
  const parts = [`Course: ${exam.course}`]
  if (exam.sections) parts.push(`Sections: ${exam.sections.join(', ')}`)
  else parts.push(`Section: ${exam.section}`)
  parts.push(`Type: ${exam.type}`)
  parts.push('Fall 2026 tentative schedule - dates and times are subject to change.')
  parts.push('All times are Eastern Standard Time (America/Toronto).')
  if (exam.building && exam.room) parts.push(`Location: ${exam.building}, Room ${exam.room}`)
  else if (exam.building) parts.push(`Location: ${exam.building}`)
  else if (exam.type.includes('IN-PERSON')) parts.push('Room location not yet published.')
  return parts.join('\n')
}

function escapeICSText(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;')
}

// iCalendar content lines must be folded at 75 UTF-8 bytes.
function foldICSLine(line: string): string {
  const encoder = new TextEncoder()
  let result = ''
  let bytes = 0
  for (const character of line) {
    const size = encoder.encode(character).length
    if (bytes + size > 75) {
      result += '\r\n '
      bytes = 1
    }
    result += character
    bytes += size
  }
  return result
}

function getCampus(type: string): string {
  if (type.includes('MAC CAMPUS')) return 'Macdonald Campus, McGill University'
  if (type.includes('D.T. CAMPUS')) return 'Downtown Campus, McGill University'
  return 'McGill University'
}

function getLocation(exam: Exam): string {
  if (exam.building && exam.room) return `${exam.building}, Room ${exam.room}, McGill University`
  if (exam.building) return `${exam.building}, McGill University`
  return getCampus(exam.type)
}

export function googleCalUrl(exam: Exam): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${exam.course} — Final Exam`,
    dates: toGoogleDate(exam.start, exam.end),
    ctz: 'America/Toronto',
    details: buildDescription(exam),
    location: getLocation(exam),
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function generateICS(exams: Exam[]): string {
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
  const events = exams.map(exam => {
    const desc = buildDescription(exam)
    const sections = [...(exam.sections ?? [exam.section])].sort().join(',')
    const uid = encodeURIComponent(`${exam.course}|${sections}|${exam.type}|${exam.start}|${exam.end}`)
    return [
      'BEGIN:VEVENT',
      `UID:${uid}@findmyexams`,
      `DTSTAMP:${timestamp}`,
      `DTSTART;TZID=America/Toronto:${toICSDate(exam.start)}`,
      `DTEND;TZID=America/Toronto:${toICSDate(exam.end)}`,
      `SUMMARY:${escapeICSText(`${exam.course} — Final Exam`)}`,
      `DESCRIPTION:${escapeICSText(desc)}`,
      `LOCATION:${escapeICSText(getLocation(exam))}`,
      `STATUS:TENTATIVE`,
      'END:VEVENT',
    ].map(foldICSLine).join('\r\n')
  })

  const cal = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//McGill Finals//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VTIMEZONE',
    'TZID:America/Toronto',
    'BEGIN:DAYLIGHT',
    'DTSTART:20260308T020000',
    'TZOFFSETFROM:-0500',
    'TZOFFSETTO:-0400',
    'TZNAME:EDT',
    'END:DAYLIGHT',
    'BEGIN:STANDARD',
    'DTSTART:20261101T020000',
    'TZOFFSETFROM:-0400',
    'TZOFFSETTO:-0500',
    'TZNAME:EST',
    'END:STANDARD',
    'END:VTIMEZONE',
    ...events,
    'END:VCALENDAR',
  ].join('\r\n') + '\r\n'

  return cal
}

export function downloadICS(exams: Exam[], filename: string = 'mcgill-finals.ics'): void {
  const ics = generateICS(exams)
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
