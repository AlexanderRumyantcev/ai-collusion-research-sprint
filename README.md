# AI-collusion evidence graph

Interactive Wigmore-style evidence graph for assessing evidence of collusion between AI agents.
Code accompanying the report *Adapting Standards-of-Proof Analysis to AI-Agent Collusion: A Wigmore-Based Interactive Evidence Graph*, written for the Apart Research AI Collusion Research Sprint (23-25 October 2026), track 2.3.

**Status: work in progress.** This is version 0.9 as of 25 October 2026. It is an unfinished snapshot submitted with the report, and it will keep changing after the sprint. The version cited in the report is the commit tagged `sprint-submission`.

## What it does

A single self-contained page (`index.html`, no build step, no dependencies besides Google Fonts loaded from the network). Interface language: Russian and English (switch in the header).

- **Weight of evidence** tab: walks one evidence item through source, element, admissibility, authenticity, direction, directness and reliability, and returns an ordinal weight from 0 to 4.
- **Proving** tab: combines item weights into element states, takes the weakest element, and compares the achieved level with a chosen target standard of proof (reasonable suspicion ... beyond a reasonable doubt).
- A glossary at the bottom marks where each term comes from (law, literature, ours, not in the scheme yet, no source found) with links to the reference list.

The weight table and aggregation rules are our draft: an ordinal scale, not probabilities. Currently only the deception subtree is implemented in detail.

## Run

Open `index.html` in a browser.

## Known gaps

Terminology and references in the glossary have not all been verified against primary sources; entries marked "verify" in the reference list are unchecked. Not yet modelled: burden of proof, an explicit layer separating the evidence record from the established fact, an alternative-explanation criterion, and a real graph drawing.

## AI assistance

The code was written with Claude Sonnet 5.5 and reviewed by the author, who takes responsibility for it.

## License

Not yet chosen.
