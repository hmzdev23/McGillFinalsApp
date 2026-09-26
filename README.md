# FindMyExams McGill

A fast, privacy-first interface to locate your Fall 2026 finals using McGill's tentative December 2026 schedule.

## Schedule data

The source is `public/schedules/december_2026_tentative_schedule_2.pdf`, supplied from Downloads. It contains 799 rows across 19 pages, including one identical duplicate for CIVE 320 section 001. The app includes all 798 unique entries, including GEOG 417's November 15–29 take-home window. Room locations have not yet been published; no April room assignments are retained. All times are Montreal local time (EST), and calendar exports identify the schedule as tentative.

Regenerate or verify the data using Python 3 and Poppler (`brew install poppler`):

```bash
python3 scripts/import-schedule.py public/schedules/december_2026_tentative_schedule_2.pdf
python3 scripts/import-schedule.py public/schedules/december_2026_tentative_schedule_2.pdf --check
```

The importer validates this PDF's row count and date format before writing the dataset. A future schedule revision may require updating those checks.

## Features

- **Instant Search**: Type your course codes and immediately see your exam schedule.
- **Filtering**: Filter by specific sections to cut out the noise.
- **Calendar Integration**: Export your exam schedule directly to Apple Calendar, Google Calendar, or Outlook.
- **Privacy-First**: All data is processed locally. No sign-ups required.

## Tech Stack

This project was recently revamped to utilize a modern, highly performant stack:

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Icons**: Lucide React
- **Analytics & Performance**: Vercel Analytics and Speed Insights
- **Typography**: `Instrument Serif` (Display) and `Manrope` (Body) via `next/font/google`

## Aesthetic & Design

The UI has been completely overhauled to reflect a sophisticated, editorial design pattern. 

- **Colors**: Warm Cream (`#FBF7EF`), Soft Black (`#141414`), and McGill Red (`#ED1B2F`) for accents.
- **Layout**: Generous negative space, delicate 1px borders, and large typographic forms replacing standard web card layouts.
- **Motion**: Subtle, elegant CSS animations (fade-ins, staggered reveals).

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

This project is configured for seamless deployment on [Vercel](https://vercel.com/).
