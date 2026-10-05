# Math Olympiad Centre: free math contest practice

A static website (plain HTML, CSS, and JavaScript; no build step, no server, no accounts) for AMC 8, AMC 10, AMC 12, AIME, and proof-based olympiad practice, with an adaptive diagnostic that places you on a 100 to 1300 scale.

Progress is stored only in the visitor's browser (localStorage). There are no analytics, ads, or tracking.

## Run it locally

```bash
python -m http.server 8430
```

Then open <http://localhost:8430>. (Any static file server works. Opening `index.html` directly also works for most pages.)

## Live site

**https://ganz-ethan.github.io/contestprep/** (GitHub Pages, served from the `main` branch root of <https://github.com/ganz-ethan/contestprep>).

To publish a change: edit, bump the `?v=` number in `index.html`, then

```bash
git add -A && git commit -m "describe the change" && git push
```

GitHub Pages rebuilds in under a minute. If `git push` asks for a username, run `gh auth setup-git` once (it lets git use your GitHub CLI login), then push again.

## Put it online for free

It is just files, so any static host works:

- **Netlify:** go to app.netlify.com/drop and drag the `mathsite` folder onto the page.
- **Vercel:** `npx vercel` inside this folder, or import a GitHub repo of it.
- **GitHub Pages:** push this folder to a repo, then Settings, Pages, deploy from the `main` branch.

The "Mistakes" line on the About page links to this repo's GitHub Issues page. Swap in an email or form link there if you prefer.

## What is in here

| File | Purpose |
| --- | --- |
| `index.html`, `style.css` | Page shell and styles (light and dark mode, phone-friendly) |
| `app.js` | Home, tracks, problem pages, timed mock contests, spaced review, progress, roadmap, about |
| `problems.js` | Track definitions, topic names, first problems, and the `M(...)` helper for multiple choice |
| `problems_amc8.js`, `problems_amc10.js`, `problems_amc12.js` | Multiple-choice problems |
| `problems_aime.js`, `problems_olympiad.js` | AIME (integer answers 0 to 999) and proof problems |
| `extra2_gen.txt`, `extra2_ck.txt`, `add_top_skills.js` | Source snippets used once to add skills (already merged into diag_items.js and verify_diag2.js). |
| `community.js`, `community/` | Accounts, friends and forum. Demo mode (this browser only) until a Supabase project is connected; see `community/README.md`. `node test_community.js` checks the real back end's requests. |
| `problems_more.js` | 26 more original AMC 8 / 10 / 12 problems, each answer recomputed in `verify.js`. |
| `sw.js` | Offline support (network first, falls back to the last copy). Progress page also has backup and restore buttons. |
| `diag_items.js` | Diagnostic and practice bank: 13 levels x 1,500 generated items (300 in each of 5 subjects) = 19,500, from 299 question types, with answer checking |
| `diag.js` | Adaptive test engine, results report, per-level practice pages |
| `config.js`, `telemetry.js` | Logging switch (off by default) and the opt-in anonymous logger |
| `collector/` | Free Google Sheets collector, plus a local test collector |
| `calibrate.js`, `calibration.json` | Refit difficulties from collected data; the loaded result |
| `verify*.js`, `report_distinct.js`, `mutation_test.js`, `test_calibrate.js`, `simulate_diag.js` | Tests and reports (see below) |

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
node verify_aime.js    # all 60 AIME answers recomputed by brute force
node verify_diag.js    # all 19,500 diagnostic items: generate, exact answers, valid ids, balanced subjects, no repeats
node verify_diag2.js   # ALL 299 diagnostic question types re-derived independently from the question text (fails if a type has no checker)
node mutation_test.js  # plants deliberate bugs and confirms verify_diag2.js catches every one
node report_distinct.js [--templates]  # how many distinct questions each level x subject really has
node print_skills.js [level]           # one sample question per question type, for reading the wording
node test_calibrate.js # calibration recovers hidden skill difficulties and flags broken skills (about a minute)
node simulate_diag.js  # Monte-Carlo accuracy of the adaptive engine (slow, several minutes)
```

Run `verify.js` and `verify_aime.js` after adding contest problems, and `verify_diag.js`, `verify_diag2.js`, and `mutation_test.js` after touching `diag_items.js`.

## The diagnostic and practice bank

Every level (100 to 1300) has **1,500 problems: 300 in each of five subjects** (arithmetic and sequences, algebra, geometry, counting and probability, number theory), listed easiest to hardest. Problems are generated from **299 question types** ("skills"); each problem's answer is computed from its own numbers, never typed. Item `L800-0037` is always the same problem.

Variety comes from three places: many distinct skills per level and subject, wide number ranges, and everyday contexts (names, objects) in word problems. 19,464 of the 19,500 questions are distinct; a few repeat where a skill's possible values run out. `report_distinct.js` shows where.

**Adding a question type:** in `diag_items.js`, add `T(level, "N|A|G|C|T", "Skill name", (r, t) => ({ q: "...", a: answer, s: "worked solution" }))`. Use `r.int`, `r.pick` for randomness and `sc(r, t, lo, hi)` for numbers that get larger as `t` (position in the level) grows. Then add an independent checker for it in `verify_diag2.js`; that script fails until every question type has one. Answers may be integers, decimals, or fractions `[n, d]`; keep numbers below about 10^12 so they print as plain integers.

## Anonymous right/wrong logging (optional, off by default)

The site can collect anonymous results so the diagnostic's difficulty numbers can be refit from real students and broken problems can be spotted. **It ships turned off.** Nothing is sent, and no consent prompt appears, until you set `logEndpoint` in `config.js`. Even then, only visitors who click "Yes, share" are ever logged.

What a consenting visitor sends: a random session code (new for every diagnostic; for practice it lives only as long as the browser tab), problem ids, whether the **first** try was right, and hints used. Never names, accounts, emails, IP addresses, device details, or anything typed.

1. **Set up a collector** (free): follow `collector/README.md` (Google Sheet via Apps Script, about 5 minutes).
2. **Put its URL in `config.js`** and redeploy. Visitors now see a one-time opt-in card on the home and diagnostic pages, and a toggle on the About page.
3. **After a few thousand diagnostic sessions**, download the sheet as CSV and run:

   ```bash
   node calibrate.js responses.csv        # writes calibration.json and prints a report
   ```

   Because the bank has 19,500 items, calibration fits **one difficulty shift per skill** (299 skills) rather than per item. A skill needs about 40 answers before it moves; skills with less data keep their design difficulty, and no skill moves more than 150 points. Redeploy with the new `calibration.json` next to `index.html`; the diagnostic loads it automatically. The report also flags **skills that look broken** (answers stay unexplained after refitting, often a wrong answer key or ambiguous wording), individual items that stay unexplained when enough data exists, and contest problems with the lowest first-try rates.

`node test_calibrate.js` checks the whole method on synthetic students: with 3,500 sessions it roughly halves the error in skill difficulty (39 to 19 points) and flags all planted broken skills with no false alarms.

If your visitors include children under 13, talk to a parent, teacher, or school before enabling logging. This is not legal advice; privacy rules (COPPA, GDPR, and others) can apply to anonymous data in some cases.

## Deploying updates

`index.html` loads scripts as `app.js?v=7` and so on. **Bump the `?v=` number whenever you change any script or style**, so browsers that cached the old files fetch the new ones.

## How the diagnostic works

Each question's difficulty `b` is the level it sits in plus how far through the band it is (0 to 99, rising smoothly across the level's 1,500 items). After every answer the engine updates a probability distribution over the student's ability with an item-response model, then picks an unused item in the least-sampled subject near the current estimate. The report shows the score with a margin of error and a score per subject (with shrinkage toward the overall score).

**Calibration caveat:** the difficulty scale is set by design, not from student data. The reported margin of error is widened for that reason. To make the score a truly calibrated measure, collect anonymous right/wrong data per item from real students and refit the difficulties; the item ids (`L800-0037`) are stable for that purpose.
