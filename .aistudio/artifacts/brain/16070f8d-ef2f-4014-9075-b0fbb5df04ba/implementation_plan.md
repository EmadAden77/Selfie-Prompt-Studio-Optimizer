# Selfie Prompt Studio & Optimizer

A specialized studio for architecting ultra-realistic smartphone selfie prompts for AI image generators (Midjourney, ChatGPT/DALL-E, Imagen). The application enforces strict "Subject-First" composition hierarchy (80% framing dominance) and locks reference biometric identity (195cm, 88kg, exact facial density and grooming) while empowering users with live visual simulation, dedicated prompt editing, and Gemini 3.8 Flash intelligence for automated scenario creation and prompt enrichment.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following requirements and design choices were confirmed during Phase 1:

- **Confirmed Decision 1 (Gemini AI Integration)**: Server-side Gemini 3.8 Flash integration via `@google/genai` to automatically generate hyper-realistic everyday candid scenarios and optimize existing prompts without breaking composition rules.
- **Confirmed Decision 2 (Biometric Identity Lock)**: Strictly enforce single-reference identity consistency (195cm stature, 88kg athletic build, un-gelled natural hair density, exact un-lasered beard contour, organic cheek freckles) to eliminate contradictions, AI drift, or facial hallucination.
- **Confirmed Decision 3 (Interactive Visual Simulator)**: A live SVG/Canvas visual preview simulator dynamically reflecting the chosen framing, smartphone angle, interior/exterior vehicle zone, lighting ambiance, and attire tension.
- **Confirmed Decision 4 (Dedicated Prompt Editor & Quick Copy)**: A full-featured editor supporting live manual tweaks, split Arabic/English inspection, instant clipboard synchronization, and session bookmarking.

---

## 1. Overview & Core Concept

### What It Does
Selfie Prompt Studio transforms high-end generative AI prompting from guesswork into an exact, physics-grounded craft. Many image models mistakenly zoom out or produce commercial-style catalog images whenever vehicles or environments are mentioned. This application generates mathematically disciplined prompts that force the AI engine to treat the reference person as the undisputed foreground subject (80% frame presence) with arm-length smartphone optics, real human asymmetry, subdermal light scattering, and subtle cabin/street ambience.

### Target Audience & Persona
- Digital creators and AI portrait artists looking for candid, unposed, social-media-native realism (Snapchat / Instagram style).
- Saudi and Gulf-based creators crafting culturally authentic, high-fidelity lifestyle imagery in modern settings (Land Cruiser LC300, Patrol, desert highways, specialty cafes).

### Key Value
- **Zero AI "Slop"**: Automatically eliminates plastic airbrushed skin, exaggerated studio backlights, and false automotive framing.
- **Biometric Consistency**: Locks the subject's exact hair density, beard geometry, eye gaze, and 195cm scale cues.
- **AI-Powered Acceleration**: One-click Gemini scenario brainstorming and prompt refinement that respects all strict constraints.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Interactive Studio Flow (5 Structured Steps)**:
   - **Step 1: Reference Identity & Expressions**: Hair flow, beard trim, facial micro-expressions (unclenched jaw, sun squint), and 195cm stature cues.
   - **Step 2: Camera & Framing Geometry**: 80% close-up / half-body / wide arm-reach, smartphone sensor choice (iPhone 16 Pro Max, raw Snapchat), aspect ratios (9:16, 4:5, 1:1, 16:9), and angles.
   - **Step 3: Attire & Candid Storyline**: Crisp white custom thobe, relaxed black crewneck, casual linen, paired with authentic reasons (waiting at red light, post-gym dusk, Friday prayer).
   - **Step 4: Incidental Environment & Vehicle**: Subtle Land Cruiser, Patrol, or Yukon cabin hints, legal nano-ceramic window tints, and ambient location lighting.
   - **Step 5: Dermal & Optical Micro-Physics**: Subsurface ear cartilage glow, cotton thobe chin bounce light, cold cup condensation, and CMOS sensor chroma noise.
2. **Live Visual Simulator Panel**:
   - Updates synchronously alongside controls to display an abstract wireframe/silhouette representing the camera viewfinder, lighting angle, phone orientation, seat geometry, and subject presence.
3. **Gemini AI Intelligence Drawer**:
   - **"Auto-Generate Scenario"**: Proposes creative candid scenarios (e.g., golden hour highway road trip, rain droplets on windshield after dusk).
   - **"Optimize & Enhance Prompt"**: Analyzes current selections and adds ultra-fine sensory nuances while checking for contradictory tokens.
4. **Prompt Editor & Clipboard Station**:
   - Side-by-side or tabbed Arabic & English output with syntax highlighting, inline manual editing, token tag badges, and one-click copy.
5. **Session Vault**:
   - Instant local storage for saving, naming, favoriting, and restoring up to 50 custom prompt recipes.

### Visual Identity & Theme
- **Aesthetic Direction**: High-precision creative utility & studio console (Clean dark theme with warm slate undertones and emerald accents).
- **Color Palette (60-30-10 Rule)**:
  - Canvas (60%): Deep obsidian neutral (`#09090b` / `bg-zinc-950`).
  - Structural Surfaces (30%): Elevated card panels (`#18181b` / `bg-zinc-900`), hairline borders (`#27272a` / `border-zinc-800`), clean typography (`text-zinc-100`, `text-zinc-400`).
  - Accent Budget (10%): High-intent emerald green (`#10b981` / `bg-emerald-600`) and warm amber for lighting badges.
- **Typography**:
  - Primary UI & Headlines: `Plus Jakarta Sans` / clean Arabic typography (`Tajawal` / system fallback).
  - Prompts & Code Blocks: `JetBrains Mono` / monospace tabular numerals for coordinate scaling.
- **Interaction Feedback**:
  - Subtle spring transitions on step selection.
  - Floating toast notifications confirming copy actions.
  - Interactive radar/viewfinder canvas for optical framing.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Server-Side Full-Stack Architecture with Express & TSX
- **Chosen Approach**: Build a unified Express server (`server.ts`) running `@google/genai` server-side, serving the Vite React frontend in development and production.
- **Why**: Keeps the `GEMINI_API_KEY` strictly secret on the server while allowing instant generation of smart scenarios and prompt optimization without client-side API leaks.
- **Alternatives Considered**: Direct browser SDK calls (rejected due to security risks and API key exposure rules).

### Decision 2: Reference Biometric Invariance vs Multiple Personas
- **Chosen Approach**: Hard-lock the biometric baseline (195cm height, 88kg athletic frame, original hair density, authentic un-lasered beard, eye gaze, cheek freckles) into the core prompt templates.
- **Why**: Protects the user from image model hallucination and conflicting descriptions (the primary cause of deformed faces and altered hair/beard in Midjourney and ChatGPT).

### Decision 3: Reactive Two-Way Prompt Architecture
- **Chosen Approach**: Parameters dynamically compute clean Arabic and English prompts, but users can edit the output directly in a live editor without destroying their selection state, with a "Re-sync from controls" button.
- **Why**: Power users often need to tweak 2-3 specific words right before pasting into Midjourney without losing their preset options.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌───────────────────────────────────────────────────────────┐
│                    Browser Client (React)                 │
│                                                           │
│  ┌─────────────────┐  ┌────────────────┐  ┌─────────────┐ │
│  │ 5-Step Studio   │  │ Live Viewfinder│  │ Prompt Deck │ │
│  │ Configuration   │  │ Visualizer SVG │  │ & Live Edit │ │
│  └────────┬────────┘  └───────┬────────┘  └──────┬──────┘ │
│           │                   │                  │        │
│           └───────────────────┼──────────────────┘        │
│                               ▼                           │
│                   State Engine (Zustand/React)            │
│                     + LocalStorage Sessions               │
└───────────────────────────────┬───────────────────────────┘
                                │ Fetch /api/gemini/*
                                ▼
┌───────────────────────────────────────────────────────────┐
│                  Server Side (Express / TSX)              │
│                                                           │
│  ┌────────────────────────┐    ┌───────────────────────┐  │
│  │ POST /api/gemini/      │    │ POST /api/gemini/     │  │
│  │ generate-scenario      │    │ optimize-prompt       │  │
│  └───────────┬────────────┘    └───────────┬───────────┘  │
│              │                             │              │
│              ▼                             ▼              │
│       @google/genai SDK (models/gemini-3.8-flash)         │
│          User-Agent: 'aistudio-build'                     │
│          API Key: process.env.GEMINI_API_KEY              │
└───────────────────────────────────────────────────────────┘
```

### Data Models & State Structure

```typescript
interface StudioState {
  // Reference Subject
  hairId: string;
  beardId: string;
  anatomicalExprId: string;
  heightCueId: string;
  skinNuanceIds: string[];

  // Framing & Optics
  frameId: string;
  aspectId: string;
  phoneId: string;
  angleId: string;
  poseId: string;
  gripMotionIds: string[];
  opticalIds: string[];

  // Style & Situation
  clothId: string;
  accessoryId: string;
  storylineId: string;

  // Car & Environment
  locId: number;
  carModelId: string;
  carColorId: string;
  tintId: string;
  lightId: string;
  cabinIds: string[];
  dashUiIds: string[];
  clutterIds: string[];

  // Micro Physics
  subsurfaceIds: string[];
  fabricIds: string[];
  thermalIds: string[];
  appUiIds: string[];

  // Manual Editor Overrides
  customPromptAr?: string;
  customPromptEn?: string;
  isCustomEdited: boolean;
}
```

### Server API Endpoints
- `POST /api/gemini/generate-scenario`: Accepts mood/theme keywords (or random) and returns a complete curated scenario configuration adhering to the subject-first rule.
- `POST /api/gemini/optimize-prompt`: Accepts current prompt text and returns enriched prompt improvements with hyper-realistic sensory details.

---

## 5. Implementation Steps (Planned Turn-by-Turn)

1. **Backend Server Setup**:
   - Create `server.ts` with Express and `@google/genai` SDK using `gemini-3.8-flash`.
   - Update `package.json` dev script to `"tsx server.ts"`.
   - Update `metadata.json` with app title, description, and `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`.
   - Update `index.html` title and OpenGraph metadata.
2. **Frontend UI Components**:
   - `src/components/ViewfinderSimulator.tsx`: Interactive SVG viewfinder visualizer indicating camera angle, framing percentage, and lighting source.
   - `src/components/PromptEditorModal.tsx`: Side-by-side editing station with token tags and diff highlighting.
   - `src/components/GeminiAssistantPanel.tsx`: Instant scenario generator and prompt optimizer with loading states.
   - `src/components/StepSections.tsx`: Polished 5-step interactive controls without pills or AI slop.
3. **Core Application Integration**:
   - Update `src/App.tsx` with full state management, preset loading, session persistence, and instant bilingual copying.
   - Verify compilation and test responsiveness across desktop and mobile.
