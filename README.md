# My-Portfolio

Custom-coded game design portfolio (HTML/CSS/JS, no build step). See `CLAUDE.md` for the full project brief and checklist.

## Structure

```
index.html            Home – hero, showreel, filterable project grid, résumé button
about.html            Bio, skills, engines/software, education timeline
contact.html          Email + professional handles
projects/project-N.html  One case study per project (brief items a–h, marked in comments)
css/style.css         All styles (colour tokens at the top)
js/main.js            Mobile nav + project filter
assets/img/           WebP images, one folder per project (assets/img/project-1/…)
assets/resume/        resume.pdf
assets/fonts/         Oswald (self-hosted so headings work offline; OFL licence included)
```

## Filling it in

- Search the HTML for `[` and `TODO` to find every placeholder.
- Swap each `.placeholder` div for the `<img>` shown in the comment next to it.
- Images: export as WebP at the size noted in the placeholder, always set `width`/`height`, and add `loading="lazy"` to everything below the fold.
- Videos: YouTube/Vimeo embeds only (template iframe is in the comments).
- Builds: host on itch.io and link from the "Watch & play" section.

## Preview locally

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploy

- **GitHub Pages:** Settings → Pages → deploy from branch `main`, folder `/`. Add the custom domain there and a `CNAME` record at the registrar.
- **Netlify:** "Import from Git", no build command, publish directory `/`. Add the custom domain under Domain management.

## Showcase (offline) tip

The site uses system fonts and no external CSS/JS, so pages render without internet. YouTube embeds still need a connection. For the Showcase computer, keep a local copy of the showreel ready as a backup.
