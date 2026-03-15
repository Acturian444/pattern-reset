# Pattern Quiz Landing Page — Section Background Analysis

## Expert Review Summary

**Issue:** "The Questions That Keep You Up" (Pain & Clarity) section background looked off compared to Hero and other sections.

---

## Root Causes Identified

1. **Hero-to-Pain seam:** Hero used `#050505` (darkest). Pain used gradient starting at `#0a0a0a` (lighter). Scrolling from Hero → Pain created a visible lightening at the boundary.
2. **Payoff box contrast:** The "Generic advice won't cut it" box used `rgba(255,255,255,0.04)` while question cards used `rgba(255,255,255,0.03)` — slight mismatch.
3. **Width inconsistency:** Pain section used `100vw` (can cause horizontal scroll); Quiz used `100%`.

---

## Fixes Applied

| Change | Before | After |
|--------|--------|-------|
| Pain & Quiz gradient start | `#0a0a0a` | `#050505` (matches Hero) |
| Pain-clarity-payoff box | `rgba(255,255,255,0.04)` | `rgba(255,255,255,0.03)` (matches items) |
| Pain section width | `100vw` | `100%` |

---

## Final Section Background Hierarchy (Top → Bottom) — Option A

| Section | Background | Notes |
|---------|------------|-------|
| Header | `#0a0a0a` | Solid |
| Hero | `#050505` | Solid, darkest |
| Pain & Clarity | `linear-gradient(#050505 → #161616)` | Seamless from Hero |
| Quiz | `linear-gradient(#161616 → #1a1a1a)` | Continues from Pain, flows into FAQ |
| FAQ | `#1a1a1a` + subtle radial overlay | Lighter support section |
| Footer | `linear-gradient(#1a1a1a → #0a0a0a)` | Soft transition from FAQ |

**Flow:** One continuous dark gradient from Hero to Footer — no abrupt seams.
