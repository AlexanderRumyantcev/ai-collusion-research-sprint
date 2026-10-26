# Tests and dataset

This folder is the harness. It runs the graph's own engine (the code in `../index.html`, loaded in jsdom, nothing re-implemented) on the dataset in `../data/`, and formats the final table into `../results/`.

Run: `npm install && npm test` (Node 18+). The run reads `../data/`, prints its full report to the terminal and writes the same text plus three CSV files to `../results/`. The output is deterministic and has no timestamps, so the files can be compared byte for byte between machines. `npm run table` then formats `../results/table.md`, the final table.

## Files

- `../data/evidence_types.json`: the dataset. One row per evidence type (T01 to T12) with the source link, what the source reports, the graph element it is mapped to, the source type (M1 to M7), the independence group, the direction, and the four labels the graph uses (admissible, authentic, directness, reliability), each with a written rationale. Rows that were not scored (X1 to X5) are listed with the reason.
- `../data/cases.json`: case configurations, i.e. which evidence types are present together. The expected level was computed by hand from the engine's rules before the first run.
- `run.js`: the harness. It computes item weights, the standard reached in each case, a one-label sensitivity analysis, and ten assertions about the engine (zero-weight items change nothing, same-group repeats add nothing, monotonicity, and so on).
- `build_table.py`: turns the generated CSVs into `../results/table.md` and `../results/table.csv`, the final table (all rows, scored and excluded).
- `../results/items.csv`, `../results/cases.csv`, `../results/sensitivity.csv`, `../results/summary.md`: generated output. The evidence-type table and the case table are the dataset's "evidence plus the graph's answer" form.

## How to read the results

- The graph is a rule engine. Its output follows from the labels, so these tests show how the method behaves on a given labelling. They do not measure accuracy, and no real collusion case with ground truth is used.
- The labels were assigned by one rater (the author) using the rubric in `../data/evidence_types.json`. Several rows have low mapping confidence, and the sensitivity table shows which label changes move a verdict.
- Items marked `graph_element: null` get a weight but cannot enter a verdict, because the demo has no element for coordination (E1) or counterfactual harm (E4).
- The `f` items in the cases are the demo's preset items about a hypothetical episode, not published data.
