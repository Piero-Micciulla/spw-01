# Which Fat Bear Are You?

SPW #11. A static, unofficial fan-made Katmai bear personality quiz. Facts are sourced in `src/js/data.js`; quiz interpretation is deliberately stored separately from factual summaries.

Scoring totals the eight-dimensional answer vector and compares its centered shape with each centered bear profile using cosine similarity. A documented `0.35` calibration offset prevents the unusually broad patient/comfort profile from swallowing the distribution; it was chosen from exhaustive analysis, not at runtime. Equal scores are resolved by lexicographically smallest bear ID, making ties deterministic. No answer state is placed in URLs or storage.
