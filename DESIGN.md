---
title: daKI.tech Design System
description: Enterprise AI voice agent platform with cyberpunk aesthetic and glassmorphism UI
tokens:
  # Color Palette
  colors:
    dark:
      value: '#0a0a0f'
      description: 'Primary background - deep space black'
    navy:
      value: '#0f172a'
      description: 'Secondary background - card backgrounds'
    cardbg:
      value: 'rgba(15, 15, 25, 0.8)'
      description: 'Card background with transparency for glassmorphism'
    cyan:
      value: '#00ffff'
      description: 'Primary accent - neon cyan for interactive elements and highlights'
    pink:
      value: '#ff0055'
      description: 'Secondary accent - hot pink for alternative CTAs and accents'
    white:
      value: '#ffffff'
      description: 'Primary text color'
    textsec:
      value: '#b0b0c0'
      description: 'Secondary text - reduced prominence'
    success:
      value: '#00ff41'
      description: 'Success state - lime green'
    purple:
      value: '#a855f7'
      description: 'Tertiary accent for service highlights'
    fuchsia:
      value: '#ec4899'
      description: 'Accent for tech stack highlights'

  # Typography
  fonts:
    display:
      family: 'Orbitron'
      fallback: 'sans-serif'
      weights: [400, 500, 700]
      description: 'High-tech geometric font for headings, branding, UI elements'
    body:
      family: 'Inter'
      fallback: 'sans-serif'
      weights: [300, 400, 600]
      description: 'Modern humanist sans-serif for body text and UI'

  font-sizes:
    xs:
      value: '0.75rem'
      line-height: '1rem'
    sm:
      value: '0.875rem'
      line-height: '1.25rem'
    base:
      value: '1rem'
      line-height: '1.5rem'
    lg:
      value: '1.125rem'
      line-height: '1.75rem'
    xl:
      value: '1.25rem'
      line-height: '1.75rem'
    '2xl':
      value: '1.5rem'
      line-height: '2rem'
    '3xl':
      value: '1.875rem'
      line-height: '2.25rem'
    '4xl':
      value: '2.25rem'
      line-height: '2.5rem'
    '6xl':
      value: '3.75rem'
      line-height: '1'

  # Spacing Scale
  spacing:
    '0':
      value: '0'
    '0.5':
      value: '0.125rem'
    '1':
      value: '0.25rem'
    '2':
      value: '0.5rem'
    '3':
      value: '0.75rem'
    '4':
      value: '1rem'
    '6':
      value: '1.5rem'
    '8':
      value: '2rem'
    '12':
      value: '3rem'
    '16':
      value: '4rem'
    '20':
      value: '5rem'
    '24':
      value: '6rem'

  # Border Radius
  radii:
    none:
      value: '0'
    sm:
      value: '0.25rem'
    base:
      value: '0.5rem'
    lg:
      value: '1rem'
    xl:
      value: '1.25rem'
    '2xl':
      value: '1.5rem'
    full:
      value: '9999px'

  # Shadows & Glows
  shadows:
    elevation-1:
      value: '0 10px 30px -10px rgba(0, 255, 255, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.5)'
      description: 'Glass card default shadow'
    elevation-2:
      value: '0 0 15px rgba(0, 255, 255, 0.1)'
      description: 'Subtle glow shadow'
    glow-cyan:
      value: '0 0 20px rgba(0, 255, 255, 0.6)'
      description: 'Bright cyan glow on hover'
    glow-pink:
      value: '0 0 20px rgba(255, 0, 85, 0.6)'
      description: 'Bright pink glow on hover'
    modal-shadow:
      value: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 255, 255, 0.1)'
      description: 'Modal/palette shadow'

  # Motion/Animation
  transitions:
    duration-fast:
      value: '0.2s'
    duration-base:
      value: '0.3s'
    duration-slow:
      value: '0.4s'
    easing-standard:
      value: 'ease'
    easing-cubic:
      value: 'cubic-bezier(0.4, 0, 0.2, 1)'
    easing-bounce:
      value: 'ease-out'

  # Borders
  borders:
    thin:
      value: '1px'
      style: 'solid'
    thick:
      value: '2px'
      style: 'solid'
    separator-color:
      value: 'rgba(0, 255, 255, 0.1)'
    border-light:
      value: 'rgba(255, 255, 255, 0.05)'

  # Backdrops
  backdrop:
    blur-light:
      value: 'blur(5px)'
    blur-medium:
      value: 'blur(10px)'
    blur-strong:
      value: 'blur(15px)'

  # Gradients
  gradients:
    progress-bar:
      value: 'linear-gradient(to right, #00ffff, #ff0055)'
      description: 'Cyan to pink for scroll progress indicator'
    card-gradient:
      value: 'linear-gradient(to bottom, #0a0a0f, rgba(10, 10, 15, 0.5))'
      description: 'Subtle downward gradient for card depth'

---

## Design System Overview

**daKI.tech** is a high-end SaaS platform showcasing AI voice agents for small and medium-sized enterprises. The design system embraces a **cyberpunk aesthetic** combined with **glassmorphism** principles, creating a premium, futuristic user experience that conveys cutting-edge technology while maintaining professional credibility.

## Visual Identity

### The Aesthetic: Cyberpunk Meets Enterprise

daKI.tech's design language sits at the intersection of three visual trends:

1. **Cyberpunk Futurism** — Neon glows, high contrast lighting, and geometric typography evoke the energy of high-tech systems. This communicates innovation and forward-thinking AI capabilities.

2. **Glassmorphism** — Frosted glass cards with backdrop blur and transparency create depth and sophistication. This modern design trend suggests clarity and transparency in data handling.

3. **Enterprise Minimalism** — Despite the vibrant accents, the design maintains clean lines and generous whitespace (blackspace), ensuring the platform feels professional and trustworthy—essential for German-speaking B2B audiences concerned with data privacy (DSGVO compliance is visually emphasized).

### Color Strategy

The palette is deliberately **high-contrast** and **accent-driven**:

- **Cyan (#00ffff)** serves as the primary brand color—energetic, cutting-edge, and visible even against dark backgrounds. Used for primary CTAs, active states, glows, and key brand elements.
- **Pink (#ff0055)** acts as a secondary accent for alternative paths and supporting CTAs, providing visual rhythm.
- **Deep Dark (#0a0a0f)** as the base ensures comfortable viewing and allows neon accents to "pop."
- **Secondary Text (#b0b0c0)** is desaturated to guide visual hierarchy without overwhelming.
- **Lime Green (#00ff41)** is reserved for success states, active indicators, and checkmarks, using its inherent "alive" quality.

This restricted palette avoids rainbow fatigue while maximizing the neon aesthetic.

### Typography

**Orbitron** (display font) is a geometric, tech-forward typeface that appears in all headings, buttons, and branded UI elements. It's unmistakably modern and aligns with the AI/tech positioning.

**Inter** (body font) is humanist and highly legible, balancing Orbitron's geometric rigidity with warmth for longer-form content.

The size scale uses Tailwind defaults but emphasizes **larger display text** (3xl–6xl) for hero sections to command attention.

## Component Patterns

### Buttons

Two primary button patterns establish affordance:

**btn-primary (Cyan Border)**
- Transparent background with 2px cyan border
- Cyan text with glow text-shadow
- Inset box-shadow for depth
- On hover: solid cyan background, dark text, amplified glow-shadow, subtle upward translation
- Conveys "primary action" and brand identity

**btn-secondary (Pink Border)**
- Same construction as primary but with pink instead of cyan
- Used for secondary pathways (alternative CTAs)
- Maintains visual consistency while offering choice

**btn-danger (Pink Border, Minimal)**
- Simplified pink border without inset shadow
- Conveys destructive action (e.g., delete account, logout)

### Glass Cards

The signature component uses **glassmorphism**:

```
Background: rgba(15, 15, 25, 0.8) with backdrop-filter: blur(10px)
Border: 1px solid rgba(0, 255, 255, 0.15) [subtle cyan edge]
Box-shadow: Dual-layer shadow for depth
Padding: Responsive (1.25rem on mobile, 2rem+ on desktop)
Border-radius: 1rem or larger (1.5rem for prominent cards)
```

This creates a "floating" effect where cards feel distinct from the background but part of a cohesive system.

### Text Effects

**Neon Glow Text** — Applied via text-shadow to cyan or pink text:
```
text-shadow: 0 0 10px rgba(0, 255, 255, 0.8), 0 0 20px rgba(0, 255, 255, 0.4)
```
Creates a halo effect suggesting light emission. Scaled down on mobile to preserve readability.

### Navigation & Interactive States

**Active Link Indicator** — An underline appears below active nav links with a matching glow-shadow, creating a sense of depth and current context.

**Scroll Progress Bar** — A fixed 3px gradient bar at the top (cyan→pink) fills left-to-right as users scroll, providing feedback and reinforcing brand colors.

**Back-to-Top Button** — Circular floating button in bottom-right, invisible until scrolling begins. On hover, it enlarges and glows, maintaining consistency with other interactive elements.

### Forms

Form inputs use:
- Dark backgrounds (`bg-dark/80`) with subtle borders (`border-white/10`)
- Focus state: cyan border with glow shadow
- Icon prefixes in some cases (e.g., robot icon for agent name input)
- Responsive grid layouts to stack on mobile

### Modals & Overlays

**Command Palette** — A search/navigation overlay centered on screen:
- Backdrop: `rgba(10, 10, 15, 0.9)` with `backdrop-filter: blur(10px)`
- Content: bordered glass card at 95% scale, animates to 100% on activation
- Results highlight on hover/selection with cyan background
- Keyboard hints in footer (subtle gray) guide interaction

**Mobile Menu** — Full-viewport overlay that slides in from top:
- Same dark backdrop with stronger blur
- Items fade in with staggered delays (cubic-bezier easing)
- Links scale on hover with cyan glow

## Spatial Design

### Hero Sections

Large glassmorphic gradients appear behind hero text (positioned absolutely, blurred, low opacity, pointer-events-none) to create atmospheric depth without obscuring content. For example, a 800px diameter circle of `bg-cyan/10 blur-[150px]` floats behind the headline.

### Grids & Spacing

- **Service cards** use a responsive 3-column grid (1 on mobile, 3 on desktop) with 2rem gaps
- **Product trinity grid** uses 4 columns: 1 + 2 (prominent) + 1 layout for balanced hierarchy
- Section padding: 5rem vertical (20px) with responsive horizontal padding (1rem on mobile, 2rem+ on desktop)
- Sections separated by `border-top: 1px solid rgba(0, 255, 255, 0.1)` for subtle visual rhythm

### Responsive Behavior

The design is **mobile-first**, with:
- Hidden desktop elements (nav links, command palette hints) revealed at md breakpoint (768px+)
- Scaled neon shadows on mobile (smaller blur radii) to maintain visual weight
- Stacked vertical layouts on mobile; side-by-side on larger screens
- Hamburger menu toggle that reveals full-screen mobile menu with animated staggered text

## Micro-interactions & Motion

### Transitions

All interactive elements use smooth transitions:
- **Fast (0.2s)** for hover states (color, border changes)
- **Base (0.3s)** for most animations (opacity, transforms)
- **Slow (0.4s)** for complex animations (menu entrance, scroll progress)

Easing typically uses `ease` or `cubic-bezier(0.4, 0, 0.2, 1)` (Google Material standard) for natural feel.

### Animations

- **Pulse** — Used on incoming call indicators and active status dots (infinite subtle scale)
- **Spin** — Loading spinners (e.g., "Deploying..." button)
- **Fade-In-Up** — Content entering the viewport (opacity + translateY)
- **Slide & Scale** — Mobile menu and command palette (transform origins respect direction)

### Hover States

- **Buttons** — Glow-shadow amplifies, background fills (for outlines), text shadow removes (for contrast)
- **Cards** — Subtle upward translation (-translate-y-2), glow shadow appears
- **Links** — Color shift to cyan, optional underline animation
- **Icons** — Scale slightly (1.1x) with timing to feel responsive

## Data Visualization & Status Indicators

### Live Status

Small badges combine icon + text:
- Green (#00ff41) pulsing dot + "24/7 Aktiv" indicates always-on service
- Uses `w-2 h-2` dot with `animate-pulse` for gentle attention

### Feature Callouts

Info boxes within glass cards highlight features:
- Cyan text on dark background for primary information
- Icon + small uppercase label above content
- Consistent padding and border styling across all callout types

### Architecture Emphasis

The "Call to Calendar" flow diagram shows:
- Card 1: Incoming call (muted cyan border, pulse animation on icon)
- Arrow icon (animated, cyan/50 opacity)
- Card 2: KI processing (prominent cyan border, bright cyan background shadow)
- Arrow icon
- Card 3: Calendar sync (green border, green icon)

This visual progression communicates the value proposition in a glanceable way.

## Accessibility & Readability

Despite the dark theme and neon colors:

- **Contrast ratios** meet WCAG AA standards (cyan on dark, white on dark both exceed 7:1)
- **Font sizes** start at a comfortable 1rem for body text
- **Line-height** is generous (1.5–1.75) for readability
- **Focus states** are clearly visible (cyan borders, glow shadows)
- **Motion is respectful** — animations use reasonable durations and avoid rapid flashing

The design conveys "cutting-edge" without sacrificing usability.

## Brand Implementation Notes

### Consistency Patterns

1. **Every interactive element** (button, link, card) uses the glass + border + glow pattern
2. **Cyan is reserved for** primary brand actions, active states, and success glows
3. **Pink provides contrast** to cyan, preventing monotone UI
4. **Dark backgrounds are never pure black** (#0a0a0f adds subtle warmth)
5. **Spacing is always aligned** to the scale (4px, 8px, 12px, 16px, etc.)

### When to Deviate

- Use lime green (#00ff41) only for success, checkmarks, and "alive" indicators
- Use purple/fuchsia sparingly for tertiary callouts (e.g., Expert Hub card)
- Never mix cyan + pink in the same element (use one per component)
- Avoid pure white for text unless maximum contrast is needed; prefer #ffffff or textsec for hierarchy

## Technical Rendering Notes

- **Backdrop filter support** varies; fallback to opacity-only for unsupported browsers
- **Glow shadows** are rendered at 1-2 blur radii larger on desktop than mobile to save processing
- **Fractional noise SVG texture** applied to body background adds tactile richness without significant load impact
- **High-precision colors** (#00ffff, not cyan) ensure neon authenticity across displays

---

## Summary

daKI.tech's design system is a cohesive blend of **neon cyberpunk energy** and **corporate glassmorphism**. Every color, shadow, and animation serves the goal: communicate cutting-edge AI capability while building trust with German enterprise clients who value precision, security (DSGVO), and professional presentation. The result is visually striking without being frivolous—a platform that looks like the future but feels dependable.
