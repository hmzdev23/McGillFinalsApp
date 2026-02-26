import { ArrowRight, Zap, Calendar, Download, Search, Clock, FileDown } from 'lucide-react'
import BGPattern from './BGPattern'

function Feature({ title, description, icon, index, total }) {
  const isTopRow = index < Math.ceil(total / 2)

  return (
    <div
      className="feature-hover-item"
      style={{
        borderRight: (index + 1) % 3 !== 0 ? '1px solid #f3f4f6' : 'none',
        borderBottom: isTopRow ? '1px solid #f3f4f6' : 'none',
      }}
    >
      {/* Gradient hover overlay */}
      <div className={`feature-hover-gradient ${isTopRow ? 'from-bottom' : 'from-top'}`} />

      {/* Icon */}
      <div className="feature-hover-icon">
        {icon}
      </div>

      {/* Title with accent bar */}
      <div className="feature-hover-title-row">
        <div className="feature-accent-bar" />
        <span className="feature-hover-title">{title}</span>
      </div>

      {/* Description */}
      <p className="feature-hover-desc">{description}</p>
    </div>
  )
}

export default function Landing({ onStart }) {
  const features = [
    {
      title: "Instant Search",
      description: "Type your course codes and get your personalized exam schedule in one click.",
      icon: <Search />,
    },
    {
      title: "Smart Matching",
      description: "Automatically deduplicates sections and groups exams by date for easy reading.",
      icon: <Zap />,
    },
    {
      title: "Calendar Export",
      description: "Add individual exams to Google Calendar or Apple Calendar with one tap.",
      icon: <Calendar />,
    },
    {
      title: "Exam Details",
      description: "See exam type, time, location, and availability window at a glance.",
      icon: <Clock />,
    },
    {
      title: "Bulk Download",
      description: "Export all your exams at once as a single .ics file for any calendar app.",
      icon: <Download />,
    },
    {
      title: "Section Filtering",
      description: "Use 'COMP 251 001' format to filter by specific section numbers.",
      icon: <FileDown />,
    },
  ]

  return (
    <div className="landing">
      {/* Hero Card */}
      <div className="hero-card">


        {/* Dot grid pattern with fade-edges mask */}
        <BGPattern
          variant="dots"
          mask="fade-edges"
          size={20}
          fill="rgba(237, 27, 47, 0.12)"
        />

        {/* Content */}
        <div className="hero-content">
          <div className="animate-fade-in-up">
            <div className="hero-badge">
              <span className="dot" />
              <span>April 2026 Exam Period</span>
            </div>
          </div>

          <h1 className="animate-fade-in-up delay-100">
            Find your <span className="accent">exams</span> in seconds.
          </h1>

          <p className="hero-subtitle animate-fade-in-up delay-200">
            Add your McGill courses, get your personalized final exam schedule,
            and export directly to your calendar.
          </p>

          <div className="animate-fade-in-up delay-300">
            <button className="btn-cta" onClick={onStart}>
              <span>Get Started</span>
              <span className="icon-circle">
                <ArrowRight />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Feature section with hover effects */}
      <div className="features-hover-grid">
        {features.map((feature, index) => (
          <Feature
            key={feature.title}
            {...feature}
            index={index}
            total={features.length}
          />
        ))}
      </div>

      <div className="landing-footer">
        © {new Date().getFullYear()} FindMyExams · McGill University
      </div>
    </div>
  )
}
