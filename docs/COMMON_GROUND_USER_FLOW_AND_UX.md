# Common Ground Social Club — User Flow, Logic & UX

> Reference document for product process, user experience, and technical flow.

---

## 1. Overview

Common Ground offers **Clubs** (recurring weekly gatherings) and **Experiences** (one-off curated activities). Users apply once, receive matched invites, pay per attendance, and connect through group chats before and after events.

---

## 2. User Flow (End-to-End)

```
Apply → Added to Lists → Receive Weekly Invites → Request/Buy Ticket → Group Chat Unlocks → Attend → Follow Up
```

### Step 1: Apply
- User submits application with: name, email, city, age, interests, why they want to join
- **Free.** No commitment.
- Data stored; user added to curated lists based on interests and fit

### Step 2: Added to Lists
- User is placed in groups/lists matched to their profile
- Invites are curated — not everyone gets every invite
- Matching ensures gatherings fit the user's interests and the group dynamic

### Step 3: Receive Weekly Invites
- Each week, users receive email and text invites to:
  - **Clubs** — Recurring gatherings (e.g., Saturday Walk, Sunday Supper, Friday Flow)
  - **Experiences** — One-off activities (beach days, concerts, museum days)
- Invites are matched to the user; not a generic feed

### Step 4: Request/Buy Ticket
- **First come, first serve** — Spots are limited
- User pays a **service fee** per event ($15–40 typical range)
- User is responsible for their own consumption at the venue:
  - **Dinner clubs:** Pay for your meal and drinks at the restaurant
  - **Social walk:** Coffee/beverage may be included (TBD)
  - **Dance/music:** Water typically provided
- No membership fee; pay only when you attend

### Step 5: Group Chat Unlocks
- After purchase, user gets access to a **group chat** for that specific event
- Chat includes:
  - All attendees who have purchased a ticket
  - Profile info and bios (from application) — so people can see who's going before they arrive
  - Ability to message before the event
- **Purpose:** Skip small talk. People arrive feeling like they already know each other.

### Step 6: Attend
- Show up at the venue
- Host guides introductions
- User pays for their own food/drinks at the venue (except where included)

### Step 7: Follow Up
- **Clubs:** Group chat stays open. User is added to the club's general chat (if first time). Can reconnect without trading numbers.
- **Experiences:** Group chat stays open for 1 month, then archives. Enough time for "let's get coffee" or exchange contacts.

---

## 3. Clubs vs. Experiences — Chat Lifecycle

| Type | General Chat | Event Chat |
|------|--------------|------------|
| **Clubs** | One recurring chat per club. We add people when they attend their first event. Stays open. | Each event has its own chat. Stays open. |
| **Experiences** | — | Event chat stays open for 1 month, then archives. |

### Clubs (Recurring)
- **General club chat:** Community hub for the club (e.g., "Saturday Walk"). Grows as people attend. Used for "Who's going this week?" and ongoing connection.
- **Event chat:** Specific to each gathering (e.g., Saturday 3/7). Pre-event coordination, post-event follow-up. Always open.

### Experiences (One-Off)
- **Event chat only:** Stays open for 1 month after the event. Gives time for follow-up without indefinite clutter.

---

## 4. Pricing Model

| Component | Who Pays |
|-----------|----------|
| Application | Free |
| Service fee per event | User ($15–40 typical) |
| Dinner, drinks at venue | User |
| Coffee/beverage (Social Walk) | TBD — may be included |
| Water (Dance/Music) | Provided |

**Note:** Membership model may be considered later. Current model is pay-per-attend.

---

## 5. Key UX Principles

1. **Curated, not algorithmic** — Human-matched invites; not a generic event feed
2. **Hosted** — Someone runs each gathering; guided introductions
3. **Low commitment** — Pay only when you attend; no subscription
4. **Pre-event connection** — See who's going, read bios, chat before you arrive
5. **Follow-up without trading numbers** — Group chat enables ongoing connection
6. **Come solo** — Everyone's there to connect; no need to bring a friend
7. **+1 flow** — Member shares invite with friend; friend reserves their own spot (same service fee, full group chat access). Both reserve around the same time. No special "add guest" flow — friend uses same reserve link.

---

## 6. Data Collected (Application)

- First name, email, city, age range
- Phone (optional), Instagram (optional)
- Interests (checkboxes)
- Attend preference (solo, with friend, either)
- What kind of people energize you (optional)
- Why do you want to join
- Event interest (if coming from a specific club CTA)
- Community Guidelines agreement
- Contact share consent (name/Instagram with attendees)

---

## 7. Technical Flow (High Level)

1. **Application** → Firestore `commonGroundApplications` + optional Google Form
2. **Invites** → Sent via email/text (manual or automated)
3. **Ticketing** → Stripe (or similar) for service fee
4. **Group chat** → Platform TBD (e.g., Slack, Discord, custom, or third-party)
5. **Post-purchase** → Unlock chat link; share attendee profiles

---

## 8. +1 Flow (Bring a Friend)

- **Design:** Solo preferred for mixing; +1 allowed for first-timers to lower anxiety
- **Flow:** Member shares weekly invite with friend → friend uses same reserve link → friend reserves their own spot (pays service fee, agrees to guidelines, gets group chat access)
- **No special build:** Same reserve flow for everyone. Friend is a full participant.
- **Capacity:** Each reservation = one spot. Both reserve around the same time (first come, first serve)
- **Benefits:** Fair (everyone pays), guidelines (friend agrees in flow), full experience (friend gets group chat), growth (friend in system, may become regular)

---

## 10. Group Model: Same vs New Each Week

**Question:** Do users join a club each week and stay with the same group, or get a new group each week, or do we keep adding to the group?

**Recommendation: Evolving group (same club, core + turnover)**

- **Clubs:** Same club, same time, same place. Regulars see familiar faces; new people join over time. Natural turnover. This builds real friendships (repeated exposure) while keeping it fresh.
- **Experiences:** One-off, new group each time.

**Why not same group every week?** Can feel cliquey; bad fit is hard to escape.  
**Why not new group every week?** Weak bonds; feels like speed-dating for friends.

---

## 11. Model & Philosophy

**Model:** Common Ground is the host. We curate clubs and experiences by interest, passion, and activity — each designed to bring people together and build real friendships. The outcome: a real social circle.

**Why weekly:** Clubs meet weekly. That regularity turns connection into a habit — same time, same place — so it becomes part of life. Social connection works like a muscle: it strengthens with regular use. We connect around what we love, which makes it easier to show up.

**Wellbeing:** Connecting regularly around what you enjoy supports mental health and reduces loneliness. It's not just social — it's part of feeling good.

**Clubs vs. experiences:** Clubs are recurring (ritual). Experiences are one-off (variety). Both build your social circle.

---

## 12. Glossary

| Term | Definition |
|------|-------------|
| **Club** | Recurring weekly gathering (same time, same place) |
| **Experience** | One-off curated activity |
| **Service fee** | Fee paid to Common Ground per event attendance |
| **General chat** | Persistent club community chat |
| **Event chat** | Chat for a specific gathering |

---

*Last updated: March 2026*
