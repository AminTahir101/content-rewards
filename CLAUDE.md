# CLAUDE.md — Permanent Project Context

> When I provide a feature request, treat this file as permanent product context.
> Do not make me re-explain the Content Rewards business model in each prompt.
> Read this file in full before starting any task in this repository.

---

## 1. PROJECT PURPOSE

You are building **Content Rewards**, a Saudi-first creator performance marketing platform inspired by the product model and user experience of:

https://contentrewards.com/

The application connects:

**Brands → Campaigns → Creators → Published Content → Verified Performance → Rewards**

The core business model is simple:

- Brands create and fund creator campaigns.
- Creators discover campaigns and join them.
- Creators publish content on supported social platforms.
- Creators submit their published content URL.
- The platform verifies content and performance.
- Rewards are calculated based on verified performance.
- Creators receive earnings.
- Brands receive measurable campaign analytics.
- The platform earns fees from campaign activity.

The goal is NOT to create a generic influencer marketplace. The product must feel like a performance-based creator economy platform where brands buy measurable distribution and creators earn based on measurable results.

---

## 2. REFERENCE PRODUCT

Use https://contentrewards.com/ as the primary product reference for: product structure, creator journey, business journey, campaign mechanics, campaign discovery, campaign detail hierarchy, reward presentation, creator earnings, campaign analytics, submission workflows, general UX simplicity, visual density, marketplace behavior.

Do NOT blindly copy: logos, brand name, copyrighted illustrations, proprietary text, exact HTML/CSS, exact component code.

Instead, recreate the same quality, clarity, hierarchy, usability, and product logic using original implementation and branding. When making design decisions, prioritize similarity in experience and interaction, not literal pixel-for-pixel duplication unless explicitly instructed.

---

## 3. PRODUCT PRINCIPLES

### 3.1 Performance First
Everything revolves around measurable creator performance. Important metrics: verified views, CPM, creator earnings, campaign spend, remaining budget, engagement, submissions, conversion metrics where supported. Avoid meaningless vanity dashboards.

### 3.2 Extremely Simple UX
The product should feel easy enough for a creator to understand without onboarding documentation.
Avoid: overly complex enterprise screens, unnecessary settings, deeply nested navigation, excessive forms, technical wording.
Prefer: cards, clear status, visible rewards, short workflows, progressive disclosure, large primary actions.

### 3.3 Creator Marketplace Feel
The creator application should feel closer to a creator marketplace, a modern consumer fintech app, a social creator dashboard — and NOT an ERP, project management software, CRM, or traditional corporate dashboard.

### 3.4 Brand Experience
The Brand portal should feel more professional and analytical than the Creator portal. Brands care primarily about: campaign performance, spend, reach, submissions, creators, campaign ROI, remaining budget, approval workflows.

### 3.5 Saudi-First
The product is initially designed for Saudi Arabia. Default assumptions: Currency SAR; primary market Saudi Arabia; Arabic and English support; full RTL support; Saudi creator ecosystem; Saudi businesses; Saudi campaigns; Saudi payment expectations; Saudi VAT/business requirements. The architecture should still allow international expansion later.

---

## 4. USER ROLES

Four primary roles: **Creator, Brand, Agency, Platform Admin**.

Permissions must always be role-aware. Do not expose features simply by hiding buttons. Enforce authorization server-side.

---

## 5. CREATOR APPLICATION

Primary creator navigation: Home, Discover, My Campaigns, Earnings, Profile.

Mobile-first UX is preferred for creator-facing interfaces.

---

## 6. CREATOR HOME

Creator Home should communicate immediately: current earnings, available balance, pending earnings, recommended campaigns, active campaigns, recent performance, recent earnings.

Example hierarchy: Welcome message → Total Earnings → Available Balance → Pending Balance → Recommended Campaigns → Active Campaigns → Recent Earnings → Recent Activity.

Do not overwhelm the creator with analytics.

---

## 7. DISCOVER

Discover is one of the most important screens in the entire product. It should show campaign cards containing: brand, campaign name, campaign cover, category, reward/CPM, maximum earning, platform, remaining budget, country, campaign status, deadline where relevant.

Example card:
```
Riyadh Season
Entertainment
SAR 12 CPM
Earn up to SAR 5,000
TikTok · Instagram
SAR 187,420 remaining
[View Campaign]
```

Filters may include: Recommended, Highest Paying, New, Trending, Ending Soon, TikTok, Instagram, YouTube, X, UGC, Clipping, Lifestyle, Entertainment, Gaming, Technology, Saudi Arabia, GCC, Worldwide.

Search should be available.

---

## 8. CAMPAIGN DETAIL

Every campaign page should clearly answer:
1. What is the campaign?
2. What does the creator need to make?
3. How much can the creator earn?
4. What platforms are allowed?
5. What rules must be followed?
6. What assets are available?
7. How does the creator join?
8. How much campaign budget remains?

Core sections: Campaign header, Brand, Reward, Campaign budget, Remaining budget, Number of creators, Total campaign views, Brief, Objective, Requirements, Do, Don't, Resources, Reward structure, Supported platforms, Eligibility, Join Campaign CTA.

Reward information must be visually prominent.

---

## 9. CAMPAIGN JOINING

Joining should be frictionless.

Before accepting a creator, validate: user authenticated, creator profile exists, required social account connected, creator country eligible, creator meets minimum requirements, campaign active, campaign capacity available, creator not already joined.

After successful joining: campaign should appear under **My Campaigns**.

---

## 10. MY CAMPAIGNS

Separate campaigns by: Active, Submitted, Completed, Rejected/Issues where necessary.

Each card should expose the next relevant action, e.g.: Create Content, Submit Content, View Submission, Fix Submission, Track Earnings.

Do not make creators guess what they need to do next.

---

## 11. SOCIAL ACCOUNTS

Creators may connect: TikTok, Instagram, YouTube, X.

Design integrations using a provider abstraction. Never tightly couple campaign logic to one social network.

Recommended interface — `SocialProvider` methods: `connectAccount()`, `refreshToken()`, `getAccount()`, `verifyAccount()`, `getPost()`, `getPostMetrics()`, `verifyOwnership()`.

Normalized account model should include: platform, external account id, username, follower count, verification state, token information, connection state, timestamps.

OAuth tokens and secrets must be encrypted. Never expose provider access tokens to the browser.

---

## 12. CONTENT SUBMISSION

Creator workflow:
1. Join campaign
2. Read campaign brief
3. Create content externally
4. Publish content
5. Return to Content Rewards
6. Select campaign
7. Paste social post URL
8. Select connected social account if necessary
9. Submit

After submission, system verifies: URL validity, platform, creator ownership, campaign compatibility, publishing date, content availability. Then submission enters review.

---

## 13. SUBMISSION STATE MACHINE

Do not handle submission states with random booleans. Use an explicit state machine.

Suggested statuses: `DRAFT`, `SUBMITTED`, `VERIFYING`, `PENDING_REVIEW`, `APPROVED`, `TRACKING`, `PERFORMANCE_LOCKED`, `PAYOUT_PENDING`, `PAID`, `REJECTED`, `FLAGGED`, `DISPUTED`, `PAYMENT_HOLD`.

Transitions must be explicitly defined. Prevent invalid transitions. Examples:
- `SUBMITTED` → `VERIFYING`
- `VERIFYING` → `PENDING_REVIEW`
- `PENDING_REVIEW` → `APPROVED`
- `PENDING_REVIEW` → `REJECTED`
- `APPROVED` → `TRACKING`
- `TRACKING` → `PERFORMANCE_LOCKED`
- `PERFORMANCE_LOCKED` → `PAYOUT_PENDING`
- `PAYOUT_PENDING` → `PAID`
- `FLAGGED` → manual review
- `REJECTED` → `DISPUTED`

---

## 14. PERFORMANCE TRACKING

Approved content should be monitored by background jobs. Never depend on page views or frontend requests to update social metrics. Maintain historical snapshots.

Store: timestamp, views, verified views, likes, comments, shares, engagement rate, fraud score, raw provider metrics where useful.

Example table `submission_metrics`: id, submission_id, captured_at, views, verified_views, likes, comments, shares, engagement_rate, fraud_score, provider_payload.

---

## 15. REWARD ENGINE

Reward calculations should be abstracted from campaigns. Do not hardcode CPM-only behavior throughout the application.

Support reward types: `CPM`, `CPV`, `CPA`, `FIXED`, `HYBRID`, `MILESTONE`. Primary initial implementation: **CPM**.

Formula: `reward = verifiedViews / 1000 × CPM`

Apply: minimum payout, maximum payout, campaign limits, creator limits, total campaign budget availability.

Use decimal-safe financial arithmetic. Never use floating-point assumptions for money. All reward calculations must be deterministic and auditable.

---

## 16. CAMPAIGN BUDGET

Campaign budgets are financial liabilities. Never treat campaign budget as a simple cosmetic number.

Track: total funded budget, committed reward, pending reward, settled reward, available budget, platform fees, refunds where relevant.

Suggested concept: `total_budget`, `reserved_budget`, `settled_budget`, `remaining_budget`.

Always prevent the campaign from promising more money than is available. Use transactional database operations when reserving budget.

---

## 17. FRAUD

Fraud prevention is a core product feature, not an optional enhancement. Every submission should support a fraud/risk score.

Potential indicators: abnormal view spikes, unnatural engagement, high views with extremely low interaction, suspicious geographic distribution, repetitive engagement patterns, deleted posts, private posts, manipulated content, creator account history, repeated fraudulent behavior, duplicated submissions.

Fraud system should support: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`.

Potential outcomes: continue automatically, manual review, payment hold, submission rejection, creator suspension.

Never automatically accuse creators. Represent outputs as risk indicators requiring rules or review.

---

## 18. CREATOR EARNINGS

Creator Earnings should show: total earned, available, pending, paid, transaction history, earnings by campaign, earnings by submission.

Financial status terminology must remain consistent across the product.

---

## 19. INTERNAL WALLET / LEDGER

Never implement balances as a field that is directly incremented/decremented without history. Use an immutable ledger.

Suggested `wallet_transactions` fields: id, wallet_id, user_id, type, amount, currency, direction, status, reference_type, reference_id, metadata, created_at.

Transaction types may include: `CAMPAIGN_REWARD`, `WITHDRAWAL`, `REFUND`, `PLATFORM_FEE`, `ADJUSTMENT`, `BONUS`, `REFERRAL`.

Balance should be derived from settled ledger transactions or maintained through a transactionally safe aggregate. Every financial mutation requires an audit trail.

---

## 20. BRAND APPLICATION

Brand navigation: Overview, Campaigns, Submissions, Creators, Analytics, Finance, Team, Settings.

The Brand interface may be desktop-first.

---

## 21. BRAND OVERVIEW

Primary information: total spend, campaign spend, verified views, average CPM, submissions, participating creators, active campaigns, campaign performance chart, top campaigns, top creators, pending reviews.

Avoid generic analytics widgets. Every number should help a brand assess campaign performance.

---

## 22. CREATE CAMPAIGN

Campaign creation should use a guided wizard:
1. Campaign Information
2. Platforms
3. Creator Requirements
4. Content Brief
5. Assets
6. Reward
7. Budget
8. Review & Launch

Do not put all campaign settings on one giant screen.

---

## 23. CAMPAIGN DATA

A campaign should support: name, slug, brand, organization, cover image, description, objective, category, start date, end date, campaign status, total budget, reward model, CPM, min payout, max creator payout, max submissions, supported platforms, countries, languages, follower requirements, creator requirements, content requirements, required hashtags, required mentions, prohibited behaviors, assets, terms, participation count, submission count, verified views, spend.

Avoid JSON dumping everything into one column unless the field is intentionally schemaless. Use normalized relational structures where important.

---

## 24. BRAND SUBMISSION REVIEW

Brand users need a review queue. Filters: Pending, Approved, Rejected, Flagged, Tracking, Paid.

Submission detail should include: creator, connected account, social content preview, campaign, current performance, compliance checks, fraud risk, submission timeline, review history.

Actions: Approve, Reject, Request Manual Review, Place on Hold. Rejection requires a reason.

---

## 25. ANALYTICS

Important analytics: verified views, total spend, average CPM, submissions, creators, engagement, platform distribution, geography, creator performance, campaign performance over time.

Analytics architecture should support pre-aggregated data for large campaigns. Do not calculate millions of raw rows synchronously every time a dashboard loads.

---

## 26. CREATOR SCORE

Implement architecture supporting an internal creator score. Potential inputs: approval rate, average views, engagement, fraud history, campaign completion, brand ratings, consistency.

Do not expose scoring internals unless product requirements explicitly require it. Score should eventually support: creator ranking, creator recommendations, campaign eligibility, fraud analysis, brand discovery.

---

## 27. NOTIFICATIONS

Build event-driven notifications. Potential events: `CAMPAIGN_JOINED`, `SUBMISSION_RECEIVED`, `SUBMISSION_APPROVED`, `SUBMISSION_REJECTED`, `SUBMISSION_FLAGGED`, `VIEW_MILESTONE_REACHED`, `REWARD_CREATED`, `REWARD_AVAILABLE`, `PAYOUT_SENT`, `CAMPAIGN_BUDGET_LOW`, `CAMPAIGN_COMPLETED`, `DISPUTE_UPDATED`.

Notification channels should be abstracted: `IN_APP`, `EMAIL`, `PUSH`. SMS or WhatsApp may be supported later.

---

## 28. ADMIN

Admin must be a separate protected application/area. Admin navigation: Overview, Users, Creators, Businesses, Campaigns, Submissions, Moderation, Risk, Payments, Disputes, Finance, Support, Analytics, Configuration.

Admin actions must generate audit logs.

---

## 29. DISPUTES

Creators must be able to dispute eligible decisions.

Suggested lifecycle: `OPEN`, `UNDER_REVIEW`, `NEEDS_INFORMATION`, `RESOLVED_APPROVED`, `RESOLVED_REJECTED`.

Store: dispute reason, evidence, admin notes, decision, timestamps, decision maker.

---

## 30. MULTI-TENANCY

Brand and Agency data must be organization-aware. Use `organization_id` consistently for tenant-owned entities: campaigns, brand_users, team_members, financial data, analytics, creator invitations.

Never rely only on frontend filtering for tenant isolation. Enforce tenant authorization at API/database level.

---

## 31. DATABASE

Prefer PostgreSQL.

Potential core tables: users, profiles, creator_profiles, organizations, organization_members, brand_profiles, agency_profiles, social_accounts, campaigns, campaign_platforms, campaign_requirements, campaign_assets, campaign_reward_rules, campaign_participants, submissions, submission_metrics, submission_reviews, fraud_checks, fraud_flags, wallets, wallet_transactions, payouts, withdrawals, disputes, notifications, creator_scores, referrals, audit_logs.

Use: UUID primary keys, created_at, updated_at, appropriate foreign keys, indexes, constraints, unique constraints, database transactions.

Do not create meaningless generic tables when a clear domain entity exists.

---

## 32. RECOMMENDED STACK

Unless the existing repository dictates otherwise, prefer:

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, shadcn/ui where appropriate
- **Backend:** Node.js, TypeScript, Next.js server features or NestJS depending on architecture
- **Database:** PostgreSQL
- **ORM:** Prisma or Drizzle
- **Authentication:** Supabase Auth, Clerk, Auth.js, or existing project authentication
- **Storage:** S3-compatible object storage or Supabase Storage
- **Jobs:** Redis, BullMQ

Deployment should remain environment-agnostic unless project infrastructure already exists.

---

## 33. BACKGROUND JOBS

Use workers/jobs for: `social_metrics_sync`, `submission_verification`, `fraud_analysis`, `reward_calculation`, `campaign_budget_reconciliation`, `payout_processing`, `notifications`, `analytics_aggregation`, `token_refresh`.

Never use long-running HTTP requests for these activities. Jobs should be idempotent, retry-safe, observable, logged.

---

## 34. API DESIGN

Use consistent, domain-oriented endpoints, e.g.: `/api/campaigns`, `/api/campaigns/:id/join`, `/api/campaigns/:id/submissions`, `/api/submissions/:id/approve`, `/api/submissions/:id/reject`, `/api/submissions/:id/metrics`, `/api/creator/earnings`, `/api/brand/analytics`.

Do not create RPC-style endpoints unnecessarily. Always validate: authentication, authorization, input schema, resource ownership, current state, financial constraints.

---

## 35. VALIDATION

Use schema validation. Prefer Zod in TypeScript projects. Validate on client where useful, server always. Never trust browser input.

---

## 36. SECURITY

Mandatory: server-side authorization, CSRF-safe behavior, SQL injection prevention, XSS protection, encrypted secrets, encrypted OAuth tokens, rate limiting, secure webhooks, webhook signature validation, tenant isolation, audit logging, payout protection, financial idempotency, environment variable separation.

Never commit: API keys, tokens, passwords, private certificates, production secrets.

---

## 37. PAYMENT RULE

Do NOT accidentally design Content Rewards as an unlicensed bank or stored-value wallet. Internally, use a financial ledger to represent balances. Actual money movement should occur through approved payment/payout integrations.

Keep ledger state, payment provider state, and campaign accounting separate but reconcilable.

---

## 38. ARABIC / RTL

Arabic support is first-class. Every major screen must work in LTR English and RTL Arabic.

Do not fix RTL using individual arbitrary CSS overrides. Use logical CSS properties wherever possible, e.g. `margin-inline-start`, `margin-inline-end`, `padding-inline`, `text-align: start`.

Support mirrored layouts where appropriate. Test both languages. Arabic copy should feel native, not machine-translated.

---

## 39. DESIGN SYSTEM

The visual experience should be: modern, minimal, premium, creator-oriented, clean, high contrast, content-first.

Avoid excessive gradients, glassmorphism, decorative effects, or dashboard clutter unless present in the approved design direction.

Use consistent: spacing, radius, typography, card patterns, buttons, inputs, navigation, status badges, tables, drawers, modals, empty states, skeleton states, notifications.

---

## 40. RESPONSIVENESS

Creator screens: mobile-first. Brand/Admin: desktop-first but responsive.

Always test mobile, tablet, desktop. Never hardcode dimensions that break common screen sizes. Avoid horizontal overflow.

---

## 41. STATES

Every asynchronous interface must account for: loading, empty, error, success, permission denied, not found, disabled, processing.

Never leave blank screens. Use skeletons rather than excessive spinners where practical.

---

## 42. AUDIT LOGGING

Important actions must be auditable, e.g.: campaign created/edited/launched/paused, submission approved/rejected, financial adjustment, payment hold, payout approved/sent, creator suspended, fraud decision, dispute resolution.

Store: actor, action, resource, before, after, timestamp, IP/device where legally appropriate.

---

## 43. CODE QUALITY

Write production-quality code. Always: use TypeScript strictly, avoid `any` unless unavoidable, create reusable domain components, keep components focused, use descriptive names, separate UI and business logic, remove dead code, avoid duplicated logic, handle errors explicitly, keep imports organized, use environment variables, respect repository conventions.

Do not over-engineer simple functionality.

---

## 44. EXISTING CODEBASE RULE

Before modifying any feature:
1. Inspect the relevant existing files
2. Understand current architecture
3. Identify related components
4. Identify database dependencies
5. Identify existing patterns
6. Reuse existing components where appropriate
7. Make the smallest coherent implementation

Do not rewrite working architecture simply because you prefer another pattern. Do not remove unrelated features. Do not modify unrelated screens.

---

## 45. DATABASE CHANGE RULE

Before creating or modifying tables, inspect existing schema. Determine: whether an equivalent table exists, relationships, foreign keys, naming conventions, RLS/security model, migrations.

Never blindly create duplicate domain models. Every schema change requires a migration. Never manually alter production state through application code.

---

## 46. UI IMPLEMENTATION RULE

When given a screenshot or reference, analyze: overall structure, hierarchy, spacing, typography, alignment, card sizing, navigation, content density, interaction states, responsiveness.

Then implement the experience faithfully. Do not merely approximate the screenshot with generic components. However, keep implementation reusable and maintainable.

---

## 47. WHEN I ASK "BUILD THIS"

Do not respond with only instructions. Inspect the repository and implement it.

Expected workflow:
1. Inspect codebase
2. Identify relevant files
3. Identify dependencies
4. Implement
5. Run typecheck
6. Run lint
7. Run tests where available
8. Build the application where practical
9. Fix introduced errors
10. Summarize exactly what changed

Do not stop after writing a plan unless explicitly asked for a plan.

---

## 48. WHEN SOMETHING IS UNCLEAR

Use the existing product requirements and repository architecture to make the most reasonable decision. Prefer implementation over unnecessary clarification. Only ask questions when the missing information genuinely prevents a safe implementation.

---

## 49. DO NOT USE MOCK DATA AS REAL DATA

Mock data is acceptable only when: explicitly requested, building an isolated prototype, backend is not yet available.

Never leave hardcoded fake campaigns, earnings, creators, analytics, or payments in production screens without clearly isolating them. Connect screens to actual data sources as soon as the backend exists.

---

## 50. FEATURE COMPLETENESS

A feature is not finished just because the visible UI exists. For every feature, consider: UI, database, API, authorization, validation, states, errors, loading, analytics where necessary, audit logging, notifications, responsive behavior, Arabic/RTL, security.

A visually complete but non-functional screen is not considered complete unless explicitly requested as a prototype.

---

## 51. PRIORITY MVP

Build the product in this order unless explicitly instructed otherwise:
1. Authentication
2. Roles and profiles
3. Organizations
4. Creator profiles
5. Social accounts
6. Campaign model
7. Brand campaign creation
8. Discover marketplace
9. Campaign details
10. Campaign joining
11. My Campaigns
12. Submission workflow
13. Brand review
14. Performance tracking
15. Reward calculation
16. Campaign budget
17. Creator earnings
18. Wallet ledger
19. Brand analytics
20. Notifications
21. Admin
22. Fraud
23. Payout integrations
24. Disputes
25. Advanced analytics
26. Creator ranking
27. AI features

Do not prematurely build complex AI functionality before the core marketplace works.

---

## 52. AI ROADMAP

Architecture should allow future AI capabilities: AI Campaign Builder, AI Creator Matching, AI Content Compliance Review, AI Fraud Detection, AI Campaign Insights, AI Budget Optimization.

Do not make the core product dependent on AI. AI should enhance the marketplace rather than become a blocking dependency.

---

## 53. CORE BUSINESS LOGIC

Always protect this loop:

```
Brand funds campaign
  ↓
Campaign becomes available
  ↓
Creator joins
  ↓
Creator publishes content
  ↓
Creator submits content
  ↓
Content verified
  ↓
Submission approved
  ↓
Performance tracked
  ↓
Views verified
  ↓
Reward calculated
  ↓
Budget reserved/settled
  ↓
Creator earns
  ↓
Creator receives payout
  ↓
Brand receives performance analytics
```

If a feature does not improve or support this loop, question whether it belongs in the MVP.

---

## 54. DEFINITION OF DONE

A feature is complete when: UI works, backend works, database is correct, permissions are enforced, validation exists, loading/error states work, responsive layout works, Arabic/RTL does not break, no obvious security issue exists, no TypeScript errors introduced, no lint errors introduced, relevant tests pass, implementation follows existing architecture.

---

## 55. FINAL DEVELOPMENT BEHAVIOR

Act as the senior engineer responsible for shipping the product.

Do not: blindly generate code, invent APIs without checking existing architecture, replace working code unnecessarily, add dependencies without reason, create duplicate components, leave placeholder functionality, use unsafe financial logic, trust client-side authorization, hardcode production data, ignore RTL, ignore responsive behavior.

Always optimize for: correctness → product usability → simplicity → maintainability → performance.

The final goal is a production-grade Saudi creator performance marketplace inspired by Content Rewards, but with its own original architecture, brand identity, Saudi localization, financial controls, and future AI capabilities.
