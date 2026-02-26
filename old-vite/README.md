# FindMyExams - McGill

FindMyExams is a modern, high-performance web application designed for students at McGill University to effortlessly find and manage their final exam schedules. By simply entering their course codes, students can instantly see their personalized exam dates, times, and locations, with seamless export options to major calendar platforms.

![Landing Hero Shot](file:///Users/hamza/.gemini/antigravity/brain/77a7ce1b-6b1f-49ac-b01c-0d6d72c9f1b6/landing_font_fixed_1772098635584.png)

## 🚀 Key Features

- **Instant Personalized Schedules**: Enter course codes (e.g., `COMP 250`) and get an immediate, aggregated schedule.
- **Smart Calendar Exports**: Export individual exams or your entire schedule directly to **Google Calendar**, **Apple Calendar**, or **Microsoft Outlook**.
- **Precise Filtering**: Supports section-level filtering (e.g., `MATH 240 001`) for large courses with multiple exam sessions.
- **Modern UI/UX**: Built with a sleek, minimalist design featuring:
  - **Inter & Geist Sans** typography
  - **Glassmorphism** effects and soft red/white McGill-inspired color palette
  - **Animated Backgrounds** with subtle dot patterns
  - **Hover Animations** for interactive elements and feature highlights

## 🛠️ Technical Architecture

FindMyExams is built using a modern, lightweight tech stack focused on speed and developer experience.

- **Frontend**: [React 19](https://reactjs.org/)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with custom design tokens
- **Icons**: [Lucide React](https://lucide.dev/)
- **Hosting**: Designed for static hosting on platforms like Vercel or GitHub Pages.

## 📦 Project Structure

```bash
src/
├── components/     # Reusable UI components (ExamCard, Results, etc.)
├── data/           # Exam data sources
├── lib/            # Utility functions (calendar export logic)
├── App.jsx         # Main application coordinator
└── index.css       # Global design system & Tailwind @theme
```

## 🪜 Getting Started

To run this project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd mcgill-finals-build
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## 🛡️ License

Private project created for the McGill University student community.
