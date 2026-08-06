# BizPilot AI Design Rules & Token Specification

This document defines the frozen, mandatory Design System Tokens for **BizPilot AI**.
Every developer, designer, and AI assistant working on this project must strictly adhere to these rules.

---

## 1. Core Layout Tokens

| Token Name | Value | Tailwind Equivalent | Usage / Notes |
| :--- | :--- | :--- | :--- |
| **Max Container Width** | `1440px` | `max-w-7xl mx-auto` | Standard grid constraint |
| **Page Padding Horizontal** | `32px` | `px-6 sm:px-8` | Page side margins |
| **Section Vertical Gap** | `128px` | `py-32` | Space between major page sections |
| **Grid / Component Gap** | `32px` | `gap-8` | Grid items & multi-column flex spacing |
| **Card Internal Padding** | `32px` | `p-8` (or `p-6 sm:p-8`) | Standard card inset |
| **Navbar Height** | `80px` | `h-20` (`py-5`) | Sticky glass header height |
| **Button Height** | `48px` | `h-12` (`py-3`) | Primary & secondary CTAs |
| **Button Padding** | `24px` | `px-6` | Horizontal CTA padding |
| **Input Height** | `48px` | `h-12` | Form inputs & command palette |
| **Card Border Radius** | `20px` | `rounded-[20px]` / `rounded-3xl` | Standard surface container radius |
| **Button Border Radius** | `12px` | `rounded-xl` | Interactive controls & buttons |
| **Pill / Badge Radius** | `9999px` | `rounded-full` | Status indicators & micro tags |

---

## 2. Color Palette & Surface Tokens

| Token | Hex / Value | Description |
| :--- | :--- | :--- |
| `--bg-canvas` | `#09090b` | Base canvas matte black |
| `--bg-surface` | `#121215` | Card & panel background |
| `--bg-elevated` | `#1a1a1e` | Hovered / elevated cards |
| `--bg-inset` | `#0d0d0f` | Inset code console & input fill |
| `--border-subtle` | `rgba(255, 255, 255, 0.07)` | Standard card border |
| `--border-default` | `rgba(255, 255, 255, 0.12)` | Active card hover border |
| `--accent-primary` | `#3b82f6` | Electric Blue accent |
| `--accent-ai` | `#8b5cf6` | Neural Violet accent |
| `--semantic-success` | `#10b981` | Emerald Green positive metrics |

---

## 3. Typography Scale

- **H1 (Hero Title)**: `72px` (`text-5xl sm:text-6xl lg:text-7xl`) | `font-bold tracking-tight leading-[1.1]`
- **H2 (Section Headline)**: `48px` (`text-3xl sm:text-4xl lg:text-5xl`) | `font-bold tracking-tight`
- **H3 (Card Title)**: `32px` (`text-2xl lg:text-3xl`) | `font-bold`
- **Body Large**: `18px` (`text-base lg:text-lg`) | `text-zinc-400 leading-relaxed`
- **Body Standard**: `14px` (`text-sm`) | `text-zinc-300`
- **Caption / Mono**: `12px - 14px` (`text-xs font-mono`) | `tracking-wider uppercase`

---

## 4. Animation & Motion Rules

- **Duration**: `200ms - 300ms`
- **Easing**: `cubic-bezier(0.16, 1, 0.3, 1)` or Framer Motion spring (`stiffness: 300, damping: 25`)
- **Strict Rule**: No distracting bounce effects, no flashy neon flashes.
- **Allowed Motion**: Fade, slide-y (10px-20px), scale (0.98 to 1.0), subtle opacity glow.

---

## 5. Shadows & Glassmorphism

- **Card Shadow**: `shadow-xl` / `shadow-[0_20px_80px_rgba(0,0,0,0.8)]`
- **Glow Accent**: `shadow-[0_0_25px_rgba(59,130,246,0.35)]`
- **Borders**: 1px crisp subtle borders (`border-white/[0.08]`)
