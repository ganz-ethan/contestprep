(() => {
  const $app = document.getElementById("app");
  const KEY = "contestprep.v1";

  // ---------- storage (browser only, no accounts) ----------
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} };
  const S = Object.assign({ attempts: {}, streak: { last: null, n: 0 } }, load());

  const byId = Object.fromEntries(PROBLEMS.map(p => [p.id, p]));
  const inTrack = t => PROBLEMS.filter(p => p.track === t);
  const dayKey = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  function touchStreak() {
    const now = new Date(), today = dayKey(now);
    if (S.streak.last === today) return;
    const y = new Date(now); y.setDate(y.getDate() - 1);
    S.streak.n = S.streak.last === dayKey(y) ? S.streak.n + 1 : 1;
    S.streak.last = today;
  }
  function record(id, { correct, hints = 0 }) {
    const a = S.attempts[id] || { tries: 0, solved: false, firstTry: null, hints: 0 };
    a.tries++;
    if (a.firstTry === null) a.firstTry = correct && hints === 0;
    a.hints = Math.max(a.hints, hints);
    if (correct && !a.solved) { a.solved = true; touchStreak(); }
    // Spaced review: a problem that gave trouble (wrong answer, or 2+ hints) comes back after 1, 3, 7, 14, 30 days.
    const now = Date.now();
    if (!correct) { a.review = true; a.box = 0; a.next = now + STEPS[0] * DAY; }
    else if (a.review) {
      if ((a.box || 0) >= STEPS.length - 1) { a.review = false; delete a.next; } // graduated
      else { a.box = (a.box || 0) + 1; a.next = now + STEPS[a.box] * DAY; }
    } else if (hints >= 2) { a.review = true; a.box = 0; a.next = now + STEPS[0] * DAY; }
    S.attempts[id] = a;
    persist();
    if (window.Telemetry) Telemetry.item(id, correct, hints); // anonymous, opt-in, first attempt only (no-op unless enabled)
  }
  const DAY = 86400000, STEPS = [1, 3, 7, 14, 30];
  const dueForReview = () => PROBLEMS.filter(p => { const a = S.attempts[p.id]; return a && a.review && a.next <= Date.now(); });
  const solvedCount = list => list.filter(p => S.attempts[p.id]?.solved).length;

  // ---------- helpers ----------
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fmt = s => s.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\n\n/g, "<br><br>");
  const pill = t => `<span class="pill">${esc(t)}</span>`;
  const bar = (n, d) => `<div class="bar"><i style="width:${d ? Math.round(100 * n / d) : 0}%"></i></div>`;
  const stars = d => `Difficulty ${d}/10`;
  let timerId = null;

  function show(html) {
    $app.innerHTML = html;
    if (window.renderMathInElement) {
      renderMathInElement($app, {
        delimiters: [{ left: "$$", right: "$$", display: true }, { left: "$", right: "$", display: false }],
        throwOnError: false,
      });
    }
    document.querySelectorAll("[data-share]").forEach(b => { b.onclick = () => { S.share = b.dataset.share === "1"; persist(); route(); }; });
  }

  // ---------- anonymous-data consent (only shown when a collector is configured in config.js) ----------
  function shareCard() {
    if (!(window.Telemetry && Telemetry.configured()) || S.share !== undefined) return "";
    return `<div class="card" style="margin:12px 0;border-color:var(--accent)">
      <b>Help make this site more accurate?</b>
      <p style="margin:6px 0 10px">You can share which problems you got right or wrong. It is <b>anonymous</b>: no name, no account, no email, nothing about you or your device, and it is not linked to you or to any other visit. It is used only to fix problem difficulty and spot mistakes. If you are under 13, ask a parent or teacher first. You can change your mind any time on the <a href="#/about">About page</a>.</p>
      <button class="btn small" data-share="1">Yes, share</button> <button class="btn small ghost" data-share="0">No thanks</button></div>`;
  }

  // ---------- router ----------
  function route() {
    clearInterval(timerId);
    const [, page, arg] = location.hash.split("/");
    if (page === "track") return viewTrack(arg);
    if (page === "problem") return viewProblem(arg);
    if (page === "mock") return viewMock(arg);
    if (page === "roadmap") return viewRoadmap();
    if (page === "progress") return viewProgress();
    if (page === "review") return viewReview();
    if (page === "about") return viewAbout();
    if ((page === "diag" || page === "level" || page === "print") && window.DiagUI) return window.DiagUI.route(page, arg, location.hash.split("/")[3]);
    return viewHome();
  }
  // shared helpers for other modules (diag.js)
  window.CP = { show, esc, fmt, pill, bar, S, persist, touchStreak, dayKey, shareCard };
  window.addEventListener("hashchange", () => { route(); window.scrollTo(0, 0); });
  window.addEventListener("load", route);
  if (document.readyState === "complete") route();

  // ---------- home ----------
  function viewHome() {
    const cards = Object.entries(TRACKS).map(([k, t]) => {
      const list = inTrack(k), n = solvedCount(list);
      return `<a class="card" href="#/track/${k}"><h3>${esc(t.name)}</h3><p>${esc(t.blurb)}</p>
        <p style="margin-top:8px">${n} / ${list.length} solved</p>${bar(n, list.length)}</a>`;
    }).join("");
    const pool = PROBLEMS.filter(p => p.track !== "olympiad");
    const daily = pool[Math.floor(Date.now() / 86400000) % pool.length];
    const doneToday = S.streak.last === dayKey(new Date());
    show(`
      <h1>Get better at contest math. Free.</h1>
      <p class="sub">From AMC 8 up to USAMO and MOP. Layered hints, multiple solution ideas, timed mock contests. No account needed.</p>
      <div class="card" style="margin:16px 0;border-color:var(--accent)">
        <h3>Find your real level</h3>
        <p style="margin:4px 0 10px">An adaptive diagnostic (up to 50 questions) that scores you from 100 (Kindergarten) to 1300 (AIME) and shows your strongest subject.</p>
        <a class="btn" href="#/diag">Take the diagnostic</a>
        <a class="btn ghost" href="#/level/700" style="margin-left:6px">Browse levels</a>
      </div>
      <div class="card" style="margin:16px 0">
        <div class="row" style="justify-content:space-between">
          <div><b>Problem of the day</b> ${pill(TRACKS[daily.track].name)} ${pill(TOPICS[daily.topic])}</div>
          <div>🔥 Streak: <b>${S.streak.n}</b> day${S.streak.n === 1 ? "" : "s"} ${doneToday ? "(done today)" : ""}</div>
        </div>
        <p style="margin:8px 0 12px;color:var(--ink)">${fmt(daily.q)}</p>
        <a class="btn" href="#/problem/${daily.id}">Solve it</a>
      </div>
      ${(() => { const due = dueForReview().length, lastD = S.diag && S.diag.history && S.diag.history[S.diag.history.length - 1];
        return (lastD ? `<div class="card" style="margin-bottom:12px"><b>Your level: ${lastD.score}</b> <span class="sub">(± ${lastD.se})</span>
            <a class="btn small ghost" style="margin-left:8px" href="#/diag/result">Report</a>
            <a class="btn small ghost" href="#/level/${Math.max(100, Math.min(1300, Math.floor(lastD.score / 100) * 100))}">Practice your level</a></div>` : "") +
          (due ? `<div class="card" style="margin-bottom:12px"><b>${due} problem${due === 1 ? "" : "s"} ready to review</b> <a class="btn small" style="margin-left:8px" href="#/review">Review now</a></div>` : ""); })()}
      ${shareCard()}
      <h2>Choose a track</h2>
      <div class="grid">${cards}</div>
      <h2>Not sure where to start?</h2>
      <p>Read the <a href="#/roadmap">roadmap</a>. It tells you which track fits your level and what to study next.</p>`);
  }

  // ---------- track ----------
  let topicFilter = "all";
  function viewTrack(k) {
    const t = TRACKS[k];
    if (!t) return viewHome();
    const all = inTrack(k);
    const topics = [...new Set(all.map(p => p.topic))];
    const list = topicFilter === "all" ? all : all.filter(p => p.topic === topicFilter);
    const mock = t.contest && all.length
      ? `<a class="btn" href="#/mock/${k}">Take a timed mock contest</a>` : "";
    show(`
      <div class="crumbs"><a href="#/">Home</a> / ${esc(t.name)}</div>
      <h1>${esc(t.name)}</h1>
      <p class="sub">${esc(t.blurb)}</p>
      <div class="row" style="margin:10px 0">${mock}</div>
      <div class="row" id="filters" style="margin:12px 0">
        <button class="btn small ${topicFilter === "all" ? "" : "ghost"}" data-t="all">All topics</button>
        ${topics.map(x => `<button class="btn small ${topicFilter === x ? "" : "ghost"}" data-t="${x}">${esc(TOPICS[x])}</button>`).join("")}
      </div>
      <div class="list">${list.map(p => `
        <a href="#/problem/${p.id}"><span>${S.attempts[p.id]?.solved ? '<span class="done">✓</span> ' : ""}${esc(TOPICS[p.topic])}: ${p.tags.map(esc).join(", ")}</span>
        <span style="color:var(--muted)">${stars(p.diff)}</span></a>`).join("")}</div>
      ${all.length < 10 ? `<p class="note">This track is still growing. More original problems are added regularly.</p>` : ""}`);
    document.getElementById("filters").onclick = e => {
      const b = e.target.closest("button"); if (!b) return;
      topicFilter = b.dataset.t; viewTrack(k);
    };
  }

  // ---------- single problem ----------
  function viewProblem(id) {
    const p = byId[id];
    if (!p) return viewHome();
    const t = TRACKS[p.track];
    const sibs = inTrack(p.track), i = sibs.indexOf(p);
    const prev = sibs[i - 1], next = sibs[i + 1];
    let hintsShown = 0, finished = false, picked = null;

    const answerArea = p.type === "proof" || p.track === "olympiad" ? "" :
      p.choices
        ? `<div class="choices" id="choices">${p.choices.map((c, j) =>
            `<button class="choice" data-l="${"ABCDE"[j]}"><b>(${"ABCDE"[j]})</b> ${esc(c)}</button>`).join("")}</div>`
        : `<div class="row" style="margin:14px 0"><input id="ans" type="number" min="0" max="999" placeholder="0–999" inputmode="numeric">
             <button class="btn" id="check">Check</button></div>`;

    show(`
      <div class="crumbs"><a href="#/">Home</a> / <a href="#/track/${p.track}">${esc(t.name)}</a></div>
      <div>${pill(t.name)}${pill(TOPICS[p.topic])}${p.tags.map(pill).join("")} <span style="color:var(--muted);font-size:.85rem">${stars(p.diff)}</span></div>
      <div class="problem">${fmt(p.q)}</div>
      ${answerArea}
      <div id="msg"></div>
      <div id="hints"></div>
      <div class="row" style="margin:12px 0">
        <button class="btn ghost" id="hintbtn">Hint 1 of ${p.hints.length}</button>
        <button class="btn ghost" id="solbtn">${p.track === "olympiad" ? "Show solution sketch" : "Show solution"}</button>
      </div>
      <div id="sol"></div>
      <div class="row" style="justify-content:space-between;margin-top:20px">
        <span>${prev ? `<a href="#/problem/${prev.id}">← Previous</a>` : ""}</span>
        <span>${next ? `<a href="#/problem/${next.id}">Next →</a>` : ""}</span>
      </div>`);

    const msg = document.getElementById("msg");
    const reveal = () => {
      document.getElementById("sol").innerHTML = `<div class="solution"><b>Solution.</b><br>${fmt(p.sol)}
        ${p.mistakes ? `<p><b>Watch out:</b> ${fmt(p.mistakes)}</p>` : ""}</div>`;
      if (window.renderMathInElement) renderMathInElement(document.getElementById("sol"), {
        delimiters: [{ left: "$$", right: "$$", display: true }, { left: "$", right: "$", display: false }], throwOnError: false });
      if (p.track === "olympiad" && !finished) {
        document.getElementById("sol").insertAdjacentHTML("beforeend", `
          <p>Honest check: could you have written a complete, rigorous proof?</p>
          <div class="row"><button class="btn small" data-g="1">Yes, I proved it</button>
          <button class="btn small ghost" data-g="0">Not yet</button></div>`);
        document.getElementById("sol").onclick = e => {
          const b = e.target.closest("[data-g]"); if (!b) return;
          finished = true; record(id, { correct: b.dataset.g === "1", hints: hintsShown });
          msg.innerHTML = b.dataset.g === "1" ? `<p class="msg-good">Marked solved.</p>` :
            `<p>Fine. Come back in a few days and try again without the sketch.</p>`;
        };
      }
    };

    const onCorrect = () => {
      finished = true;
      msg.innerHTML = `<p class="msg-good">Correct!</p>`;
      reveal();
    };
    const onWrong = () => { msg.innerHTML = `<p class="msg-bad">Not quite. Try again, or use a hint.</p>`; };

    if (p.choices) {
      document.getElementById("choices").onclick = e => {
        const b = e.target.closest(".choice"); if (!b || finished) return;
        picked = b.dataset.l;
        const ok = picked === p.answer;
        record(id, { correct: ok, hints: hintsShown });
        b.classList.add(ok ? "right" : "wrong");
        ok ? onCorrect() : onWrong();
      };
    } else if (p.answer !== undefined) {
      const check = () => {
        if (finished) return;
        const raw = document.getElementById("ans").value.trim();
        if (!/^\d+$/.test(raw)) { msg.innerHTML = `<p class="msg-bad">Enter an integer from 0 to 999.</p>`; return; }
        const ok = parseInt(raw, 10) === p.answer;
        record(id, { correct: ok, hints: hintsShown });
        ok ? onCorrect() : onWrong();
      };
      document.getElementById("check").onclick = check;
      document.getElementById("ans").onkeydown = e => { if (e.key === "Enter") check(); };
    }

    const hb = document.getElementById("hintbtn");
    hb.onclick = () => {
      if (hintsShown >= p.hints.length) return;
      document.getElementById("hints").insertAdjacentHTML("beforeend",
        `<div class="hint"><b>Hint ${hintsShown + 1}.</b> ${fmt(p.hints[hintsShown])}</div>`);
      hintsShown++;
      hb.textContent = hintsShown >= p.hints.length ? "No more hints" : `Hint ${hintsShown + 1} of ${p.hints.length}`;
      hb.disabled = hintsShown >= p.hints.length;
      renderMathInElement(document.getElementById("hints"), {
        delimiters: [{ left: "$$", right: "$$", display: true }, { left: "$", right: "$", display: false }], throwOnError: false });
    };
    document.getElementById("solbtn").onclick = reveal;
  }

  // ---------- mock contest ----------
  let mock = null; // { track, items, answers, cur, endAt, done }
  const ordinal = i => i + 1;

  function viewMock(k) {
    const t = TRACKS[k];
    if (!t || !t.contest) return viewHome();
    if (mock && mock.track === k) return mock.done ? mockResults() : mockRun();
    const items = inTrack(k);
    const c = t.contest, n = Math.min(items.length, c.n);
    const minutes = Math.max(1, Math.round(c.minutes * n / c.n));
    show(`
      <div class="crumbs"><a href="#/">Home</a> / <a href="#/track/${k}">${esc(t.name)}</a> / Mock contest</div>
      <h1>${esc(t.name)} mock contest</h1>
      <div class="card">
        <p><b>${n} problems, ${minutes} minutes</b> ${n < c.n ? `(the real contest has ${c.n} problems and ${c.minutes} minutes; this is scaled to the problems we have so far)` : ""}</p>
        <p><b>Scoring:</b> ${c.correct} per correct${c.blank ? `, ${c.blank} per blank` : ""}${c.wrong ? `, ${c.wrong} per wrong` : ", 0 for wrong or blank"}.
        ${c.blank ? "Leaving a question blank is worth more than a wrong guess, so skip when you have no idea." : ""}</p>
        <p>No hints or solutions until you finish. Calculators are not allowed on the real contest, so do not use one.</p>
        <button class="btn" id="go">Start the clock</button>
      </div>`);
    document.getElementById("go").onclick = () => {
      // sample n problems, ordered easy -> hard like a real contest
      const pick = [...items].sort(() => Math.random() - 0.5).slice(0, n).sort((a, b) => a.diff - b.diff);
      mock = { track: k, items: pick, answers: {}, cur: 0, endAt: Date.now() + minutes * 60000, done: false };
      mockRun();
    };
  }

  function fmtTime(ms) {
    const s = Math.max(0, Math.ceil(ms / 1000));
    return `${Math.floor(s / 3600) ? Math.floor(s / 3600) + ":" : ""}${String(Math.floor(s / 60) % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  }

  function mockRun() {
    const m = mock, p = m.items[m.cur], t = TRACKS[m.track];
    clearInterval(timerId);
    const cur = m.answers[p.id] ?? "";
    show(`
      <div class="row" style="justify-content:space-between">
        <h1 style="margin:0">Question ${ordinal(m.cur)} of ${m.items.length}</h1>
        <span class="timer" id="timer">${fmtTime(m.endAt - Date.now())}</span>
      </div>
      <div class="qnav">${m.items.map((q, i) =>
        `<button data-i="${i}" class="${i === m.cur ? "cur" : ""} ${m.answers[q.id] ? "ans" : ""}">${i + 1}</button>`).join("")}</div>
      <div class="problem">${fmt(p.q)}</div>
      ${p.choices
        ? `<div class="choices">${p.choices.map((c, j) => { const l = "ABCDE"[j];
            return `<button class="choice ${cur === l ? "sel" : ""}" data-l="${l}"><b>(${l})</b> ${esc(c)}</button>`; }).join("")}</div>`
        : `<div class="row" style="margin:14px 0"><input id="ans" type="number" min="0" max="999" value="${esc(cur)}" placeholder="0–999" inputmode="numeric"></div>`}
      <div class="row">
        <button class="btn ghost" id="clear">Clear answer</button>
        <button class="btn ghost" id="prev" ${m.cur === 0 ? "disabled" : ""}>← Prev</button>
        <button class="btn ghost" id="next" ${m.cur === m.items.length - 1 ? "disabled" : ""}>Next →</button>
        <span style="flex:1"></span>
        <button class="btn" id="finish">Finish &amp; score</button>
      </div>`);

    const tick = () => {
      const left = m.endAt - Date.now(), el = document.getElementById("timer");
      if (!el) return;
      el.textContent = fmtTime(left);
      el.classList.toggle("low", left < 5 * 60000);
      if (left <= 0) finishMock();
    };
    timerId = setInterval(tick, 1000);
    const go = i => { m.cur = i; mockRun(); };
    document.querySelector(".qnav").onclick = e => { const b = e.target.closest("button"); if (b) go(+b.dataset.i); };
    document.getElementById("prev").onclick = () => go(m.cur - 1);
    document.getElementById("next").onclick = () => go(m.cur + 1);
    document.getElementById("clear").onclick = () => { delete m.answers[p.id]; mockRun(); };
    document.getElementById("finish").onclick = () => {
      const blanks = m.items.filter(q => !m.answers[q.id]).length;
      if (confirm(blanks ? `${blanks} question(s) are blank. Finish anyway?` : "Finish and score?")) finishMock();
    };
    if (p.choices) {
      document.querySelector(".choices").onclick = e => {
        const b = e.target.closest(".choice"); if (!b) return;
        m.answers[p.id] = m.answers[p.id] === b.dataset.l ? "" : b.dataset.l; // click again to unselect
        mockRun();
      };
    } else {
      document.getElementById("ans").oninput = e => { m.answers[p.id] = e.target.value.trim(); };
    }
  }

  function finishMock() {
    clearInterval(timerId);
    mock.done = true;
    mock.items.forEach(p => {
      const a = mock.answers[p.id];
      if (a) record(p.id, { correct: String(a) === String(p.answer), hints: 0 });
    });
    mockResults();
  }

  function mockResults() {
    const m = mock, c = TRACKS[m.track].contest;
    let right = 0, blank = 0, wrong = 0;
    const rows = m.items.map((p, i) => {
      const a = m.answers[p.id];
      const ok = a && String(a) === String(p.answer);
      if (!a) blank++; else if (ok) right++; else wrong++;
      return `<tr><td><a href="#/problem/${p.id}">${i + 1}</a></td><td>${a ? esc(a) : "—"}</td><td>${esc(p.answer)}</td>
        <td>${!a ? "blank" : ok ? '<span class="done">✓</span>' : '<span class="msg-bad">✗</span>'}</td></tr>`;
    }).join("");
    const score = right * c.correct + blank * c.blank + wrong * c.wrong;
    const max = m.items.length * c.correct;
    show(`
      <div class="crumbs"><a href="#/">Home</a> / <a href="#/track/${m.track}">${esc(TRACKS[m.track].name)}</a> / Results</div>
      <h1>Score: ${score} / ${max}</h1>
      <p class="sub">${right} correct, ${wrong} wrong, ${blank} blank.</p>
      <table class="t"><tr><th>#</th><th>Your answer</th><th>Correct</th><th></th></tr>${rows}</table>
      <p>Click a question number to review the hints and solution.</p>
      <div class="row"><button class="btn" id="again">Take it again</button></div>`);
    document.getElementById("again").onclick = () => { mock = null; viewMock(m.track); };
  }

  // ---------- progress ----------
  function viewProgress() {
    const rows = Object.entries(TOPICS).map(([k, name]) => {
      const list = PROBLEMS.filter(p => p.topic === k);
      const att = list.filter(p => S.attempts[p.id]);
      const ft = att.filter(p => S.attempts[p.id].firstTry).length;
      return `<tr><td>${esc(name)}</td><td>${solvedCount(list)} / ${list.length}</td>
        <td>${att.length ? Math.round(100 * ft / att.length) + "%" : "—"}</td><td style="width:35%">${bar(solvedCount(list), list.length)}</td></tr>`;
    }).join("");
    const weak = Object.entries(TOPICS).map(([k, name]) => {
      const att = PROBLEMS.filter(p => p.topic === k && S.attempts[p.id]);
      return att.length >= 2 ? { name, acc: att.filter(p => S.attempts[p.id].firstTry).length / att.length } : null;
    }).filter(Boolean).sort((a, b) => a.acc - b.acc)[0];
    show(`
      <h1>My progress</h1>
      <p class="sub">Saved only in this browser. Clearing site data erases it.</p>
      <p>🔥 Current streak: <b>${S.streak.n}</b> day${S.streak.n === 1 ? "" : "s"}</p>
      ${weak ? `<p class="note">Your weakest topic right now is <b>${esc(weak.name)}</b> (${Math.round(weak.acc * 100)}% first-try accuracy). Practice more of it.</p>` : ""}
      <table class="t"><tr><th>Topic</th><th>Solved</th><th>First-try (no hints)</th><th></th></tr>${rows}</table>
      <p style="margin-top:24px"><button class="btn ghost small" id="backup">Download backup</button>
        <button class="btn ghost small" id="restore">Restore from backup</button>
        <input type="file" id="restoreFile" accept="application/json,.json" hidden aria-label="Backup file">
        <button class="btn ghost small" id="reset">Reset all progress</button></p>
      <p class="sub" id="backupMsg" role="status"></p>`);
    document.getElementById("backup").onclick = () => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([JSON.stringify(S)], { type: "application/json" }));
      a.download = "contestprep-backup-" + dayKey(new Date()) + ".json"; a.click(); URL.revokeObjectURL(a.href);
    };
    document.getElementById("restore").onclick = () => document.getElementById("restoreFile").click();
    document.getElementById("restoreFile").onchange = ev => {
      const f = ev.target.files[0], msg = document.getElementById("backupMsg"); if (!f) return;
      const rd = new FileReader();
      rd.onload = () => {
        try {
          const d = JSON.parse(rd.result);
          if (!d || typeof d !== "object" || Array.isArray(d) || typeof d.attempts !== "object" || !d.attempts) throw 0;
          if (!confirm("Replace the progress in this browser with this backup?")) return;
          for (const k of Object.keys(S)) delete S[k];
          Object.assign(S, { attempts: {}, streak: { last: null, n: 0 } }, d); persist(); location.reload();
        } catch { msg.textContent = "That file is not a Pi Gym backup."; }
      };
      rd.readAsText(f);
    };
    document.getElementById("reset").onclick = () => {
      if (confirm("Erase all progress in this browser?")) {
        S.attempts = {}; S.streak = { last: null, n: 0 }; persist(); viewProgress();
      }
    };
  }

  // ---------- spaced review ----------
  function viewReview() {
    const due = dueForReview();
    const later = PROBLEMS.filter(p => { const a = S.attempts[p.id]; return a && a.review && a.next > Date.now(); })
      .sort((a, b) => S.attempts[a.id].next - S.attempts[b.id].next);
    const when = t => { const d = Math.ceil((t - Date.now()) / DAY); return d <= 1 ? "tomorrow" : `in ${d} days`; };
    show(`
      <h1>Review</h1>
      <p class="sub">Problems you missed, or needed several hints for, come back after 1, 3, 7, 14, and 30 days. Solving one cleanly moves it to the next gap. Cramming does not stick; spacing does.</p>
      <h2>Ready now (${due.length})</h2>
      ${due.length ? `<div class="list">${due.map(p => `<a href="#/problem/${p.id}"><span>${esc(TRACKS[p.track].name)}: ${esc(TOPICS[p.topic])}, ${p.tags.map(esc).join(", ")}</span><span style="color:var(--muted)">${stars(p.diff)}</span></a>`).join("")}</div>`
        : `<p class="note">Nothing is due. Do some problems in a <a href="#/">track</a>; the ones you miss will show up here.</p>`}
      ${later.length ? `<h2>Coming up (${later.length})</h2><div class="list">${later.slice(0, 12).map(p => `<a href="#/problem/${p.id}"><span>${esc(TRACKS[p.track].name)}: ${p.tags.map(esc).join(", ")}</span><span style="color:var(--muted)">${when(S.attempts[p.id].next)}</span></a>`).join("")}</div>` : ""}`);
  }

  // ---------- about / privacy ----------
  function viewAbout() {
    show(`
      <h1>About, privacy, and sources</h1>
      <h2>What this is</h2>
      <p>A free, no-account practice site for math contests: AMC 8, AMC 10, AMC 12, AIME, and proof-based olympiads (USAJMO, USAMO, USCMO, MOP). It also has an adaptive diagnostic that places you on a 100 to 1300 scale, with 1,500 practice problems at every level (300 in each of five subjects).</p>
      <h2>Privacy: nothing leaves your device</h2>
      <ul>
        <li>There are <b>no accounts, no sign-ups, and no passwords</b>.</li>
        <li>Your progress, streak, diagnostic history, and review schedule are stored <b>only in this browser</b> (localStorage). We never receive them. Clearing your browser data erases them.</li>
        <li>The site has <b>no analytics, no ads, and no tracking cookies</b>, and it asks for no personal information. That is deliberate: many users are under 13, and collecting almost nothing keeps them safe.</li>
        <li>The only outside requests are to a CDN for the math-rendering library (KaTeX) and fonts, plus the optional anonymous sharing described below (only if you choose it).</li>
      </ul>
      <h2>Optional: share anonymous right/wrong results</h2>
      ${(() => {
        if (!(window.Telemetry && Telemetry.configured())) return `<p class="note">This copy of the site is <b>not collecting any data</b>. Nothing is sent anywhere.</p>`;
        return `<p>If you choose to share, the site sends only: a <b>random code</b> that is not stored on your device after you close the tab (a new one is made for every diagnostic), the <b>problem numbers</b> you answered, whether your <b>first try</b> was right or wrong, and how many <b>hints</b> you used. It never sends your name, any account (there are none), email, IP address, device details, or what you typed. We use it only to make problem difficulty and the diagnostic score more accurate, and to find mistakes in problems. If you are under 13, ask a parent or teacher before turning this on.</p>
          <p><b>Status:</b> sharing is <b>${S.share === true ? "ON" : "OFF"}</b>. ${S.share === true ? `<button class="btn small ghost" data-share="0">Turn off</button>` : `<button class="btn small" data-share="1">Turn on</button>`}</p>`; })()}
      <h2>Problems and copyright</h2>
      <p>Every problem here is <b>original</b>, written in the style of each contest, and every numeric answer is checked by computer. We do not copy real contest problems: AMC, AIME, and USAMO problems belong to the Mathematical Association of America (MAA). The <a href="#/roadmap">roadmap</a> links to the official archives. "AMC", "AIME", and "USAMO" are trademarks of the MAA; this site is not affiliated with or endorsed by the MAA.</p>
      <h2>About the diagnostic score</h2>
      <p>The 100 to 1300 scale comes from the difficulty built into this site's problems, not from a national sample of students, so read it as a precise relative measure rather than an official grade equivalent. Every report shows its margin of error. As real students use it, the difficulty numbers can be recalibrated.</p>
      <h2>Mistakes</h2>
      <p>Found a wrong answer or an unclear problem? Please <a href="https://github.com/ganz-ethan/contestprep/issues/new" target="_blank" rel="noopener">report it on GitHub</a> (a free GitHub account is needed) and include the problem number shown in the page address.</p>`);
  }

  // ---------- roadmap ----------
  function viewRoadmap() {
    show(`
      <h1>Roadmap</h1>
      <p class="sub">Which track fits you, and what to study to move up. Check <a href="https://maa.org/math-competitions" target="_blank" rel="noopener">maa.org</a> for current dates, eligibility, and registration.</p>

      <h2>The ladder</h2>
      <div class="card"><b>AMC 8 → AMC 10 → AMC 12 → AIME → USAJMO / USAMO → MOP</b>
        <p style="margin-top:6px">AIME qualification is by AMC 10/12 score cutoffs (these change each year). USAJMO/USAMO qualification is by AMC + AIME index. MOP is the summer training program for top USAMO performers. Always confirm the current rules with the MAA.</p></div>

      <h2>Where to start</h2>
      <table class="t">
        <tr><th>If you are...</th><th>Do this</th></tr>
        <tr><td>Comfortable with school math, new to contests</td><td>AMC 8 track. Finish it, then redo missed problems after a few days.</td></tr>
        <tr><td>Scoring 15+ on AMC 8 or in Algebra 1/Geometry</td><td>AMC 10 track, then timed mocks.</td></tr>
        <tr><td>Scoring 100+ on AMC 10, or precalc-ready</td><td>AMC 12 track, then AIME.</td></tr>
        <tr><td>Solving several AIME problems</td><td>Olympiad track. Learn to write proofs; do not just get answers.</td></tr>
      </table>

      <h2>Topics to master, in order</h2>
      <ol>
        <li><b>Algebra:</b> linear and quadratic equations, Vieta, factoring tricks (SFFT), logs, sequences, polynomials.</li>
        <li><b>Counting &amp; probability:</b> multiplication principle, permutations, combinations, complementary counting, inclusion-exclusion, recursion, expected value.</li>
        <li><b>Number theory:</b> divisors, gcd/lcm, modular arithmetic, CRT, Euler/Fermat, orders, Diophantine equations.</li>
        <li><b>Geometry:</b> similar triangles, areas, circles, power of a point, trig, coordinates, then mass points, inversion, projective ideas for olympiads.</li>
        <li><b>Inequalities:</b> AM-GM, Cauchy-Schwarz, rearrangement, Jensen, SOS.</li>
        <li><b>Olympiad combinatorics:</b> pigeonhole, invariants and monovariants, extremal principle, graph theory, induction.</li>
      </ol>

      <h2>Contest strategy</h2>
      <ul>
        <li><b>AMC 10/12:</b> blank is +1.5, wrong is 0. Guess only if you can eliminate answers and have a real reason to. Do the first 10–15 problems accurately, then spend your time where it pays.</li>
        <li><b>AIME:</b> there is no penalty and no choices. Always write something down. Sanity-check that your answer is an integer from 0 to 999.</li>
        <li><b>Proofs:</b> write for a skeptical grader. State the claim, prove every step, handle edge cases, and say where you use each hypothesis. A correct idea with gaps earns partial credit; a correct answer with no proof earns very little.</li>
        <li><b>Review:</b> redo every missed problem after 3 days and again after 2 weeks. Write down the idea you missed in one sentence.</li>
      </ul>

      <h2>A typical contest year</h2>
      <p class="sub">Approximate. The MAA sets exact dates, eligibility, and registration each year, so always confirm on <a href="https://maa.org/math-competitions" target="_blank" rel="noopener">maa.org</a> or with your school's coordinator.</p>
      <table class="t">
        <tr><th>When (usually)</th><th>What</th></tr>
        <tr><td>Fall (about November)</td><td>AMC 10 and AMC 12, in a main and an alternate session. Your school registers you.</td></tr>
        <tr><td>Winter (about January)</td><td>AMC 8.</td></tr>
        <tr><td>Winter (about February)</td><td>AIME, by invitation based on AMC 10/12 score cutoffs.</td></tr>
        <tr><td>Spring (about March)</td><td>USAJMO and USAMO, by invitation based on AMC and AIME performance.</td></tr>
        <tr><td>Summer (about June)</td><td>MOP, the training camp for top USAMO performers.</td></tr>
      </table>
      <p>A simple plan: take the <a href="#/diag">diagnostic</a> now, practice your level and the track above it for 20 to 30 minutes a day, review missed problems on the <a href="#/review">review page</a>, and take a timed mock contest in the month before each real one.</p>

      <h2>Real past contests (official archives)</h2>
      <p class="sub">The real problems belong to the MAA, so we link to them instead of copying them. Use them for full-length practice once you finish a track here.</p>
      <ul>
        <li><a href="https://artofproblemsolving.com/wiki/index.php/AMC_8_Problems_and_Solutions" target="_blank" rel="noopener">AMC 8: every year, with solutions</a></li>
        <li><a href="https://artofproblemsolving.com/wiki/index.php/AMC_10_Problems_and_Solutions" target="_blank" rel="noopener">AMC 10: every year, with solutions</a></li>
        <li><a href="https://artofproblemsolving.com/wiki/index.php/AMC_12_Problems_and_Solutions" target="_blank" rel="noopener">AMC 12: every year, with solutions</a></li>
        <li><a href="https://artofproblemsolving.com/wiki/index.php/AIME_Problems_and_Solutions" target="_blank" rel="noopener">AIME: every year, with solutions</a></li>
        <li><a href="https://artofproblemsolving.com/wiki/index.php/USAMO_Problems_and_Solutions" target="_blank" rel="noopener">USAMO and USAJMO archives</a></li>
      </ul>

      <h2>Free resources to pair with this site</h2>
      <ul>
        <li><a href="https://artofproblemsolving.com/wiki" target="_blank" rel="noopener">AoPS Wiki</a> has past contests, solutions, and topic articles.</li>
        <li><a href="https://maa.org/math-competitions" target="_blank" rel="noopener">MAA competitions</a> are the official source for AMC/AIME/USAMO rules.</li>
        <li><a href="https://www.khanacademy.org/math" target="_blank" rel="noopener">Khan Academy</a> is good for filling school-math gaps first.</li>
      </ul>`);
  }
})();
