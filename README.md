# Nagun Haridasan: portfolio

An interactive portfolio: a Three.js wall of molten **NAGUN** blocks (Fire theme only) with an AI-style UI layer on top.

Open `index.html` in a modern browser. Three.js and the fonts load from public CDNs (pinned version, SRI hash, locked down by a Content-Security-Policy).

## What's in it

- **Fire wall**: drag to orbit, scroll to shatter it, click to pulse; sound toggle top-right.
- **Assistant**: ask about the CV in the bar at the bottom. It is a small retrieval script that runs in the browser (no server, no API) and only answers from the CV.
- **Command menu**: `Ctrl K` / `Cmd K` (or `/` to ask).
- **Skills**: interactive constellation; hover a skill to see which projects used it.
- **Lab**: LLM memory budget calculator (llama.cpp flags), a parametric lampshade, a lip-to-speech pipeline animation.
- Panels are deep-linkable: `#/about`, `#/skills`, `#/projects`, `#/lab`, `#/contact`, `#/ask`.

## Editing

`index.html` is generated. Edit the sources in `src/` and run:

```
python build.py
```

| File | What |
|---|---|
| `src/engine.html` | the Three.js scene (Fire only, NAGUN, textures inline) |
| `src/portfolio.html / .css / .js` | the UI layer; the CV content lives at the top of `portfolio.js` |

Preview locally with `python -m http.server` and open `http://localhost:8000`.
