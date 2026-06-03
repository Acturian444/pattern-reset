# Pattern quiz temporarily hidden

The relationship quiz (`index.html`) is **off** for visitors. The page file stays in the repo for a future re-launch.

## What we did

1. **Vercel redirects** (`vercel.json`): `/` and `/index.html` → `/home` (302, easy to remove).
2. **`index.html`**: immediate client redirect to `/home` (backup for non-Vercel hosts).
3. **Nav / footer**: removed “Get Clarity” and quiz CTAs on live pages; former quiz buttons point to `/home` where needed.
4. **`robots.txt`**: `Disallow` for `/` and `/index.html`.
5. **`sitemap.xml`**: homepage URL is `/home`.

## Re-enable later

1. Remove or comment the two quiz redirects in `vercel.json`.
2. Remove the redirect `<script>` at the top of `index.html` `<head>`.
3. Restore nav/footer links (search repo for `index.html` / `Get Clarity`).
4. Revert `robots.txt` and `sitemap.xml` if desired.
5. Redeploy.
