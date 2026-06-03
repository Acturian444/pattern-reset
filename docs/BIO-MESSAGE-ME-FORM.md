# Bio link — Message Me form

## Google Form: "Message Me"

| Field | Entry ID |
|-------|----------|
| Your Message | `entry.1072301583` |
| Email | `entry.2011616989` | Required |

Form action: `https://docs.google.com/forms/d/e/1FAIpQLSfyNFXWb8mZ0A-EOemynRlZemc1_Pm1fvYvl5O9DKqpfwjAAw/formResponse`

Configured in `liamsaysit.html` (`PR_MESSAGE_FORM_ACTION`, `PR_FORM_ENTRY_*`).

## Firestore

Collection: **`bioMessages`**

| Field | Type | Notes |
|-------|------|--------|
| `message` | string | Required, 3–5000 chars |
| `email` | string | Required, 5–320 chars |
| `source` | string | Always `liamsaysit` |
| `createdAt` | timestamp | Server time |

Rules: `firestore.rules` → `match /bioMessages/{id}`

**Deploy rules after pull:**

```bash
firebase deploy --only firestore:rules
```

## Page

- `liamsaysit.html` — `#message-me` section (anchor `#newsletter` id kept on wrapper for old links)
