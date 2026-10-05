# Anonymous results collector

Logging is **off** until you do the steps below, and even then only visitors who click "Yes, share" are ever logged.

## What is collected

One row per problem a consenting visitor answered:

| column | meaning |
| --- | --- |
| `day` | the date the server received it (no time of day) |
| `kind` | `diag` (a finished diagnostic) or `prac` (practice problems) |
| `sid` | a random code, new for every diagnostic and for every browser tab session, not stored afterwards |
| `item` | problem id, such as `L800-0037` or `a10-12` |
| `ok` | 1 if the **first** try was correct, otherwise 0 |
| `hints` | hints used before that first try, 0 to 3 |

Not collected: names, emails, accounts (there are none), IP addresses, device or browser details, anything typed, or any persistent identifier. Do not add any of these to the collector.

If your audience includes children under 13, talk to a parent, teacher, or school before turning logging on, and keep the consent wording on the site as it is (it tells under-13s to ask a grown-up). This is not legal advice; rules such as COPPA (US) and GDPR (EU/UK) can apply even to anonymous data in some cases, so check with someone qualified if you will run this at scale or through a school.

## Option A: Google Sheet (free, no server)

1. Create a new Google Sheet (name it anything).
2. **Extensions > Apps Script.** Delete the sample code, paste in `apps_script.gs`, and save.
3. **Deploy > New deployment**, choose type **Web app**. Set *Execute as:* **Me** and *Who has access:* **Anyone**. Click Deploy and approve the permissions.
4. Copy the **Web app URL** (it ends in `/exec`).
5. Open `config.js` in the site and set `logEndpoint` to that URL. Re-deploy the site.
6. The first submission creates a `responses` tab. **File > Download > CSV** (that tab) gives you the data for `calibrate.js`.

Anyone who has your URL could post fake rows, so the script checks the shape of every row and caps batch size. It cannot stop a determined person from posting plausible junk; with a few hundred real students that noise is small, and `calibrate.js` shrinks toward the design values anyway.

## Option B: your own machine (testing, or a small group)

```bash
node collector/local_collector.js          # listens on http://localhost:8787/, writes collector/responses.csv
```

Set `logEndpoint` to `http://localhost:8787/` while testing. For real use the endpoint must be reachable over HTTPS from your visitors' browsers, so Option A is simpler.

## Using the data

```bash
node calibrate.js responses.csv            # writes calibration.json and prints a report
```

See the main README. Commit the new `calibration.json` next to `index.html` and redeploy; the diagnostic loads it automatically.
