# FindMyExams McGill

Find your McGill **Fall 2026 final exams** using the **tentative December 2026 schedule**. Search by course and section, then export your schedule to Google Calendar, Apple Calendar, or Outlook.

Live site: [findmyexams.app](https://www.findmyexams.app)

## Current schedule

- **Source:** [McGill December 2026 tentative schedule](public/schedules/december_2026_tentative_schedule_2.pdf).
- **Coverage:** 798 unique exam entries from 799 rows across 19 pages. The PDF repeats CIVE 320 section 001 once; the app includes it once.
- **Dates:** Fall 2026 only, including GEOG 417's November 15–29 take-home window. Previous-semester exam data is not used by the active app.
- **Time zone:** Montreal local time, Eastern Standard Time (EST), for these exam dates.
- **Locations:** Building and room assignments are currently omitted from the interface and calendar exports. Campus names are shown where supplied in the PDF. Rooms will be added when the updated schedule is available.
- **Status:** Tentative. Dates and times may change; confirm your exams against the university's latest schedule.

This is an independent student project, not an official McGill University website.

## Search and calendar exports

Enter a course such as `COMP 251`, `NUR1 221`, or `ECON 230D1`. Add a section to narrow the results, for example `ANAT 315 001L`. Course codes also work without spaces.

Results combine sections that share the same exam type and time. Separate lab exams and multi-day take-home windows remain distinct.

- **Google Calendar:** Opens a prefilled event with Fall 2026 dates and the `America/Toronto` time zone.
- **Apple Calendar / Outlook:** Download an `.ics` file for one exam or use **Export All** for the full selected schedule. Events are marked tentative and include Fall 2026 in their titles.
- **Existing imports:** Calendar exports are snapshots, not subscriptions. Previously imported events do not automatically change when the website is updated.

Course lookup runs in the browser and does not require an account. The site uses Vercel Analytics and Speed Insights.

## Local development

```bash
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000).

```bash
npm run build  # Production build and TypeScript checks
npm run start  # Serve the production build
npm run lint   # ESLint (currently includes pre-existing issues and archived code)
```

The stack is Next.js 16, React 19, TypeScript, Tailwind CSS 4, and Lucide icons. Instrument Serif and Manrope are loaded through `next/font/google`; builds need access to Google Fonts.

## Verify or regenerate exam data

The checked-in PDF is the source for `src/data/exams.ts`. With Python 3 and Poppler installed (`brew install poppler` on macOS):

```bash
python3 scripts/import-schedule.py public/schedules/december_2026_tentative_schedule_2.pdf --check
python3 scripts/import-schedule.py public/schedules/december_2026_tentative_schedule_2.pdf
```

The importer checks the schedule heading, course and section formats, dates, row count, and duplicate count. It records the source PDF's SHA-256 in the generated file. Its checks are specific to this schedule revision; update them and review every imported row when replacing the PDF.

## Deployment

The Vercel project is `mcgillfinalsapp`, connected to this repository's `main` branch. The application root is the repository root, with the Next.js framework preset and `npm run build`.

After pushing, verify that Vercel creates a successful production deployment whose source commit matches GitHub's latest `main` commit. A successful Git push alone does not confirm that the live site has updated.

`old-vite/` is archived code and is not the active application or deployment root.
