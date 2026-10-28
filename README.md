# Danushaa M S — portfolio

Cinematic, editorial portfolio built with Next.js 15 (App Router, TypeScript), GSAP + ScrollTrigger and Framer Motion.
All content comes from the October 2026 resume and lives in one file: `src/content/site.ts`.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run check      # typecheck + lint + production build
```

> This project was written in a workspace without npm access, so `npm run check` has **not** been run yet.
> The source was transpiled and rendered in headless Chromium (desktop, tablet, mobile, reduced motion) with real GSAP,
> but please run `npm run check` once after installing and fix anything it reports.

## Values to fill in (`src/content/site.ts`)

| Key | What to put there |
| --- | --- |
| `links.github` | Your GitHub profile URL. Until set, the contact overlay shows a dashed placeholder in dev and nothing in production. |
| `projects[].links` | Live / repository links per project, e.g. `[{ label: "Live site", href: "https://…" }]`. Empty arrays render nothing in production. |
| `portrait.src` | Put your photo in `/public` (e.g. `/public/portrait.jpg`) and set `"/portrait.jpg"`. `portrait.focus` sets the crop (`object-position`). A 4:5 photo works best. |
| `contact.showPhone` | `true` to show your phone number in the footer. |

The About section's second paragraph and the Story intro are written from your resume; edit the wording to sound like you.

## What's where

| Section | File | Notes |
| --- | --- | --- |
| Hero + inspection lamp | `components/Hero.tsx`, `components/Flashlight.tsx` | GSAP intro timeline; the lamp reveals a lit layer with annotations. |
| Story (experience) | `components/Story.tsx` | Chronological timeline, scroll-drawn rail. |
| Case files (projects) | `components/Work.tsx`, `components/ProjectVisual.tsx` | Pinned horizontal scroll on desktop; stacked on tablet, phone and reduced motion. |
| Outcomes | `components/Outcomes.tsx` | Second use of the lamp: outlined figures fill in under the beam. |
| Skills, About, Footer | `components/Skills.tsx`, `About.tsx`, `Footer.tsx` | |
| Let's collaborate | `components/HireMe.tsx`, `Hand.tsx`, `ContactOverlay.tsx` | Strings, hand pull, button tilt/gloss, morph into contact overlay. |

### The flashlight (`<Flashlight />`)

Reusable: pass a readable `base` layer and a `reveal` layer with identical layout.
Props: `radius`, `touchRadius`, `core` (bright-centre fraction), `glow`, `ease`, `rest` (start position), toggle labels and `hint`.
Pointer position goes straight into CSS custom properties from a requestAnimationFrame loop that stops when the beam settles; React never re-renders on move.
Touch: tap to place, horizontal drag to move (vertical swipes still scroll). Low-power devices and reduced motion get no smoothing and no glow.
Every lamp has a "show everything" toggle, and the reveal layer is `aria-hidden` because all essential text is in the base layer.

### Motion ownership

GSAP and Framer Motion never animate the same property on the same element:

- **GSAP**: hero timeline and parallax, section reveals, horizontal case files, SVG stroke drawing, the strings, the hand, and the `.collab__rig` wrapper's x/y.
- **Framer Motion**: nav underline and mobile menu, the collaborate button (tilt, lift, gloss sweep, tap), the shared-layout morph into the contact overlay, overlay content.

All GSAP work runs inside `useGSAP` + `gsap.matchMedia()` and is reverted on unmount; the string ticker only runs while its section is on screen.
`MotionConfig reducedMotion="user"` makes Framer follow the OS setting.

### Accessibility

Skip link, semantic landmarks, one `h1`, visible focus rings, `aria-current` in the nav, Escape-to-close mobile menu,
and a contact dialog with focus trap, Escape, a visible Close button and focus returned to the button.

## `preview/`

`preview/build.mjs` and `preview/runtime.js` build a browser preview without npm (used to produce the shared preview link).
They are not part of the Next.js app and are ignored by TypeScript and ESLint; delete the folder if you don't need it.
