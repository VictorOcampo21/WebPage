# Victor Ocampo Marin · Portfolio

Personal portfolio site (Data Engineer). Vue 3 + Vite + Tailwind CSS v4, static single page, deployed to GitHub Pages.

Live: https://victorocampomarin.com

## Update the content

| What | Where |
|---|---|
| Text: about, experience, projects, skills, certifications, contact | `src/data/profile.js` |
| Project flow diagrams (nodes and arrows) | `src/diagrams/*.js` |
| CV PDF (currently v6) | Replace the file in `public/` and update `cvFile` in `src/data/profile.js` |
| "In training" skills, NiFi "Why" tab | `training` and `projects[0].decisions` in `src/data/profile.js` |
| Page title, description, Open Graph | `index.html` (share image: `public/og.png`, 1200×630) |
| Hero numbers, rotating roles, "Now" card, tech band | `stats`, `roles`, `now`, `marquee` in `src/data/profile.js` |

Lakehouse card: when the repository has its first phase published, set `status: 'in-progress'`, `repo: '<url>'` and list the finished phases in `phasesDone`.

## Run locally

```bash
npm install
npm run dev       # development server
npm run build     # production build in dist/
npm run preview   # serve the build at http://localhost:4173/
```

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages.
One-time setup: repository **Settings → Pages → Build and deployment → Source: GitHub Actions**, and **Custom domain: victorocampomarin.com** with **Enforce HTTPS**.

Domain DNS (GoDaddy): four `A` records on `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`, and a `CNAME` on `www` → `victorocampo21.github.io`. `public/CNAME` holds the domain.
