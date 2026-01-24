# Free 22-Day Pattern Reset: Visual Design Specification
## Minimalist, Mobile-First, Time-Wealth Focused

---

## DESIGN PHILOSOPHY

**Minimalist Principles:**
- Clean, uncluttered, focused
- Time tracking is prominent
- Progress is visual
- Easy to use, big touch targets
- Beautiful but functional
- Mobile-first (60%+ users on mobile)

---

## COLOR PALETTE

### Primary Colors
- **Background:** `#fffcf1` (Cream - warm, inviting)
- **Text:** `#000000` (Black - high contrast, readable)
- **Accent:** `#ca0013` (Brand Red - action, energy)
- **Secondary:** `#f5f5f5` (Light Grey - subtle separation)

### Status Colors
- **Success/Complete:** `#28a745` (Green - completed rituals)
- **In Progress:** `#ffc107` (Amber - active timers)
- **Neutral:** `#6c757d` (Grey - pending/incomplete)

### Vice Elimination Colors
- **Eliminated:** `#28a745` (Green - streak active)
- **Consumed:** `#dc3545` (Red - streak broken)
- **Neutral:** `#6c757d` (Grey - not tracked)

---

## TYPOGRAPHY

### Font Families
- **Headings:** `'Anton', sans-serif` (Bold, uppercase, impactful)
- **Body:** `'DM Sans', sans-serif` (Readable, friendly, modern)

### Font Sizes (Mobile-First)
- **H1 (Page Title):** 2rem (32px) mobile, 2.5rem (40px) desktop
- **H2 (Section Title):** 1.5rem (24px) mobile, 1.75rem (28px) desktop
- **H3 (Ritual Title):** 1.25rem (20px) mobile, 1.5rem (24px) desktop
- **Body:** 1rem (16px) mobile, 1.125rem (18px) desktop
- **Small:** 0.875rem (14px) mobile, 1rem (16px) desktop

### Font Weights
- **Headings:** 700 (Bold)
- **Body:** 400 (Regular)
- **Emphasis:** 600 (Semi-bold)

---

## SPACING SYSTEM

### Base Unit: 8px
- **XS:** 4px (0.5rem)
- **S:** 8px (1rem)
- **M:** 16px (2rem)
- **L:** 24px (3rem)
- **XL:** 32px (4rem)
- **XXL:** 48px (6rem)

---

## LAYOUT STRUCTURE

### Mobile View (Default)

```
┌─────────────────────────────────────┐
│  [Banner - Fixed, 60px height]      │
├─────────────────────────────────────┤
│  [Header - Sticky, 70px height]     │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐ │
│  │ YOUR PATTERN RESULTS          │ │
│  │                               │ │
│  │ ⚓ The Anchor                  │ │
│  │ Fixer                          │ │
│  │ Pattern Strength: 78%          │ │
│  │                               │ │
│  │ [View Full Results →]         │ │
│  └───────────────────────────────┘ │
│                                     │
│  DAY 3 OF 22                        │
│  ████████░░░░░░░░░░ 14%            │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ TODAY'S TIME WEALTH           │ │
│  │                               │ │
│  │ ⏱️ 1h 25m invested            │ │
│  │                               │ │
│  │ Progress: 45% of daily goal   │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 5 CORE RITUALS                │ │
│  │                               │ │
│  │ ☑ Fasting (16h 30m)          │ │
│  │ ☑ Hydration + Intention (2m)  │ │
│  │ ☑ Movement + Affirmation (20m)│ │
│  │ ☐ Flow Activity (0m)          │ │
│  │ ☐ Let It Out (0m)             │ │
│  │                               │ │
│  │ [Start Flow Activity]         │ │
│  │ [Start Journaling]            │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ VICE ELIMINATION              │ │
│  │                               │ │
│  │ ☑ No Junk Food (Day 3)       │ │
│  │ ☑ No Sugar (Day 3)            │ │
│  │ ☑ No Alcohol (Day 3)          │ │
│  │ ☑ No Screen Time (Day 2)     │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ TODAY'S EDUCATION             │ │
│  │                               │ │
│  │ [Daily Prompt]                │ │
│  │ [Micro-Education]             │ │
│  │ [Pattern-Specific Quote]      │ │
│  └───────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

---

## COMPONENT DESIGNS

### 1. Pattern Results Card

**Design:**
```
┌─────────────────────────────────────┐
│  YOUR PATTERN RESULTS               │
│  ┌───────────────────────────────┐ │
│  │                               │ │
│  │  [Icon] ⚓                     │ │
│  │                               │ │
│  │  You're The Anchor             │ │
│  │  Fixer                          │ │
│  │                               │ │
│  │  Pattern Strength: 78%         │ │
│  │                               │ │
│  │  [View Full Results →]         │ │
│  │                               │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Styling:**
- Background: `#fff` (White card on cream background)
- Border: `1px solid #f5f5f5` (Subtle border)
- Border-radius: `12px` (Rounded corners)
- Padding: `1.5rem` (24px)
- Shadow: `0 2px 8px rgba(0,0,0,0.05)` (Subtle shadow)
- Icon: Large, colored (red for accent)
- Text: Centered, clear hierarchy

**States:**
- Default: White background, subtle shadow
- Hover: Slight elevation (shadow increase)
- Click: Opens results modal

---

### 2. Progress Bar

**Design:**
```
DAY 3 OF 22
████████░░░░░░░░░░░░ 14%
```

**Styling:**
- Background: `#f5f5f5` (Light grey)
- Fill: `#ca0013` (Brand red)
- Height: `8px` (Mobile), `10px` (Desktop)
- Border-radius: `4px` (Rounded)
- Text: `1.25rem` (20px), bold, brand red
- Percentage: Right-aligned, same size

**Animation:**
- Smooth fill animation on progress update
- Pulse effect on completion milestones (25%, 50%, 75%, 100%)

---

### 3. Time Wealth Dashboard

**Design:**
```
┌─────────────────────────────────────┐
│  TODAY'S TIME WEALTH                │
│                                      │
│  ⏱️ 1h 25m invested                 │
│                                      │
│  Progress: 45% of daily goal        │
│                                      │
│  [Circular Progress Ring]            │
│                                      │
└─────────────────────────────────────┘
```

**Styling:**
- Background: `#fff` (White card)
- Border-radius: `12px`
- Padding: `1.5rem`
- Icon: Large clock icon, brand red
- Time Display: `2rem` (32px), bold, brand red
- Progress Text: `0.875rem` (14px), grey
- Circular Progress: SVG ring, brand red fill, grey background

**Visual:**
- Large, prominent time display
- Circular progress ring (45% filled)
- Clean, minimal design

---

### 4. 5 Core Rituals Checklist

**Design:**
```
┌─────────────────────────────────────┐
│  5 CORE RITUALS                     │
│                                     │
│  ☑ Fasting (16h 30m)              │
│  ☑ Hydration + Intention (2m)      │
│  ☑ Movement + Affirmation (20m)     │
│  ☐ Flow Activity (0m)               │
│  ☐ Let It Out (0m)                  │
│                                     │
│  [Start Flow Activity]              │
│  [Start Journaling]                 │
└─────────────────────────────────────┘
```

**Styling:**
- Background: `#fff` (White card)
- Border-radius: `12px`
- Padding: `1.5rem`
- Checkbox: Large (24px), custom styled
- Completed: Green checkmark, greyed text
- Pending: Empty circle, active text
- Time: Small, grey, right-aligned
- Buttons: Full-width, brand red, 44px height

**Checkbox Design:**
- Completed: Green circle with white checkmark
- Pending: Grey circle outline
- Size: 24px × 24px (touch-friendly)

**Button Design:**
- Background: `#ca0013` (Brand red)
- Text: White, bold, `1rem` (16px)
- Height: `44px` (iOS touch target)
- Border-radius: `8px`
- Hover: Darker red (`#a0000f`)
- Active: Pressed state (slight scale down)

---

### 5. Vice Elimination Tracker

**Design:**
```
┌─────────────────────────────────────┐
│  VICE ELIMINATION                   │
│                                     │
│  ☑ No Junk Food (Day 3)           │
│  ☑ No Sugar (Day 3)                │
│  ☑ No Alcohol (Day 3)              │
│  ☑ No Screen Time (Day 2)         │
│                                     │
│  [Calendar View]                    │
└─────────────────────────────────────┘
```

**Styling:**
- Background: `#fff` (White card)
- Border-radius: `12px`
- Padding: `1.5rem`
- Checkbox: Same as rituals (24px)
- Streak Badge: Small pill, green background, white text
- Calendar: Mini calendar view (optional, collapsible)

**Streak Badge:**
- Background: `#28a745` (Green)
- Text: White, `0.75rem` (12px), bold
- Padding: `4px 8px`
- Border-radius: `12px`

**Calendar View (Optional):**
- Mini calendar (7 days visible)
- Green dot = eliminated
- Red dot = consumed
- Grey dot = not tracked
- Collapsible section

---

### 6. Daily Education Section

**Design:**
```
┌─────────────────────────────────────┐
│  TODAY'S EDUCATION                  │
│                                     │
│  [Collapsible Section]              │
│                                     │
│  ▼ Morning Prompt                   │
│  ▼ Micro-Education                 │
│  ▼ Pattern-Specific Quote           │
└─────────────────────────────────────┘
```

**Styling:**
- Background: `#fff` (White card)
- Border-radius: `12px`
- Padding: `1.5rem`
- Collapsible: Accordion-style, smooth animation
- Icon: Chevron down/up for expand/collapse

**Content Styling:**
- **Prompt:** Bold, `1.125rem` (18px), brand red
- **Question:** Regular, `1rem` (16px), black
- **Reflection:** Italic, `0.875rem` (14px), grey
- **Action:** Bold, `1rem` (16px), brand red
- **Quote:** Italic, `1rem` (16px), grey, with quotation marks
- **Expert Name:** Small, `0.75rem` (12px), grey

---

### 7. Timer Components

**Walk Timer:**
```
┌─────────────────────────────────────┐
│  20-MINUTE WALK                     │
│                                     │
│  [Circular Timer]                   │
│      15:32                          │
│                                     │
│  [Start] [Pause] [Stop]            │
│                                     │
│  Your Affirmation:                  │
│  "I trust. I let go. I am safe."   │
└─────────────────────────────────────┘
```

**Styling:**
- Circular timer: SVG, 120px diameter (mobile), 150px (desktop)
- Progress ring: Brand red, animated
- Time display: Large, `2rem` (32px), bold, centered
- Buttons: Full-width, 44px height, brand red
- Affirmation: Centered, italic, `1rem` (16px)

**Pomodoro Timer (Flow Activity):**
```
┌─────────────────────────────────────┐
│  FLOW ACTIVITY                      │
│                                     │
│  [Large Circular Timer]             │
│      25:00                          │
│      Work Session                   │
│                                     │
│  [Start Work] [Pause] [Complete]    │
│                                     │
│  Session 1 of 4                     │
│  ⏱️ Time Invested: 0h 0m           │
│                                     │
│  [Classical Music Player]           │
│  ▶️ Play | ⏸️ Pause | 🔊 Volume    │
└─────────────────────────────────────┘
```

**Styling:**
- Large circular timer: 180px diameter (mobile), 220px (desktop)
- Progress ring: Brand red, animated
- Time display: `2.5rem` (40px), bold
- Session counter: Small, grey
- Music player: Simple controls, minimal design

---

### 8. Journaling Component

**Design:**
```
┌─────────────────────────────────────┐
│  LET IT OUT (JOURNALING)            │
│                                     │
│  Today's Prompt:                    │
│  "What are you holding in about     │
│   needing to control? What happens  │
│   when you can't fix something?"   │
│                                     │
│  [Textarea - Auto-expanding]        │
│                                     │
│  ⏱️ 0m | 💾 Auto-saved             │
│                                     │
│  [Save & Complete]                  │
└─────────────────────────────────────┘
```

**Styling:**
- Textarea: Full-width, auto-expanding, min-height `120px`
- Border: `1px solid #f5f5f5`
- Border-radius: `8px`
- Padding: `1rem`
- Font: `1rem` (16px), readable
- Auto-save indicator: Small, green, right-aligned
- Timer: Small, grey, left-aligned
- Button: Full-width, brand red, 44px height

---

## RESPONSIVE BREAKPOINTS

### Mobile (Default)
- **Width:** < 768px
- **Layout:** Single column, stacked
- **Padding:** `1rem` (16px) sides
- **Font sizes:** Base sizes (see Typography)

### Tablet
- **Width:** 768px - 1024px
- **Layout:** Single column, slightly wider
- **Padding:** `2rem` (32px) sides
- **Font sizes:** Slightly larger

### Desktop
- **Width:** > 1024px
- **Layout:** Max-width `900px`, centered
- **Padding:** `3rem` (48px) sides
- **Font sizes:** Largest (see Typography)

---

## INTERACTIVE STATES

### Buttons
- **Default:** Brand red background, white text
- **Hover:** Darker red (`#a0000f`), slight elevation
- **Active:** Pressed (scale 0.98), darker
- **Disabled:** Grey background, grey text, no interaction

### Cards
- **Default:** White background, subtle shadow
- **Hover:** Slight elevation (shadow increase)
- **Active:** Pressed (scale 0.99)

### Checkboxes
- **Unchecked:** Grey circle outline
- **Checked:** Green circle with white checkmark
- **Hover:** Slight scale (1.1)
- **Active:** Pressed (scale 0.95)

### Links
- **Default:** Brand red, underline on hover
- **Hover:** Darker red, underline
- **Active:** Pressed (scale 0.98)

---

## ANIMATIONS

### Page Load
- **Fade In:** Cards fade in sequentially (0.2s delay between)
- **Slide Up:** Content slides up from bottom (0.3s ease-out)

### Progress Updates
- **Progress Bar:** Smooth fill animation (0.5s ease-out)
- **Time Wealth:** Number count-up animation (0.8s ease-out)
- **Circular Progress:** Smooth ring fill (0.5s ease-out)

### Interactions
- **Button Click:** Scale down (0.98) on press, scale up on release
- **Checkbox Toggle:** Scale animation (0.2s ease-out)
- **Card Hover:** Shadow increase (0.2s ease-out)
- **Accordion Expand:** Smooth height animation (0.3s ease-out)

### Completion Celebrations
- **Ritual Complete:** Green checkmark animation (scale + fade)
- **Day Complete:** Confetti animation (optional, subtle)
- **Streak Milestone:** Badge pulse animation (3-day, 7-day, 22-day)

---

## ACCESSIBILITY

### WCAG 2.1 AA Compliance
- **Color Contrast:** All text meets 4.5:1 ratio minimum
- **Touch Targets:** Minimum 44px × 44px
- **Keyboard Navigation:** Full keyboard support
- **Screen Readers:** Proper ARIA labels, semantic HTML
- **Focus Indicators:** Clear focus rings on interactive elements

### Features
- **Skip to Content:** Skip link for keyboard users
- **Alt Text:** All icons and images have descriptive alt text
- **ARIA Labels:** All interactive elements properly labeled
- **High Contrast Mode:** Supports system high contrast settings

---

## VISUAL HIERARCHY

### Priority Order (Top to Bottom)
1. **Pattern Results Card** - Reminds user why they're here
2. **Progress Bar** - Shows overall progress (Day X of 22)
3. **Time Wealth Dashboard** - Shows today's investment
4. **5 Core Rituals** - Main actions for the day
5. **Vice Elimination** - Secondary challenge
6. **Daily Education** - Learning and growth

### Visual Weight
- **Heavy:** Time Wealth, Rituals (action items)
- **Medium:** Progress Bar, Vice Elimination
- **Light:** Education (collapsible, optional)

---

## MOBILE-SPECIFIC DESIGN

### Touch Targets
- **Minimum Size:** 44px × 44px (iOS standard)
- **Spacing:** Minimum 8px between touch targets
- **Buttons:** Full-width on mobile for easy tapping

### Scrolling
- **Smooth Scrolling:** Enabled
- **Sticky Elements:** Header, Progress Bar (optional)
- **Pull to Refresh:** Optional, for progress updates

### Gestures
- **Swipe:** Optional, for navigating days
- **Tap:** Primary interaction method
- **Long Press:** Optional, for additional actions

---

## LOADING STATES

### Skeleton Screens
- **Cards:** Grey placeholder boxes with shimmer animation
- **Text:** Grey placeholder lines
- **Buttons:** Grey placeholder rectangles

### Progress Indicators
- **Spinner:** Small, brand red, for async operations
- **Progress Bar:** For time-based operations (timers)

---

## ERROR STATES

### Validation Errors
- **Red Border:** On invalid input
- **Error Message:** Below input, red text, small font
- **Icon:** Red X icon next to error

### Empty States
- **Message:** Friendly, encouraging text
- **Icon:** Large, grey, relevant icon
- **Action:** Clear CTA button

---

## SUCCESS STATES

### Completion
- **Green Checkmark:** Animated, prominent
- **Success Message:** Encouraging, celebratory
- **Next Action:** Clear CTA for next step

### Milestones
- **Badge:** Animated badge for streaks, completions
- **Message:** Congratulatory text
- **Share:** Optional share button

---

## DARK MODE (Optional)

### Color Adjustments
- **Background:** `#1a1a1a` (Dark grey)
- **Text:** `#ffffff` (White)
- **Cards:** `#2a2a2a` (Slightly lighter)
- **Accent:** `#ca0013` (Same brand red)
- **Borders:** `#3a3a3a` (Subtle separation)

### Implementation
- **System Preference:** Respects `prefers-color-scheme: dark`
- **Toggle:** Optional manual toggle in settings

---

## SUMMARY

**Design Principles:**
- ✅ Minimalist - Clean, uncluttered, focused
- ✅ Mobile-First - 60%+ users on mobile
- ✅ Time-Focused - Time tracking is prominent
- ✅ Progress-Focused - Visual progress indicators
- ✅ Easy to Use - Big buttons, clear actions
- ✅ Beautiful - Inspiring, not clinical
- ✅ Accessible - WCAG 2.1 AA compliant

**Key Components:**
1. Pattern Results Card (top, sticky)
2. Progress Bar (Day X of 22)
3. Time Wealth Dashboard (prominent)
4. 5 Core Rituals Checklist (main actions)
5. Vice Elimination Tracker (streak counters)
6. Daily Education (collapsible, 5-10 min)
7. Timer Components (walk, Pomodoro)
8. Journaling Component (auto-save)

**Ready for Implementation:** ✅

