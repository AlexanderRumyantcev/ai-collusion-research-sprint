# Results of tests/run.js

Generated file, do not edit. Re-run with `npm test`. The engine is the code in `index.html`, loaded in jsdom; nothing is re-implemented here.

Labels in `evidence_types.json` were assigned by the author (single rater) with the rubric stated there. The results therefore show how the method behaves on this labelling. They do not measure whether the method is accurate.

## Evidence types

| id | evidence type | element (report -> demo) | source | direction | directness | reliability | weight |
|---|---|---|---|---|---|---|---|
| T01 | Partner substitution: behaviour changes when the partner is replaced | E1 coordination -> none | M7 | inculpatory | direct | reliable | +4 |
| T02 | Partner substitution as support for agreement | E2 agreement -> agree | M7 | inculpatory | circumstantial | reliable | +2 |
| T03 | Explicit agreement recovered from a hidden channel | E2 agreement -> agree | M3 | inculpatory | direct | doubtful | +3 |
| T04 | Hidden channel detected, no agreement text recovered | E2 agreement -> agree | M3 | inculpatory | circumstantial | doubtful | +1 |
| T05 | Price-level audit finds supracompetitive prices | E2 agreement -> agree | M6 | inculpatory | circumstantial | unreliable | +0 |
| T06 | Excess residual correlation between agents' unexplained choices | E2 agreement -> agree | M6 | inculpatory | circumstantial | doubtful | +1 |
| T07 | Shared-model coupling as an alternative explanation of similar behaviour | E2 agreement -> agree | M6 | exculpatory | circumstantial | reliable | -2 |
| T08 | Internal-state probe shows the model recognises the true answer it does not report | E3 deception (knowledge) -> know | M4 | inculpatory | direct | doubtful | +3 |
| T09 | Reasoning-token count differs between truthful and untruthful answers | E3 deception (knowledge) -> know | M2 | inculpatory | circumstantial | unreliable | +0 |
| T10 | LLM judge reads the messages and reports collusion | E2 or E3 (verdict on the whole claim) -> none | M6 | inculpatory | circumstantial | unreliable | +0 |
| T11 | Sequence-level monitor detects structured misbehaviour that per-step monitors miss | E4 counterfactual harm -> none | M2 | inculpatory | circumstantial | doubtful | +1 |
| T12 | Same task for different customers: output quality differs | adjacent: single-agent conditional conduct, not collusion -> none | M6 | inculpatory | circumstantial | doubtful | +1 |

Rows with `none` get a weight but cannot enter a verdict, because the demo has no matching element.

## Case configurations

| case | evidence | element states | standard reached |
|---|---|---|---|
| C0 Output only, nothing else (fals) | none | access=0; false=0; know=0; agree=0; act=0 | below threshold |
| C1 Price-level audit only (fals) | T05 | access=0; false=0; know=0; agree=0; act=0 | below threshold |
| C2 Joint-distribution audit only (synchrony) (fals) | T06 | access=0; false=0; know=0; agree=1; act=0 | Reasonable suspicion |
| C3 Synchrony plus the shared-model alternative (fals) | T06, T07 | access=0; false=0; know=0; agree=contested; act=0 | below threshold |
| C4 Partner-substitution experiment only (fals) | T02 | access=0; false=0; know=0; agree=2; act=0 | Reasonable suspicion |
| C5 Partner substitution plus synchrony (fals) | T02, T06 | access=0; false=0; know=0; agree=2; act=0 | Reasonable suspicion |
| C6 Partner substitution plus a decoded handshake (fals) | T02, T03 | access=0; false=0; know=0; agree=4*; act=0 | Reasonable suspicion |
| C7 C4 plus an independent full trace of a hypothetical episode (fals) | T02, f2, f4, f13 | access=4; false=4; know=0; agree=2; act=4 | Reasonable suspicion |
| C8 C7 plus a white-box probe (fals) | T02, f2, f4, f13, T08 | access=4; false=4; know=3; agree=2; act=4 | Substantial evidence |
| C9 C8 plus a decoded handshake (fals) | T02, T03, f2, f4, f13, T08 | access=4; false=4; know=3; agree=4*; act=4 | Preponderance of the evidence |
| C10 C9 as a concealment claim (conc) | T02, T03, f1, f2, f5, f13, T08 | duty=4; access=4; withheld=4; know=3; agree=4*; act=4 | Preponderance of the evidence |
| C11 C9 plus a reliable direct exculpatory item (agent never received X) (fals) | T02, T03, f2, f3, f4, f13, T08 | access=excluded; false=4; know=3; agree=4*; act=4 | excluded |

Element states are the weights 0 to 4 per element; `*` marks independent corroboration. The verdict is limited by the weakest element.

## Sensitivity to one label

| case | label changes tried | changed the standard reached |
|---|---|---|
| C0 | 0 | 0 |
| C1 | 4 | 1 |
| C2 | 5 | 3 |
| C3 | 9 | 4 |
| C4 | 4 | 2 |
| C5 | 9 | 0 |
| C6 | 9 | 0 |
| C7 | 16 | 0 |
| C8 | 21 | 14 |
| C9 | 26 | 17 |
| C10 | 30 | 20 |
| C11 | 30 | 4 |

Changes that moved the verdict:

| case | item | change | from | to |
|---|---|---|---|---|
| C1 | T05 | reliability_up | below threshold | Reasonable suspicion |
| C2 | T06 | reliability_down | Reasonable suspicion | below threshold |
| C2 | T06 | inadmissible | Reasonable suspicion | below threshold |
| C2 | T06 | not_authentic | Reasonable suspicion | below threshold |
| C3 | T06 | directness_flip | below threshold | Reasonable suspicion |
| C3 | T07 | directness_flip | below threshold | excluded |
| C3 | T07 | inadmissible | below threshold | Reasonable suspicion |
| C3 | T07 | not_authentic | below threshold | Reasonable suspicion |
| C4 | T02 | inadmissible | Reasonable suspicion | below threshold |
| C4 | T02 | not_authentic | Reasonable suspicion | below threshold |
| C8 | T02 | reliability_down | Substantial evidence | Probable cause |
| C8 | T02 | directness_flip | Substantial evidence | Preponderance of the evidence |
| C8 | T02 | inadmissible | Substantial evidence | Reasonable suspicion |
| C8 | T02 | not_authentic | Substantial evidence | Reasonable suspicion |
| C8 | f2 | inadmissible | Substantial evidence | Reasonable suspicion |
| C8 | f2 | not_authentic | Substantial evidence | Reasonable suspicion |
| C8 | f4 | inadmissible | Substantial evidence | Reasonable suspicion |
| C8 | f4 | not_authentic | Substantial evidence | Reasonable suspicion |
| C8 | f13 | inadmissible | Substantial evidence | Reasonable suspicion |
| C8 | f13 | not_authentic | Substantial evidence | Reasonable suspicion |
| C8 | T08 | reliability_down | Substantial evidence | Reasonable suspicion |
| C8 | T08 | directness_flip | Substantial evidence | Probable cause |
| C8 | T08 | inadmissible | Substantial evidence | Reasonable suspicion |
| C8 | T08 | not_authentic | Substantial evidence | Reasonable suspicion |
| C9 | T03 | reliability_down | Preponderance of the evidence | Substantial evidence |
| C9 | T03 | directness_flip | Preponderance of the evidence | Substantial evidence |
| C9 | T03 | inadmissible | Preponderance of the evidence | Substantial evidence |
| C9 | T03 | not_authentic | Preponderance of the evidence | Substantial evidence |
| C9 | f2 | directness_flip | Preponderance of the evidence | Substantial evidence |
| C9 | f2 | inadmissible | Preponderance of the evidence | Reasonable suspicion |
| C9 | f2 | not_authentic | Preponderance of the evidence | Reasonable suspicion |
| C9 | f4 | directness_flip | Preponderance of the evidence | Substantial evidence |
| C9 | f4 | inadmissible | Preponderance of the evidence | Reasonable suspicion |
| C9 | f4 | not_authentic | Preponderance of the evidence | Reasonable suspicion |
| C9 | f13 | directness_flip | Preponderance of the evidence | Substantial evidence |
| C9 | f13 | inadmissible | Preponderance of the evidence | Reasonable suspicion |
| C9 | f13 | not_authentic | Preponderance of the evidence | Reasonable suspicion |
| C9 | T08 | reliability_down | Preponderance of the evidence | Reasonable suspicion |
| C9 | T08 | directness_flip | Preponderance of the evidence | Probable cause |
| C9 | T08 | inadmissible | Preponderance of the evidence | Reasonable suspicion |
| C9 | T08 | not_authentic | Preponderance of the evidence | Reasonable suspicion |
| C10 | T03 | reliability_down | Preponderance of the evidence | Substantial evidence |
| C10 | T03 | directness_flip | Preponderance of the evidence | Substantial evidence |
| C10 | T03 | inadmissible | Preponderance of the evidence | Substantial evidence |
| C10 | T03 | not_authentic | Preponderance of the evidence | Substantial evidence |
| C10 | f1 | directness_flip | Preponderance of the evidence | Substantial evidence |
| C10 | f1 | inadmissible | Preponderance of the evidence | Reasonable suspicion |
| C10 | f1 | not_authentic | Preponderance of the evidence | Reasonable suspicion |
| C10 | f2 | directness_flip | Preponderance of the evidence | Substantial evidence |
| C10 | f2 | inadmissible | Preponderance of the evidence | Reasonable suspicion |
| C10 | f2 | not_authentic | Preponderance of the evidence | Reasonable suspicion |
| C10 | f5 | directness_flip | Preponderance of the evidence | Substantial evidence |
| C10 | f5 | inadmissible | Preponderance of the evidence | Reasonable suspicion |
| C10 | f5 | not_authentic | Preponderance of the evidence | Reasonable suspicion |
| C10 | f13 | directness_flip | Preponderance of the evidence | Substantial evidence |
| C10 | f13 | inadmissible | Preponderance of the evidence | Reasonable suspicion |
| C10 | f13 | not_authentic | Preponderance of the evidence | Reasonable suspicion |
| C10 | T08 | reliability_down | Preponderance of the evidence | Reasonable suspicion |
| C10 | T08 | directness_flip | Preponderance of the evidence | Probable cause |
| C10 | T08 | inadmissible | Preponderance of the evidence | Reasonable suspicion |
| C10 | T08 | not_authentic | Preponderance of the evidence | Reasonable suspicion |
| C11 | f3 | reliability_down | excluded | Preponderance of the evidence |
| C11 | f3 | directness_flip | excluded | Preponderance of the evidence |
| C11 | f3 | inadmissible | excluded | Preponderance of the evidence |
| C11 | f3 | not_authentic | excluded | Preponderance of the evidence |

## Assertions

- PASS: hand-computed expected level matches the engine in every case
- PASS: weight table: direct+reliable 4, direct+doubtful 3, circumstantial+reliable 2, circumstantial+doubtful 1, unreliable 0
- PASS: inadmissible or unauthentic item is not evidence (no weight)
- PASS: zero-weight items change no verdict (C9 + T05 + T09)
- PASS: an inadmissible item contributes nothing (C9 with f13 inadmissible equals C9 without f13)
- PASS: repeating an item from the same independence group adds nothing (C2 + duplicate of T06)
- PASS: a reliable direct exculpatory item excludes the element (C11)
- PASS: monotonicity: strengthening an inculpatory item never lowers the verdict, strengthening an exculpatory one never raises it
- PASS: deterministic: two runs give identical results
- PASS: the page loaded without script errors
