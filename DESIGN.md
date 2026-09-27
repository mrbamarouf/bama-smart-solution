# BAMA Smart Solution Design System

## Overview

The site is a dark architectural brand environment with controlled white editorial sections. Deep navy establishes permanence, electric blue describes active connections, and cyan appears only as a small signal highlight. Photography carries spatial credibility; typography and thin network lines supply technical precision.

## Foundation

### Color

- Near Black: `#050B14`, primary cinematic background
- Deep Technology Navy: `#061A3A`, structural surface and dark-section base
- Electric Blue: `#0868F2`, primary action and active connection
- Bright Connected Blue: `#00BDF2`, sparing signal highlight
- Soft Tech White: `#F7F9FC`, light editorial canvas
- Pure White: `#FFFFFF`, high-contrast type and focused surfaces
- Secondary Neutral: `#8794A8`, supporting copy and metadata

### Typography

- English: Manrope, with weight contrast between 400, 500, 600, and 700.
- Arabic: Noto Sans Arabic, with natural RTL spacing and punctuation.
- Display headings use compact line height and no tighter than `-0.04em` tracking.
- Body copy stays at 16px or above with a maximum readable measure of 70ch.

### Spacing

Use a fluid 8px-based system with large changes in rhythm between cinematic, editorial, and technical sections. Content is constrained to 1440px; selected images and dark environments may extend full-bleed.

### Shape

Most structure is square-edged or softly chamfered. Cards, when functionally necessary, stay within 12–16px radius. Pills are reserved for compact status labels and buttons.

## Components

### Navigation

A thin floating header overlays the hero. It gains a near-black translucent surface on scroll. The approved transparent BAMA mark appears directly on the dark environment with no card, white field, or enclosing shape.

### Buttons

Primary actions use Electric Blue with white text. Secondary actions use a restrained white or navy outline. Hover motion is a short horizontal translation with no bounce.

### Product Showcase

Large editorial split layouts alternate image and information within a 1440px composition. Confirmed products use substantial isolated product renders; future categories use their own campaign worlds. Product specifications appear as a measured technical list, never as retail pricing cards.

### Product Categories

Six editorial chapters—Networking, Access, Security, Home, Sensors, and Connected Devices—share the same navy/cobalt visual universe while varying image treatment, section rhythm, and supporting information. Status language always distinguishes `available`, `comingSoon`, and `futureCategory` content.

### Connected Diagram

The smart-ecosystem visual uses an architectural image, thin blue paths, and keyboard-focusable points. Labels appear on hover or focus and are always available to assistive technology.

### Intro

A five-to-six second, session-only brand reveal. Signal paths converge around the transparent BAMA mark, followed by the BAMA SMART SOLUTION name and tagline. No logo card or white field is used, and the site is never blocked when reduced motion is requested.

## Motion

Use exponential ease-out curves. Prefer opacity, transform, clip-path, line drawing, and restrained blur. Every animation has a reduced-motion alternative. Content remains visible if observers or animation libraries fail.

## Responsive Direction

Desktop composition remains optimized at 1366px, 1440px, and 1920px. Phase 2 uses dedicated mobile components below 1024px while sharing product records, localization, routes and contact configuration.

The approved nine-screen mobile reference governs phone composition: near-black surfaces throughout, a white transparent logo with the supplied letterforms, a full-height architectural hero, near-full-screen navigation, vertical category rows, unboxed product renders, an architectural ecosystem diagram, four photographic use-case rows, and compact contact/footer sections. Arabic uses true RTL and right-aligned editorial text; English uses its own LTR composition. Latin specifications are isolated with `bdi`.

The primary target is 390px with additional layouts at 360, 375, 393, 412 and 430px. Mobile body text uses 14–15px to match the approved reference, section headings 23–25px and hero headings 32–35px. Touch targets are at least 44px. Phone sections use safe-area insets and `svh`/`dvh`, with short-viewport and landscape handling. Mobile-specific WebP assets avoid fetching the full desktop imagery. Physical-device testing remains distinct from browser-engine emulation.
