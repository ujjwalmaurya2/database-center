---
name: DriveBase
colors:
  surface: '#031427'
  surface-dim: '#031427'
  surface-bright: '#2a3a4f'
  surface-container-lowest: '#000f21'
  surface-container-low: '#0b1c30'
  surface-container: '#102034'
  surface-container-high: '#1b2b3f'
  surface-container-highest: '#26364a'
  on-surface: '#d3e4fe'
  on-surface-variant: '#c7c4d8'
  inverse-surface: '#d3e4fe'
  inverse-on-surface: '#213145'
  outline: '#918fa1'
  outline-variant: '#464555'
  surface-tint: '#c3c0ff'
  primary: '#c3c0ff'
  on-primary: '#1d00a5'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#4d44e3'
  secondary: '#bec6e0'
  on-secondary: '#283044'
  secondary-container: '#3f465c'
  on-secondary-container: '#adb4ce'
  tertiary: '#4edea3'
  on-tertiary: '#003824'
  tertiary-container: '#006e4b'
  on-tertiary-container: '#67f4b7'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#031427'
  on-background: '#d3e4fe'
  surface-variant: '#26364a'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 30px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '450'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.02em
  headline-md-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 0.25rem
  sm: 0.5rem
  md: 1rem
  lg: 1.5rem
  xl: 2.5rem
  container-max: 1440px
  gutter: 1.5rem
---

## Brand & Style
The design system is engineered for a high-performance Backend-as-a-Service platform. The brand personality is **Technical, Precise, and Empowering**. It targets developers who value efficiency and high-fidelity aesthetics. 

The visual style is **Modern Minimalist with a Technical Edge**, blending the systematic clarity of enterprise tools with the refined finish of a premium consumer app. It utilizes high-density layouts, purposeful whitespace, and subtle depth through glassmorphism to create a professional environment that reduces cognitive load while maintaining a sophisticated, high-end feel.

## Colors
The palette is optimized for long-duration technical work, defaulting to a **Dark Mode** first approach. 

- **Primary:** Deep Indigo (#4F46E5) serves as the core action color, representing reliability and depth.
- **Backgrounds:** The primary interface uses a rich, deep charcoal-black (#020617) to provide maximum contrast for code and data.
- **Surfaces:** Elevated containers use a slightly lighter slate (#0F172A) to create a clear visual hierarchy.
- **Accents:** Emerald is used exclusively for successful deployments and active states. Amber indicates pending processes or conflicts. Rose is reserved for critical errors and destructive actions.

## Typography
This design system uses a triple-font strategy to balance character with utility:

1. **Geist** for headlines and display text, providing a sharp, geometric look that feels inherently technical.
2. **Inter** for all body copy and UI controls, ensuring legibility and a neutral, professional tone.
3. **JetBrains Mono** for all code blocks, API keys, and ID strings, optimized for technical readability.

Scale text carefully: use `body-md` for standard dashboard data and `code-md` for any developer-facing strings.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a strict 4px baseline.

- **Desktop:** 12-column grid with 24px (1.5rem) gutters and 40px margins. 
- **Sidebar:** Fixed width at 260px, utilizing a glassmorphic blur to suggest depth.
- **Content Density:** High. Elements are spaced tightly to allow more data to be visible on-screen simultaneously. 
- **Adaptation:** On tablet, the sidebar collapses into a drawer. On mobile, margins reduce to 16px and the grid transitions to 4 columns.

## Elevation & Depth
The design system creates hierarchy through **Tonal Layering** and **Glassmorphism** rather than heavy shadows.

- **Surface 0 (Background):** Pure black/deep charcoal. Used for the main canvas.
- **Surface 1 (Cards/Containers):** Slightly elevated slate. Defined by a 1px border (#1E293B) and a very subtle 4px blur shadow with 20% opacity.
- **Surface 2 (Modals/Overlays):** Uses a background blur (12px) and 80% opacity fill of the surface color.
- **Outlines:** Ghost borders are used for inactive states, using a 1px solid stroke with 10% opacity.

## Shapes
The shape language is **Soft and Structural**. 

Standard UI elements like buttons, inputs, and small cards use a **8px (0.5rem)** corner radius. Large containers and main dashboard panels use a **16px (1rem)** radius to anchor the layout. This balance ensures the UI feels modern and approachable without losing its professional, "engineered" precision.

## Components
- **Buttons:** Primary buttons use the Indigo fill with white text. Secondary buttons are "Ghost" style (transparent fill, 1px border). Active states feature a subtle inner glow.
- **Inputs:** Dark backgrounds with a 1px border that illuminates to the primary color on focus. Use JetBrains Mono for placeholder text in technical fields.
- **Status Chips:** Small, pill-shaped badges with low-opacity backgrounds (10%) and high-opacity text of the same accent color (e.g., green on green).
- **Code Blocks:** Syntax-highlighted containers with a specialized "Copy" button that appears on hover. Use a distinct background (#000000) to separate logic from UI.
- **Cards:** No external shadows. Depth is communicated via a subtle 1px border and slightly lighter background tint than the main canvas.
- **Data Tables:** Borderless rows with a 1px separator. Row hover states should use a subtle highlight (#1E293B).