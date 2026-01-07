# C100% – Disc Golf Putting Trainer
## Product Plan & Feature Specification

**Version:** 1.0  
**Date:** December 19, 2025  
**Status:** Pre-Development Planning

---

## 1. Executive Summary

**C100%** is a computer vision-powered disc golf putting practice app that uses a phone's camera to automatically track putting performance, measure improvement, and create a competitive social experience around achieving personal "Circle of Confidence" distances.

**Core value proposition:**  
- Hands-free putting practice tracking via vision AI (no tapping between putts).  
- Automatic distance estimation and make/miss detection.  
- Data-driven "Circle of Confidence" stat (90% make zone) with badges at 2-ft increments up to 50 ft.  
- Social challenges, real-time 2-player mini-matches, and friend-group leaderboards.  
- Money-back guarantee on subscription: measurable improvement in C1 putting if user commits to consistent practice.

**Target user:**  
Disc golfers aged 18–55 who want to improve their putting through structured practice, compete with friends, and track real progress over time. Primary markets: North America (especially Canada/US).

---

## 2. User Experience & Core Flow

### 2.1 Setup & Calibration (First Time)

**Objective:** Configure camera, establish distance mapping, and train the vision model.

**Steps:**

1. **Camera mount selection:**
   - User chooses how they're mounting the phone: "Leaning on bag," "Tripod/stand," or "Magnetic ground pole."
   - App displays setup guidance overlays for each option, recommending side-view angle and suggesting phone height/distance to ensure both basket and putter are in frame.

2. **Field-of-view check:**
   - App visually detects the basket and player's height in the frame.
   - If 30 ft likely exceeds the frame width, it prompts: "Move your camera back or higher; we don't think 30 ft will fit. Please adjust and try again."

3. **5–10–20–30 ft calibration drill:**
   - User stands at **5 ft**, takes 5 putts, walks back to the phone.
   - Screen shows: "How many did you make out of 5?" (input 0–5).
   - User repeats at **10 ft**, **20 ft**, and **30 ft**.
   - For each set, the app records video clips (to train the model) and collects ground-truth make/miss counts.
   - These labeled clips calibrate:
     - Distance mapping (screen position ↔ actual feet).
     - Make/miss classification thresholds.

4. **Save camera preset:**
   - After calibration, app saves the setup as a location preset (e.g., "Backyard basket," "Local park").
   - Next session: user can "Use last preset" to skip recalibration, or "Re-calibrate" if the basket/camera moved.

### 2.2 Free-Putt Session (Ongoing)

**Objective:** Player practices; app auto-tracks results and builds confidence curve.

**Flow:**

1. User selects session type (free putt, ladder, death putt, etc.) and starts.
2. Player throws from any distances within the camera frame (ideally 5–40 ft).
3. App continuously detects:
   - **Distance estimate:** using calibrated camera mapping and player/basket height.
   - **Make/miss classification:** disc in chains/basket vs missed.
   - **Hand used:** vision infers left/right from body orientation and release side; can be overridden in profile.
   - **Putting style** (once model is trained): stagger, straddle, spin, push, spush, patent pending, flick, etc.
4. User **does not interact** during the session (no tapping after each putt).
5. After session, app shows:
   - Session summary: total putts, makes, C1/C1X stats.
   - **Confidence curve:** smooth make-probability vs distance, with 90% zone marked.
   - Share button for achievements.

### 2.3 Circle of Confidence (CoC) Challenge

**Objective:** Validate a player's 90% confidence distance with a formal 50-putt test.

**Flow:**

1. App suggests a CoC challenge distance based on the confidence curve (e.g., "Your 90% zone is around 17 ft").
2. User can accept and enter the target distance (or choose a custom one).
3. **Distance accuracy prompt:**
   - App asks: "Please measure this distance with a tape or marked rope. Accuracy matters."
   - Vision model checks framing and warns: "You appear closer/further than [distance] ft. Please confirm your marker is correct."
4. User takes **50 putts** at that exact distance; app records each putt.
5. User walks back and inputs total makes (0–50).
6. **Outcome:**
   - If makes ≥45/50 (90%+): **Badge earned!** (e.g., "Money Zone 17 ft"). CoC is updated; user can share the achievement.
   - If makes <45/50: **Still counts toward stats.** App shows "You're at 80% from 17 ft—5 more makes away from leveling up," encouraging future attempts.

---

## 3. Player Profile & Tracking

### 3.1 Profile Fields

- **Name / Email** (required for login and password reset).
- **Height** (for camera-based distance scaling).
- **Dominant hand:** Right / Left / Ambidextrous.
- **Favorite putters** (e.g., "Luna," "P2," "Aviar") — for flavor and leaderboards.
- **Profile picture** (optional).

### 3.2 Hand Tracking

- Vision model infers which hand is used on each putt (left vs right) based on release side and body position.
- Sessions can be filtered by hand: "Right-hand only," "Left-hand only," or "All."
- Paid users see per-hand stats: "Your left-hand CoC is 16 ft; right-hand is 19 ft."

---

## 4. Stats & Metrics

### 4.1 Continuous Confidence Curve

**Instead of discrete 5-ft buckets, use all data points to generate a smooth curve.**

- For every recorded putt: store the distance estimate and make/miss result.
- Fit a **make-probability curve** (e.g., logistic or smoothed empirical) across all distances.
- Display visually as a line graph: distance (x-axis) vs make % (y-axis).
- Highlight the **90% confidence zone:** the farthest distance where the curve stays at/above 90% (9/10).
- This distance is the suggested Circle of Confidence.

### 4.2 Key Stats (Paid Users)

- **Per-distance analytics:**
  - Make % at every distance (not bucketed; curve-based).
  - Longest streaks at each distance.
  - Personal records (PRs): "Best 85% session from 25 ft."

- **Circle 1 (C1) focus:**
  - C1 make %: all putts inside 10 m (33 ft).
  - C1X make %: inside 10 m during casual rounds (if integrated with round scoring).

- **Per-style stats (once model trained):**
  - Make % by putting style and distance: "Straddle spin from 20–25 ft: 78%."
  - Style recommendations: "Your straddle is 8% better from 25 ft—consider it in wind."

- **Streaks & trends:**
  - Longest make streak, by distance.
  - Weekly/monthly progress toward CoC milestones.
  - Improvement since last week/month (simple delta).

### 4.3 Putting Styles

**Recognized styles (with visual detection + user confirmation drills):**

- Stagger/inline stance.
- Straddle stance.
- Spin putt.
- Push putt.
- Spush/hybrid.
- Patent pending (custom).
- Flick.

Users can run short labeled drills ("Do 10 straddle putts, confirm") so the model learns visual signatures. Paid users get per-style analytics.

---

## 5. Circle of Confidence & Badge System

### 5.1 Definition

**Circle of Confidence (CoC):**  
The farthest distance at which a player can achieve **90% make rate (9/10)**, validated via a 50-putt challenge (≥45/50).

### 5.2 Badge Ladder (2-ft Increments, 6 ft to 50 ft)

Each badge unlocks at a validated CoC distance. Badges are earned by completing a **50-putt, ≥45/50 challenge** at that distance.

| Distance | Badge Name |
|----------|------------|
| 6 ft | Baby Chains |
| 8 ft | Lil' Tap-In |
| 10 ft | Warm-Up Warrior |
| 12 ft | Tap-In Terminator |
| 14 ft | Circle Cub |
| 16 ft | Money Zone 16 |
| 18 ft | Ice Circle 18 |
| 20 ft | Bulletproof 20 |
| 22 ft | Cold-Blooded 22 |
| 24 ft | Nerves of Steel 24 |
| 26 ft | Circle Assassin 26 |
| 28 ft | Chain Sniper 28 |
| 30 ft | Circle 1 King/Queen 30 |
| 32 ft | Edge of Circle 32 |
| 34 ft | Circle Raider 34 |
| 36 ft | Deep Circle 36 |
| 38 ft | Fearless 38 |
| 40 ft | Circle 2 Challenger 40 |
| 42 ft | Long-Range Sniper 42 |
| 44 ft | Edge Hunter 44 |
| 46 ft | Big Circle Baller 46 |
| 48 ft | Circle 2 Ice 48 |
| 50 ft | Long-Bomb Legend 50 |

**Display:**
- Profile headline: highest validated CoC distance + badge name.
- Badge ladder: all earned badges shown on profile, ordered by distance.

---

## 6. Game Modes & Challenges

### 6.1 Solo Modes (Free & Paid)

**Quick Warmup:**
- 20–30 putts from near current CoC distance.
- Good for pre-round practice.

**Ladder:**
- 5 putts each at distances 10 → 15 → 20 → 25 → 30 ft.
- Advance when hitting a threshold (e.g., 4/5).
- Retreat if you miss too many.

**Death Putt:**
- Standard putting, but if you miss **>3 ft past basket**, you incur an extra "miss penalty."
- Leaderboards: best Death Putt sessions, fewest penalty misses.

**Gauntlet (paid):**
- Randomized angles/distances within Circle 1 to simulate real-round variability.
- High engagement for serious players.

**Circle of Confidence Challenge:**
- 50 putts at a single distance (user's current CoC or a new target).
- Validation run for badges.

### 6.2 Real-Time 2-Player Mini-Matches (Paid)

**Setup:**
- Two players stand near the basket at roughly equal distance (they agree on distance; app estimates independently per player from camera geometry).
- Each player has a quick "ID pose" so the app learns their clothing shape/color and can distinguish them across the match.

**Match flow:**
- Alternating turns or side-by-side shots (configurable).
- Standard mini-match: **20 putts per player** (40 total).
- App auto-detects makes/misses and distance per player using angle-robust estimation (accounts for camera perspective using player height and basket position in frame).

**Scoring:**
- Per-player stats: makes, distance, streaks.
- Post-match report: who won, key stats, best streak.
- Can be shared / posted to leaderboard.

**Angle robustness:**
- Model estimates distance using **player height, basket size, and their relative positions** in frame.
- Works even if camera isn't perfectly side-on (within reason).
- Both players still get fair distance estimates because the model calculates independently per player.

### 6.3 Asynchronous Challenges (Paid)

**Challenge types:**

1. **Match my performance:**
   - "Beat my Money Zone 18 badge" (50 putts at 18 ft, ≥45/50).
   - "Match my last C1 session: 82% inside Circle 1."

2. **Time-limited:**
   - "Best 50-putt C1 session by end of week."
   - "Improve your CoC by 2 ft by end of month."

3. **Custom:**
   - "Death Putt from your current CoC distance."

**Mechanics:**
- Challenger gets **up to 5 attempts** to meet the goal (enforced by app).
- Deadline is set by the challenger.
- After deadline, results are compared: winner determined, stats displayed.
- Can be shared to friends, team, or leaderboard.

### 6.4 Team & Friend-Group Leaderboards (Paid)

- **Friend list:** invite other C100% users; build a personal friend group.
- **Friend-group leaderboards:**
  - Ranked by highest validated CoC distance.
  - Ranked by cleanest 50-putt CoC run (fewest misses).
  - Weekly/monthly C1 make % improvements.

- **Team challenges:**
  - Create a team (e.g., "Card Crew," "League Night").
  - Set a team goal: combined CoC improvements, total C1 makes per week.
  - Each member's sessions contribute to team progress.
  - Post-challenge summaries and celebrations.

---

## 7. Social & Sharing

### 7.1 In-App Social

- **Friend feed / team chat:**
  - Posts appear when users:
    - Earn a new badge.
    - Improve their CoC.
    - Win a challenge.
    - Hit a personal record.
  - Friends can like, comment, or send a challenge reply.

### 7.2 External Sharing

**Every achievement generates a shareable card with:**
- Distance, badge name, make count, date.
- A **deep link** into the app (or to app store if not installed).
- Prefilled message, e.g.: "I just locked in Money Zone 18 in C100%! Can you beat it?"

**Sharing channels:**
- SMS / text message.
- Email.
- WhatsApp / Messenger.
- Instagram / Facebook / Twitter (with native share sheet).
- In-app to friends/team.

**Deep-link behavior:**
- Installed users jump into the relevant screen (challenge, profile, leaderboard).
- New users see the app store page with context preserved for post-install onboarding.

### 7.3 Friendly Side-Bets (Optional)

**Social stakes (non-monetary):**
- Challenges can include an optional "for fun" wager note, e.g.:
  - "Loser buys post-round drinks."
  - "Loser owes a disc."
  - "Loser does Death Putt on video."

**In-app tracking:**
- App records agreed stakes as social decoration.
- Tracks head-to-head win/loss history between friends.
- Shows leaderboard of "side-bet winners" for banter (no real money).

---

## 8. Monetization & Subscription Model

### 8.1 Free Tier

**Features:**
- Single-player practice with:
  - Camera setup + 5/10/20/30 calibration.
  - Vision-assisted make/miss + distance tracking.
  - Session-level summary graph and maybe last 3 sessions.
- Email required (for save progress and basic reminders).

**Limitations:**
- No historical stats beyond recent sessions.
- No Circle of Confidence engine or badges.
- No multiplayer or challenges.
- **Ads:** 1 rewarded video before starting a session, 1 before viewing summary.
  - Clear messaging: "Ads help a little, but they barely cover coffee. Subscriptions keep this project alive."

**Ad revenue (estimate):**
- ~$0.01–$0.04 per session per user (varies by region/eCPM).
- Not primary revenue; mainly a conversion funnel to paid.

### 8.2 Paid Subscription (C100%+)

**One-tier "Premium" entitlement mapping to all platforms (iOS, Android).**

**Pricing (recommended):**
- **Monthly:** $9.99 USD / $13.49 CAD.
- **Annual:** $69.99 USD / $94.99 CAD (≈$5.83/month, ~42% off).
- **Free trial:** 7–14 days (configurable).

**Entitlements (all included in single C100%+ subscription):**

✓ **No ads** — ever.

✓ **Full statistical history & trends:**
- Unlimited historical sessions.
- Confidence curve updates and long-term trends.
- Per-hand, per-style stats (once model trained).
- Correlation analysis: notes vs performance.

✓ **Circle of Confidence engine:**
- Automatic 90% zone calculation.
- CoC badge ladder (6–50 ft).
- CoC Challenge tools with distance validation.

✓ **Advanced solo game modes:**
- Ladder, Death Putt, Gauntlet, plus custom modes.
- Leaderboards within each mode.
- Session templates and recommended programs.

✓ **Real-time multiplayer:**
- 2-player mini-matches (20-putt or custom).
- Live scoring and post-match stats.
- Ability to play on any angle (camera-geometry robust).

✓ **Asynchronous challenges:**
- Send performance-matching challenges to any friend.
- Track attempts and enforce limits.
- Global and private leaderboards.

✓ **Friend groups & team leaderboards:**
- Create teams or friend groups.
- Shared leaderboards and team challenges.
- Invite and manage members.

✓ **Email coaching & reminders:**
- Smart reminders: "You haven't putted in 3 days—a quick session keeps your streak alive."
- Weekly progress summaries: makes, trends, next milestones.
- Milestone celebrations: first C1 badge, new CoC, etc.

✓ **"Better putter" guarantee:**
- Money-back guarantee if C1 make % does not improve after X weeks.
- Conditions:
  - Minimum sessions per week (e.g., 3+).
  - Minimum putts per session (e.g., 30+).
  - No long gaps (auto-reset if >10 days inactive).
- In-app dashboard shows eligibility and progress toward guarantee.
- Transparent refund policy and process.

✓ **Referral & discount codes:**
- Each subscriber gets a unique referral code.
- Friends using code get discounted first month or extended trial.
- Referrer gets credit (free weeks or discount) when friends subscribe.

✓ **Putting style analysis (once model trained):**
- Per-style make % and distance-specific insights.
- Recommendations: "Your straddle excels from 25 ft."

✓ **Advanced sharing & achievements:**
- Premium badge designs and achievement cards.
- Custom leaderboard rankings.

---

## 9. Technical Architecture

### 9.1 Backend: Firebase-Centric

**Firebase services:**

- **Firebase Auth:**
  - Email/password sign-in.
  - Optional social logins (Google, Apple).

- **Firestore / Realtime Database:**
  - **users:** profiles, heights, handedness, favorite putters.
  - **sessions:** raw putt events (distance, make/miss, hand, style), timestamps.
  - **achievements:** badges earned, CoC history, challenge records.
  - **social:** friend list, teams, incoming/outgoing challenges, feed posts.
  - **leaderboards:** materialized views for quick queries.

- **Cloud Functions:**
  - Trigger on session completion: calculate CoC, award badges, post to feed.
  - Challenge enforcement: check attempts, calculate winners, settle results.
  - Email campaigns: summaries, reminders, milestones (via SendGrid or similar).
  - Model training data export (for continuous vision model improvement).

- **Cloud Storage:**
  - Store short video clips from calibration and key sessions (for model training).
  - User profile pictures.

- **Cloud Messaging (FCM):**
  - Push notifications for challenge results, friend activity, reminders.

### 9.2 Mobile App (React Native)

**Tech stack:**
- **Framework:** React Native (code-once for iOS/Android).
- **State management:** Redux or Zustand.
- **Local storage:** AsyncStorage + SQLite for offline session caching.
- **Video/camera:** React Native Camera or Expo Camera.
- **Vision inference:** TensorFlow Lite (on-device) for disc/basket/putt detection.

**Core features:**
- Real-time camera streaming and event detection.
- Offline session recording (syncs to Firebase when online).
- Local stats aggregation before cloud sync.
- Deep linking (via react-navigation and universal links).

### 9.3 Vision Model

**On-device inference (TensorFlow Lite):**
- Disc detection and tracking.
- Basket/chain localization.
- Putt event classification (make vs miss).
- Hand/body pose (for handedness and style detection).
- Distance estimation (calibrated per camera setup).

**Server-side improvements:**
- Cloud Functions or ML Engine for periodic retraining on labeled session data.
- A/B testing model variants on user cohorts.
- Continuous model updates pushed to clients via app updates.

### 9.4 Subscription Management

**Platforms:**
- **iOS:** RevenueCat or native StoreKit 2 for App Store Subscriptions.
- **Android:** RevenueCat or native Google Play Billing.
- **Web (future):** Stripe for web subscription management.

**Entitlement sync:**
- Client checks subscription status on launch and periodically.
- Firebase Custom Claims or RevenueCat user properties gated for paid features.

---

## 10. Launch Strategy

### 10.1 MVP (Version 1.0)

**Minimum viable feature set:**

✓ Camera setup + 5/10/20/30 calibration.  
✓ Free-putt sessions with vision-assisted make/miss tracking.  
✓ Confidence curve generation (smooth, not bucketed).  
✓ CoC calculation and basic badge (6–10 ft to start).  
✓ Friend list and simple friend-group leaderboard.  
✓ Asynchronous CoC challenges (no real-time multiplayer yet).  
✓ Free tier with ads.  
✓ Paid subscription (C100%+) with full history, CoC badges, challenges, and email reminders.  
✓ Social sharing (deep links to achievements).  
✓ Basic onboarding and setup flow.  

**Defer to v1.1+:**
- Full 2-player real-time multiplayer (aim for v1.1).
- Advanced putting style detection (v1.1–1.2).
- Complex team structures and tournaments (v1.2).
- Gauntlet and advanced game modes (v1.1+).

### 10.2 Closed Beta (Month 1–2)

- **Target:** 20–50 local disc golfers + local disc golf clubs in Vancouver area.
- **Platform:** TestFlight (iOS) + internal Android testing.
- **Feedback goals:**
  - Setup friction: is 5/10/20/30 drill intuitive?
  - Camera & vision accuracy: are distances and make/miss calls reliable?
  - Stats clarity: do users understand the confidence curve and CoC?
  - Leaderboard engagement: do friend challenges motivate repeated use?
- **Iterate:** fix crashes, adjust calibration, refine UI clarity.

### 10.3 Soft Launch (Month 3)

- **Platforms:** Apple App Store, Google Play (US/Canada).
- **Release:** invite-only via shared codes or closed beta expansion.
- **Community seeding:**
  - Posts in r/discgolf, local disc golf Facebook groups, disc golf forums.
  - Emphasize: vision-tracked putting, CoC, friend challenges.
  - Offer: founders discount or extended trial in exchange for feedback.
- **Metrics to watch:**
  - Activation rate (camera setup completion).
  - Calibration success rate.
  - Session frequency (users per week).
  - Subscription conversion rate (free → paid).
  - Churn (retention at 1w, 2w, 4w, 12w).

### 10.4 Public Launch (Month 4+)

- **App Store Optimization (ASO):** keyword research, screenshots, description optimized for "disc golf putting trainer" and "circle of confidence."
- **Paid user acquisition (optional):** small budget for Facebook/Instagram ads targeting disc golfers, golf enthusiasts.
- **Community engagement:**
  - Sponsor local disc golf events or leagues.
  - Feature user stories and high CoC achievers.
  - Referral incentives (free month per successful referral).
- **Seasonal campaigns:**
  - Winter: "improve your putting indoors."
  - Spring: "get tournament-ready."
  - Leagues: integrate with local league schedules.

---

## 11. Success Metrics & KPIs

### 11.1 Acquisition & Onboarding

- **DAU/MAU (Daily/Monthly Active Users):** target 10K DAU by end of Year 1.
- **Activation rate:** % of installs that complete setup + first calibration.
- **Calibration completion rate:** % of installs that finish 5/10/20/30 drill.

### 11.2 Engagement

- **Session frequency:** average sessions per user per week.
- **Session length:** average putts per session.
- **CoC challenge participation:** % of users who attempt at least one CoC challenge per month.
- **Leaderboard activity:** % of users who view or engage with friend leaderboards weekly.

### 11.3 Monetization

- **Subscription conversion rate:** % of free users → paid within 30 days.
- **MRR (Monthly Recurring Revenue):** gross revenue from subscriptions (excluding refunds).
- **ARPU (Average Revenue Per User):** revenue / total active users.
- **Churn rate:** % of subscribers canceling per month (target: <5% for healthy SaaS).
- **LTV (Lifetime Value):** estimated revenue per user over lifetime (target: >100x CAC for profitability).

### 11.4 Product Quality

- **Vision accuracy:** % of make/miss calls that match ground truth (target: >95%).
- **Distance estimation error:** mean absolute error in distance (target: ±2 ft avg).
- **Crash rate:** % of sessions that error out (target: <1%).
- **App rating:** target 4.5+ stars on app stores.

### 11.5 User Satisfaction & Retention

- **Net Promoter Score (NPS):** in-app or email survey (target: 50+).
- **Retention (Day 7, Day 30, Day 90):** % of day-1 users still active at day 7, 30, 90.
- **Guarantee satisfaction:** % of guarantee claims honored (goal: >90% approval, <10% churn due to dissatisfaction).

---

## 12. Roadmap (High-Level)

### Phase 1: MVP (Months 1–3)
- ✓ Core camera setup, calibration, free-putt sessions.
- ✓ Confidence curve, CoC, badges (6–10 ft).
- ✓ Friend leaderboards, simple challenges, social sharing.
- ✓ Free + paid tiers, email reminders, basic guarantee framework.

### Phase 2: Expansion (Months 4–6)
- ✓ Real-time 2-player mini-matches.
- ✓ Extend badges to full 6–50 ft range.
- ✓ Putting style detection + per-style stats.
- ✓ Advanced game modes (Ladder, Death Putt, Gauntlet).
- ✓ Team challenges, tournament support.

### Phase 3: Maturity (Months 7–12)
- ✓ Video playback and slow-motion analysis (optional).
- ✓ In-round stats integration (pull data from UDisc or DGCR).
- ✓ Premium content (coaching videos, technique guides).
- ✓ Coach/league tools (view member stats, assign programs).
- ✓ International expansion (multi-language, other currencies).

### Phase 4: Long-Term (Year 2+)
- Web dashboard for in-depth analytics.
- Hardware partnerships (co-branded monopod with setup guidance).
- Esports / tournament platform (live streaming, official leaderboards).
- Integration with other disc golf apps (scorecards, course data).

---

## 13. Known Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Vision accuracy poor in low light / outdoor glare | Medium | High | Test extensively in beta; train on diverse lighting. Offer calibration hints. |
| Users don't maintain practice discipline | Medium | Medium | Email reminders, guarantee incentives, social pressure (leaderboards, challenges). |
| Slow subscription conversion | Low | High | A/B test free trial lengths, paywall messaging, and ad placement. Early referral incentives. |
| Multiplayer latency issues | Low | Medium | Use Firebase Realtime DB, optimize message schema, test on 4G/LTE. |
| Privacy concerns (video storage) | Low | High | Transparently explain that calibration clips are for model training only, stored securely, and user can delete. Comply with GDPR/PIPEDA. |
| Churn from guarantee refunds | Low | High | Set clear, achievable guarantee criteria. Track early indicators (low session count) and re-engage before deadline. |

---

## 14. Competitive Landscape

**Existing disc golf apps (UDisc, DGCR, etc.):** mostly focus on course routing and round scoring, not putting practice.

**Existing putting-practice apps:** few; most are generic or inactive. **C100% differentiator: vision-based hands-free tracking + social challenges + guarantees.**

**Fitness/skill training apps with similar models:** Strava, Peloton, Kahoot, Nike Training Club. C100% borrows engagement and referral mechanics but specializes in disc golf putting.

**Direct competitors:** None currently in disc golf. If a competitor emerges, C100% will pivot to emphasize guarantee, friend challenges, and seamless vision integration.

---

## 15. Success Criteria (12 Months Post-Launch)

- **1,000+ paid subscribers** generating $10K+/month MRR.
- **90%+ vision accuracy** on make/miss detection.
- **>40% free → paid conversion** within 30 days of first session.
- **<7% monthly churn** on subscriptions.
- **4.5+ star rating** on app stores.
- **>50% of paid users engaged weekly** with challenges or leaderboard activity.
- **<5% of paid users** claim guarantee refunds (indicating achievable criteria + good engagement).

---

## 16. Conclusion

C100% targets a niche but passionate audience: disc golfers who want measurable improvement and social competition in putting practice. By combining computer vision, personalized metrics (Circle of Confidence), social challenges, and a money-back guarantee, C100% differentiates itself and drives engagement and retention.

The freemium model (free tier + ads) lowers friction to acquisition, while the paid subscription ($9.99–$69.99/year) funds development and scales profitably. An iterative MVP → public launch → phase expansion approach de-risks development and allows for user feedback before major features.

**Next steps:** finalize tech stack, set up Firebase and development environment, recruit closed-beta testers, begin vision model training and integration.

---

**Document prepared for:** Product development and stakeholder alignment.  
**Contact:** [Team/Product Lead]