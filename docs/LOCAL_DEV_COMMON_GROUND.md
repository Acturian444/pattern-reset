# Local Development — Common Ground Form

## The 404 error

When you see `api/common-ground-google-form: 404 (Not Found)`, it means the form submission proxy is **not reachable**. The Common Ground form needs this API to send data to Google Sheets.

## Why it happens

| How you open the page | Proxy reachable? |
|-----------------------|------------------|
| Double-click `common-ground.html` (file://) | No |
| Live Server / Python http.server / npx serve | No (static only) |
| **`node server.js`** → http://localhost:3000/common-ground.html | **Yes** |

## Correct way to test locally

1. **Open Terminal** in the project folder.

2. **Start the server:**
   ```bash
   npm start
   ```
   or
   ```bash
   node server.js
   ```

3. **Open in browser:**
   ```
   http://localhost:3000/common-ground.html
   ```

4. Fill out and submit the form. Data should appear in your Google Sheet.

## Quick check

If a red banner appears at the top saying *"Form submissions won't reach Google until you run npm start..."*, the proxy is not reachable. Follow the steps above.
