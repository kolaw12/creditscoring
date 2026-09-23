RENTFIN — COMPLETE UI/UX REDESIGN INSTRUCTION

IMPORTANT: READ THIS ENTIRE PROMPT BEFORE CHANGING ANY CODE.

The current UI design of this application is NOT acceptable. Do not continue polishing the existing design. Do not simply change colors, font sizes, spacing, or individual sections.

I want you to completely rethink and redesign the frontend UI/UX from scratch while preserving the existing functionality, backend logic, APIs, database structure, authentication, and business logic wherever possible.

The goal is to make RentFin look like a professionally designed, production-ready fintech/housing-finance product that could realistically be launched to customers.

==================================================
1. PRODUCT
==================================================

RentFin is a Nigerian rent-financing platform.

The core problem:

A tenant may be able to afford rent through monthly income, but may not have enough cash available to pay a full year's rent upfront.

RentFin allows eligible customers to apply for rent financing. If approved, RentFin finances the eligible rent amount and pays the verified landlord/property recipient, while the tenant repays according to an agreed monthly repayment schedule.

The product should communicate:

- Trust
- Financial responsibility
- Simplicity
- Transparency
- Security
- Modern technology
- Housing
- Accessibility
- Professionalism

The product should NOT look like a generic banking dashboard, generic SaaS template, crypto website, or basic Bootstrap website.

==================================================
2. VERY IMPORTANT — DO NOT COPY THE CURRENT DESIGN
==================================================

The existing frontend should be treated as functional scaffolding only.

DO NOT:

- Make small CSS adjustments to the existing design
- Keep the current section structure just because it already exists
- Simply change the orange color
- Keep the existing generic cards
- Keep the current typography hierarchy
- Keep the current spacing system
- Keep the current hero layout
- Keep the current footer layout
- Reuse poor component arrangements
- Create pages by stacking headings and paragraphs
- Generate every page using the same generic dashboard template

Instead:

REDESIGN THE VISUAL SYSTEM AND PAGE COMPOSITIONS FROM THE GROUND UP.

==================================================
3. DESIGN QUALITY BAR
==================================================

The final result should feel like it was designed in Figma by an experienced product designer before being implemented in code.

It must feel:

- Premium
- Modern
- Clean
- Sophisticated
- Human
- Trustworthy
- Financially credible
- Housing-oriented
- Visually distinctive
- Responsive
- Carefully composed

It should NOT feel:

- AI-generated
- Template-generated
- Generic
- Empty
- Overly corporate
- Like a school project
- Like raw HTML/CSS
- Like a collection of unrelated dashboard cards

Every page should have intentional visual hierarchy and composition.

==================================================
4. DESIGN THE PRODUCT AS ONE SYSTEM
==================================================

Do not design each page independently.

Create one coherent RentFin design system.

Every screen should clearly belong to the same product.

Define and consistently use:

- Typography
- Font sizes
- Font weights
- Line heights
- Spacing scale
- Border radius
- Shadows
- Borders
- Background surfaces
- Cards
- Buttons
- Inputs
- Selects
- Tables
- Badges
- Alerts
- Modals
- Navigation
- Sidebar
- Tabs
- Progress indicators
- Empty states
- Loading states
- Error states
- Success states
- Icons
- Illustrations
- Responsive breakpoints

Use design tokens/CSS variables so the system can be changed globally.

==================================================
5. BRAND DIRECTION
==================================================

RentFin should have a strong visual identity.

The existing orange accent can be considered as part of the brand, but DO NOT flood the entire interface with orange.

Use color intentionally.

The overall visual direction should combine:

FINTECH + HOUSING + PREMIUM STARTUP.

Use a sophisticated neutral foundation with a carefully controlled accent color.

Do not use the common:

- Purple fintech gradient
- Blue SaaS template
- Excessive gradients
- Neon colors
- Random colorful cards

Do not finalize colors arbitrarily.

First establish a coherent palette and apply it consistently.

==================================================
6. TYPOGRAPHY
==================================================

Do not rely on browser-default typography.

Choose a professional modern font system suitable for a financial technology product.

Typography must create clear hierarchy between:

- Hero headline
- Section headline
- Page headline
- Subheading
- Body
- Supporting text
- Labels
- Numbers
- Financial figures
- Buttons
- Navigation

Large financial numbers should have deliberate typography.

Avoid making every heading unnecessarily huge.

==================================================
7. LAYOUT
==================================================

Use a professional responsive layout system.

Do not allow content to touch the browser edges unnecessarily.

Use:

- Max-width containers
- Consistent horizontal padding
- Strong grid alignment
- Appropriate whitespace
- Clear section boundaries
- Responsive layouts

Desktop layouts should have intentional composition.

Mobile layouts must be designed deliberately rather than simply shrinking desktop content.

==================================================
8. LANDING PAGE
==================================================

Completely redesign the landing page.

The landing page should immediately communicate:

"RentFin helps eligible tenants handle annual rent through manageable monthly payments."

The hero should contain:

- Strong headline
- Short supporting explanation
- Primary CTA
- Secondary CTA
- Trust/supporting information
- A strong visual composition on the other side

Do NOT create a hero with text on the left and a completely empty right side.

The hero visual should communicate the actual RentFin product.

Possible visual direction:

A polished rent-financing/payment interface showing something like:

Annual rent
₦1,200,000

Monthly repayment
₦XXX,XXX

Payment progress
██████████░░

Next payment
October XX

The visual should look like an actual product interface, not a fake generic illustration.

==================================================
9. LANDING PAGE STRUCTURE
==================================================

Create a carefully designed page containing appropriate sections such as:

1. Navigation
2. Hero
3. Social proof / trust indicators where appropriate
4. Problem
5. RentFin solution
6. How RentFin works
7. Product/financial visualization
8. Benefits
9. Eligibility
10. Transparent financing example
11. Trust/security
12. FAQ
13. Strong final CTA
14. Footer

Do not simply stack these sections vertically with plain text.

Each section needs its own visual composition.

==================================================
10. VISUAL STORYTELLING
==================================================

The website should visually communicate the RentFin journey:

RENT IS DUE
       ↓
CUSTOMER APPLIES
       ↓
APPLICATION IS REVIEWED
       ↓
CUSTOMER RECEIVES OFFER
       ↓
LANDLORD IS PAID
       ↓
CUSTOMER REPAYS MONTHLY

Use visual components, diagrams, cards, timelines, product previews, and other appropriate UI patterns.

Do not rely entirely on paragraphs to explain this.

==================================================
11. FINANCING EXAMPLE
==================================================

Create an elegant financing example component.

For example:

Annual rent
₦1,200,000

Financing term
12 months

Monthly repayment
₦XXX,XXX

Total repayment
₦X,XXX,XXX

IMPORTANT:

Do not invent actual RentFin commercial terms.

If the backend/business rules do not yet define interest, fees, maximum loan amount, minimum income, term, or other financial rules, make the UI configurable and clearly label examples as illustrative.

Never present invented numbers as official RentFin terms.

==================================================
12. AUTHENTICATION PAGES
==================================================

Redesign:

- Login
- Signup
- Forgot password
- Reset password
- Verification

These should feel like part of the same premium product.

Avoid boring centered forms floating on a completely empty page.

Use appropriate visual structure while keeping the forms simple and focused.

==================================================
13. BORROWER ONBOARDING
==================================================

Design onboarding as a polished multi-step experience.

Example:

STEP 1
Personal information

STEP 2
Employment & income

STEP 3
Property information

STEP 4
Rent details

STEP 5
Documents

STEP 6
Review & submit

Include:

- Progress indicator
- Clear step title
- Helpful explanation
- Form sections
- Validation states
- Save/continue behaviour
- Back/next controls
- Mobile-friendly layout

The user should always understand:

Where am I?
What information do I need?
How many steps remain?
What happens next?

==================================================
14. APPLICATION STATUS
==================================================

Create polished application-status screens.

Possible states:

Draft
Submitted
Verification
Under review
Additional information required
Approved
Declined
Expired

Each state should have a different appropriate visual treatment.

Do not use excessive colors.

==================================================
15. FINANCING OFFER
==================================================

This is one of the most important screens in the entire application.

Design a highly polished financing offer page.

The customer should immediately understand:

Approved financing amount
Customer contribution, if applicable
Fees/interest, where applicable
Monthly repayment
Total repayment
Repayment term
First payment date
Property/rent information
Offer expiry
Important terms

Include a clear:

ACCEPT OFFER

action.

Also provide access to the relevant terms before acceptance.

Do not hide important financial information.

==================================================
16. BORROWER DASHBOARD
==================================================

The dashboard should answer:

"What is happening with my rent?"

Design it around the user's actual financial journey.

Include appropriate elements such as:

- Greeting
- Application status
- Active financing
- Amount financed
- Monthly repayment
- Next payment
- Repayment progress
- Recent payments
- Notifications
- Important actions
- Documents

Example conceptual hierarchy:

ACTIVE RENT FINANCING

₦1,200,000 financed

₦XXX,XXX / month

Next payment
October XX

[ View loan ]

Repayment progress
████████████░░░░

Do not create a dashboard that is simply:

Card
Card
Card
Card
Table

It should have a clear visual hierarchy.

==================================================
17. LOAN DETAILS
==================================================

Create a detailed loan page containing:

- Loan summary
- Financing amount
- Repayment amount
- Remaining balance
- Progress
- Payment schedule
- Next payment
- Payment history
- Property information
- Relevant documents
- Loan status

Financial information must be easy to scan.

==================================================
18. PAYMENTS
==================================================

Design:

- Make payment
- Payment confirmation
- Payment processing
- Payment success
- Payment failure
- Payment history
- Receipt/details

Make payment status visually obvious.

Do not claim payment succeeded based only on frontend state.

==================================================
19. PROFILE & SETTINGS
==================================================

Design polished:

- Personal information
- Employment information
- Bank/payment information
- Documents
- Security
- Notifications
- Preferences

Use appropriate navigation and grouping.

==================================================
20. ADMIN EXPERIENCE
==================================================

The admin interface should feel like a serious operations platform.

Do not make it look identical to the borrower dashboard.

Create a proper admin information architecture.

Include:

- Dashboard
- Applications
- Application review
- Applicants
- Risk assessment
- Financing offers
- Loans
- Repayments
- Payments
- Landlords
- Properties
- Payouts
- Users
- Notifications
- Reports
- Audit logs
- Settings

Admin pages should prioritize:

- Information density
- Search
- Filtering
- Sorting
- Status
- Actions
- Tables
- Detail panels
- Review workflows

But they must still be visually polished.

==================================================
21. APPLICATION REVIEW
==================================================

The application review screen should feel like a real financial operations tool.

Organize information logically:

Applicant
Personal information
Employment
Income
Property
Rent
Documents
Verification
Risk assessment
Application history
Notes
Actions

Use tabs, sections, side panels, or other appropriate patterns.

Do not dump everything onto one giant page.

==================================================
22. MOBILE-FIRST DESIGN
==================================================

RentFin will be used heavily on mobile.

Do not treat mobile as an afterthought.

For every screen define how it behaves on:

- Mobile
- Tablet
- Desktop

On mobile:

- Navigation should transform appropriately
- Cards should stack intelligently
- Tables should become usable mobile layouts
- Forms should be comfortable to complete
- Financial figures must remain readable
- Buttons should be easy to tap
- Important actions should remain accessible

==================================================
23. MICROINTERACTIONS
==================================================

Use subtle professional interaction design:

- Hover states
- Focus states
- Button feedback
- Form validation
- Loading states
- Skeleton loading
- Success states
- Error states
- Progress transitions
- Modal transitions

Do not over-animate.

Animation should communicate state, not decorate the interface.

==================================================
24. ACCESSIBILITY
==================================================

Ensure:

- Good contrast
- Keyboard navigation
- Visible focus states
- Proper labels
- Accessible forms
- Semantic HTML
- Screen-reader-friendly controls
- Touch-friendly controls

==================================================
25. CONTENT DESIGN
==================================================

Do not fill the interface with meaningless placeholder copy.

Write concise product-oriented content.

Avoid:

"Lorem ipsum"

"Welcome to our amazing platform"

Generic SaaS marketing language.

The copy should explain RentFin clearly.

==================================================
26. ICONS AND GRAPHICS
==================================================

Use one coherent icon system.

Do not mix random icon styles.

Do not use emojis as UI icons.

Do not add random illustrations simply to fill empty space.

Every visual element should have a purpose.

==================================================
27. RESPONSIBLE FINANCIAL COMMUNICATION
==================================================

Do not invent:

- Interest rates
- Fees
- Loan limits
- Eligibility requirements
- Regulatory licenses
- Guarantees
- Approval times
- Financial promises

If these values are not defined in the backend/business rules, make them configurable.

Avoid misleading claims.

==================================================
28. TECHNICAL IMPLEMENTATION
==================================================

Use the existing project's architecture where practical.

Do not rewrite backend functionality unnecessarily.

The frontend should use reusable components.

Create a clear component system.

Example:

components/
  ui/
  navigation/
  forms/
  financial/
  applications/
  loans/
  payments/
  dashboard/
  admin/

Avoid duplicating components across pages.

==================================================
29. DESIGN TOKENS
==================================================

Create centralized tokens for:

colors
typography
spacing
radius
shadows
breakpoints
component dimensions

Do not scatter arbitrary values throughout the application.

==================================================
30. IMPORTANT DEVELOPMENT PROCESS
==================================================

Before writing code:

1. Inspect the entire existing project.
2. Understand the current routes.
3. Understand the existing components.
4. Understand the existing API integration.
5. Understand what functionality already works.
6. Identify what should be preserved.
7. Identify what is purely visual and can be rebuilt.

Then create a UI/UX implementation plan.

DO NOT immediately start editing files.

First show me:

A. Current architecture summary
B. Existing screens/routes
C. What will be preserved
D. What will be redesigned
E. Proposed design system
F. Proposed page structure
G. Component architecture
H. Responsive strategy
I. Implementation phases

WAIT FOR APPROVAL BEFORE IMPLEMENTING THE REDESIGN.

==================================================
31. DESIGN REVIEW STANDARD
==================================================

Before considering any page finished, review it as a professional product designer.

Ask:

- Does this look like a real fintech product?
- Is the hierarchy immediately clear?
- Is the primary action obvious?
- Does the page have visual rhythm?
- Is there enough whitespace?
- Does the page feel intentionally composed?
- Does it look good at desktop width?
- Does it look good on mobile?
- Does it feel consistent with the rest of RentFin?
- Does it communicate trust without making unsupported claims?
- Does it look like something a real company could launch?

If the answer is no, redesign the page rather than simply tweaking it.

==================================================
32. MOST IMPORTANT INSTRUCTION
==================================================

I do NOT want a generic AI-generated website.

I want a cohesive, premium, production-quality RentFin product interface.

Think like:

A senior product designer
+
A fintech UX designer
+
A design-system specialist
+
A senior frontend engineer

Do not rush into coding.

First understand the product.

Then establish the design system.

Then establish the screen architecture.

Then implement the interfaces consistently.

The goal is not to make the existing website "look better."

The goal is to make the entire RentFin product look professionally designed from the beginning.
