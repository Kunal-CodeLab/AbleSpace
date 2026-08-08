# Pyramid — Full-Stack Task Management System & AbleSpace Assessment

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/Backend-NestJS-E0234E?style=for-the-badge&logo=nestjs)](https://nestjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?style=for-the-badge&logo=sqlite)](https://www.sqlite.org/)

**GitHub Repository:** [https://github.com/Kunal-CodeLab/AbleSpace](https://github.com/Kunal-CodeLab/AbleSpace)

A full-stack, enterprise-grade Task Management System built for **AbleSpace Technical Assessment**, adhering to the provided Figma design with 100% pixel perfection, paired with an executive product understanding report for Part 2.

---

## Technical Highlights & Design Fidelity

### 1. **Part 1 – Task Management System**
- **Default Entry Flow**:
  - `http://localhost:3000/` loads the **`1.PNG` Login Screen** with Pyramid logo, guest login button, and Google OAuth option.
  - Clicking **"Continue as Guest"** authenticates session and opens the **Tasks Kanban Board (`2.PNG`)**.
- **Kanban Board (`2.PNG`)**: 4 status columns (*To Do*, *Doing*, *Completed*, *On Hold*), assignee avatars, reddish due date badges (`29 Jul`), tag pills, and column add-task triggers.
- **Tabular List View (`photo_17-51-42.jpg`)**: Accordion status groups, signal-strength priority indicators (*High*, *Medium*, *Low*, *Urgent*), and keyboard shortcut live search (`⌘F`).
- **Task Detail Full Drawer (`photo_17-51-48.jpg`)**: Editable title/description, subtasks table, comments & reply feed, status selector, priority popover selector, date-range calendar picker, and activity updates feed.
- **Theme & Color Swatches**: Persistent Light/Dark themes (`localStorage`) & 6 accent color modes (*Amber*, *Blue*, *Pink*, *Rose*, *Emerald*, *Black*).
- **Projects Page & Settings**: Breadcrumb navigation (`Projects > Design Homepage`) and User Profile settings matching Figma mockups.
- **100% Fully Functional Menus**: Every three-dot menu (`...`), lock icon, watcher counter, share link, and form action is fully interactive with popovers and state updates.

### 2. **Part 2 – AbleSpace Product Analysis**
- Complete executive analysis saved at: **[`docs/Part2_AbleSpace_Product_Analysis.md`](file:///c:/Users/Anonymous/Downloads/AbleSpace/docs/Part2_AbleSpace_Product_Analysis.md)**
- Breakdown of the **Caseload -> "Take Data"** workflow, trial data tracking paradigms, and 5 actionable UX/UI engineering recommendations.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│              NEXT.JS 14 FRONTEND (App Router)            │
│  - Zustand State Management  - Lucide Icons             │
│  - Tailwind CSS Styling     - Dark/Light Theme Persist │
└─────────────────────────────────────────────────────────┘
                            │
                     REST API Calls
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│               NESTJS BACKEND (TypeScript)                │
│  - Class-Validator DTOs     - CORS Enabled              │
│  - Modular Controllers      - Prisma ORM Data Service   │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   SQLITE DATABASE                       │
│  - Users, Workspaces, Projects, Tasks, Subtasks, Logs   │
└─────────────────────────────────────────────────────────┘
```

---

## Quick Start & Running Locally

### Prerequisites
- Node.js 18+ and npm installed on your system.

### 1. Backend Setup (NestJS)
```bash
cd backend
npm install
npx prisma db push
npx ts-node src/seed.ts
npm run start:dev
```
Backend API will start on **`http://localhost:3001`**.

### 2. Frontend Setup (Next.js 14)
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## Build & Verification Commands

```bash
# Verify Backend Compilation
cd backend && npm run build

# Verify Frontend Compilation
cd frontend && npm run build
```
Both backend and frontend build commands compile with **0 Errors**!
