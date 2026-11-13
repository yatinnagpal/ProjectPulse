---
name: ProjectPulse Precision SaaS
colors:
  surface: '#fcf8fb'
  surface-dim: '#dcd9dc'
  surface-bright: '#fcf8fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f2f5'
  surface-container: '#f0edf0'
  surface-container-high: '#eae7ea'
  surface-container-highest: '#e5e1e4'
  on-surface: '#1c1b1d'
  on-surface-variant: '#464555'
  inverse-surface: '#313032'
  inverse-on-surface: '#f3f0f2'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#005338'
  on-tertiary: '#ffffff'
  tertiary-container: '#006e4b'
  on-tertiary-container: '#67f4b7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#fcf8fb'
  on-background: '#1c1b1d'
  surface-variant: '#e5e1e4'
typography:
  display:
    fontFamily: Inter
    fontSize: 3rem
    fontWeight: '600'
    lineHeight: 3.5rem
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Inter
    fontSize: 2rem
    fontWeight: '600'
    lineHeight: 2.5rem
    letterSpacing: -0.025em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '600'
    lineHeight: 1.5rem
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.375rem
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1.125rem
    letterSpacing: 0.005em
  label-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '500'
    lineHeight: 1.25rem
    letterSpacing: 0em
  label-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '500'
    lineHeight: 1rem
    letterSpacing: 0.01em
  mono-metric:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: '500'
    lineHeight: 1rem
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system targets modern product teams, engineering leads, and fast-moving organizations requiring high-velocity project tracking alongside automated AI synthesis. The aesthetic synthesizes Linearâ€™s speed-first density, Notionâ€™s typographic hierarchy, and Stripeâ€™s refined spatial craft.

### Visual Principles
- **Clarity Over Ornamentation:** Avoid ornamental graphics. Depth, hierarchy, and affordance are achieved through hairline borders, micro-elevation, and intentional typographic scale.
- **High Signal-to-Noise Ratio:** Information density is kept high without clutter by using strict structural alignment, clear column gutters, and compact interactive targets.
- **Instrument-Grade Micro-Interactions:** Subtle states, live execution pulses, and accessible keyboard shortcut badges signal high operational efficiency.

## Colors

The palette is engineered for prolonged focus in productivity workflows. A crisp base of zinc-tinted neutrals minimizes eye fatigue while distinct semantic accents communicate status at a glance.

### Palette Architecture
- **Primary (`#4f46e5`):** Reserved for core interactive states, primary actions, focused controls, and AI prompt triggers.
- **Secondary (`#2563eb`):** Utilized for active workspace navigation, multi-select states, and informational callouts.
- **Semantic Accents:**
  - **Healthy / Complete (`#10b981`):** Applied to resolved milestones, healthy velocity scores, and positive metric indicators.
  - **Warning / At Risk (`#f59e0b`):** Deployed for slipping deadlines, resource bottlenecks, and medium-severity notices.
  - **Critical / Blocked (`#ef4444`):** Restricted to blocking issues, failed CI/CD pipelines, and destructive actions.
- **Neutrals:**
  - Canvas Base: `#ffffff`
  - Sub-Canvas / Rail: `#fafafa`
  - Elevated Container: `#ffffff`
  - Hairline Border: `#e4e4e7`
  - Text Primary: `#09090b`
  - Text Muted: `#71717a`

## Typography

The type system is built on **Inter** with native OpenType features enabled. Numerical metrics, issue identifiers (e.g., `ENG-1042`), dates, and progress percentages must always be rendered with tabular figures (`tnum`, `cv05`) to prevent layout shifts during live data re-renders.

### Application Guidelines
- **Headlines:** Use tight letter-spacing for large titles to maintain cohesion in data-dense layouts.
- **Body & Labels:** `body-md` serves as the primary interface standard for task descriptions, comments, and documentation.
- **Metrics & Monospace Accents:** Key task counters, sprint velocity data, and hotkeys utilize `mono-metric` styling with enabled tabular lining figures.

## Layout & Spacing

The layout is structured around an asymmetrical application workspace: an adaptive sidebar navigation rail (240px default, 64px collapsed), a master view, and a dynamic contextual detail panel.

### Spatial Guidelines
- **Grid Structure:** The main view uses a fluid responsive column grid (4-column mobile, 8-column tablet, 12-column desktop) bound by fixed structural rails.
- **Rhythm & Density:** Use compact gaps (`space-xs` and `space-sm`) inside compound list elements, inputs, and badge groups. Reserve `space-lg` and `space-xl` for outer section headers and container padding.
- **Breakpoints:**
  - `Mobile (< 768px)`: Navigation moves to an off-canvas drawer or bottom action bar. Margins contract to `1rem`. Multi-column boards collapse into swipeable single-lane tab views.
  - `Tablet (768px - 1024px)`: Detail views overlay as modal sheets.
  - `Desktop (> 1024px)`: Persistent split panes allow concurrent board browsing and issue inspection without navigation context loss.

## Elevation & Depth

Visual hierarchy uses tonal surface layering combined with low-radius ambient diffusion and 1px architectural hairline borders.

### Elevation Levels
- **Level 0 (Flat / Canvas):** Surface color `#ffffff` or `#fafafa`. Border `1px solid transparent`.
- **Level 1 (Card & Task Row):** Surface `#ffffff`, border `1px solid #e4e4e7`, shadow `0 1px 2px 0 rgba(0, 0, 0, 0.05)`.
- **Level 2 (Popovers, Flyout Menus, Floating Filters):** Surface `#ffffff`, border `1px solid #e4e4e7`, shadow `0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)`.
- **Level 3 (Command Palette / Dialog Modal):** Surface `#ffffff`, border `1px solid #d4d4d8`, shadow `0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)`.

## Shapes

The interface balances sharp productivity lines with ergonomic softens. Geometric integrity is maintained by preserving consistent inner-to-outer nesting radius rules.

### Corner Radii
- **Standard (`0.5rem / 8px`):** Used for standard buttons, inputs, list items, and dropdown panels.
- **Large (`1rem / 16px`):** Used for main cards, issue canvas containers, and modal dialogs.
- **Pill (`9999px`):** Strictly reserved for status tags, priority indicators, avatar badges, and keyboard keycaps (`<kbd
K‚‚ˆÈÈÛÛ\Û™[Â‚ˆÈÈÈ]ÛœÂ‹H
Š”š[X\žNŠŠˆ˜XÚÙÜ›Ý[™Í™MX^Ù™™™™™˜›Ü™\ˆ\ÛÛY˜[œÜ\™[ˆÝ™\ŽˆÍÌÎØXˆ›ØÝ\ÙYˆš[™ÈÙˆœÍŒÍ™ŒXÚ]œÙ™œÙ]‚‹H
Š”ÙXÛÛ™\žHÈÚÜÝŠŠˆ˜XÚÙÜ›Ý[™Ù™™™™™˜^ÌLL˜›Ü™\ˆ\ÛÛYÙMMMØˆÝ™\ŽˆÙX‚‹H
Š‘ÚÜÝXÝ[ÛŽŠŠˆ˜XÚÙÜ›Ý[™˜[œÜ\™[^ÍÌMÌMØXˆÝ™\Žˆ˜XÚÙÜ›Ý[™ÙX^ÌLL˜‚‚ˆÈÈÈÝ]\È˜YÙ\È	ˆš[Üš]HÚÙ[œÂ‹H
Š”Ý]\È[™XØ]ÜŽŠŠˆ[Ú\KZYÚŒœY[™ÈÜš^›Û[ˆ˜XÚÙÜ›Ý[™]L	H[ÙˆHÙ[X[XÈÛÛÜ‹^[ˆ[[[œÚ]K‚‹H
Š“]™HÝ]\ÈÝŠŠˆHœÚ\˜Ý[\ˆÝXÙY[›[™HYÙˆÝ]\È^ˆ›ÜˆXÝ]™HÜˆ›ØÚÙY›ØÙ\ÜÙ\Ë\HHÙ[H‹\ÙXÛÛ™[XšY[[ÙHÜXÚ]H[š[X][Ûˆ
ÜXÚ]HØØ[[™È™]ÙY[ˆ[™KŒ
K‚‹H
Š“[™X\‹TÝ[Hš[Üš]H˜YÙ\ÎŠŠ‚ˆH
•\™Ù[ŠˆÙYXÛÛˆÚ][\š\ÝX[‚ˆH
’YÚŠˆ™YH\ØÙ[™[™È˜\œÈ[ˆÙNYL˜‚ˆH
“YY][NŠˆÛÈ\ØÙ[™[™È˜\œÈ[ˆÍÌMÌMØX‚ˆH
“ÝÎŠˆÚ[™ÛH˜\ˆ[ˆØLXLXXX‚‚ˆÈÈÈÙ^X›Ø\™ÚÜÝ]Ù^XØ\Â‹HÙ^XØ\ÚÙ[ŽˆØ™˜ÛÛZ[™\ˆÚ]›Ü™\ˆ\ÛÛYÙMMMØ˜XÚÙÜ›Ý[™ÙX^ÍÌMÌMØX˜Y]\ÈY[™È\\›ÛÚ^™HŽÍ\™[X›Û˜[Z[H[\˜Ú]X[\ˆšYÝ\™\Ë‚‚ˆÈÈÈ›Ü›H[œ]Â‹HÝ[™\™ZYÚˆÍœˆ›Ü™\ˆ\ÛÛYÙMMMØÝ\™˜XÙHÙ™™™™™˜^ÌLL˜XÙZÛ\ˆØLXLXXX‚‹H›ØÝ\ÈÝ]Nˆ›Ü™\ˆÛÛÜˆÍ™MXÚ]H\Í™MX›ÞÚYÝË‚‚ˆÈÈÈØ\™È	ˆÛÜšÈ][\Â‹HÛÛ\XÝ\ÚÈØ\™È\ÙHLœY[™Ë›Ü™\ˆ\ÛÛYÙMMMØÝ\™˜XÙHÙ™™™™™˜‚‹HÝ™\ˆÝ]Nˆ›Ü™\ˆÛÛÜˆÙÚYÝÈ[]˜][Ûˆ]™[K‚‹H]Z[^[Ý]È™X]\™H[ˆ\ÜÚYÛ™YH]˜]\ˆÝXÚÈÝ™\›\[™ÈžHMœ›Ü™\™YÚ]œØ[˜\È˜XÚÙÜ›Ý[™‚‚ˆÈÈÈÛÛ[X[™[]H
8£&ÊB‹HÙ[\™YÝ™\›^H[Ù[X^]ÚYˆÜÙX\˜ÚšY[ZYÚÚ]˜[œÜ\™[›Ü™\‹‚‹Hš[\ˆ\Ý][\È\ÙHH[šYšYYÌœZYÚYX[YÛ™YXÛÛœË[™šYÚX[YÛ™YÙ^X›Ø\™ÚÜÝ]Ù^XØ\Ë