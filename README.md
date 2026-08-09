# Pyramid — Full-Stack Task Management System & AbleSpace Assessment

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/Backend-NestJS-E0234E?style=for-the-badge&logo=nestjs)](https://nestjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?style=for-the-badge&logo=sqlite)](https://www.sqlite.org/)

**GitHub Repository:** [https://github.com/Kunal-CodeLab/AbleSpace](https://github.com/Kunal-CodeLab/AbleSpace)

A full-stack, enterprise-grade Task Management System built for **AbleSpace Technical Assessment**, adhering to the provided Figma design with 100% pixel perfection, paired with an executive product understanding report for Part 2.

---

## Table of Contents
- [What Was Built](#what-was-built)
- [Challenges & Problems Faced](#challenges--problems-faced)
- [How Problems Were Solved](#how-problems-were-solved)
- [Technical Highlights & Design Fidelity](#technical-highlights--design-fidelity)
- [Architecture Diagram](#architecture-diagram)
- [Quick Start & Running Locally](#quick-start--running-locally)
- [Build & Verification Commands](#build--verification-commands)

---

## What Was Built

This project is a high-performance, full-stack Task Management Application named **Pyramid**, developed specifically for the **AbleSpace Technical Assessment**. It is designed to match the provided Figma mockups with 100% design fidelity and responsiveness.

### Core Components Developed:
1. **Default Entry & Authentication Flow**:
   - `http://localhost:3000/` loads the **`1.PNG` Login Screen** featuring the Pyramid branding, Google OAuth interface, and a **"Continue as Guest"** option.
   - Guest authentication automatically provisions a demo session with pre-populated workspaces, projects, and tasks.

2. **Kanban Task Board (`2.PNG`)**:
   - 4 dynamic status columns (*To Do*, *Doing*, *Completed*, *On Hold*).
   - Card features include assignee avatars, reddish due date badges (`29 Jul`), tag pills, watcher counters, and inline column task creation triggers.

3. **Tabular List View (`photo_17-51-42.jpg`)**:
   - Collapsible accordion groups organized by status.
   - Signal-strength priority indicators (*High*, *Medium*, *Low*, *Urgent*).
   - Global keyboard shortcut live search (`⌘F` / `Ctrl+F`).

4. **Task Detail Drawer (`photo_17-51-48.jpg`)**:
   - Slide-over drawer with real-time editing of titles, descriptions, and status selectors.
   - Interactive subtask management with progress tracking.
   - Nested comments feed with instant replies.
   - Date-range calendar pickers, priority popover selectors, and real-time activity update logs.

5. **Dynamic Theme & Color Swatch System**:
   - Persistent Light/Dark themes saved to `localStorage`.
   - 6 dynamic accent color modes (*Amber*, *Blue*, *Pink*, *Rose*, *Emerald*, *Black*).

6. **Executive Product Analysis (Part 2)**:
   - In-depth product analysis saved at: **[`docs/Part2_AbleSpace_Product_Analysis.md`](file:///c:/Users/Anonymous/Downloads/AbleSpace/docs/Part2_AbleSpace_Product_Analysis.md)** covering the **Caseload -> "Take Data"** workflow, trial tracking paradigms, and 5 actionable UX/UI recommendations.

---

## Challenges & Problems Faced

During the development of this enterprise task management system, several complex full-stack engineering challenges arose:

### 1. State Synchronization Across Kanban, List View & Drawer
- **The Problem**: Updating a task's status, priority, or subtasks inside the slide-over Drawer often failed to reflect immediately across the Kanban board columns or Tabular List accordion without executing heavy full-page API refetches. This caused UI flickering, lag, and temporary state desynchronization between different views.

### 2. SSR Hydration Mismatch & Theme Flashing (FOUC)
- **The Problem**: Implementing 6 accent color swatches along with Light/Dark mode in Next.js 14 App Router caused Next.js Server-Side Rendering (SSR) hydration warnings (`Text content does not match server-rendered HTML`). Furthermore, reading theme preferences from `localStorage` on page load caused an annoying flash of unstyled content (FOUC).

### 3. N+1 Query Bottlenecks & Complex Relational Payload Nesting
- **The Problem**: Tasks require deep relational data (assignees, subtasks, nested comments, tags, activity history). Fetching or creating tasks without optimal query structure in Prisma ORM resulted in N+1 relational database queries and incomplete payload structures sent to the frontend.

### 4. Frictionless Guest Authentication & Relational Integrity
- **The Problem**: Requiring users to sign up before testing reduces reviewer experience. However, creating a guest mode without proper session mapping leads to orphan records or broken user-relation dependencies (e.g. `createdBy`, `assignedTo`, comment authors).

---

## How Problems Were Solved

To ensure a smooth, production-grade application, each problem was systematically solved using modern architecture patterns:

### 1. Centralized Zustand Store with Optimistic UI Updates
- **The Solution**: Built a global state manager using **Zustand**. When a task is dragged, status-toggled, or edited in the drawer, the UI updates **optimistically** in real time across both Kanban and Tabular views simultaneously. Backend REST API requests occur asynchronously in the background. If a network error occurs, state changes are automatically rolled back.

### 2. CSS Custom Variables & Client-Side Hydration Guard
- **The Solution**: Theme colors and accent swatches were mapped directly to CSS variables (`var(--accent-color)`, `var(--bg-primary)`). A custom `ThemeProvider` component with a mounted status check was created to safely read `localStorage` values on the client side after initial mount. This completely eliminated Next.js SSR hydration warnings and prevented theme flashing.

### 3. NestJS Modular Feature Architecture & Prisma Eager Loading
- **The Solution**: Structured the NestJS backend into modular feature controllers (`TasksModule`, `ProjectsModule`, `UsersModule`). Prisma queries were optimized using explicit `include` directives (`include: { assignee: true, subtasks: true, comments: true, tags: true }`), ensuring full nested task graphs are fetched in a single efficient query execution.

### 4. Ephemeral Guest Session Token & Seeding Script
- **The Solution**: Engineered a Guest Authentication strategy that automatically assigns a persistent guest session token linked to a pre-configured demo user in SQLite. Paired with a robust database seed script (`src/seed.ts`), evaluators can instantly click **"Continue as Guest"** and interact with realistic data right away.

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
- Breakdown of the **Caseload -> "Take Data"** workflow, trial data tracking paradigms, and 5 actionable UX/UI recommendations.

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
