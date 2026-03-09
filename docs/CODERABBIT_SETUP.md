# Why CodeRabbit Comments Don’t Show on Pull Requests

CodeRabbit only posts comments when its **GitHub App is installed** on this repository and has access to it. There is no config in the repo that can “turn on” CodeRabbit without the app being installed.

## Likely reasons you don’t see CodeRabbit comments

1. **CodeRabbit is not installed on this repo**  
   The app must be installed from GitHub and this repository must be in the list of repos it can access.

2. **This repository wasn’t selected during install**  
   If you chose “Only select repositories,” this repo must be one of them.

3. **Organization approval**  
   If the repo is under a GitHub **organization**, the org may need to approve the CodeRabbit app for this repo (Settings → Third-party access / GitHub Apps).

4. **First run / delay**  
   Reviews run when a PR is opened or when new commits are pushed. The first run can take a few minutes.

## How to get CodeRabbit comments on your PRs

1. **Install the CodeRabbit GitHub App**
   - Go to: **https://github.com/apps/coderabbitai**
   - Click **Configure** or **Install**
   - Choose your user or org, then either “All repositories” or “Only select repositories”
   - If you choose “Only select repositories,” add **this repository**
   - Complete the install flow

2. **If the repo is in an organization**
   - Org admin: **Settings → GitHub Apps → CodeRabbit** (or **Third-party access**)
   - Ensure CodeRabbit is **approved** for this repo

3. **Open or update a PR**
   - Open a new PR, or push new commits to an existing PR
   - CodeRabbit will run on that PR; comments usually appear within a few minutes

4. **Optional: repo config**
   - This repo has a **`.coderabbit.yaml`** in the root so that when CodeRabbit runs, it uses explicit settings (reviews enabled, etc.). You don’t need to change it for basic comments to appear.

## Quick check

- **GitHub repo → Settings → Integrations → GitHub Apps**  
  Look for **CodeRabbit**. If it’s not listed, it’s not installed on this repo (or not approved by the org).

Once the app is installed and has access to this repo, CodeRabbit comments should appear on pull requests (including `pre-deployment-review` → `main`).
