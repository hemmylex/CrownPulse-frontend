# CrownPulse PRD: Nigeria's Contest & Voting Platform (Web + iOS + Android)

Draft v1.0, 19 October 2026. The architecture and roadmap diagrams live in the source document and are described in sections 7, 11 and 13.

## 1. Executive summary

CrownPulse should grow from a Next.js web app into Nigeria's default platform for paid-vote contests: pageants, talent shows, campus queens, brand challenges and live TV-style finales, run on web, iOS and Android with one shared backend.

The repo already proves the core loop: a voter signs in, buys votes through Paystack, watches a live leaderboard and earns points for rewards. Contestants have portfolios, brands have campaigns and ROI dashboards, and admins have a contest CMS, fraud signals and an audit log. What is missing is everything that makes this a mass-market Nigerian product: native mobile apps, push notifications, vote channels for low-data users (USSD, WhatsApp, bank transfer), judges and scoring, organiser self-service, payout automation, and stronger integrity controls.

**What this PRD asks for**

- Ship native-quality iOS and Android apps for voters, contestants and organisers, built with React Native (Expo) on top of the existing API.
- Add voting channels that work without a card or a data plan: USSD, WhatsApp and dynamic bank-transfer accounts.
- Turn contest running into self-service: organisers create, price, schedule, moderate, score with judges, and pay out winners without CrownPulse staff.
- Make every vote auditable, with device and payment fraud controls, so organisers and sponsors can trust the result.
- Give brands a sponsorship product with live ROI, not a banner slot.

**Proposed targets for the first 12 months after mobile launch** (assumptions to confirm, not forecasts):

| Metric | Target |
| --- | --- |
| Contests hosted per month | 150 |
| Paying voters per month | 250,000 |
| Share of votes cast on mobile apps or USSD | 70% |
| Vote payment success rate | 95% or higher |
| Winner payouts completed within 5 working days | 98% |
| App store rating | 4.5 or higher |

## 2. Problem and opportunity

Nigerian contests run on fragile tools: Instagram polls, spreadsheet tallies, one-off voting sites and manual bank transfers, so organisers struggle to prove a result is fair and voters cannot easily pay. (Market figures below are approximate, from general knowledge, and must be validated before they reach an investor deck.)

**Why now**

- Nigeria has a very large, young, mobile-first population, and live entertainment formats (reality TV, campus pageants, Afrobeats talent hunts, church and community contests) already run on audience voting.
- Instant bank transfers, card payments through Paystack, Flutterwave and Monnify, and USSD are all mainstream, so a vote purchase can be a one-tap or one-dial action.
- Brands want measurable youth reach. A contest gives them votes, shares and sign-ups they can count.

**Pain points we are solving**

| User | Pain today | CrownPulse answer |
| --- | --- | --- |
| Voter | Cards fail, data is expensive, unclear whether a vote counted | Bank transfer, USSD and wallet votes, instant receipts, live leaderboard |
| Contestant | No credible way to promote votes or prove audience | Portfolio, share links, referral tracking, verified vote counts |
| Organiser | Manual tallying, disputes, cash handling, no sponsor reporting | Self-service console, judge scoring, audit trail, automated payouts |
| Brand | Sponsorship has no measurable return | Campaign dashboards with votes, reach, CPM and ROI |
| Regulator and bank | Fraud, unclear fund flows | KYC for organisers, escrow-style settlement, full audit log |

**Differentiators**

1. Works on a feature phone and on a weak connection, because of USSD, lite mode and offline-tolerant vote receipts.
2. Vote integrity as a product feature, with a public audit page per contest.
3. Live-show mode that syncs voting to a TV or YouTube broadcast.
4. Brand ROI built into every contest from day one (already started in the repo).

## 3. Goals, non-goals and success metrics

The north-star metric is **verified paid votes per month**, because it moves only when voters, contestants, organisers and payments all work.

**Goals**

1. Launch iOS and Android apps with feature parity for the voter and contestant journeys within 5 months of kickoff.
2. Reach vote success rate of 95% or higher across card, transfer and USSD.
3. Let an organiser launch a contest in under 15 minutes with no CrownPulse staff involved.
4. Make results defensible: every vote traceable to a payment and a device, with a public audit summary.
5. Give sponsors a live ROI view per campaign.

**Non-goals for this release**

- No cryptocurrency or international card-first voting.
- No general-purpose social network or open chat. Moderated fan comments only.
- No in-house video streaming infrastructure. Embed YouTube, Instagram Live and similar, with an optional licensed live provider later.
- No lottery, raffle or prize-draw mechanics unless legal review clears them (see compliance).

**Metrics**

| Area | Metric | Target at 12 months |
| --- | --- | --- |
| Growth | Monthly active voters | 400,000 |
| Growth | Contests hosted per month | 150 |
| Revenue | Platform fee on gross votes | 10% to 15% of gross, tiered |
| Conversion | Visit to paid vote (mobile) | 6% |
| Conversion | Cart abandonment at payment | under 20% |
| Reliability | Vote confirmation within 10 seconds | 99% |
| Trust | Votes flagged and reversed for fraud | under 1% |
| Retention | Voters who vote in a second contest within 60 days | 35% |
| Quality | Crash-free sessions (iOS and Android) | 99.5% |

All targets are proposals for the team to challenge.

## 4. Users, roles and personas

The repo supports four roles today (admin, brand, contestant, voter). This PRD adds organiser, judge, moderator and finance, so a contest can run without CrownPulse staff.

| Role | In repo today | New in this PRD | Primary device |
| --- | --- | --- | --- |
| Voter | Yes | Wallet, USSD and WhatsApp voting, fan clubs, streaks | Android phone, some iPhone, feature phone via USSD |
| Contestant | Yes | Mobile portfolio editor, vote-link sharing kit, referral tracking, payout onboarding | Android phone |
| Brand | Yes | Sponsor packages, mobile ROI dashboard, perk redemption scanner | Laptop and phone |
| Organiser | No (admin does this) | Self-service contest builder, KYC, settlement account, team seats | Laptop and phone |
| Judge | No | Scoring panel, blind scoring, conflict-of-interest declaration | Tablet and phone |
| Moderator | No | Content review queue, report handling | Laptop |
| Finance | No | Reconciliation, payout approval, refunds | Laptop |
| Admin | Yes | Policy controls, feature flags, regional settings | Laptop |

**Personas**

- **Chioma, 21, final-year student in Enugu.** Votes for a campus queen from her phone on a small data bundle. She wants a vote to cost under ₦200 and to see it count straight away.
- **Tunde, 27, event promoter in Lagos.** Runs six contests a year. He wants to set prices, take sponsors and pay winners without chasing a developer or a spreadsheet.
- **Amaka, 24, aspiring singer in Abuja.** Needs a shareable link, a leaderboard she can screenshot, and proof her votes are real so sponsors take her seriously.
- **Mr Bello, 55, uncle voting for his niece.** Has a basic phone. He dials a USSD code and pays from airtime or a bank prompt.
- **Ngozi, brand manager at a beverage company.** Needs reach, sign-ups and cost per vote on one screen, exportable for her agency.

## 5. Current state: what the CrownPulse repo gives us

The `hemmylex/CrownPulse-frontend` repo (last pushed 26 Sep 2026) is a solid web foundation but only the customer-facing half. I read the frontend only; the backend API it calls (`NEXT_PUBLIC_API_URL`, default `localhost:4000`) is not in this repo, so backend claims below come from the API client and need confirming against that service.

**Stack found**

Next.js 16.3.6 with React 19.2.8 and Tailwind 4, Supabase Auth through `@supabase/ssr`, TanStack Query, Recharts, Zod and Sonner. Roles are enforced by `requireRole` in `lib/rbac.ts`, which redirects to `/auth/login` or `/403`.

**What already exists**

| Capability | Evidence in repo |
| --- | --- |
| Sign-up, email verification, login, social-auth buttons | `app/auth/*`, `api.signup`, `api.verifyEmail` |
| Contest browse and detail with ranked entry cards | `app/contests/[slug]`, `entry-card.tsx` |
| Paid voting through Paystack redirect, 1 to 100 votes per card, price in kobo | `entry-card.tsx`, `api.initiateVote`, `app/vote/callback` |
| Live shows with embedded player, leaderboard refreshing every 15 seconds, up to 500 votes per purchase | `app/live/[id]/stream-room.tsx` |
| Contestant portfolio, media, achievements, social links, entries, follow | `app/(app)/contestant/*`, `app/c/[slug]` |
| Loyalty points and reward catalog with claim codes | `app/rewards`, `app/(app)/dashboard` |
| Winners page and finalise-contest endpoint | `app/winners`, `api.finalizeContest`, payout status endpoints |
| Brand and campaign endpoints, ROI model (impressions, CTR, CPM, cost per vote, ROI percent, geography) | `api.brandRoi`, `BrandRoi` type |
| Brand social auto-posting and share tracking | `api.composeBrandPost`, `api.trackShare` |
| Fraud signals (shared IPs, bursts, failures) and audit log | `api.fraudSignals`, `api.auditLog` |
| Rounds, entry moderation, contest CMS | `api.createRound`, `api.setEntryStatus`, `api.adminCreateContest` |

**Gaps and risks I found**

1. **No admin, brand or organiser screens in this repo.** The API client has the endpoints, but the page list has only voter and contestant routes.
2. **No mobile apps, no push, no realtime.** Leaderboards poll every 15 seconds.
3. **Login is required to vote and Paystack is the only checkout path.** The landing page promises transfers, USSD and mobile money, which today depend entirely on what Paystack's hosted page offers.
4. **Marketing numbers are hard-coded** on the landing page ("12,400+ voters this week", "2M+ votes cast", "450+ contests", "90+ brand partners", "5 languages"). There is no language switching in the code. These must be replaced with live data or removed before public launch.
5. **No judges or scoring**, no wallet, no vote bundles, no referral system, no in-app notifications.
6. **Quality hygiene:** Supabase and React Query packages sit in `devDependencies` although used at runtime, the API client types most responses as `any`, and there is no test script.

These gaps drive the scope in the rest of this document.

## 6. Feature requirements by role

Priorities: **P0** = needed for launch, **P1** = within 3 months after launch, **P2** = later. "Exists" means the frontend repo already has it; the rest is new.

### 6.1 Voter

| ID | Requirement | Priority | Status |
| --- | --- | --- | --- |
| V-01 | Browse and search contests by category, city, state, status and sponsor | P0 | Partly exists |
| V-02 | Guest checkout: vote with phone number or email and OTP, no full account | P0 | New |
| V-03 | Vote bundles (5, 10, 50, 100) with a visible per-vote price and bulk discount | P0 | New |
| V-04 | Pay by card, bank transfer (dynamic account number), USSD, Apple Pay and Google Pay where supported | P0 | Card via Paystack exists |
| V-05 | Instant receipt with vote reference, in app and by SMS or email | P0 | Partly exists |
| V-06 | Live leaderboard over WebSocket or server push, with rank changes and rank history | P0 | Polling exists |
| V-07 | Free daily vote (one per contest per verified phone) as an engagement hook, configurable by organiser | P1 | New |
| V-08 | Wallet: top up once, vote many times without repeating checkout | P1 | New |
| V-09 | Follow contestants, push alerts for rank changes, new media and voting deadlines | P0 | Follow exists |
| V-10 | Share cards: auto-generated image with contestant photo, rank and vote link for WhatsApp, Instagram and X | P0 | Share buttons exist |
| V-11 | Points, badges and streaks; reward catalog with QR or code redemption | P1 | Points and catalog exist |
| V-12 | Fan clubs and moderated comment wall per contestant | P2 | New |
| V-13 | Vote history, refunds status and dispute button | P0 | Vote list exists |
| V-14 | Languages: English, Pidgin, Yoruba, Igbo, Hausa | P1 | Claimed, not built |

### 6.2 Contestant

| ID | Requirement | Priority | Status |
| --- | --- | --- | --- |
| C-01 | Onboarding wizard: profile, photo and video, bio, location, social links | P0 | Portfolio exists on web |
| C-02 | Apply to open contests with entry fee payment, pitch and required media | P0 | Apply exists, fee payment new |
| C-03 | Entry status tracking (pending, approved, rejected, eliminated) with reasons and push alerts | P0 | Status API exists |
| C-04 | Personal vote link and QR code, with attribution so contestants see which channel drove votes | P0 | New |
| C-05 | Live stats: votes per hour, rank, top cities, referrer breakdown | P1 | New |
| C-06 | Verified social follower stats (already modelled) shown on profile | P1 | Stats API exists |
| C-07 | Winner payout onboarding: bank account verification by name match, tax and KYC fields | P0 | Payout status exists, onboarding new |
| C-08 | Content toolkit: caption templates, poster generator, reminder scheduler | P2 | New |
| C-09 | Report a problem: harassment, fake votes or rule disputes, handled by moderators | P0 | New |

### 6.3 Organiser (new role)

| ID | Requirement | Priority |
| --- | --- | --- |
| O-01 | Organiser KYC: business or individual identity, bank account verification, settlement account | P0 |
| O-02 | Contest builder: title, rules, categories, rounds, entry fee, vote price and bundles, start and end, region limits | P0 |
| O-03 | Templates: pageant, talent show, campus queen, brand challenge, charity vote | P1 |
| O-04 | Entry moderation queue with approve, reject, request changes, and bulk actions | P0 |
| O-05 | Round management: advance top N, eliminate, carry over or reset votes, with a hybrid score (public votes weight plus judge weight) | P0 |
| O-06 | Live-show mode: sync a stream, lock or unlock voting on a timer, push "voting closes in 5 minutes" | P1 |
| O-07 | Sponsor slots and prize pool display; invite brands to sponsor | P1 |
| O-08 | Finance view: gross votes, fees, refunds, net settlement, downloadable statement | P0 |
| O-09 | Team seats with roles (owner, editor, moderator, finance) | P1 |
| O-10 | Public audit page per contest: total votes, paid versus free, flagged and reversed, time of finalisation | P0 |
| O-11 | Winner announcement tool with shareable result cards and certificate PDFs | P1 |

### 6.4 Judge (new role)

- Invite by link, accept conflict-of-interest declaration, then score entries against organiser-defined criteria (for example talent 40, stage presence 30, originality 30).
- Blind mode hides vote counts until scores are locked. Scores are immutable after submission, with an audit entry for any admin correction.
- Works on tablet and phone, including live scoring during a show with low latency.

### 6.5 Brand

| ID | Requirement | Priority |
| --- | --- | --- |
| B-01 | Brand profile and campaigns, launch a sponsored contest (exists as API) | P0 |
| B-02 | Sponsor packages: title sponsor, category sponsor, prize sponsor, with logo placement rules | P1 |
| B-03 | Live ROI dashboard on web and mobile: impressions, clicks, votes, cost per vote, ROI percent, geography (model exists) | P0 |
| B-04 | Perk and coupon issuance with unique codes and merchant-side QR validation | P1 |
| B-05 | Social auto-posting and scheduling to connected accounts (API exists) | P1 |
| B-06 | Exportable post-campaign report as PDF and CSV | P0 |

### 6.6 Admin, moderator and finance

- Admin console: users, roles, contests, feature flags, fee rules by organiser tier, regional settings and content takedown.
- Moderator queue: reported media, comments and profiles, with action history and appeal.
- Finance: daily reconciliation against Paystack and bank statements, refunds, chargeback handling, payout approval with two-person approval above a threshold.
- Fraud centre: shared-IP clusters, burst detection and failure patterns (signals API exists), with case notes, vote reversal and account holds.
- Immutable audit log for every admin, organiser and judge action (API exists).

## 7. Mobile apps for iOS and Android

Build one React Native (Expo, TypeScript) codebase for iOS and Android, in the same monorepo as the Next.js web app, so the API client, Zod schemas, design tokens and business rules are shared instead of copied. The team already writes TypeScript, Zod and React, and Android phones will carry most Nigerian traffic, so the app must run well on low-end devices.

**Options considered**

| Option | For | Against | Verdict |
| --- | --- | --- | --- |
| React Native with Expo | One codebase, shared TypeScript and Zod, over-the-air fixes, fits the current team | Some native modules need care on low-end Android | Recommended |
| Flutter | Strong rendering performance | New language, no code sharing with web | Not chosen |
| Two native apps | Best platform fit | Two teams, double cost, slower features | Not chosen |
| PWA only | Cheapest | Weak push on iOS, no store presence, poor trust for payments | Keep as the web fallback only |

**Apps and audiences**

- **CrownPulse** (voter and contestant) is the main store listing, with role switching inside the app.
- **CrownPulse Studio** (organiser, judge, brand) is a second listing, so heavy admin features do not bloat the voter app and judges get a focused scoring tool.

**Core screens**

| Area | Screens |
| --- | --- |
| Discover | Home feed (live now, closing soon, trending, near you), search, categories, contest detail, contestant profile |
| Vote | Pick bundle, payment method sheet, pending and success states, receipt, share card |
| Live | Live show room with embedded stream, real-time leaderboard, vote button with timer, reactions |
| Me | Wallet, vote history, rewards, badges, followed contestants, settings, language |
| Contestant | Portfolio editor, media upload, entries and status, vote-link kit, stats, payout details |
| Studio | Contest list, builder, moderation queue, round control, finance summary, judge scoring panel, brand ROI |

**Native capabilities**

- **Push notifications** through FCM and APNs: vote receipts, rank changes, contest start and close, winner announcements, payout updates. Users control topics.
- **Live leaderboard on the lock screen:** iOS Live Activities and an ongoing Android notification during a live show.
- **Deep and universal links** so a shared vote link opens the app on the right contestant, and falls back to web.
- **Camera and gallery** with on-device image and video compression before upload, resumable uploads on weak networks.
- **Biometric and PIN lock** for wallet and payout screens.
- **QR scanner** for perk redemption and in-person event check-in.
- **Share sheet** with generated image cards for WhatsApp status and Instagram stories.
- **Offline tolerance:** cached feeds and profiles, queued actions, clear "waiting for network" states. A purchase is never silently duplicated.

**Performance and device budgets**

| Budget | Target |
| --- | --- |
| Download size on Android | under 30 MB |
| Cold start on a 2 GB RAM Android device | under 3 seconds |
| Time to first leaderboard render on 3G-class network | under 4 seconds |
| Data saver mode | images capped, video off by default, leaderboard updates throttled |
| Minimum OS | Android 8 or newer, iOS 16 or newer (revisit at launch) |

**Store-policy risk to resolve before build (top risk).** Apple and Google both require their own billing for digital goods and may treat vote bundles as such, which would route a share of revenue to the stores and change pricing. Votes may also be reviewed against contest and gambling-adjacent rules. Before committing UI, the team must (1) read the current App Store Review Guidelines on in-app purchase and Google Play's payments and contest policies, (2) ask Apple and Google for pre-review guidance, and (3) design the payment layer so bundles can use a different rail per platform. See the decisions at the end of section 13.

## 8. Nigeria-specific payments, channels and localisation

A vote is a small payment, so checkout design decides revenue: fixed per-transaction fees punish ₦50 and ₦100 purchases, cards fail often, and many voters prefer transfers, USSD or a wallet. The plan is to add channels, put bundles and a wallet in front of the payment rail, and make confirmation webhook-driven so a voter who closes the app mid-payment still gets credited. Fee rates, levies and short-code lead times below must be confirmed with each provider and with the tax adviser before pricing is fixed.

**Payment and vote channels**

| Channel | How it works | Dependency | Priority |
| --- | --- | --- | --- |
| Card (Paystack) | Hosted checkout today, in-app SDK on mobile | Paystack account (exists) | P0 |
| Bank transfer with dynamic account | Voter gets a one-time account number, vote credits on receipt | PSP virtual-account product | P0 |
| USSD | Dial a short code, pick contest and contestant, pay by bank USSD prompt or airtime | NCC short-code allocation through an aggregator, PSP USSD channel | P1 |
| WhatsApp voting | Chat flow: pick contest, contestant, bundle, then a payment link | WhatsApp Business Platform approval | P1 |
| Wallet | Top up once; each vote debits the wallet instantly | Ledger service (section 11) | P1 |
| Apple Pay, Google Pay | One-tap on supported devices | PSP support, store policy review | P1 |
| Airtime or carrier billing | TV-style short-code voting | Telco aggregator, regulator rules | P2 |
| International cards, diaspora | Votes in USD or GBP with FX shown up front | PSP international cards | P2 |

**Second provider for resilience.** Integrate one more PSP (Flutterwave or Monnify) behind a single payment interface, with automatic fail-over when Paystack error rates rise. Route by channel, cost and current success rate.

**Pricing and economics**

- Prices are integers in kobo in every service, as the repo already does. Display in ₦ with no decimals for votes.
- Organisers set a base vote price within a platform floor, because a ₦20 vote would cost more to process than it earns.
- Bundles and the wallet are the margin defence: one ₦1,000 top-up replaces ten ₦100 card charges.
- Platform fee is a percentage of gross, tiered by organiser volume. Fee rules live in configuration, not code.

**Confirmation and reconciliation**

1. The app creates a vote order with an idempotency key and gets a payment reference (the repo's `initiateVote` already returns one).
2. The PSP webhook, verified by signature, marks the order paid and credits votes exactly once.
3. A reconciliation job re-checks every pending order older than 5 minutes against the PSP (`verifyVoteByReference` is the starting point), and a daily job reconciles totals with PSP settlement reports.
4. Failed or duplicated payments produce automatic refunds or credits, visible in vote history.

**USSD journey (example, short code to be allocated)**

1. Dial the short code, choose language.
2. Enter a contest code or pick from a short list of live contests.
3. Enter the contestant's number, see the name to confirm.
4. Choose the bundle, then pay by bank USSD prompt or wallet PIN.
5. Receive an SMS receipt with the reference and current rank.

**Connectivity and device realities**

- Assume flaky 3G and data costs. Lite mode shrinks images and pauses video. Resume uploads. Retry safely with idempotency keys.
- SMS OTP through at least two providers with fallback to WhatsApp or voice, and handling for do-not-disturb restrictions.
- Time zone is West Africa Time (UTC+1) for all contest clocks, with the server as the single source of truth for open and close times.

**Localisation**

English at launch, then Nigerian Pidgin, Yoruba, Igbo and Hausa (V-14). Strings come from translation files with native-speaker review, not machine translation alone. Currency, phone formats (+234, 0xxx) and state and city lists follow Nigerian conventions.

## 9. Trust, fraud prevention and vote integrity

In a paid-vote platform, trust is the product: one credible rigging scandal ends an organiser's brand and ours. Because voting costs money, fraud is mostly payment fraud, bot farms and insider tampering, and each needs its own control. The repo's fraud signals (shared IPs, bursts, repeated failures) and audit log are the starting layer, not the finish.

**Threats and controls**

| Threat | Control | Priority |
| --- | --- | --- |
| Bot or script vote stuffing | Rate limits per account, device and IP; Play Integrity and App Attest checks on mobile; CAPTCHA on web after risk triggers | P0 |
| Many accounts for one person | Phone-number verification, device fingerprint, shared-device and shared-IP clustering (signals API exists) | P0 |
| Stolen cards and chargebacks | 3-D Secure where available, PSP risk scores, velocity rules, hold settlement until the contest is finalised, organiser liability rules | P0 |
| Insider tampering (organiser, admin, engineer) | Append-only vote ledger, two-person approval for reversals, hash-chained audit log, no direct database edits to tallies | P0 |
| Disputed result | Public audit page with paid, free, reversed and flagged counts; downloadable vote log with masked voter IDs | P0 |
| Vote buying for a single contestant by the organiser | Disclosure rules, concentration alerts when a few payers give a contestant most votes | P1 |
| Fake or stolen contestant profiles | Selfie and ID check for finalists, reverse-image checks, community report flow | P1 |
| Refund and promo abuse | Single-use codes, per-user free-vote caps, refund velocity limits | P1 |
| Abusive content and harassment | Upload scanning, report button, moderator queue with service levels | P0 |

**Integrity rules**

1. A vote exists only if a confirmed payment, a free-vote entitlement or an organiser-issued grant backs it. Each row in the ledger carries its source.
2. Votes are never edited. A correction is a reversing entry with a reason, an actor and a timestamp.
3. Finalising a contest freezes the ledger. The final tally, its hash and the time are written to the audit page.
4. Organisers may set per-voter caps and daily caps. The caps and the rule that applies to each vote are shown to voters up front.
5. Fraud actions are reviewable: every held, flagged or reversed vote links to the signal that caused it, so organisers can defend or contest the action.

**Service levels**

- Fraud alerts on high-severity patterns reach on-call staff within 5 minutes during live shows.
- A voter dispute gets a first response within 24 hours and a decision within 3 working days.

## 10. Compliance, legal and safety

Three issues can stop launch if ignored: whether paid voting with prizes falls under lottery or gaming rules, whether holding voter or organiser money needs a licence, and how personal data (especially of minors) is handled. This section is a checklist for Nigerian counsel to confirm. It is not legal advice, and the laws named should be checked for amendments and new directives before launch.

| Area | What to confirm or build | Owner | By |
| --- | --- | --- | --- |
| Lottery and gaming rules | Whether paid votes for a prize contest are treated as a contest of skill or popularity, or as a lottery or gaming product, at federal and state level (for example the National Lottery Regulatory Commission and state gaming authorities). Define allowed prize mechanics. Forbid raffle-style draws until cleared. | Legal | Before build of organiser tools |
| Data protection | Nigeria Data Protection Act 2023 and regulator directives: lawful basis, consent records, privacy notice, data subject requests, breach notice process, data protection officer, registration as a controller or processor where required, processor contracts with PSPs and SMS providers | Legal and security | Before launch |
| Money handling | Do not hold customer funds unless licensed. Use a licensed provider for wallets and settlement, and keep organiser money in provider-held balances or escrow-style settlement. Confirm Central Bank of Nigeria rules for stored value and any wallet limits. | Legal and finance | Before wallet (V-08) |
| KYC and anti-money-laundering | Organiser identity and bank-account name match, sponsor checks, transaction monitoring, suspicious activity escalation | Finance and compliance | Before organiser self-service |
| Consumer protection | Clear prices, refund policy, no unsubstantiated claims (the landing page numbers), fair terms, complaint channel; consumer protection law and the competition and consumer protection commission's expectations | Legal | Before launch |
| Telecom rules | Short-code allocation, SMS sender IDs, do-not-disturb handling, opt-outs | Product and legal | Before USSD and SMS |
| Tax | Treatment of platform fees (including VAT), stamp duty and levies on receipts, prize payout withholding, invoices for organisers. Check the current tax laws in force in 2026. | Finance and tax adviser | Before pricing is final |
| Advertising and sponsorship | Brand campaign claims and disclosures under advertising practice rules | Legal | With brand product |
| Minors | Contests with under-18 contestants need verified guardian consent, no direct messaging to minors, no payments by minors, stricter media rules, and an organiser attestation | Legal and trust and safety | Before such contests are allowed |
| Intellectual property | Takedown process for infringing media, music licensing guidance for talent shows, organiser warranty on rights | Legal | Before launch |
| Political content | Policy on political party contests and election-related polls | Legal and policy | Before launch |
| Store policies | Apple and Google review rules on payments, user-generated content, contests and age ratings | Product | Before build (see section 7) |

**Safety and moderation requirements**

- All user-generated media passes automated scanning before publication, with a human review path for flags.
- Report buttons on every profile, comment and media item, with response targets: urgent safety reports within 2 hours, others within 24 hours.
- Block and mute for voters and contestants. Comment walls are moderated, with word filters in English, Pidgin and the major Nigerian languages.
- Data retention schedule: payment records kept as finance and tax rules require, personal profile data deleted or anonymised on request unless law requires retention, media of ended contests archived with consent.

**Security baseline**

TLS everywhere, secrets in a managed vault, least-privilege access, mandatory multi-factor authentication for staff, annual third-party penetration test and one before launch, dependency scanning in CI, and PCI scope kept minimal by never touching card data (hosted fields and PSP SDKs only).

## 11. Technical architecture, data model and API

Keep the current Next.js, Supabase and Node API foundation and grow it as a modular monolith with background workers: vote integrity, payments and realtime all need one transactional core, and a small team cannot run a mesh of services. I could not see the backend repo, so the data model and endpoint lists below are inferred from the frontend's API client and must be checked against it.

&#91;embedded content: target architecture · 5 layers, ledger at the centre\]

Every channel calls the same API, the voting ledger is the only place a vote is created, and payments, notifications and media reach partners through adapters so providers can be swapped.

**Architecture principles**

1. **Ledger first.** Every vote source (card, transfer, USSD, wallet, free vote, organiser grant) writes one append-only ledger row inside a database transaction.
2. **Idempotent everywhere.** Payment orders, webhooks, vote credits, top-ups and payouts carry idempotency keys, so retries never double-credit.
3. **Shared contracts.** One OpenAPI description and one Zod schema package feed the web app, the mobile apps and the API. The `any` types in the current API client go away.
4. **Realtime reads from a cache.** Redis sorted sets hold live leaderboards, rebuilt from the ledger when needed. Clients subscribe per contest and receive throttled deltas.
5. **Channels stay thin.** Web, apps, USSD and WhatsApp all call the same vote-order API.
6. **Observable and switchable.** Feature flags, structured logs, tracing and error reporting exist before the first launch.

**Realtime leaderboard path.** A confirmed payment commits to the ledger, emits an event, increments the Redis leaderboard, and fans out over WebSocket to subscribed clients. The existing 15-second polling stays as a fallback. Proposed capacity targets for a finale: 5,000 concurrent viewers per show, 200 confirmed votes per second sustained, bursts to 1,000 per second, and 95% of votes visible on the leaderboard within 3 seconds.

**Data model**

| Entity | Purpose | State |
| --- | --- | --- |
| Profiles, roles | Identity, role assignment, points | Exists (inferred) |
| Contests, rounds, entries | Contest definition, stages, applications and status | Exists (inferred) |
| Contestants, media, achievements, social accounts | Portfolio and verified reach | Exists (inferred) |
| Vote orders and votes | Purchases and credited votes | Exists, to be rebuilt on the ledger |
| Rewards catalog and user rewards | Points redemption codes | Exists (inferred) |
| Winners and payout status | Results and payouts | Exists (inferred) |
| Brands, campaigns, impressions, shares, post queue | Sponsorship and ROI | Exists (inferred) |
| Streams | Live shows linked to contests | Exists (inferred) |
| Fraud signals, audit log | Risk and accountability | Exists (inferred) |
| Vote ledger | Append-only source of truth for every vote | New |
| Wallets and wallet ledger | Stored value and spending | New |
| Payment attempts, webhook events, bundles, price rules | Provider-agnostic payments | New |
| Organiser accounts, KYC, settlements, payout batches | Self-service money flow | New |
| Judges, criteria, score sheets | Scoring | New |
| Devices, push tokens, notifications, preferences | Mobile engagement | New |
| Referrals and attribution | Contestant growth tools | New |
| Moderation reports and actions | Safety | New |
| Translations, feature flags | Localisation and rollout | New |

**API additions** (versioned under `/v1`, existing endpoints kept working during migration)

| Group | Examples |
| --- | --- |
| Voting | `POST /v1/vote-orders` with an `Idempotency-Key` header, `GET /v1/vote-orders/{id}`, `GET /v1/contests/{id}/leaderboard`, WebSocket `/v1/ws` |
| Payments | `POST /v1/webhooks/{provider}` with signature checks, `POST /v1/wallet/topups`, `GET /v1/wallet` |
| Channels | `POST /v1/ussd/session`, `POST /v1/whatsapp/webhook` |
| Organiser | `/v1/organisers/me`, KYC submission, settlement account, contest templates, team seats |
| Judging | `POST /v1/judges/scores`, `GET /v1/contests/{id}/score-summary` |
| Mobile | `POST /v1/devices` for push tokens, notification preferences, signed media-upload URLs |
| Trust | `GET /v1/contests/{id}/audit`, report endpoints, dispute endpoints |
| Growth | Referral links and attribution reports |

**Delivery and operations**

- Monorepo with `apps/web`, `apps/mobile`, `apps/studio` and shared packages for the API client, schemas and design tokens.
- CI runs lint, type checks, unit tests, web end-to-end tests (Playwright) and mobile flows (Maestro). EAS builds ship store binaries, with over-the-air updates for non-native fixes.
- Environments: development, staging with PSP test mode, production. Load tests of finale traffic run on staging before each flagship event.
- Backups with point-in-time recovery. Disaster recovery targets: recovery point 5 minutes, recovery time 1 hour.
- Hosting in the cloud region nearest Nigerian users, behind a CDN with African points of presence, with a documented answer on where personal data lives.

## 12. Non-functional requirements, analytics and monetisation

The platform earns most of its money in short, spiky windows (finales and closing days), so reliability and speed during those hours matter more than average-day performance.

**Non-functional requirements**

| Area | Requirement |
| --- | --- |
| Availability | 99.9% monthly; 99.95% during declared live shows, with a change freeze 24 hours before a flagship finale |
| Latency | p95 API response under 400 ms excluding PSP calls; vote confirmation visible within 10 seconds for 99% of paid votes |
| Scale | Targets in section 11; load test at 2x expected peak before each flagship event |
| Data integrity | No lost or duplicated votes: ledger writes are transactional and webhooks idempotent; reconciliation difference under 0.01% of gross |
| Security | Section 10 baseline; staff access reviewed quarterly; vulnerability fixes for critical issues within 72 hours |
| Privacy | Data minimisation, consent records, export and delete on request, masked voter identity in public logs |
| Accessibility | WCAG 2.2 AA on web and equivalent platform accessibility on mobile: screen readers, large text, contrast, captions on platform-owned video |
| Compatibility | Last two major versions of Chrome, Safari, Edge and Firefox; Android and iOS minimums in section 7; USSD on any handset |
| SEO and sharing | Contest and contestant pages server-rendered, with rich link previews for WhatsApp and social |
| Support | In-app help centre, WhatsApp support line, ticketing with service levels, status page |

**Analytics**

Track a single event taxonomy across web, apps, USSD and WhatsApp, with consent where required. The core funnel is: contest viewed, contestant opened, vote started, payment method chosen, payment succeeded or failed, vote credited, receipt shared.

- Dashboards: conversion by channel and payment method, failure reasons, cost per vote, repeat voting, contestant-driven versus organic votes, retention by cohort.
- Brand ROI reads the same events, so sponsor numbers and platform numbers always agree.
- Experimentation through feature flags: bundle sizes, free-vote hooks, checkout order, push timing.

**Monetisation**

| Stream | Model | Notes |
| --- | --- | --- |
| Vote fee | Percentage of gross vote revenue, tiered by organiser volume | Main revenue; proposed range 10% to 15%, to test |
| Entry fees | Smaller percentage of contestant entry fees | Organiser sets the fee |
| Organiser plans | Free tier with limits, paid plans for team seats, custom branding, advanced analytics | Predictable subscription revenue |
| Sponsorship | Packages sold to brands, platform commission on sponsorships it brokers | Includes perk and coupon programme |
| Premium contestant tools | Poster generator, analytics, boosted placement clearly labelled as promoted | Never affects vote counts |
| White-label | Branded app or domain for large organisers | Later |

**Illustrative unit economics (placeholder numbers, not a forecast).** A contest sells 100,000 votes at ₦100, so gross is ₦10,000,000. At a 12% platform fee, revenue is ₦1,200,000. If provider costs average 2% of gross (₦200,000), about ₦1,000,000 remains before refunds, support, hosting and staff. Bundles and the wallet matter because provider fees include a fixed part per transaction that hurts small payments.

## 13. Roadmap, team, risks and decisions

Public launch of the iOS and Android apps lands on 2 April 2027, five months after a 2 November 2026 kickoff, if three gates are passed. The first gate (legal and store-policy answers) decides how voting is priced on iOS and whether prize mechanics are allowed, so it comes before most build work.

&#91;embedded content: roadmap · 4 phases, 3 gates\]

Gate 1 opens the build, gate 2 starts the closed beta and store review, and gate 3 allows public release.

**Proposed core team** (19 people plus external counsel and a tax adviser)

| Role | Headcount |
| --- | --- |
| Product manager | 1 |
| Product and brand designers | 2 |
| Mobile engineers (React Native) | 3 |
| Backend engineers | 3 |
| Web engineers | 2 |
| QA and test automation | 1 |
| DevOps and site reliability | 1 |
| Data and analytics | 1 |
| Trust and safety, moderation | 2 |
| Support and organiser success | 2 |
| Finance and compliance | 1 |

**Seasonality.** December and January are peak months for entertainment events in Nigeria. Phase 0 and the first half of phase 1 fall across them, so run a few December pilot contests on the existing web app, with the Paystack flow, to learn from real traffic while the apps are built.

**Risks**

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| App stores treat vote bundles as digital goods, forcing store billing or rejecting the app | High | High | Early pre-review with both stores, a payment layer that can use a different rail per platform, price modelling with commission included |
| Paid voting with prizes is classed as a lottery or gaming product | Medium | High | Counsel opinion before organiser tools ship, strict prize rules, no raffle mechanics |
| PSP outage or slowdown during a finale | Medium | High | Second provider with automatic fail-over, status monitoring, pre-event load tests, a manual vote-credit fallback |
| Vote-rigging scandal | Medium | High | Section 9 controls, public audit page, third-party review of flagship contests |
| USSD short code takes longer than planned | High | Medium | Start the application in phase 0, launch the apps without USSD, treat USSD as phase 3 |
| Poor performance on low-end Android phones | Medium | Medium | Device lab with 2 GB phones, performance budgets in CI, lite mode |
| Organiser non-payment of fees or chargebacks | Medium | Medium | Settlement holds until finalisation, organiser KYC, reserve on high-risk contests |
| Price instability from inflation and currency moves | High | Medium | Quarterly price review, organiser-set prices within a floor, prices stored per contest |
| Personal-data incident | Low | High | Section 10 security baseline, breach response drill, minimal data held |
| Team capacity across the festive season | Medium | Medium | Scope phase 1 to P0 only, protect a two-week buffer in February |

**Decisions taken** (recommended defaults, applied so work can start; comment on any row to change it)

| Question | Decision | Reason |
| --- | --- | --- |
| Where does the backend live? | The Supabase Postgres database is the shared system of record. CMS, CRM and configuration tables are versioned migrations in the web repo, and the existing Node API reads the same tables. | The backend repo was not available, and this removes the dependency. |
| Marketplace or self-service tool? | Both: a self-service organiser platform, with CrownPulse-run flagship contests as the demand engine. | Flagships create audience and proof; self-service scales without staff. |
| Which contest types first? | Music and talent shows and campus pageants. Brand challenges run on top as sponsorships. | High vote volume and strong social sharing. |
| iOS and Android billing | Comply with store billing for in-app vote bundles at launch (StoreKit and Google Play Billing), keep Paystack checkout on web, set prices per channel in the CMS, and request pre-review from both stores. Confirm against the current store rules before submission. | Lowest chance of rejection or removal; the commission is priced in. |
| Wallets | Phase 3, only through a licensed partner. CrownPulse never holds stored value itself. | Avoids a licensing gap. |
| Admin and organiser console | Built in the web repo and driven by the CMS and CRM data model in section 15. | One source of truth, no hardcoded screens. |
| Team and budget | Start with 8 people in phase 0 (1 product, 1 design, 2 mobile, 2 backend, 1 web, 1 QA and DevOps) and grow to the 19-person plan by phase 2. | Limits spend before gate 1 clears. |
| Languages after English | Nigerian Pidgin first, then Yoruba, Hausa and Igbo. All strings live in the CMS translation store. | Pidgin has the widest reach among young voters. |

## 14. Standards and legal enforceability

Every requirement in this PRD is held to published standards where they exist, and every legal document is built so that a Nigerian court or regulator can see who agreed to what, when and in which version. A PRD cannot make a contract binding by itself: enforceability depends on counsel-approved text, proper acceptance mechanics and records. So all legal text ships as draft templates in the CMS and cannot be published until named counsel approves it (see 14.4).

### 14.1 Standards adopted

| Area | Standard | How it is applied |
| --- | --- | --- |
| Application security | OWASP ASVS Level 2, Level 3 for the ledger, payments and payout modules | Security requirements in every epic, tested in CI and in the annual penetration test |
| Mobile security | OWASP MASVS Level 1, plus resilience controls for the voting and wallet screens | Certificate pinning, jailbreak and root signals, Play Integrity and App Attest |
| Card data | PCI DSS 4.0, SAQ A scope | Hosted fields and PSP SDKs only; card numbers never reach our servers or logs |
| Information security management | ISO/IEC 27001 aligned controls, with SOC 2 Type I assessed as a 12-month goal | Policies, access reviews, supplier reviews, incident response |
| Privacy | Nigeria Data Protection Act 2023 and regulator directives; ISO/IEC 27701 aligned | Data protection impact assessment before launch, records of processing, processor agreements |
| Accessibility | WCAG 2.2 level AA | Checked in design review and automated tests |
| API design | OpenAPI 3.1, RFC 9457 problem details for errors, OAuth 2.0 and OpenID Connect for sign-in | Contract tests in CI; one schema package shared by web, mobile and API |
| Data formats | ISO 8601 and UTC storage for time, ISO 4217 NGN with amounts in kobo, E.164 phone numbers, BCP 47 language tags | Enforced by schema validation |
| Reliability | Service level objectives with error budgets | Targets in section 12 |
| Requirements | Unique IDs, one testable statement per requirement, priority and owner | Used throughout sections 6 to 12 |

### 14.2 Legal document set

| Document | Who accepts it | When |
| --- | --- | --- |
| Terms of Use | Every account holder and guest voter | Before first account creation or purchase |
| Privacy Notice and Cookie Policy | Everyone, shown and acknowledged | At sign-up, first visit and each material change |
| Voting Rules and Refund and Dispute Policy | Every voter | Before the first paid vote |
| Contestant Agreement (entry terms, media licence, conduct, consent to publicity) | Every contestant | At application |
| Guardian Consent Form | Parent or guardian of a minor contestant | Before the minor's entry is approved |
| Organiser Services Agreement (KYC, fees, settlement, prize duties, indemnities, liability limits) | Every organiser, signed by an authorised person | Before the first contest goes live |
| Contest Official Rules template (eligibility, entry period, how winners are chosen, prizes, tie-break, sponsor, governing law) | Generated per contest and shown to voters and contestants | Before the contest opens |
| Sponsor Agreement and Insertion Order | Brands | Before campaign launch |
| Judge Agreement (confidentiality, conflicts of interest, scoring duties) | Every judge | Before scoring access |
| Acceptable Use and Content Policy | Everyone who uploads or comments | At first upload |
| Data Processing Agreements | Payment, SMS, WhatsApp, hosting and analytics providers | Before integration |

### 14.3 Enforceability mechanics (product requirements)

1. **Clear agreement, not browsewrap.** The user must tick an unticked box or press a button labelled as agreement, next to a link to the full text, before the first purchase or entry. Nothing is pre-ticked.
2. **Immutable versions.** A published document is never edited. A change creates a new version with an effective date. Material changes need 30 days' notice and re-acceptance at the next sign-in or purchase.
3. **Evidence record.** For each acceptance store the user or guest identifier, document and version, SHA-256 hash of the text shown, UTC time, app or browser version, locale, acceptance method and a truncated or hashed network address. Keep records for the longest limitation period counsel specifies.
4. **Signed organiser and sponsor agreements.** Electronic signature by a KYC-verified signatory with name, role and time, a sealed PDF with an audit certificate, and countersignature stored in the organiser's account. Counsel decides whether a qualified signature provider is needed.
5. **Plain-language summaries.** A short summary in the user's language sits above each long document, and the full text governs. Key terms (price, no-refund cases, prize rules) appear at the point of purchase.
6. **Adults only for payment.** Purchasers must be 18 or older, confirmed at sign-up, and minors take part only through the guardian flow.
7. **Fair and transparent pricing.** Total price including taxes and fees is displayed before payment, and receipts are issued for every purchase.
8. **Governing law and disputes.** Nigerian law, with a stepped process of in-app complaint, mediation, then arbitration or the courts named by counsel. Counsel confirms the arbitration route under current Nigerian law.
9. **Electronic evidence readiness.** Records are exportable with integrity proofs so they can be produced as electronic records under the Evidence Act. Counsel confirms the exact certification steps.

### 14.4 Approval workflow for legal text

Each legal document moves from draft to counsel-approved to published. Only a user with the legal-approver role can approve, the approver's name and the date are recorded, and the audit log is append-only. Until a document is approved, the platform blocks the flows that depend on it (for example paid voting) in production. Drafts supplied by the team are starting points for counsel, not finished contracts.

## 15. CMS- and CRM-driven platform: zero hardcoding

Nothing a business user could ever want to change may live in code. Code holds structure and behaviour; everything else is data that staff edit in the CMS or CRM, with approval, versioning and audit. This applies to every client: web, iOS, Android, USSD menus and WhatsApp flows.

### 15.1 What must be configurable

| Domain | Examples | Stored as | Edited by |
| --- | --- | --- | --- |
| Content | Page copy, hero, features, FAQs, banners, marketing blocks, SEO titles and descriptions, images | Pages and typed blocks with locales | Content editor |
| Navigation and layout | Header and footer menus, links, social handles, app-store links | Menus and site settings | Content editor |
| Strings and messages | Button labels, errors, empty states, email, SMS, push, WhatsApp and USSD text | Translation store and message templates | Content editor, translator |
| Legal | All documents in section 14, versions, effective dates | Legal documents and acceptances | Legal approver |
| Money | Vote prices, bundles, free-vote rules, platform fee tiers, entry fees, minimum price floors, payout schedule, tax rates | Effective-dated platform configuration | Finance, with two-person approval |
| Contest rules | Categories, round templates, scoring criteria and weights, caps, regions | Contest templates and contest records | Organiser, admin |
| Product switches | Feature availability, payment-method order, kill switches, rollout percentages, supported countries | Feature flags and settings | Admin |
| Brand and theme | Colours, fonts, logos, badge and reward definitions | Design tokens and catalog tables | Designer, admin |
| Reference data | States, cities, contest categories, report reasons, bank list | Lookup tables | Admin |
| CRM | Pipeline stages, lead forms and fields, segments, campaign templates, consent types | CRM configuration tables | Growth lead, admin |

### 15.2 CMS requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| CMS-01 | Typed block library (hero, feature grid, steps, role cards, stats, call to action, rich text, FAQ, contest list, leaderboard, media gallery), each validated against a schema at save time | P0 |
| CMS-02 | Draft, review, scheduled publish and unpublish, with version history and one-click rollback | P0 |
| CMS-03 | Locale fallback chain (for example Yoruba to English) with missing-translation reports | P0 |
| CMS-04 | Media library with automatic resizing, alt text required, and usage tracking | P1 |
| CMS-05 | Preview links for unpublished content on web and in the mobile apps | P1 |
| CMS-06 | Role-based permissions per content area, plus an append-only audit log of who changed what | P0 |
| CMS-07 | Live metrics blocks read real data and hide themselves when no data exists; the platform never shows invented statistics | P0 |
| CMS-08 | Content served to mobile through the same API with caching and offline last-known-good snapshots | P0 |

### 15.3 CRM requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| CRM-01 | Contacts and organisations for organisers, brands, contestants, judges and voter segments, linked to platform accounts | P0 |
| CRM-02 | Lead capture forms defined in the CMS (fields, validation, consent text) that create CRM leads with source and campaign attribution | P0 |
| CRM-03 | Configurable pipelines and stages for organiser onboarding and sponsorship deals, with tasks, notes and activity timeline | P0 |
| CRM-04 | Consent and preference centre by channel (email, SMS, WhatsApp, push), with opt-out honoured everywhere | P0 |
| CRM-05 | Segments and campaigns that send templated messages from the CMS, with frequency caps and quiet hours | P1 |
| CRM-06 | Support tickets and disputes linked to the contact, vote or payment involved | P1 |
| CRM-07 | Data subject request tooling: export, correct, delete, with a clock for response deadlines | P0 |
| CRM-08 | Import and export, and webhooks to the analytics warehouse | P1 |

### 15.4 Governance and engineering rules

1. **No literals for business content in code.** A CI scanner fails the build on user-facing string literals, currency amounts, percentages, fee values, URLs and phone numbers outside an allow-list of technical identifiers.
2. **No hardcoded fallbacks.** If the CMS is unreachable, clients serve the last known good snapshot from cache. If none exists, they show a neutral loading or error state without invented copy.
3. **Effective-dated configuration.** Prices, fees and rules take effect at a stated time, and the rule that applied to a purchase is stored with it.
4. **Two-person approval** for changes to money, legal text and fraud thresholds. Everything else needs a named approver per role.
5. **Environments.** Content and configuration are promoted from staging to production as versioned packages, never edited by hand in production.
6. **Audit.** Every change records actor, time, before and after, and reason.

### 15.5 Acceptance criteria

- A non-engineer changes hero copy, a vote price, a fee tier, a legal document version, a push template and adds a language, and each goes live without a code deploy.
- The CI scanner reports zero user-facing literals in the web, mobile and admin code.
- Every configuration change appears in the audit log with actor, diff and approver.
- With the CMS database unreachable, the web app still renders cached content and never shows placeholder or invented text.

**Sources and assumptions.** Repo facts come from `hemmylex/CrownPulse-frontend` at commit `e3c2355`, read on 19 October 2026. Market observations, fee structures, regulatory points and unit economics are working assumptions from general knowledge, not looked up for this draft. Each needs verification with the named owner before it drives a decision.
