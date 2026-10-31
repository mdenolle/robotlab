# RobotLab

RobotLab is Alex's second coding project, after [Algo](https://github.com/mdenolle/algo-app): a website and installable web app that helps a kid pick a robot to build, follow a step-by-step guide, and keep track of progress.

Live site: **https://mdenolle.github.io/robotlab/** (app: [app.html](https://mdenolle.github.io/robotlab/app.html)). Every push to `main` rebuilds and republishes it.

Alex started it on an iPad with ChatGPT; this repository is the cleaned-up export of that work.

## What it does

- Five starter projects: mini brush bot, doodle bot, desk buddy, obstacle explorer (rover), and track follower.
- Search and filters, plus typed or spoken ideas matched to the closest starter project by keyword. It does not invent new hardware designs.
- Parts lists, build steps, experiments, and a printable guide for each project.
- Build progress saved in the browser (`localStorage`), so it stays on the device where it was made.
- An Arduino Uno sketch for the desk buddy ([site/desk-buddy.ino](site/desk-buddy.ino)).
- A poster, a QR code for the live site, and "add to home screen" install with offline guides.

The rover and track follower use the chosen kit's own wiring and code; the site links to example projects instead of giving one universal wiring diagram.

## Run it on your computer

Needs Python 3.10+.

```sh
python -m venv .venv && source .venv/bin/activate
python -m pip install -r requirements.txt
python scripts/preview.py          # http://localhost:8000/  (app: /app.html)
```

`preview.py` builds `site/` into `public/` and serves it. Edit files in `site/`, never in `public/` (it is regenerated and git-ignored). To test on the iPad, run `python scripts/preview.py --host 0.0.0.0` and open `http://<laptop-name>.local:8000/` on the same Wi-Fi (offline install needs HTTPS, so test that on the live site).

```sh
python scripts/build.py --site-url https://mdenolle.github.io/robotlab   # build only
python scripts/check.py                                                  # link, image, manifest, ZIP checks
```

`build.py` copies `site/` to `public/`, generates the QR code for the site URL, gives the offline cache a new version name, and packages `robotlab-website.zip` for the download button. `check.py` does not replace testing in a browser or on a real robot.

## Folder map

- `site/`: the website and app source. [site/README.md](site/README.md) lists the files.
  - `index.html`: main page; `app.html`: the build app; `app.js`: projects, search, guides, saved progress.
  - `images/`: project illustrations and the hero picture.
  - `sw.js`, `install.js`, `manifest.webmanifest`: home-screen install and offline use.
- `scripts/`: Python build, preview, and check tools.
- `.github/workflows/pages.yml`: builds, checks, and deploys to GitHub Pages.

## Status

Tested in desktop and mobile browsers while it was hosted on ChatGPT. Not yet tested: installing on a real device from the GitHub Pages site, and building the robots themselves. The pictures are illustrations, so real builds will look different.

[site/research-notes.md](site/research-notes.md) lists the sources used to choose the five projects.
