# kgatman.github.io — Portfolio

A lightweight, responsive, single-page portfolio for **Makhate Makhate**.
No build step, no framework — just static HTML, CSS and a little vanilla JS,
served directly by GitHub Pages.

**Live:** https://kgatman.github.io

## Structure

```
index.html            # All content + sections (edit here first)
assets/css/styles.css # All styling + design tokens
assets/js/main.js     # Theme toggle, nav, scroll reveal, contact form
img/optimized/        # Web-sized profile images
.nojekyll             # Tells GitHub Pages to skip Jekyll and serve as-is
```

## How to customize

Everything you'll want to change is marked in `index.html` with `{{EDIT}}`,
`{{NAME}}`, `{{PROJECT_1}}`, etc. Quick map:

| Want to change…            | Where |
|----------------------------|-------|
| Name, tagline, bio         | `index.html` → Hero + About sections |
| Page title / SEO / OG tags | `index.html` `<head>` |
| Skills                     | `#skills` — edit the `<li>` tags |
| Projects                   | `#projects` — duplicate a `.project-card` (first one is `.featured`) |
| Experience                 | `#experience` — duplicate a `.timeline-item` |
| Email / social links       | `#contact` and the footer |
| Brand colors               | `assets/css/styles.css` → `:root` tokens (`--accent`) |
| Contact form               | Replace `{{FORMSPREE_ID}}` with your [Formspree](https://formspree.io) ID, or delete the form |

### Profile photo
Replace `img/optimized/profile.jpg` (800px) and `profile@2x.jpg` (1200px).
To regenerate from a large original on macOS:

```bash
sips -Z 800  -s formatOptions 82 img/pro.jpg --out img/optimized/profile.jpg
sips -Z 1200 -s formatOptions 80 img/pro.jpg --out img/optimized/profile@2x.jpg
```

## Local preview

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Notes
- Dark mode by default with a light theme toggle (respects OS preference, remembers your choice).
- Accessible: skip link, keyboard nav, ARIA, reduced-motion support.
- The old Jekyll `_config.yml` is no longer used (kept for reference) — `.nojekyll` disables Jekyll.
