# Bio link — The Things We Don't Say

Story submissions from `liamsaysit.html` (series form).

## Google Form: "Message Me"

| Field | Entry ID | Notes |
|-------|----------|--------|
| Your Message | `entry.1072301583` | Includes category as first line: `What is this: …` |
| Email | `entry.2011616989` | Required |

Form action: `https://docs.google.com/forms/d/e/1FAIpQLSfyNFXWb8mZ0A-EOemynRlZemc1_Pm1fvYvl5O9DKqpfwjAAw/formResponse`

Configured in `liamsaysit.html` (`PR_MESSAGE_FORM_ACTION`, `PR_FORM_ENTRY_*`).

## Firestore

Collection: **`bioMessages`**

| Field | Type | Notes |
|-------|------|--------|
| `message` | string | Required; category + story, up to ~11k chars |
| `email` | string | Required, 5–320 chars |
| `source` | string | `liamsaysit` (bio) or `letitout` (other leads) |
| `createdAt` | timestamp | Server time |

Rules: `firestore.rules` → `match /bioMessages/{id}`

**Deploy rules after pull:**

```bash
firebase deploy --only firestore:rules
```

## Page

- Live URL: https://mypatternreset.com/liamsaysit
- Form: `#message-me` (legacy `#newsletter` id kept on wrapper)
- Title / OG: Liam Says It — `images/liam-says-it-og.jpg`
