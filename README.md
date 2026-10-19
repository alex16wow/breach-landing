# BREACH landing page

Static game landing page. No build or installation is required. Serve this repository with any static HTTP server, for example `python -m http.server 4173`, then open http://localhost:4173.

## Files

- `index.html`: page structure
- `style.css`: layout, responsive styles and visual effects
- `app.js`: content, pointer parallax and dialogs
- `motion.js`: scroll animations
- `assets/`: optimized images and seamless ping-pong hero video
- `vendor/`: locally bundled GSAP 3.13.0 and ScrollTrigger

The hero video combines forward and reversed footage into one continuous loop. Characters, objects and particles move in separate layers. Artifact cards assemble once and remain in their final positions when scrolling back up. Secondary card descriptions appear on hover, keyboard focus or tap. The pause control and reduced-motion preference disable animation.

Game download, full trailer, news and social destinations are concept placeholders. Replace their handlers in `app.js` when production URLs are available. Typography uses Google Fonts with system fallbacks.

This repository stores the landing page files. Website hosting is configured separately.
