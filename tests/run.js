'use strict';
// Runs the evidence graph engine from ../index.html (the real page code, loaded in jsdom)
// on the evidence types in ../data/evidence_types.json and the case configurations in
// ../data/cases.json.
// Writes results/{items,cases,sensitivity}.csv and summary.md at the repository root.
// Prints the same summary to the terminal. Output is deterministic.
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

const here = __dirname;
const html = fs.readFileSync(path.join(here, '..', 'index.html'), 'utf8');
const dataDir = path.join(here, '..', 'data');
const types = JSON.parse(fs.readFileSync(path.join(dataDir, 'evidence_types.json'), 'utf8'));
const casesFile = JSON.parse(fs.readFileSync(path.join(dataDir, 'cases.json'), 'utf8'));

const vc = new VirtualConsole();
let pageErrors = 0;
vc.on('jsdomError', (e) => { pageErrors++; console.error('PAGE ERROR:', e.message); });
const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'https://example.org/', virtualConsole: vc });
const ev = (s) => dom.window.eval(s);

const weight = ev('weight'), elementState = ev('elementState'), levelOf = ev('levelOf');
const F = ev('F'), ST = ev('ST'), TYPES = ev('TYPES');
const STD = Array.from(ev('STD').en), WN = Array.from(ev('WN').en);

// labels: public English -> engine keys used by the page
const YN = { yes: 'да', no: 'нет' };
const DC = { direct: 'прямая', circumstantial: 'косвенная' };
const REL = { reliable: 'надёжен', doubtful: 'сомнителен', unreliable: 'ненадёжен' };
const REL_ORDER = ['unreliable', 'doubtful', 'reliable'];
const inv = (m) => Object.fromEntries(Object.entries(m).map(([k, v]) => [v, k]));
const YNe = inv(YN), DCe = inv(DC), RELe = inv(REL);

// catalogue of items: demo presets (hypothetical episode) and pool rows
const cat = {};
F.forEach((f) => {
  cat[f.id] = { adm: ST.adm[f.id], aut: ST.aut[f.id], dc: ST.dc[f.id], rel: ST.rel[f.id], dir: f.dir, el: f.el, src: f.s, origin: 'demo preset (hypothetical)' };
});
types.scored.forEach((r) => {
  F.push({ id: r.id, t: { ru: r.title, en: r.title }, fact: { ru: r.title, en: r.title }, s: r.graph_source,
    el: r.graph_element ? [r.graph_element] : [], dir: r.direction, dc: DC[r.directness], g: r.group });
  cat[r.id] = { adm: YN[r.admissible], aut: YN[r.authentic], dc: DC[r.directness], rel: REL[r.reliability],
    dir: r.direction, el: r.graph_element ? [r.graph_element] : [], src: r.graph_source, origin: r.origin };
});
// synthetic duplicate of T06 in the same independence group, used only by an assertion
const t06 = types.scored.find((r) => r.id === 'T06');
F.push({ id: 'T06dup', t: { ru: 'dup', en: 'dup' }, fact: { ru: 'dup', en: 'dup' }, s: 'M6', el: ['agree'], dir: 1, dc: DC.circumstantial, g: t06.group });
cat.T06dup = Object.assign({}, cat.T06);

function setup(specs) {
  F.forEach((f) => { ST.on[f.id] = false; });
  specs.forEach(({ id, over }) => {
    const l = Object.assign({}, cat[id], over || {});
    ST.on[id] = true; ST.adm[id] = l.adm; ST.aut[id] = l.aut; ST.dc[id] = l.dc; ST.rel[id] = l.rel;
  });
}
function evalCase(type, specs) {
  setup(specs);
  const states = TYPES[type].el.map((k) => [k, elementState(k)]);
  const lvl = levelOf(states.map((a) => a[1]));
  const excluded = states.some((a) => a[1].k === 'x');
  const stateStr = states.map(([k, s]) => k + '=' + (s.k === 'x' ? 'excluded' : s.k === 'c' ? 'contested' : s.e) + (s.corro && s.k === 'n' ? '*' : '')).join('; ');
  return { lvl, excluded, val: excluded ? -1 : lvl, states: stateStr,
    label: excluded ? 'excluded' : lvl === 0 ? 'below threshold' : STD[lvl - 1] };
}
const specsOf = (ids) => ids.map((id) => ({ id }));
const relevant = (type, id) => cat[id].el.some((e) => TYPES[type].el.includes(e));

// ---------- items ----------
const csv = (rows) => rows.map((r) => r.map((v) => '"' + String(v === null || v === undefined ? '' : v).replace(/"/g, '""') + '"').join(',')).join('\n') + '\n';
const itemRows = [['id', 'status', 'pool_ref', 'title', 'origin', 'report_element', 'graph_element', 'source_type', 'group', 'direction', 'directness', 'admissible', 'authentic', 'reliability', 'weight', 'weight_name', 'signed_weight', 'enters_demo_verdict', 'mapping_confidence', 'as_reported', 'source_urls', 'rationale']];
const itemOut = [];
types.scored.forEach((r) => {
  const res = weight(YN[r.admissible], YN[r.authentic], DC[r.directness], REL[r.reliability]);
  const w = res.w;
  const signed = w === null ? 'not evidence' : (r.direction > 0 ? '+' : '-') + w;
  itemOut.push({ r, w, signed });
  itemRows.push([r.id, 'scored', r.pool_ref, r.title, r.origin, r.report_element, r.graph_element || '', r.graph_source, r.group, r.direction > 0 ? 'inculpatory' : 'exculpatory', r.directness, r.admissible, r.authentic, r.reliability, w === null ? '' : w, w === null ? '' : WN[w], signed, r.graph_element ? 'yes' : 'no', r.mapping_confidence, r.as_reported, r.source_urls.join(' '), r.rationale]);
});
types.excluded.forEach((x) => itemRows.push([x.id, 'excluded', '', x.title, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', x.source_urls.join(' '), x.reason]));

// ---------- cases ----------
const caseOut = [];
const caseRows = [['case', 'name', 'type', 'items', 'element_states', 'level', 'standard_reached', 'expected_level', 'matches_expected']];
let allMatch = true;
casesFile.cases.forEach((c) => {
  const r = evalCase(c.type, specsOf(c.items));
  const exp = c.expected_level;
  const ok = exp === 'excluded' ? r.excluded : (!r.excluded && r.lvl === exp);
  if (!ok) allMatch = false;
  caseOut.push({ c, r, ok });
  caseRows.push([c.id, c.name, c.type, c.items.join(' '), r.states, r.excluded ? '' : r.lvl, r.label, exp, ok ? 'yes' : 'NO']);
});

// ---------- sensitivity: change one label of one item by one step ----------
const sensRows = [['case', 'item', 'perturbation', 'level_before', 'level_after', 'changed']];
const sensSummary = [];
const changes = [];
casesFile.cases.forEach((c) => {
  const base = evalCase(c.type, specsOf(c.items));
  let n = 0, ch = 0;
  c.items.filter((id) => relevant(c.type, id)).forEach((id) => {
    const l = cat[id];
    const relNow = RELe[l.rel];
    const perts = [];
    const i = REL_ORDER.indexOf(relNow);
    if (i > 0) perts.push(['reliability_down', { rel: REL[REL_ORDER[i - 1]] }]);
    if (i < 2) perts.push(['reliability_up', { rel: REL[REL_ORDER[i + 1]] }]);
    perts.push(['directness_flip', { dc: l.dc === DC.direct ? DC.circumstantial : DC.direct }]);
    perts.push(['inadmissible', { adm: YN.no }]);
    perts.push(['not_authentic', { aut: YN.no }]);
    perts.forEach(([name, over]) => {
      const after = evalCase(c.type, c.items.map((x) => (x === id ? { id: x, over } : { id: x })));
      const changed = after.label !== base.label;
      n++; if (changed) { ch++; changes.push({ case: c.id, item: id, name, from: base.label, to: after.label }); }
      sensRows.push([c.id, id, name, base.label, after.label, changed ? 'yes' : 'no']);
    });
  });
  sensSummary.push({ id: c.id, n, ch });
});

// ---------- assertions (properties of the engine, not of the data) ----------
const assertions = [];
const check = (name, ok, detail) => assertions.push({ name, ok, detail: detail || '' });
check('hand-computed expected level matches the engine in every case', allMatch);
const wt = (a, b, c, d) => weight(a, b, c, d).w;
check('weight table: direct+reliable 4, direct+doubtful 3, circumstantial+reliable 2, circumstantial+doubtful 1, unreliable 0',
  wt('да', 'да', 'прямая', 'надёжен') === 4 && wt('да', 'да', 'прямая', 'сомнителен') === 3 && wt('да', 'да', 'косвенная', 'надёжен') === 2 &&
  wt('да', 'да', 'косвенная', 'сомнителен') === 1 && wt('да', 'да', 'прямая', 'ненадёжен') === 0 && wt('да', 'да', 'косвенная', 'ненадёжен') === 0);
check('inadmissible or unauthentic item is not evidence (no weight)', wt('нет', 'да', 'прямая', 'надёжен') === null && wt('да', 'нет', 'прямая', 'надёжен') === null);
const c9 = casesFile.cases.find((c) => c.id === 'C9');
const base9 = evalCase('fals', specsOf(c9.items));
check('zero-weight items change no verdict (C9 + T05 + T09)', evalCase('fals', specsOf(c9.items.concat(['T05', 'T09']))).label === base9.label);
check('an inadmissible item contributes nothing (C9 with f13 inadmissible equals C9 without f13)',
  evalCase('fals', c9.items.map((x) => (x === 'f13' ? { id: x, over: { adm: YN.no } } : { id: x }))).label === evalCase('fals', specsOf(c9.items.filter((x) => x !== 'f13'))).label);
check('repeating an item from the same independence group adds nothing (C2 + duplicate of T06)',
  evalCase('fals', specsOf(['T06', 'T06dup'])).label === evalCase('fals', specsOf(['T06'])).label);
check('a reliable direct exculpatory item excludes the element (C11)', caseOut.find((o) => o.c.id === 'C11').r.excluded);
let monoOk = true; const monoBad = [];
casesFile.cases.forEach((c) => {
  const base = evalCase(c.type, specsOf(c.items));
  c.items.filter((id) => relevant(c.type, id)).forEach((id) => {
    const l = cat[id]; const i = REL_ORDER.indexOf(RELe[l.rel]);
    const tries = [];
    if (i < 2) tries.push({ rel: REL[REL_ORDER[i + 1]] });
    if (l.dc === DC.circumstantial) tries.push({ dc: DC.direct });
    tries.forEach((over) => {
      const after = evalCase(c.type, c.items.map((x) => (x === id ? { id: x, over } : { id: x })));
      const bad = l.dir > 0 ? after.val < base.val : after.val > base.val;
      if (bad) { monoOk = false; monoBad.push(c.id + ':' + id); }
    });
  });
});
check('monotonicity: strengthening an inculpatory item never lowers the verdict, strengthening an exculpatory one never raises it', monoOk, monoBad.join(', '));
const run1 = JSON.stringify(casesFile.cases.map((c) => evalCase(c.type, specsOf(c.items))));
const run2 = JSON.stringify(casesFile.cases.map((c) => evalCase(c.type, specsOf(c.items))));
check('deterministic: two runs give identical results', run1 === run2);
check('the page loaded without script errors', pageErrors === 0);

// ---------- write ----------
const outDir = path.join(here, '..', 'results');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'items.csv'), csv(itemRows));
fs.writeFileSync(path.join(outDir, 'cases.csv'), csv(caseRows));
fs.writeFileSync(path.join(outDir, 'sensitivity.csv'), csv(sensRows));

const md = [];
md.push('# Results of tests/run.js', '', 'Generated file, do not edit. Re-run with `npm test`. The engine is the code in `index.html`, loaded in jsdom; nothing is re-implemented here. This is the same text the run prints to the terminal.', '',
  'Labels in `evidence_types.json` were assigned by the author (single rater) with the rubric stated there. The results therefore show how the method behaves on this labelling. They do not measure whether the method is accurate.', '',
  '## Evidence types', '', '| id | evidence type | element (report -> demo) | source | direction | directness | reliability | weight |', '|---|---|---|---|---|---|---|---|');
itemOut.forEach(({ r, signed }) => md.push(`| ${r.id} | ${r.title} | ${r.report_element} -> ${r.graph_element || 'none'} | ${r.graph_source} | ${r.direction > 0 ? 'inculpatory' : 'exculpatory'} | ${r.directness} | ${r.reliability} | ${signed} |`));
md.push('', 'Rows with `none` get a weight but cannot enter a verdict, because the demo has no matching element.', '', '## Case configurations', '', '| case | evidence | element states | standard reached |', '|---|---|---|---|');
caseOut.forEach(({ c, r }) => md.push(`| ${c.id} ${c.name} (${c.type}) | ${c.items.join(', ') || 'none'} | ${r.states} | ${r.label} |`));
md.push('', 'Element states are the weights 0 to 4 per element; `*` marks independent corroboration. The verdict is limited by the weakest element.', '', '## Sensitivity to one label', '', '| case | label changes tried | changed the standard reached |', '|---|---|---|');
sensSummary.forEach((s) => md.push(`| ${s.id} | ${s.n} | ${s.ch} |`));
md.push('', 'Changes that moved the verdict:', '', '| case | item | change | from | to |', '|---|---|---|---|---|');
changes.forEach((x) => md.push(`| ${x.case} | ${x.item} | ${x.name} | ${x.from} | ${x.to} |`));
md.push('', '## Assertions', '');
assertions.forEach((a) => md.push(`- ${a.ok ? 'PASS' : 'FAIL'}: ${a.name}${a.detail ? ' (' + a.detail + ')' : ''}`));
fs.writeFileSync(path.join(outDir, 'summary.md'), md.join('\n') + '\n');

console.log(md.join('\n'));
const failed = assertions.filter((a) => !a.ok);
if (failed.length) { console.error('\n' + failed.length + ' assertion(s) FAILED'); process.exit(1); }
console.log('\nAll ' + assertions.length + ' assertions passed.');
