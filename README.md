# Victor Ocampo Marin · Portfolio

Personal portfolio site (Data Engineer). Vue 3 + Vite + Tailwind CSS v4, static single page, deployed to GitHub Pages.

Live: https://victorocampomarin.com

## Update the content

The site is a terminal: the home screen shows a lineage map, and each node "runs" a section.

| What | Where |
|---|---|
| All text: about, experience, projects, skills, certifications, contact | `src/data/profile.js` |
| Sections, their commands, order (next/prev) and shortcut keys | `src/data/terminal.js` |
| Project flow diagrams (nodes and arrows) | `src/diagrams/*.js` |
| CV PDF (currently v6) | Replace the file in `public/` and update `cvFile` in `src/data/profile.js` |
| "In training" skills, NiFi "Why" tab, lakehouse "Done so far" | `training`, `projects[].decisions`, `projects[].phasesDone` in `src/data/profile.js` |
| Page title, description, Open Graph, JSON-LD | `index.html` (share image: `public/og.png`, 1200×630) |
| How each section looks | `src/views/*View.vue` (the plain document reuses them) |

Routes: `#/` (map), `#/about`, `#/projects` (and `#/projects/<id>`), `#/experience`, `#/education`, `#/skills`, `#/certifications`, `#/contact`, `#/plain` (one-page document, printable).

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
