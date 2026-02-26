import type { Exam } from '../data/types'

// Format: 20260424T140000
function toICSDate(isoStr: string): string {
  const d = new Date(isoStr)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
}

// Format for Google Calendar: 20260424T140000/20260424T170000
function toGoogleDate(startISO: string, endISO: string): string {
  return `${toICSDate(startISO)}/${toICSDate(endISO)}`
}

function buildDescription(exam: Exam): string {
  const parts = [`Course: ${exam.course}`]
  if (exam.sections) parts.push(`Sections: ${exam.sections.join(', ')}`)
  else parts.push(`Section: ${exam.section}`)
  parts.push(`Type: ${exam.type}`)
  return parts.join('\\n')
}

function getCampus(type: string): string {
  if (type.includes('MAC CAMPUS')) return 'Macdonald Campus, McGill University'
  if (type.includes('D.T. CAMPUS')) return 'Downtown Campus, McGill University'
  return 'McGill University'
}

export function googleCalUrl(exam: Exam): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${exam.course} — Final Exam`,
    dates: toGoogleDate(exam.start, exam.end),
    details: buildDescription(exam).replace(/\\n/g, '\n'),
    location: getCampus(exam.type),
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function generateICS(exams: Exam[]): string {
  const events = exams.map(exam => {
    const desc = buildDescription(exam)
    return [
      'BEGIN:VEVENT',
      `DTSTART;TZID=America/Toronto:${toICSDate(exam.start)}`,
      `DTEND;TZID=America/Toronto:${toICSDate(exam.end)}`,
      `SUMMARY:${exam.course} — Final Exam`,
      `DESCRIPTION:${desc}`,
      `LOCATION:${getCampus(exam.type)}`,
      `STATUS:CONFIRMED`,
      'END:VEVENT',
    ].join('\r\n')
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
  ].join('\r\n')

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
