# DESIGN.md — [Brand Name]

## 1. Objective

The landing page should feel like a trustworthy, human‑centered fintech solution — not a generic loan app. Someone should walk away understanding that this product helps young professionals split their annual rent into manageable monthly payments, and that the process is transparent, secure, and designed for their reality. The quality bar is “premium but approachable”: clean enough to trust with money, warm enough to feel like it was made for people, not spreadsheets.

## 2. Product Context

- **What the product does:** A rent‑financing platform that lets eligible tenants spread their annual rent into monthly installments, with the platform paying the landlord upfront.
- **Who it’s for:** Young professionals and recent graduates in Nigeria (mid‑20s to early‑30s) who can afford monthly rent but face upfront annual payment demands from landlords.
- **Adjacent brands (feel like these):** Mercury (clarity and trust), Ramp (editorial clarity), Monzo (human fintech).
- **Distant brand (do not feel like this):** Generic payday‑loan sites — cluttered, aggressive, and predatory‑looking.
- **Cultural register:** Serious but human — financial trust without coldness.

## 3. Visual Foundations

### 3a. Color

- **Neutral scale:** `[--n-50: #F9FAFB, --n-100: #F3F4F6, --n-200: #E5E7EB, --n-300: #D1D5DB, --n-400: #9CA3AF, --n-500: #6B7280, --n-600: #4B5563, --n-700: #374151, --n-800: #1F2937, --n-900: #111827]`
- **Accent(s):** `[--accent-primary: #D97706]` (a warm amber/terracotta – placeholder for final brand color)
- **Semantic:** `[--success: #059669, --warning: #D97706, --error: #DC2626]`
- **Usage rules:** Accent is used sparingly — primary CTA buttons, key numbers, and active states only. Never as a section background. Neutrals dominate the palette.

### 3b. Typography

- **Display face:** `Inter, weights 600–700`
- **Body face:** `Inter, weights 400–500`
- **Fallback stack:** `['Inter', 'system-ui', 'sans-serif']`
- **Type scale:** `[12 / 14 / 16 / 18 / 24 / 32 / 48 / 72]` (minor third ratio)
- **Weight discipline:** Headings: 600–700. Body: 400–500. No bold body text.

### 3c. Spacing & rhythm

- **Base unit:** `8px`
- **Spacing scale:** `[4, 8, 16, 24, 32, 48, 64, 96, 128]`
- **What "generous" whitespace means in numbers:** Section padding ≥ 96px on desktop, ≥ 64px on mobile.

### 3d. Component seeds

- **Button:** Two variants: primary (filled accent, rounded‑md) and ghost (text link with hover underline). No secondary filled buttons.
- **Card / container:** Minimal cards with 1px border, no shadow, 0px radius. Used only for grouping related content (e.g., FAQ items). Not for feature grids.
- **Iconography:** Lucide icons, weight 1.5, used sparingly for functional elements (arrows, checkmarks). No decorative icons.

## 4. Accessibility

- **Text contrast:** Body text 4.5:1 min against background. Large text/UI 3:1 min.
- **Motion:** Respect `prefers-reduced-motion`. No auto‑playing animations.
- **Focus indicators:** Visible focus ring (2px solid accent) on interactive elements.
- **Alt text policy:** Decorative images: alt="". Informational images: concise description of content.

## 5. Voice & Tone

- **Register:** Conversational but professional — like a knowledgeable friend, not a bank brochure.
- **Sentence rhythm:** Short to medium. One idea per sentence.
- **Words this brand uses:** “spread,” “monthly,” “transparent,” “secure.”
- **Words this brand refuses:** “seamless,” “elevate,” “journey,” “unlock,” “delight.”
- **Address:** “you” / “your” — direct to the reader.

## 6. Implementation Practices

- **Token format:** CSS variables (Tailwind theme extension).
- **Component library convention:** shadcn/ui for base components, bespoke overrides for brand‑specific styling.
- **Image treatment rules:** Real photography of Nigerian urban environments (apartments, young professionals) – no stock fintech imagery. If photography isn’t available, use solid color blocks with typographic treatment.
- **Grid system:** 12‑column grid, max‑width 1200px, centered.
- **Motion rules:** Easing: cubic‑bezier(0.4, 0, 0.2, 1); duration: 150–300ms. Only for hover states and page transitions. No bouncing, no parallax.

## 7. Anti-Patterns

- **No gradient hero backgrounds.** This brand’s trust comes from clarity, not flashy gradients.
- **No rounded‑16px‑shadow‑sm card grids.** Feature lists are presented as typographic rhythm, not identical boxes.
- **No emoji in section headings.** Confidence is verbal, not visual.
- **No testimonial carousels.** One or two static, verified testimonials if needed.
- **No “trust logos” strip.** Trust is built through copy and transparency, not logo rows.
- **No rhetorical questions in headers.** Statements only.

## 8. Decision-Making

1. **Clarity over cleverness.** If a layout obscures the message, revise the layout.
2. **Restraint over completeness.** When in doubt, cut. This brand under‑decorates rather than over‑decorates.
3. **Human over corporate.** Prefer language and imagery that feels personal, not institutional.
4. **Accessibility floor is not negotiable.** If a color choice fails contrast, change the color.

## 9. Workflow

1. Read Objective + Product Context + Voice & Tone.
2. Write the page outline in plain text — one line per section, no visuals.
3. For each section, decide: does the message need a visual, or does typographic treatment carry it?
4. Apply Visual Foundations (color, type scale) to the outline.
5. Anti‑Patterns pass: flag any section that matches a slop pattern; revise.
6. Accessibility pass: contrast + type size.
7. Ship.
