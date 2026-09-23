# Design Notes — Landing Page Redesign

## Date: 2026-09-23
## Direction: Editorial Web Designer (per blueprint)

### What changed
- Replaced generic fintech landing page (gradient hero, card grids, testimonial carousel) with type‑forward, essay‑like layout.
- Updated color palette from purple (#7C3AED) to warm amber (#D97706) placeholder.
- Changed button border-radius from full to md, removed purple shadow.
- Added Inter font via next/font and CSS variable mapping.
- Removed loan calculator section (not in blueprint).
- Removed testimonial carousel; trust built through copy, not logo strips.
- FAQ remains accordion (per existing component) but could be visible Q&A in future pass.

### Why these choices
- Amber feels warmer and more human than corporate fintech blue/purple.
- Type‑forward hero forces the product’s specific problem statement to be the visual anchor.
- Inline typographic lists avoid the default card‑grid slop pattern.
- Editorial flow (essay‑like scroll) matches the target audience’s reading habits.

### What to watch
- Other pages (signup, login, about, contact) still use purple gradients and need updating for brand consistency.
- Final brand colors are still placeholder; swap amber for the approved palette when ready.
- The “example financing” numbers are placeholders; replace with real configurables.

### Anti‑slop checklist
- ✅ No gradient hero background
- ✅ No rounded‑16px‑shadow‑sm card grids
- ✅ No emoji in section headings
- ✅ No testimonial carousel
- ✅ No trust‑logo strip
- ✅ No rhetorical questions in headers
- ✅ No “seamless/elevate/journey” copy

### Next steps
1. Update signup/login pages to match new amber brand.
2. Replace placeholder financing numbers with real configurables.
3. Consider converting FAQ to visible Q&A (non‑accordion) for editorial tone.
4. Run accessibility audit (contrast, focus states) once final colors are set.
