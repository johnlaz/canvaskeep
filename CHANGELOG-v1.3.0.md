# CanvasKeep v1.3.0

| File | What changed | Why |
|---|---|---|
| app/index.html | **Load Sample Artwork** button on the empty first-run gallery (6 paintings from your photos, child "Cathy"). Loads only when tapped | Optional demo, nothing preloaded |
| app/index.html | Settings > "Remove Sample Artwork" restored; removes only sample items | Clean exit from the demo |
| app/index.html | Export/Import/JSON wording replaced with **Back Up My Gallery / Restore From Backup** everywhere (intro, settings, toasts, confirmations, errors) | School-mom language |
| app/index.html | Removed the duplicate manual "Google Drive" and "iCloud" rows and the dev note about OAuth. One Back Up button; real Google Drive connect stays in Settings | Fewer, clearer options |
| app/index.html | Restore also works from the first screen of a fresh install | Switching phones |
| app/index.html | Upload screen: "Add Several at Once", "Split One Photo Into Many", "One at a Time"; Settings "App Color"; dev-flavored copy removed | Plain language |
| app/samples/*.jpg | New: the six sample paintings (cropped from your share cards) | Sample set |
| app/shot-1..4-*.png, shot-wide.png | New: store screenshots captured from the running app with the sample art (1080x1920) plus a 1920x1080 overview | Store listing |
| app/manifest.json | Screenshots wired in (narrow + wide) | Install UI / store |
| app/sw.js, app/index.html | Version 1.3.0 (cache canvaskeep-v1.3.0) | Update delivery |
| index.html (landing) | New icon, real screenshots, screenshot strip, plain-language privacy section, 2026 footer with lazlab.io@gmail.com, "34 pieces saved" claim removed, backup wording | Landing refresh |
| docs/banner.svg, docs/how-it-works.svg | New README visuals | README |
| README.md | Banner + flow, live links, repo layout, deploy, changelog, backup wording | README |
| canvas_icon.jpg, app/README.md | Deleted (old icon with pale corners; duplicate README) | Flatten |

Old (v1.1) emoji demo data is still removed automatically on load. Reinstall: not needed.
