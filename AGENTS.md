# Project Guidelines & Memory for AI Agents (AGENTS.md)

This file contains permanent instructions and guidelines for AI agents working on this codebase. **You MUST read and strictly adhere to these guidelines before making any edits or improvements.**

---

## 🛡️ Core Regression-Prevention & Quality Protocol

When making ANY code changes or requested improvements in this project, you MUST strictly observe the following rules:

### 1. 🎯 Surgical Scope & Impact Analysis
- **Read Before Edit:** Always inspect the target file AND its dependent components before modifying code.
- **Do Not Remove Working Logic:** Never delete, disable, or alter existing props, state variables, useEffect hooks, or event handlers unless explicitly requested by the user.
- **Targeted Edits:** Make surgical, localized changes rather than rewriting entire files or large code blocks.

### 2. 🧩 Component & Flow Preservation
- **State Machine Protection:** Maintain the existing 5-phase teaching lifecycle (`intro` -> `concept` -> `example` -> `doubt` -> `transition`) in `server.ts` and `useLiveSession.ts`.
- **Whiteboard Idempotency:** Preserve string normalization and deduplication logic in whiteboard update handlers (`App.tsx`, `ClassroomBoard.tsx`).
- **LaTeX & SVG Typewriter Sync:** Preserve instant atomic rendering for LaTeX math blocks (`$$`, `\[`, `\begin{`) and smooth adaptive typewriter speed in `ChalkTypewriter.tsx` and `VectorDisplay.tsx`.
- **Audio & Live Session Safety:** Do not break WebSocket streaming, PCM audio playback, or VAD parameters when updating UI components.

### 3. 🛡️ Type Safety & Contract Guarantee
- Keep all shared TypeScript interfaces consistent across client and server files.
- If a prop or state structure changes in one component, verify and update all parent and child components accordingly.

### 4. 🔍 Mandatory Verification Workflow
Before marking any task as complete:
1. Run `lint_applet` to catch any TypeScript or syntax issues.
2. Run `compile_applet` to verify that the app builds cleanly with zero errors.
3. Restart the dev server (`restart_dev_server`) if server-side code in `server.ts` was modified.

---

## 📱 Mobile-First Native UI & UX Rule (Permanent Memory)

- **Mobile-First Paradigm**: The entire user interface must strictly follow a 100% Mobile-First native mobile app design philosophy.
- **Form Factor & Dimensions**: All screens, layouts, modals, sheets, bottom navigation bars, and overlays must be crafted primarily for smartphone screens (viewports, touch ergonomics, thumb-friendly touch targets ≥ 44px, safe area padding, and compact vertical spacing).
- **Desktop/Large Screen Behavior**: On desktop or large screens, the interface must remain centered and framed cleanly as a focused mobile app canvas (e.g., `max-w-md` or `max-w-lg` container centered with responsive ergonomics) rather than sprawling into multi-column desktop web layouts.
- **Future Design Execution**: Every newly designed component, page, or interaction must strictly be designed for mobile first without exception.

---

## 🎨 Mandatory Brand Color Palette & Design System Rule (Permanent Memory)

Whenever modifying, designing, or styling ANY page, screen, modal, card, or UI component, you **MUST STRICTLY** adhere to this exact branding color combination:

### 1. Primary Brand Accent (Interactive & Action Color)
- **Primary Indigo / Electric Violet:** `#796AEF` (`indigo-600` / `indigo-700` in Tailwind)
  - **Usage:** Primary CTA buttons, active navigation tabs, brand highlights, topic selection badges, icons, and AI action triggers.
- **Soft Violet Tint:** `indigo-50` / `indigo-100` (`#EEF2FF`)
  - **Usage:** Active tab backgrounds, subtle selected chips, badge pills, and soft highlight borders.

### 2. Canvas & Surface Neutrals (Clean Slate Theme)
- **Background Canvas:** `slate-50` / `#F8FAFC` and pure `#FFFFFF` for cards/sheets/modals.
- **Borders & Dividers:** `slate-200` / `slate-100` / `#E2E8F0` for subtle, clean structure.
- **Typography:**
  - **Headings & Primary Text:** `slate-900` / `slate-800` (`#0F172A` / `#1E293B`)
  - **Secondary & Caption Text:** `slate-500` / `slate-600` (`#64748B` / `#475569`)

### 3. Socratic Classroom Theme (Live Whiteboard)
- **Deep Emerald Blackboard Canvas:** `#0A1B16` / `#0C201A` (`emerald-950` / `#0c201a`)
- **Chalk Accents:**
  - **Bright Chalk White:** `#FFFFFF` (standard explanation text)
  - **Golden Amber:** `#FCD34D` / `amber-300` (definitions & key formulas)
  - **Mint Emerald:** `#34D399` / `emerald-400` (step-by-step intuition & equations)
  - **Rose Pink/Red:** `#FB7185` / `rose-400` (common mistakes & trap warnings)

### 4. Functional & Gamification Accents
- **Amber / Gold (`amber-500` / `#F59E0B`):** XP points, battle streaks, trophy badges, and rankings.
- **Emerald Green (`emerald-600` / `emerald-500`):** Correct answers, accuracy rates, and completed modules.
- **Rose / Crimson (`rose-500` / `rose-600`):** Error/mistake tags, PYQ blindspots, and critical alerts.

**Rule:** Never introduce unapproved random color schemes (e.g., cyan/neon, random purples, orange headers). Always use this unified palette.

---

