# ContestPrep: free math contest practice

A static website (plain HTML, CSS, and JavaScript; no build step, no server, no accounts) for AMC 8, AMC 10, AMC 12, AIME, and proof-based olympiad practice, with an adaptive diagnostic that places you on a 100 to 1300 scale.

Progress is stored only in the visitor's browser (localStorage). There are no analytics, ads, or tracking.

## Run it locally

```bash
python -m http.server 8430
```

Then open <http://localhost:8430>. (Any static file server works. Opening `index.html` directly also works for most pages.)

## Put it online for free

It is just files, so any static host works:

- **Netlify:** go to app.netlify.com/drop and drag the `mathsite` folder onto the page.
- **Vercel:** `npx vercel` inside this folder, or import a GitHub repo of it.
- **GitHub Pages:** push this folder to a repo, then Settings, Pages, deploy from the `main` branch.

Before sharing widely, change the "Mistakes" line on the About page (`viewAbout` in `app.js`) to include a real contact email or form link.

## What is in here

| File | Purpose |
| --- | --- |
| `index.html`, `style.css` | Page shell and styles (light and dark mode, phone-friendly) |
| `app.js` | Home, tracks, problem pages, timed mock contests, spaced review, progress, roadmap, about |
| `problems.js` | Track definitions, topic names, first problems, and the `M(...)` helper for multiple choice |
| `problems_amc8.js`, `problems_amc10.js`, `problems_amc12.js` | Multiple-choice problems |
| `problems_aime.js`, `problems_olympiad.js` | AIME (integer answers 0 to 999) and proof problems |
| `diag_items.js` | Diagnostic bank: 13 levels x 100 generated items, with answer checking |
| `diag.js` | Adaptive test engine, results report, per-level practice pages |
| `config.js`, `telemetry.js` | Logging switch (off by default) and the opt-in anonymous logger |
| `collector/` | Free Google Sheets collector, plus a local test collector |
| `calibrate.js`, `calibration.json` | Refit difficulties from collected data; the loaded result |
| `verify*.js`, `simulate_diag.js` | Tests (see below) |

## Adding problems

Multiple choice (in `problems_amc10.js`, for example):

```js
M("a10-41", "amc10", "alg", 4, ["Vieta"],
  R`Question with $math$.`,
  ["1", "2", "3", "4", "5"], "3",                    // choices, then the correct choice's text
  [R`Hint 1`, R`Hint 2`, R`Hint 3`],                 // exactly three layered hints
  R`Full solution with $\boxed{3}$.`,
  R`Optional "watch out" note.`);
```

AIME problems use `A(id, topic, diff, tags, q, answer, hints, sol, mistakes)` with an integer 0 to 999 answer, and olympiad problems use `O(id, topic, diff, tags, q, hints, sol, mistakes)`. Write problems yourself or adapt ideas; **do not paste real AMC, AIME, or USAMO problems** (MAA copyright). Link to the official archives instead.

Use `\lt` instead of a bare `<` inside math.

## Tests

Run these from this folder with Node:

```bash
node verify.js         # bank structure, plus 40 multiple-choice answers recomputed by brute force
node verify_aime.js    # all 30 AIME answers recomputed by brute force
node verify_diag.js    # all 1300 diagnostic items: generate, answer parses, no duplicates
node verify_diag2.js   # 34 tricky diagnostic skills re-derived by an independent method
node simulate_diag.js  # Monte-Carlo accuracy of the adaptive engine (slow, several minutes)
node test_calibrate.js # calibration recovers hidden difficulty shifts and flags broken problems
```

Run `verify.js` and `verify_aime.js` after adding problems.

## Anonymous right/wrong logging (optional, off by default)

The site can collect anonymous results so the diagnostic's difficulty numbers can be refit from real students and broken problems can be spotted. **It ships turned off.** Nothing is sent, and no consent prompt appears, until you set `logEndpoint` in `config.js`. Even then, only visitors who click "Yes, share" are ever logged.

What a consenting visitor sends: a random session code (new for every diagnostic; for practice it lives only as long as the browser tab), problem ids, whether the **first** try was right, and hints used. Never names, accounts, emails, IP addresses, device details, or anything typed.

1. **Set up a collector** (free): follow `collector/README.md` (Google Sheet via Apps Script, about 5 minutes).
2. **Put its URL in `config.js`** and redeploy. Visitors now see a one-time opt-in card on the home and diagnostic pages, and a toggle on the About page.
3. **After a few hundred diagnostic sessions**, download the sheet as CSV and run:

   ```bash
   node calibrate.js responses.csv        # writes calibration.json and prints a report
   ```

   Redeploy with the new `calibration.json` next to `index.html`; the diagnostic loads it automatically. Items with fewer than 20 answers keep their design difficulty, and no item moves more than 150 points. The report also flags problems that stay unexplained after refitting (often a wrong answer key or ambiguous wording) and lists contest problems with the lowest first-try rates.

`node test_calibrate.js` checks the whole method on synthetic students (it recovers hidden difficulty shifts and catches planted broken problems).

If your visitors include children under 13, talk to a parent, teacher, or school before enabling logging. This is not legal advice; privacy rules (COPPA, GDPR, and others) can apply to anonymous data in some cases.

## Deploying updates

`index.html` loads scripts as `app.js?v=6` and so on. **Bump the `?v=` number whenever you change any script or style**, so browsers that cached the old files fetch the new ones.

## How the diagnostic works

Each question's difficulty `b` is the level it sits in plus how far through the band it is (0 to 99). After every answer the engine updates a probability distribution over the student's ability with an item-response model, then picks an unused item in the least-sampled subject near the current estimate. The report shows the score with a margin of error and a score per subject (with shrinkage toward the overall score).

**Calibration caveat:** the difficulty scale is set by design, not from student data. The reported margin of error is widened for that reason. To make the score a truly calibrated measure, collect anonymous right/wrong data per item from real students and refit the difficulties; the item ids (`L800-37`) are stable for that purpose.
