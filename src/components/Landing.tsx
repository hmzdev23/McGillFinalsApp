'use client'

import React, { useEffect, useState } from 'react'
import { ArrowRight, MapPin, Search, Calendar, Compass, Sun } from 'lucide-react'

interface LandingProps {
  onStart: () => void;
}

export default function Landing({ onStart }: LandingProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className={`min-h-[100dvh] w-full transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>

      {/* Navigation */}
      <nav className="absolute top-0 left-0 w-full z-50 px-6 pt-12 pb-6 md:px-12 md:py-8 flex justify-between items-center mix-blend-multiply pointer-events-none">
        <div className="pointer-events-auto">
          <span className="font-display text-2xl tracking-tighter italic mt-safe opacity-40 md:opacity-100">FindMyExams</span>
        </div>
        <button
          onClick={onStart}
          className="pointer-events-auto group hidden md:flex items-center gap-2 text-xs uppercase tracking-widest hover:opacity-60 transition-opacity duration-500"
        >
          <span>Start Search</span>
          <ArrowRight width={16} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </nav>

      {/* Hero Block - Using McGill Light Red instead of Yellow */}
      <header className="relative w-full min-h-[100dvh] flex flex-col justify-end bg-mcgill-light px-6 pb-12 pt-32 md:px-12 md:pb-20">
        <div className="max-w-screen-2xl mx-auto w-full reveal-on-scroll">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-9">
              <h1 className="font-display text-7xl md:text-[10rem] tracking-tight leading-[0.9] font-light italic">
                Find your exams <br />
                <span className="not-italic text-mcgill">in seconds.</span>
              </h1>
            </div>
            <div className="md:col-span-3 flex flex-col justify-end gap-6">
              <p className="font-body font-light text-sm md:text-base leading-relaxed opacity-90">
                A fast and easy way to locate your April 2026 Finals without digging through endless PDF schedules.
              </p>

              <button
                onClick={onStart}
                className="flex md:hidden items-center justify-center w-full gap-4 px-8 py-5 bg-obsidian text-cream hover:bg-mcgill hover:text-white transition-colors duration-500 rounded-full group cursor-pointer shadow-xl mb-4"
              >
                <span className="text-sm uppercase tracking-widest font-body font-medium">Start Search</span>
                <ArrowRight width={20} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform duration-500" />
              </button>

              <div className="w-full h-[1px] bg-obsidian opacity-20"></div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-80">
                <MapPin width={16} strokeWidth={1.5} />
                <span>McGill University</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Context Block */}
      <section className="w-full py-24 md:py-40 px-6 md:px-12 bg-cream">
        <div className="max-w-screen-md mx-auto reveal-on-scroll">
          <span className="block font-body text-xs uppercase tracking-widest opacity-40 mb-8">The Problem</span>
          <h2 className="font-display text-4xl md:text-5xl leading-tight font-normal mb-12 tracking-tight">
            Not a replacement for the official schedule, but a tool in the moment of need.
          </h2>
          <div className="flex flex-col md:flex-row gap-12">
            <div className="w-full md:w-1/12 border-t border-obsidian opacity-20 pt-2"></div>
            <div className="w-full md:w-11/12">
              <p className="font-body text-lg md:text-xl font-light leading-relaxed text-obsidian opacity-80">
                The official exam schedule is a massive document. We understand that during finals season, you need absolute clarity—exact times, specific rooms, and seamless calendar integration. We extracted the data so you don't have to search manually.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Concept Block */}
      <section className="w-full py-12 md:py-24 px-6 md:px-12 bg-cream">
        <div className="max-w-screen-2xl mx-auto border-t border-b border-obsidian border-opacity-10 reveal-on-scroll">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left */}
            <div className="py-16 md:py-32 md:pr-16 border-b md:border-b-0 md:border-r border-obsidian border-opacity-10 flex flex-col justify-between min-h-[50vh]">
              <div className="mb-8">
                <Search width={32} strokeWidth={1.5} className="opacity-60 mb-6 text-mcgill" />
                <h3 className="font-display text-5xl md:text-7xl tracking-tight">Instant<br /><span className="italic">Clarity</span></h3>
              </div>
              <p className="font-body text-sm font-light opacity-60 max-w-xs">
                Type your course codes. Get your schedule instantly. Filter by sections to see exactly what matters to you.
              </p>
            </div>
            {/* Right */}
            <div className="py-16 md:py-32 md:pl-16 flex flex-col justify-between min-h-[50vh]">
              <div className="mb-8">
                <Calendar width={32} strokeWidth={1.5} className="opacity-60 mb-6 text-mcgill" />
                <h3 className="font-display text-5xl md:text-7xl tracking-tight">Export<br /><span className="italic">Everywhere</span></h3>
              </div>
              <p className="font-body text-sm font-light opacity-60 max-w-xs">
                One click to push your entire exam schedule into Apple Calendar, Google Calendar, or Outlook.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Cloud Section */}
      <section className="w-full py-24 px-6 md:px-12 bg-cream">
        <div className="max-w-screen-xl mx-auto flex flex-col items-center justify-center reveal-on-scroll">
          <h3 className="font-body text-sm md:text-base text-obsidian opacity-60 mb-12 text-center md:mb-16">
            Supported by modern calendar providers. <br className="md:hidden" />
            From lookup to export seamlessly.
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-24 opacity-60 hover:opacity-100 transition-all duration-700">
            {/* Apple Calendar Style Logo Text */}
            <div className="flex items-center gap-3 group cursor-default">
              <svg className="h-8 w-auto md:h-10 md:w-auto text-obsidian/60 group-hover:text-obsidian transition-colors fill-current" viewBox="0 -32 384 544" xmlns="http://www.w3.org/2000/svg">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.3 48.6-.7 90.4-84.3 103.6-119.3-34.2-15.8-62.7-46.6-62.7-91.3zM252.1 72.4c22.8-29.8 35.3-72.2 27.7-111.4-38.1 1.7-83.3 25.4-107.5 56.4-23.4 29.5-38.3 71.9-29.4 110.1 41.5 2.1 82.3-25.5 109.2-55.1z" />
              </svg>
              <span className="font-semibold text-3xl md:text-4xl tracking-tight leading-none text-obsidian/60 group-hover:text-obsidian transition-colors" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>Apple</span>
            </div>
            {/* Google Calendar Style Logo Text */}
            <div className="flex items-center gap-3 group cursor-default">
              <svg className="h-8 w-auto md:h-10 md:w-auto text-obsidian/60 group-hover:text-[#4285F4] transition-colors fill-current" viewBox="0 0 488 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
              </svg>
              <span className="font-body font-bold text-3xl md:text-4xl tracking-tighter leading-none text-obsidian/60 group-hover:text-[#4285F4] transition-colors">Google</span>
            </div>
            {/* Outlook Style Logo Text */}
            <div className="flex items-center gap-3 group cursor-default">
              <svg className="h-8 w-auto md:h-10 md:w-auto text-obsidian/60 group-hover:text-[#0078D4] transition-colors fill-current" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 32h214.6v214.6H0V32zm233.4 0H448v214.6H233.4V32zM0 265.4h214.6V480H0V265.4zm233.4 0H448V480H233.4V265.4z" />
              </svg>
              <span className="font-body font-semibold text-3xl md:text-4xl tracking-tight leading-none text-obsidian/60 group-hover:text-[#0078D4] transition-colors">Outlook</span>
            </div>
          </div>
        </div>
      </section>

      {/* Combined CTA & Manifesto Block */}
      <section className="w-full py-32 md:py-48 px-6 md:px-12 bg-mcgill-light flex items-center justify-center text-center">
        <div className="max-w-screen-md reveal-on-scroll flex flex-col items-center">
          <Sun width={48} height={48} strokeWidth={1} className="mb-12 opacity-80 animate-spin-slow mx-auto text-mcgill" style={{ animationDuration: '10s' }} />

          <p className="font-display text-4xl md:text-6xl tracking-tight italic leading-tight mb-16">
            "Exams are stressful enough. Finding when they are shouldn't be."
          </p>

          <button
            onClick={onStart}
            className="flex items-center gap-3 px-8 py-4 border border-obsidian hover:bg-obsidian hover:text-cream transition-colors duration-300 rounded-full group cursor-pointer"
          >
            <span className="text-sm uppercase tracking-widest font-body">Begin the Search</span>
            <Compass width={20} strokeWidth={1.5} className="group-hover:rotate-45 transition-transform duration-500" />
          </button>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="w-full py-8 px-6 md:px-12 bg-mcgill-light flex flex-col md:flex-row justify-between items-center gap-4 border-t border-obsidian border-opacity-10 text-center md:text-left">
        <div className="flex flex-col gap-1">
          <span className="font-body text-xs opacity-40 font-medium tracking-wide">© FindMyExams McGill</span>
          <span className="font-body text-[10px] md:text-xs opacity-40 max-w-lg mt-1">
            Disclaimer: This is not an official McGill University website. The exam schedule is tentative and subject to change. Always verify your schedule with official university sources.
          </span>
        </div>
        <div className="flex gap-4 opacity-40 uppercase text-xs tracking-widest mt-4 md:mt-0">
          Made by Hamza
        </div>
      </footer>

    </div>
  )
}
