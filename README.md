# Jannis Grimm portfolio

This repository contains the React and Vite source for iamjannisgrimm.com. The TARS story is in `src/components/featured/ProductStoryStack.jsx` and its styles are in `src/components/featured/FeaturedProjectsStory.css`.

## Development

- Run `npm ci` to install dependencies.
- Run `npm run dev` to open the local portfolio.
- Run `npm run lint` and `npm run check:tars-prompt-storm` to check the source.
- Run `npm run build` to build the site into `dist/`, then `npm run preview` to preview it.

GitHub Pages serves the separate `gh-pages` branch. Source changes are reviewed against `main`. The Publish portfolio workflow checks, builds and publishes each push to `main`, then requests a Pages rebuild. It also supports manual runs. Branch pushes used for draft PRs do not publish.

The page loads its quote, metrics and timeline before mounting React, as in `9859094` (September 1, 2026). This keeps the initial layout stable before GSAP measures pinned sections. The TARS story still ends at “Every task finds its agent.”

For an authorized manual release, run the checks above and `npm run deploy`, then verify the Pages deployment and live site. Recover a release by publishing the previously verified source revision again; do not rewrite the source history.
