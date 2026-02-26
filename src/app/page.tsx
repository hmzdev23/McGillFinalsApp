'use client'

import { useState, useCallback, useEffect } from 'react'
import Landing from '../components/Landing'
import CourseEntry from '../components/CourseEntry'
import Results from '../components/Results'
import type { CourseChip } from '../data/types'

export default function Home() {
  const [screen, setScreen] = useState<'landing' | 'entry' | 'results'>('landing')
  const [courses, setCourses] = useState<CourseChip[]>([])

  const goToEntry = useCallback(() => setScreen('entry'), [])
  const goLanding = useCallback(() => setScreen('landing'), [])

  const goToResults = useCallback((selectedCourses: CourseChip[]) => {
    setCourses(selectedCourses)
    setScreen('results')
  }, [])

  const goBack = useCallback(() => {
    setScreen('entry')
  }, [])

  // Scroll-triggered reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    const elements = document.querySelectorAll('.reveal-on-scroll')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [screen])

  return (
    <main>
      {screen === 'landing' && <Landing onStart={goToEntry} />}
      {screen === 'entry' && (
        <CourseEntry
          initialCourses={courses}
          onSubmit={goToResults}
          onBack={goLanding}
        />
      )}
      {screen === 'results' && (
        <Results courses={courses} onBack={goBack} />
      )}
    </main>
  )
}
