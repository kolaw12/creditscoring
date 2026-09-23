# MASTER BUILD PROMPT

## Graduate Rent Financing & Rent Payment Platform — Nigeria

You are the lead software architect, senior full-stack engineer, product designer, database engineer, security engineer, QA engineer, and DevOps engineer responsible for building this entire platform.

Do NOT treat this as a generic loan app.

The product is a **rent-financing platform for graduates and young professionals in Nigeria**.

The core problem is:

A tenant may be able to afford rent from their monthly income, but a landlord or agent may require the annual rent upfront. The platform allows an eligible tenant to apply for rent financing. If approved, the platform finances the approved rent amount and pays the verified landlord/property recipient according to the approved process. The tenant then repays the financing through scheduled monthly installments.

The platform must be designed around:

**Trust + affordability + transparency + security + excellent UX + responsible lending operations.**

---

# 1. PRODUCT OBJECTIVE

Build a production-quality web application that supports this complete lifecycle:

Landing Page
→ Sign Up
→ Login
→ Account Verification
→ Profile / KYC
→ Employment & Income Information
→ Property / Rent Information
→ Document Upload
→ Application Submission
→ Verification
→ Risk / Affordability Assessment
→ Manual/Admin Review
→ Financing Offer
→ Offer Acceptance
→ Agreement
→ Disbursement / Landlord Payment
→ Active Loan
→ Monthly Repayments
→ Payment History
→ Late Payment Handling
→ Collections
→ Loan Completion

There must also be a complete internal Admin Portal.

A future Landlord/Property Portal should be architecturally possible, even if it is not part of the first MVP.

---

# 2. IMPORTANT PRODUCT PRINCIPLE

Do not build a website that merely looks like a fintech application.

Build an actual financial workflow.

Every important action must have:

* validation
* authorization
* database persistence
* auditability
* error handling
* proper state transitions
* idempotency where money movement is involved
* appropriate notifications
* clear UI feedback

Do not fake financial transactions.

Do not create fake successful payment responses in production code.

Do not hardcode approval decisions.

Do not expose secret keys to the frontend.

Do not store sensitive credentials in source code.

---

# 3. INITIAL PRODUCT SCOPE

The first release is a:

## Responsive Web Application

Do NOT build native Android/iOS applications in the first phase.

The web application must be:

* mobile-first
* tablet responsive
* desktop responsive
* accessible
* fast
* professional
* usable on Nigerian mobile networks
* optimized for real-world phones

The architecture should allow a future React Native mobile application to consume the same backend APIs.

---

# 4. TECHNOLOGY STACK

Use this stack unless there is a compelling technical reason to change it.

## Frontend

* Next.js
* TypeScript
* React
* Tailwind CSS
* shadcn/ui or an equivalent accessible component system
* React Hook Form
* Zod
* TanStack Query
* Recharts where charts are required

Use Next.js for:

* marketing website
* authentication pages
* borrower portal
* admin portal

Use TypeScript strictly.

Avoid unnecessary client-side state.

Use server-side rendering/static rendering where appropriate for public pages.

---

# 5. BACKEND

Use:

* Node.js
* TypeScript
* Express.js

Do NOT switch to NestJS unless explicitly requested.

Structure the backend cleanly using modules.

Recommended architecture:

src/

config/
modules/
auth/
users/
tenants/
landlords/
properties/
applications/
risk/
offers/
loans/
repayments/
payments/
payouts/
documents/
notifications/
admin/
analytics/
webhooks/
middleware/
database/
jobs/
queues/
utils/
types/
app.ts
server.ts

Use:

* controllers
* services
* repositories/data-access layer where useful
* validators
* middleware
* typed DTOs
* centralized error handling

Do not put business logic directly inside route handlers.

---

# 6. DATABASE

Use:

## PostgreSQL

Use:

## Prisma ORM

The database must be designed for financial data and future growth.

The original database concept includes:

* users
* tenant_profiles
* landlords
* properties
* applications
* risk_assessments
* financing_offers
* landlord_payouts
* repayment_schedules
* payments
* auto_debit_mandates
* documents

Improve this structure where necessary.

IMPORTANT:

Create a dedicated:

## loans

table/entity.

A financing offer is NOT the same thing as an active loan.

Lifecycle:

Application
→ Risk Assessment
→ Offer
→ Accepted Offer
→ Loan
→ Disbursement
→ Repayment
→ Completed / Defaulted

Also create appropriate structures for:

* loan transactions
* payment attempts
* webhook events
* audit logs
* notifications
* verification records
* application status history
* loan status history

Do not treat the `payments` table as a simplistic generic ledger if a proper financial transaction structure is required.

---

# 7. FINANCIAL DATA PRINCIPLES

Money must never be represented using floating-point numbers.

Use an appropriate precise representation such as:

* PostgreSQL DECIMAL/NUMERIC
* integer minor units where appropriate

Every financial transaction must have:

* unique internal ID
* provider reference where applicable
* transaction type
* amount
* status
* timestamps
* related user/application/loan
* audit information

Money-moving operations must be idempotent.

If a payment provider sends the same webhook multiple times, the system must NOT record the payment multiple times.

---

# 8. USER ROLES

Implement role-based access control.

Initial roles:

## Tenant

Can:

* register
* verify account
* complete profile
* submit financing application
* upload documents
* view application status
* view financing offer
* accept/reject offer
* view active loan
* view repayment schedule
* make payments
* view payment history
* manage profile
* contact support

## Admin

Can:

* view applications
* review applications
* view verification information
* review risk assessment
* approve/decline according to configured workflow
* create/manage offers
* manage loans
* monitor repayments
* manage collections
* manage landlord/property records
* monitor payouts
* view reports
* manage users
* view audit logs

Create room for additional roles such as:

* credit_officer
* operations
* collections_officer
* finance
* super_admin

Do not give every admin unrestricted permissions by default.

---

# 9. PUBLIC LANDING PAGE

The landing page must NOT look like a generic loan website.

The product solves a very specific problem:

"Your landlord wants rent upfront. We help eligible tenants spread the cost into manageable monthly payments."

The landing page should communicate this immediately.

Required sections:

1. Navigation
2. Hero
3. Problem / solution
4. How it works
5. Benefits
6. Who can apply
7. Example financing explanation
8. Trust/security section
9. FAQ
10. Final CTA
11. Footer

Primary CTA:

"Get Started"

Secondary CTA:

"How It Works"

The hero should visually communicate:

Property / rent
→ financing
→ monthly repayment

Do not rely on a generic stock-photo fintech design.

The visual identity must communicate:

* housing
* financial trust
* modern technology
* young professionals
* simplicity

---

# 10. DO NOT FINALIZE BRAND COLORS YET

The previous purple/navy concept is NOT approved.

Do not assume the final brand palette.

Create the frontend with a centralized design-token system so the colors can be changed globally later.

For example:

--color-primary
--color-secondary
--color-background
--color-surface
--color-text
--color-muted
--color-success
--color-warning
--color-danger
--color-border

Do not scatter hard-coded colors throughout the application.

The final brand colors will be selected separately.

---

# 11. DESIGN DIRECTION

The UI must feel:

* premium
* modern
* trustworthy
* calm
* simple
* human
* professional

Avoid:

* generic fintech templates
* excessive gradients
* excessive glassmorphism
* excessive shadows
* overly colorful dashboards
* unnecessary animations
* crowded cards
* meaningless charts
* giant amounts of information on one screen

The product should feel like a real company, not an AI-generated dashboard.

---

# 12. DESIGN SYSTEM

Create a reusable design system before building all screens.

Define:

* typography
* spacing
* buttons
* inputs
* selects
* checkboxes
* radio buttons
* cards
* tables
* tabs
* modals
* drawers
* badges
* alerts
* tooltips
* dropdowns
* progress indicators
* stepper
* document upload components
* confirmation dialogs
* loading states
* skeleton states
* empty states
* success states
* error states

All pages must use the same component system.

---

# 13. AUTHENTICATION FLOW

Build:

* Sign up
* Login
* Logout
* Forgot password
* Reset password
* Email verification
* Phone/OTP verification where applicable
* Session management
* Protected routes

Never store plaintext passwords.

Use secure password hashing.

Implement proper:

* access token/session handling
* refresh strategy if JWT is used
* CSRF protection where applicable
* rate limiting
* brute-force protection
* account lock/risk controls where appropriate

---

# 14. SIGN-UP PAGE

The sign-up experience should be extremely simple.

Collect only what is necessary initially.

Example:

Full name
Email
Phone
Password
Confirm password

Then verification.

Do not ask the user for 30 fields during registration.

Profile/application information should be collected later.

---

# 15. BORROWER ONBOARDING

After account creation:

Guide the user through a clear onboarding flow.

Example:

Step 1:
Personal Information

Step 2:
Employment

Step 3:
Income

Step 4:
Property/Rent

Step 5:
Documents

Step 6:
Review & Submit

Always show:

* progress
* current step
* remaining steps
* save and continue later
* validation errors

Never make the user wonder:

"Where am I?"

---

# 16. PERSONAL INFORMATION

Collect appropriate information required for identity and underwriting.

Possible information:

* full legal name
* date of birth
* phone
* email
* address
* identification information
* BVN/NIN where legally and operationally appropriate

Sensitive information must be protected.

Do not display sensitive identity numbers unnecessarily.

Mask sensitive values in the UI.

---

# 17. EMPLOYMENT AND INCOME

Collect:

* employment status
* employer
* job title where necessary
* employment start date
* monthly income
* salary payment frequency
* salary bank
* relevant income documentation

The application must make affordability understandable.

Do not automatically approve someone merely because they have employment.

---

# 18. PROPERTY / RENT APPLICATION

Collect:

* property address
* city
* state
* property type
* annual/monthly rent
* lease duration
* landlord/agent information
* requested financing amount
* proposed down payment

The system should validate that:

requested financing
+
tenant contribution
===================

relevant approved financing/rent structure

Do not allow inconsistent financial figures.

---

# 19. LANDLORD AND PROPERTY VERIFICATION

The platform should support:

* landlord identity/details
* property details
* bank account details
* verification status
* payout information

The system should be designed so that approved rent financing can be paid to the correct verified recipient rather than simply handing unrestricted cash to the borrower where the business model does not require it.

Build verification status tracking.

---

# 20. DOCUMENT MANAGEMENT

Support appropriate documents such as:

* government ID
* employment letter
* bank statement
* tenancy agreement
* proof of income
* property/rent documentation

Documents should have:

* type
* owner
* application
* upload timestamp
* verification status
* rejection reason if applicable

Use secure object storage.

Do not expose private documents through public URLs.

Use signed/private access where appropriate.

---

# 21. RISK / AFFORDABILITY ENGINE

Create a dedicated risk module.

Do NOT hardcode arbitrary approval logic into the frontend.

The risk engine should be configurable.

Potential inputs:

* monthly income
* requested rent
* financing amount
* rent-to-income ratio
* employment status
* employment duration
* verified income
* bank cash flow data
* existing obligations
* credit information
* previous repayment history
* other approved risk factors

Potential outputs:

* affordability score
* risk score
* risk level
* recommended financing amount
* recommended down payment
* recommendation:

  * approve
  * manual_review
  * decline

IMPORTANT:

Do not present an internal risk score to the borrower unless the business/legal policy explicitly requires it.

All automated decisions should be auditable.

Store the inputs and decision version used.

---

# 22. APPLICATION STATUS

Create clear application states.

Example:

draft
→ submitted
→ verification
→ under_review
→ additional_information_required
→ approved
→ declined
→ expired

Do not allow arbitrary status changes.

Implement valid state transitions.

The borrower should see a simple human-readable status.

Example:

"Your application is currently being reviewed."

Not:

`APPLICATION_UNDER_REVIEW_V3`.

---

# 23. FINANCING OFFER

After approval, generate a financing offer.

Show clearly:

* approved financing amount
* tenant contribution/down payment
* financing fee where applicable
* interest/finance charge where applicable
* monthly installment
* repayment period
* total repayment amount
* first payment date
* subsequent payment dates
* property
* important terms
* expiry date

The exact commercial structure must be configurable.

Do not invent financial terms.

The UI must make the total cost obvious before acceptance.

---

# 24. OFFER ACCEPTANCE

The tenant must explicitly accept the offer.

Store:

* offer version
* terms
* acceptance timestamp
* user
* IP/device metadata where appropriate
* agreement reference

Do not silently modify accepted terms.

Once accepted, create the loan according to the configured workflow.

---

# 25. LOAN MANAGEMENT

Create a proper loan lifecycle.

Example:

approved
→ offer_accepted
→ pending_disbursement
→ active
→ delinquent
→ defaulted
→ completed
→ cancelled where applicable

The borrower dashboard must show:

* original amount
* outstanding balance
* amount paid
* next payment
* payment progress
* repayment schedule
* loan status

---

# 26. REPAYMENT SCHEDULE

Generate the repayment schedule when the loan is activated.

Each installment should contain:

* installment number
* due date
* amount due
* amount paid
* outstanding amount
* status
* paid date
* applicable fees where valid

Support:

* paid
* pending
* partial
* late
* defaulted

Do not allow the frontend to decide that a payment is "paid."

Payment status must come from the backend after verification.

---

# 27. PAYMENTS

Integrate with the selected Nigerian payment provider(s).

The architecture should allow Paystack and/or Flutterwave without tying the whole system to one provider.

Payment flow:

Frontend
→ backend
→ payment provider
→ provider webhook
→ backend verification
→ transaction update
→ repayment update
→ loan balance update
→ notification

Never trust a frontend success message as proof of payment.

Verify provider transactions server-side.

Implement webhook signature/security verification according to the provider's official requirements.

---

# 28. LANDLORD PAYOUTS

Payout flow must be traceable.

Example:

Approved loan
→ offer accepted
→ required conditions satisfied
→ payout initiated
→ provider processing
→ payout successful
→ loan/disbursement recorded

Handle:

* pending
* processing
* successful
* failed
* reversed

Do not mark payouts as successful merely because an API request was sent.

---

# 29. AUTO-DEBIT

Support recurring payment authorization where the selected payment provider and business model support it.

Track:

* mandate reference
* provider
* status
* authorization date
* start date
* end date
* failed attempts

Handle failed debit attempts gracefully.

Do not repeatedly charge users without following configured rules.

---

# 30. NOTIFICATIONS

Support:

* email
* SMS
* in-app notifications

Notifications should include:

* account verification
* application submitted
* additional information required
* application approved
* application declined
* financing offer available
* offer accepted
* disbursement update
* upcoming repayment
* payment successful
* payment failed
* missed payment
* loan completed

Use background jobs/queues for notifications.

Do not block the main HTTP request unnecessarily while sending SMS/email.

---

# 31. BORROWER DASHBOARD

The dashboard should be simple.

Show:

* greeting
* application status
* active loan
* outstanding balance
* next repayment
* repayment progress
* recent payments
* important notices
* quick actions

Navigation:

Dashboard
My Application
My Loan
Payments
Documents
Profile
Support

Do not overload the dashboard with meaningless statistics.

---

# 32. MY LOAN PAGE

Include:

Loan Summary

* loan amount
* total repayment
* outstanding balance
* repayment period
* status

Repayment Progress

Repayment Schedule

Payment History

Loan Documents

Make Payment

Support

---

# 33. PAYMENT PAGE

Allow the borrower to:

* view amount due
* select payment method
* initiate payment
* see payment processing status
* see success/failure result

Never display "successful" before the backend confirms the payment.

---

# 34. ADMIN DASHBOARD

Build a serious internal operations dashboard.

Main sections:

Dashboard
Applications
Customers
Risk Review
Offers
Loans
Payments
Payouts
Repayments
Collections
Properties
Landlords
Documents
Reports
Audit Logs
Settings

---

# 35. ADMIN APPLICATION REVIEW

Admin should be able to see:

Applicant
Application
Property
Rent
Requested financing
Documents
Verification
Income
Employment
Risk assessment
Flags
History

Actions:

* approve
* decline
* request information
* create offer where appropriate

Every important admin decision must create an audit event.

---

# 36. ADMIN LOAN VIEW

Show:

* borrower
* loan ID
* original amount
* outstanding balance
* amount repaid
* repayment schedule
* payment history
* payout history
* status
* delinquency information
* relevant documents
* audit history

---

# 37. COLLECTIONS

Create a dedicated collections section.

Show:

* upcoming payments
* overdue payments
* days overdue
* outstanding amount
* borrower
* contact history
* previous payment behavior
* collection status

Do not build abusive collection mechanisms.

Collections actions must be traceable and governed by configured business policies.

---

# 38. ANALYTICS

Admin reporting should include:

* total applications
* approved applications
* declined applications
* active loans
* total amount financed
* total outstanding
* repayments received
* overdue amount
* default metrics
* payout metrics

Charts should be useful, not decorative.

---

# 39. AUDIT LOGGING

Create a robust audit system.

Log important events such as:

* login
* failed login
* password change
* KYC changes
* application submission
* document verification
* risk decision
* offer creation
* offer acceptance
* loan creation
* payout initiation
* payout completion
* payment
* repayment status changes
* admin approval
* admin decline
* settings changes

Audit records should not be casually editable/deletable.

---

# 40. SECURITY

This is a financial application.

Implement appropriate:

* HTTPS
* secure password hashing
* authentication
* authorization
* RBAC
* input validation
* output validation
* rate limiting
* secure headers
* CORS configuration
* CSRF protection where applicable
* SQL injection protection through ORM/parameterization
* XSS protection
* secure cookies/tokens
* secret management
* encryption for sensitive data where appropriate
* private document storage
* webhook verification
* audit logs
* dependency vulnerability monitoring

Never place:

* API secrets
* payment secret keys
* database passwords
* encryption keys

inside frontend code or Git.

Use environment variables/secrets management.

---

# 41. ERROR HANDLING

Every important operation needs proper error states.

Examples:

Payment failed
Document upload failed
KYC failed
Application submission failed
Session expired
Network error
Server error
Invalid form
Duplicate payment
Provider unavailable

Errors should be understandable to users.

Never expose stack traces or internal database errors to users.

---

# 42. FRONTEND UX REQUIREMENTS

The application must feel like one coherent product.

Do not create disconnected screens.

The journey must feel natural:

Landing
→ Sign up
→ Verify
→ Onboarding
→ Application
→ Submit
→ Status
→ Offer
→ Accept
→ Loan
→ Repayment

Use:

* clear progress
* breadcrumbs where appropriate
* persistent navigation
* contextual help
* confirmation screens
* empty states
* skeleton loaders
* success states
* clear errors

Forms should preserve entered data when possible.

---

# 43. MOBILE-FIRST DESIGN

Design mobile first.

Then expand to:

* tablet
* desktop

Do not simply shrink the desktop UI.

Mobile forms should:

* have large touch targets
* avoid unnecessary fields
* use appropriate input types
* support Nigerian phone numbers
* work well with mobile keyboards
* clearly show progress

---

# 44. ACCESSIBILITY

Use semantic HTML.

Support:

* keyboard navigation
* focus states
* screen readers
* accessible labels
* sufficient contrast
* error descriptions
* accessible dialogs
* accessible form validation

Do not use color alone to communicate status.

---

# 45. PERFORMANCE

Optimize for real-world Nigerian connectivity.

Avoid:

* unnecessary JavaScript
* huge images
* excessive animation
* unnecessary API requests

Use:

* image optimization
* lazy loading
* caching
* pagination
* background jobs
* database indexes
* appropriate query optimization

---

# 46. API DESIGN

Use REST APIs with consistent conventions.

Example:

/api/v1/auth
/api/v1/users
/api/v1/applications
/api/v1/properties
/api/v1/landlords
/api/v1/risk
/api/v1/offers
/api/v1/loans
/api/v1/repayments
/api/v1/payments
/api/v1/payouts
/api/v1/documents
/api/v1/notifications
/api/v1/admin
/api/v1/analytics
/api/v1/webhooks

Use consistent:

* HTTP status codes
* error format
* pagination
* filtering
* sorting
* validation
* authentication

---

# 47. API DOCUMENTATION

Generate OpenAPI/Swagger documentation.

Every API should document:

* endpoint
* method
* authentication
* request body
* response
* errors
* authorization requirements

---

# 48. BACKGROUND JOBS

Use a queue system such as:

Redis + BullMQ

for:

* notifications
* repayment reminders
* payment reconciliation
* webhook processing where appropriate
* scheduled checks
* document processing
* other asynchronous tasks

Do not create fragile cron logic inside random route handlers.

---

# 49. FILE STORAGE

Use private object storage such as AWS S3.

Documents must not be publicly accessible.

Implement:

* upload validation
* file size limits
* MIME validation
* safe filenames
* private storage
* signed access URLs
* document status
* deletion/retention policies according to configured requirements

---

# 50. ENVIRONMENT CONFIGURATION

Create:

.env.example

with placeholders such as:

DATABASE_URL=
JWT_SECRET=
PAYMENT_PROVIDER_SECRET=
PAYMENT_PROVIDER_PUBLIC_KEY=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=
REDIS_URL=
SMS_API_KEY=
EMAIL_API_KEY=

Never commit real secrets.

---

# 51. DEVELOPMENT ENVIRONMENTS

Support:

Development
Staging
Production

Do not use production payment credentials in development.

Provide a sandbox/mock provider abstraction for development.

---

# 52. TESTING

Write tests.

At minimum:

### Unit tests

* authentication
* affordability calculations
* repayment calculations
* loan state transitions
* payment handling
* webhook processing

### Integration tests

* signup
* application submission
* offer acceptance
* loan creation
* payment confirmation
* repayment update

### End-to-end tests

Test the complete journey:

Signup
→ Verification
→ Application
→ Review
→ Offer
→ Acceptance
→ Loan
→ Payment

---

# 53. DATABASE MIGRATIONS

All database changes must use migrations.

Never manually alter production database structure.

Seed development data separately.

Create realistic development fixtures but clearly label them as test data.

---

# 54. DEPLOYMENT

Recommended architecture:

Frontend:
Next.js → Vercel or equivalent

Backend:
Node.js/Express → AWS/DigitalOcean/etc.

Database:
Managed PostgreSQL

Storage:
AWS S3 or equivalent

Cache/Queue:
Managed Redis

CI/CD:
GitHub Actions

Monitoring:
Sentry + infrastructure logging

The architecture should support scaling later.

---

# 55. PROJECT STRUCTURE

Create a clean monorepo if appropriate.

Example:

apps/
web/
api/

packages/
ui/
types/
config/
validation/

Or another clean architecture if there is a strong reason.

Keep frontend and backend responsibilities clearly separated.

---

# 56. DO NOT OVERENGINEER THE MVP

Do not build everything at once.

Build in phases.

## PHASE 1 — FOUNDATION

* project setup
* database
* authentication
* RBAC
* design system
* basic frontend
* backend architecture
* environment configuration

## PHASE 2 — PUBLIC WEBSITE

* landing page
* how it works
* FAQs
* about
* contact
* authentication pages

## PHASE 3 — BORROWER ONBOARDING

* profile
* verification
* employment
* income
* property
* documents

## PHASE 4 — APPLICATION

* application flow
* validation
* submission
* application status

## PHASE 5 — ADMIN

* application review
* verification
* risk review
* approval/decline
* offer creation

## PHASE 6 — LOANS

* offer acceptance
* loan creation
* repayment schedule
* borrower loan dashboard

## PHASE 7 — PAYMENTS

* payment provider integration
* webhooks
* reconciliation
* repayments
* payouts

## PHASE 8 — NOTIFICATIONS

* email
* SMS
* reminders
* payment notifications

## PHASE 9 — COLLECTIONS & REPORTING

* overdue loans
* collections
* analytics
* reports

## PHASE 10 — HARDENING

* security audit
* performance
* testing
* monitoring
* deployment
* production readiness

---

# 57. CRITICAL RULE FOR THE AI AGENT

Do NOT attempt to generate the entire system in one giant uncontrolled code generation step.

Work incrementally.

For every phase:

1. Explain what you are about to build.
2. Inspect the existing project.
3. Implement the phase.
4. Run tests.
5. Fix errors.
6. Verify database migrations.
7. Verify API endpoints.
8. Verify frontend behavior.
9. Confirm completion.
10. Move to the next phase only when the current phase is stable.

Never overwrite working functionality unnecessarily.

Never create duplicate components when reusable components already exist.

Never silently change architecture.

---

# 58. IMPORTANT BUSINESS RULE

The software must not invent business policies.

Things such as:

* interest rate
* financing fee
* maximum loan amount
* minimum income
* repayment duration
* down payment
* affordability thresholds
* late fees
* eligibility criteria

must be configurable.

Use configuration/policy tables or a dedicated policy layer where appropriate.

Do not hardcode these values throughout the codebase.

---

# 59. REGULATORY / COMPLIANCE DESIGN

The platform will operate in Nigeria and involves financial services.

Build the software to be compliance-ready.

Do not falsely claim that the software itself is legally compliant.

Do not invent licenses or regulatory approvals.

Keep appropriate separation between:

* product configuration
* lending policy
* compliance requirements
* software implementation

Sensitive customer data must be handled securely.

The architecture must allow future compliance requirements to be incorporated without rebuilding the entire application.

---

# 60. FINAL UX STANDARD

Before considering a page complete, ask:

Does this feel like a real product?

Can a first-time user understand what to do?

Is the primary action obvious?

Is the amount of information appropriate?

Does it work on mobile?

Does the page explain errors clearly?

Does the design match the rest of the platform?

Does it feel trustworthy enough for someone to trust us with their rent?

If the answer is no, improve it before proceeding.

---

# 61. FINAL QUALITY STANDARD

The finished application should NOT look like:

* an AI-generated template
* a generic dashboard
* a tutorial project
* a basic CRUD application

It should look and behave like a serious Nigerian fintech/property-financing product.

Prioritize:

**UX → Security → Correct financial logic → Reliability → Maintainability → Performance → Visual polish.**

Do not sacrifice financial correctness for visual appearance.

---

# 62. STARTING INSTRUCTION

Before writing application code:

1. Inspect the existing repository.
2. Inspect the existing database/schema files.
3. Inspect existing frontend files.
4. Inspect existing backend files.
5. Identify what already exists.
6. Compare it against this specification.
7. Produce a short implementation plan.
8. Identify contradictions or missing decisions.
9. Do NOT invent missing business rules.
10. Begin with Phase 1 only.

Do not build the entire system blindly.

Build it as a professional software team would build it.

The final system must be modular, secure, testable, scalable, maintainable, responsive, and visually polished.
