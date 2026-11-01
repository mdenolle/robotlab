# Editable website and app

This folder is the website source. Edit these files, then run the Python preview/build scripts from the repository root. GitHub Actions builds this folder into `public/` and publishes it with Pages.

- `index.html`: main website, projects, installation help, research, and downloads.
- `app.html`: dedicated robot-building app.
- `app.js`: search, keyword matching, instructions, and saved progress.
- `discover.js`: “Discover your robot” form; ranks the five robots against what the builder wants and has.
- `print.js`: “3D print it” tool. Turns a photo or screenshot of a drawing into a printable STL (raised plate, cut-out shape, or plate with holes), all in the browser.
- `feedback.js`: “Tell us what you think” form. Set `FEEDBACK_ENDPOINT` or `FEEDBACK_EMAIL` at the top to choose where answers go.
- `gallery.js`: robot picture dialogs and buttons opening build guides.
- `polish.css`: visual design and responsive layouts.
- `images/`: robot photos (with credits in its README) and hero art.
- `install.js`, `manifest.webmanifest`, `sw.js`: home-screen install and offline features.
- `icon*`: website/app icons.
- `desk-buddy.ino`: Arduino sketch for the desk-buddy build.
- `robotlab-poster.jpg`: Alex's sketch-inspired poster.
- `robotlab-qr.png`: source QR image; the build regenerates it for the actual website URL.
- `research-notes.md`: project-selection sources.

The build adds `robotlab-website.zip` to the output. Keep this source folder free of credentials. Read the repository's main README for setup and GitHub instructions.

## Using just the downloaded website folder

If you downloaded the website ZIP instead of cloning the full development repository, open a terminal in its `RobotLab/` folder and run `python -m http.server 8000`. Open http://localhost:8000/. The development scripts and GitHub workflow live in the repository: https://github.com/mdenolle/robotlab
