---
name: PYMETRACKER
colors:
  surface: "#fbf9f8"
  surface-dim: "#dbd9d9"
  surface-bright: "#fbf9f8"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#f5f3f3"
  surface-container: "#efeded"
  surface-container-high: "#eae8e7"
  surface-container-highest: "#e4e2e2"
  on-surface: "#1b1c1c"
  on-surface-variant: "#4f4441"
  inverse-surface: "#303030"
  inverse-on-surface: "#f2f0f0"
  outline: "#817470"
  outline-variant: "#d3c3be"
  surface-tint: "#725950"
  primary: "#725950"
  on-primary: "#ffffff"
  primary-container: "#fedcd0"
  on-primary-container: "#795f56"
  inverse-primary: "#e0c0b4"
  secondary: "#575f6b"
  on-secondary: "#ffffff"
  secondary-container: "#dbe3f1"
  on-secondary-container: "#5d6571"
  tertiary: "#5d5f5f"
  on-tertiary: "#ffffff"
  tertiary-container: "#e3e3e3"
  on-tertiary-container: "#636565"
  error: "#ba1a1a"
  on-error: "#ffffff"
  error-container: "#ffdad6"
  on-error-container: "#93000a"
  primary-fixed: "#fddbcf"
  primary-fixed-dim: "#e0c0b4"
  on-primary-fixed: "#291710"
  on-primary-fixed-variant: "#584239"
  secondary-fixed: "#dbe3f1"
  secondary-fixed-dim: "#bfc7d4"
  on-secondary-fixed: "#141c26"
  on-secondary-fixed-variant: "#3f4752"
  tertiary-fixed: "#e2e2e2"
  tertiary-fixed-dim: "#c6c6c7"
  on-tertiary-fixed: "#1a1c1c"
  on-tertiary-fixed-variant: "#454747"
  background: "#fbf9f8"
  on-background: "#1b1c1c"
  surface-variant: "#e4e2e2"
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: "700"
    lineHeight: "1.2"
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: "700"
    lineHeight: "1.2"
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: "600"
    lineHeight: "1.3"
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: "600"
    lineHeight: "1.4"
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: "400"
    lineHeight: "1.6"
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: "400"
    lineHeight: "1.6"
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "600"
    lineHeight: "1.2"
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: "500"
    lineHeight: "1.2"
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

The design system is centered on "Soft Minimalism"—a philosophy that prioritizes clarity and whitespace while eschewing the coldness of traditional corporate tools. The brand personality is approachable, observant, and serene, designed to reduce the cognitive load and stress often associated with high-stakes competitor analysis.

The visual style blends **Minimalism** with **Glassmorphism**. It utilizes translucent layers and frosted glass effects to create a sense of depth without relying on heavy shadows or dark dividers. The interface should feel "light as air," using organic curves and a warm, optimistic palette to foster an environment of intuitive discovery.

## Colors

The color strategy is "High-Light, Low-Contrast." The primary soft peach (`#FEDCD0`) serves as the emotional anchor, used for primary actions and highlights. The secondary blue (`#E8F0FE`) provides a cool, calming counterpoint for secondary information or data visualization.

Neutral tones are strictly kept in the warm-gray and off-white spectrum to avoid the clinical feel of pure blacks or grays. Text should never be pure black; instead, use a deep charcoal-gray (`#4A4A4A`) to maintain high legibility while softening the visual impact on the eyes.

## Typography

This design system uses a dual-font approach. **Plus Jakarta Sans** is employed for headlines and hero sections to inject personality and a modern, friendly character. **Inter** is used for body copy and data-heavy labels to ensure maximum utility and legibility, particularly for metrics and competitive data.

Weight contrast is kept gentle; avoid "Black" or "Extra Bold" weights. Instead, rely on the difference between Semi-Bold and Regular to create hierarchy. Line heights are purposefully generous to increase the feeling of "breathability" throughout the application.

## Layout & Spacing

The layout follows a **fluid grid** model with significant emphasis on outer margins to center the user's focus.

- **Desktop:** 12-column grid with 64px side margins. Elements are often grouped in "islands" of content rather than stretching the full width of the viewport.
- **Mobile:** 4-column grid with 16px margins.

The spacing rhythm is based on an 8px scale. Use the `lg` (48px) and `xl` (80px) units between major sections to reinforce the minimalist aesthetic and prevent the interface from feeling cluttered. Gutters should remain constant at 24px to ensure distinct separation between data cards.

## Elevation & Depth

Visual hierarchy is achieved through **Glassmorphism** and **Tonal Layering**. Instead of traditional shadows, surfaces use a combination of:

1.  **Backdrop Blurs:** 12px to 20px blur on container backgrounds.
2.  **Semi-transparency:** Surface colors at 70-90% opacity.
3.  **Inner Glows:** A 1px white border (20% opacity) on the top and left edges of cards to simulate a light source.
4.  **Ambient Shadows:** Very soft, low-opacity shadows (4% alpha) with a large blur radius (30px+) are used only for the highest level of elevation, such as active modals or floating action buttons.

Avoid hard drop shadows or dark inner shadows. The goal is to make elements appear to be floating in a brightly lit, ethereal space.

## Shapes

The shape language is **balanced and rounded**. This design system uses the **Rounded (2)** setting to create a professional yet approachable aesthetic.

Containers and cards should utilize the `rounded-lg` (1rem) or `rounded-xl` (1.5rem) tokens for a clear, modern appearance. This consistency in curvature helps humanize the data-driven nature of the tool while providing enough structure for complex analytical layouts.

## Components

- **Buttons:** Primary buttons use the soft peach (`#FEDCD0`) with a subtle white-to-transparent gradient. Secondary buttons use a glass effect with a thin white border.
- **Cards:** Cards are the primary vessel for data. They should have a white background at 80% opacity, a 20px backdrop-blur, and a 1rem to 1.5rem corner radius.
- **Input Fields:** Use a soft-gray fill with no border until focused. Upon focus, the border should transition to the primary peach color with a soft outer glow.
- **Chips & Tags:** Small, rounded elements used for competitor categories. Use the secondary blue or primary peach at very low opacities (10%) with darker text of the same hue.
- **Lists:** Use generous vertical padding (16px+) between list items. Separate items with high-transparency lines or simply through whitespace rather than heavy dividers.
- **Progress Bars:** Use standard rounded tracks with the primary peach color for the fill. The motion should be eased and organic.
