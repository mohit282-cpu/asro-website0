---
name: design-system-spatial-glass-navbar
description: Premium Spatial UI + Glassmorphism design specification for modern AI, SaaS, and developer products. Defines implementation-ready visual language, motion, layout, accessibility, and component behavior.
---

<!-- TYPEUI_SH_MANAGED_START -->

# Spatial Glassmorphism Design System

## Mission

Create a futuristic, immersive interface that feels lightweight, premium, and three-dimensional.

The interface should appear to float above the background instead of being attached to it.

Users should feel depth, hierarchy, and motion without distraction.

---

# Design Philosophy

Inspired by

- Spatial Computing
- VisionOS
- Glassmorphism
- Apple Human Interface
- Linear
- Vercel
- Google AI

The interface should prioritize

- clarity
- hierarchy
- depth
- simplicity
- motion
- accessibility

---

# Design Keywords

- Spatial
- Floating
- Glass
- Premium
- AI Native
- Minimal
- Soft
- Elegant
- Intelligent
- Futuristic

---

# Visual Principles

## Floating Interface

Every major surface should appear detached from the page.

Avoid flat rectangles.

Components should cast soft shadows and use subtle transparency.

---

## Layered Depth

The interface must contain multiple depth layers.

```
Background

↓

Gradient Layer

↓

Particle Layer

↓

Glass Layer

↓

Content Layer

↓

Floating Components

↓

Cursor Layer
```

---

## Glass First

Every surface should use

- transparency
- blur
- soft borders
- realistic reflections

Avoid solid backgrounds whenever possible.

---

# Color Tokens

## Background

```
color.background.primary
#050608

color.background.secondary
#0C0D11

color.background.tertiary
#12141A
```

---

## Glass

```
glass.surface

rgba(255,255,255,0.06)

glass.border

rgba(255,255,255,0.12)

glass.hover

rgba(255,255,255,0.09)

glass.active

rgba(255,255,255,0.15)
```

---

## Accent

```
Blue

#4F8CFF

Purple

#7B5CFF

Cyan

#36D8FF

Green

#32E6A1
```

---

## Text

```
Primary

#FFFFFF

Secondary

#BFC4D1

Muted

#8E95A4
```

---

# Blur Tokens

```
blur.xs = 8px

blur.sm = 12px

blur.md = 20px

blur.lg = 32px

blur.hero = 48px
```

---

# Border Tokens

```
1px

rgba(255,255,255,0.08)

1.5px

rgba(255,255,255,0.10)

2px

rgba(255,255,255,0.14)
```

---

# Radius

```
small

12px

medium

20px

large

32px

capsule

999px
```

---

# Shadows

```
soft

0 8px 30px rgba(0,0,0,.15)

glass

0 12px 40px rgba(0,0,0,.25)

floating

0 24px 80px rgba(0,0,0,.35)

hero

0 60px 120px rgba(0,0,0,.45)
```

---

# Navigation

## Style

Floating Glass Capsule

Centered

Sticky

Transparent

Backdrop Blur

Rounded

Soft Shadow

---

## Dimensions

```
Height

76px

Width

90%

Max Width

1400px

Top

24px
```

---

## Navigation Background

```
rgba(255,255,255,.05)

blur(24px)

border

1px rgba(255,255,255,.12)
```

---

## Navigation Motion

Hover

```
Lift

2px

Scale

1.02

Duration

200ms
```

Scroll

```
Height

76px

↓

64px

Opacity

5%

↓

12%
```

---

# Hero

Glass Panel

Floating

Centered

Max Width

1280px

---

## Hero Card

```
Background

rgba(255,255,255,.05)

Blur

40px

Radius

32px

Padding

64px
```

---

## Hero Image

Should float

```
TranslateY

8px

↓

-8px

Duration

6s

Infinite
```

---

# Cards

Cards must appear suspended.

```
Background

rgba(255,255,255,.05)

Blur

24px

Radius

28px

Border

1px solid rgba(255,255,255,.08)
```

Hover

```
TranslateY

-8px

Scale

1.02

Shadow

Floating

Border Brightness

+15%
```

---

# Buttons

Primary

Glass Gradient

Rounded Capsule

```
Height

52px

Radius

999px
```

Hover

```
Glow

Scale

1.03

Magnetic Motion
```

---

Secondary

Ghost

Glass Border

Blur Background

---

# Inputs

Glass Surface

```
Blur

20px

Radius

16px

Padding

18px
```

Focus

```
Border Blue

Outer Glow

2px
```

---

# Sidebar

Floating

Glass

```
Width

280px

Radius

28px

Blur

32px
```

---

# Modals

Glass Window

```
Opacity

92%

Blur

40px

Radius

36px

Shadow

Hero
```

Open Animation

```
Scale

0.95

↓

1

Fade

0

↓

1
```

---

# Cursor

Custom Cursor

Small glowing orb

Blend mode

Screen

Smooth interpolation

---

# Background

Multiple Layers

Gradient

Noise

Grid

Particles

Glow

Orbs

---

## Gradient

Animated

Duration

20s

Infinite

---

## Noise

Opacity

2%

---

## Floating Orbs

Blur

80px

Opacity

18%

Movement

Slow

Organic

---

# Glass Components

Every Glass Surface

Must Include

- Blur
- Border
- Transparency
- Reflection
- Shadow
- Rounded Corners

Must Never Use

- Pure White
- Pure Black
- Hard Shadows
- Sharp Corners

---

# Spatial Effects

Every large component should have depth.

Methods

- Perspective
- Layer Separation
- Soft Shadow
- Floating Animation
- Cursor Parallax

---

# Cursor Parallax

Cards

```
RotateX

±5°

RotateY

±5°

Translate

4px
```

---

# Motion

Everything should feel weightless.

Avoid

Linear movement

Prefer

Spring

Ease Out

Inertia

Momentum

---

# Typography

Primary

Google Sans Flex

Secondary

Inter

Alternative

SF Pro Display

---

# Spacing

```
4

8

12

16

24

32

48

64

96

128
```

No arbitrary spacing.

---

# Accessibility

Must support

- WCAG 2.2 AA
- Keyboard Navigation
- Focus Visible
- Reduced Motion
- High Contrast
- Screen Readers

Glass surfaces must always maintain readable contrast.

---

# Performance

Maximum Layers

12

Target FPS

60

GPU Accelerated

Only animate

- opacity
- transform
- filter (minimal)

Avoid

- width
- height
- margin
- left
- top

---

# Responsive

Desktop

Spatial Layout

Tablet

Reduce blur

Reduce padding

Mobile

Simplified glass

Smaller radius

Reduced transparency

Disable heavy particles

---

# Anti Patterns

Never

❌ Heavy blur everywhere

❌ Excessive glow

❌ Hard borders

❌ Sharp corners

❌ Bright backgrounds

❌ Flat cards

❌ Heavy shadows

❌ Low contrast

❌ Random spacing

❌ Competing animations

---

# QA Checklist

## Glass

✓ Blur applied correctly

✓ Borders consistent

✓ Shadows realistic

✓ Transparency balanced

---

## Layout

✓ Floating hierarchy

✓ Consistent spacing

✓ Rounded corners

✓ Depth maintained

---

## Motion

✓ Smooth transitions

✓ 60 FPS

✓ GPU acceleration

✓ Reduced motion supported

---

## Accessibility

✓ Keyboard accessible

✓ Focus visible

✓ WCAG AA contrast

✓ Screen reader friendly

---

## Performance

✓ No layout shifts

✓ Optimized blur

✓ Optimized shadows

✓ Stable rendering

<!-- TYPEUI_SH_MANAGED_END -->