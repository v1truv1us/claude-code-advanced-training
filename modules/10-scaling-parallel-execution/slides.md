# Module 10: Scaling & Parallel Execution

## 📋 Slide Deck

### Slide 1: Title Slide
**Module 10: Scaling & Parallel Execution**  
*Headless/Print Mode (claude -p), Batch Processing, Parallel Fan-Out, and CI/CD Automation*

---

### Slide 2: Learning Objectives
By end of this module, you will be able to:
- Run Claude Code **non-interactively** using `claude -p` (print mode)
- Choose the right **output format** for automation (text/json/stream-json)
- Enforce **budgets & guardrails** (max budget, max turns, tool allowlists)
- Build **fan-out** patterns (xargs/parallel, matrix jobs, worker pools)
- Capture and **resume/continue sessions** when jobs are split across steps
- Add **monitoring + reliable failure handling** for large-scale automation

---

### Slide 3: The Scaling Problem (What Changes at 10× / 100×)
**Typical “scale events”**
- Migrating patterns across **100s–1000s of files**
- Running the same workflow across **many repos**
- Nightly automation / policy checks
- CI pipelines that must be **deterministic** and **budget bounded**

**Scaling dimensions**
```
Throughput ↑          Reliability ↑           Governance ↑
- parallel runs        - retries/checkpoints    - tool allowlists
- batching strategy    - resumable sessions     - budgets/turn limits
- streaming output     - structured outputs     - audit logs
```

**Production targets (example)**
- 100 files < 5 minutes
- 1000 files < 30 minutes
- 0 manual approvals required (when safe)
- Hard budget ceiling per run

---

### Slide 4: Headless / Programmatic Mode = `claude -p`
Claude Code’s programmatic CLI mode is **print mode**:
- Add **`-p` / `--print`** to run non-interactively and exit
- All standard CLI flags still apply

**Basic example**
```bash
claude -p "What does the auth module do?"
```

**Pipe input (CI-friendly)**
```bash
cat logs.txt | claude -p "Summarize errors and likely root causes"
```

**Prefer explicit constraints in automation**
```bash
claude -p "Run unit tests and fix failures" \
  --allowedTools "Bash,Read,Edit" \
  --max-budget-usd 5.00 \
  --max-turns 6
```

---

### Slide 5: Structured Output for Automation (`--output-format`)
Use `--output-format` to control automation output:

- `text` (default): human-friendly
- `json`: single JSON object (includes metadata like `session_id`, plus `result`)
- `stream-json`: newline-delimited JSON events (good for streaming + logs)

**Single JSON response**
```bash
claude -p "Summarize this project" --output-format json
```

**Validated JSON via JSON Schema (`--json-schema`)**
```bash
claude -p "Extract the main function names from auth.py" \
  --output-format json \
  --json-schema '{
    "type":"object",
    "properties":{"functions":{"type":"array","items":{"type":"string"}}},
    "required":["functions"]
  }'
```

**Streaming tokens/events**
```bash
claude -p "Explain recursion" \
  --output-format stream-json \
  --verbose \
  --include-partial-messages
```

**Streaming text-only (example filter)**
```bash
claude -p "Write a poem" \
  --output-format stream-json --verbose --include-partial-messages \
| jq -rj 'select(.type=="stream_event" and .event.delta.type?=="text_delta") | .event.delta.text'
```

---

### Slide 6: Budgets, Turn Limits, and Determinism
Scaling safely means **hard guardrails**.

**Max spend**
```bash
claude -p "Generate migration plan for this repo" \
  --max-budget-usd 10.00
```

**Max agent turns**
```bash
claude -p "Refactor the code to remove dead branches" \
  --max-turns 4
```

**Reduce “ambient state” for CI**
- For one-shot jobs where you do **not** want persistence:
```bash
claude -p "Review this diff" --no-session-persistence
```

**Fallback model (print mode)**
```bash
claude -p "Run quick review" --fallback-model sonnet
```

---

### Slide 7: Tool Permissions in Non-Interactive Runs
In CI you usually need:
- A **restricted allowlist** (`--allowedTools`) so the run can complete
- OR strict restriction (`--tools`) to remove tool access entirely

**Allow only safe tool usage**
```bash
claude -p "Run tests and fix failures" \
  --allowedTools "Bash,Read,Edit"
```

**Very tight allowlist using permission rules**
```bash
claude -p "Create a commit for staged changes" \
  --allowedTools "Bash(git diff *),Bash(git status *),Bash(git commit *)"
```

**Restrict tools (strong governance)**
```bash
claude -p "Explain the codebase; do not run commands" \
  --tools "Read"
```

---

### Slide 8: Parallel Execution Patterns (Fan-Out)
The easiest scale win is **multiple independent `claude -p` invocations**.

#### Pattern A: `xargs -P` (simple fan-out)
```bash
git ls-files '*.ts' \
| xargs -n 1 -P 8 -I {} \
  bash -lc 'claude -p "Review {} for risky patterns. Output JSON." \
    --output-format json --max-budget-usd 0.25 --allowedTools "Read" \
    | jq -c --arg file "{}" ". + {file:$file}"'
```

#### Pattern B: GNU `parallel` (more control)
```bash
git ls-files '*.py' \
| parallel -j 12 \
  'claude -p "Summarize {} in 3 bullets" --max-budget-usd 0.10 --allowedTools "Read"'
```

#### Pattern C: Worker pool (app-level control)
- Keep concurrency bounded (e.g., 4–16)
- Add retries/backoff
- Aggregate JSON results into a single report artifact

---

### Slide 9: Continue / Resume Conversations (Multi-Step Jobs)
When a workflow spans steps, you can:
- `--continue` / `-c`: continue **most recent** conversation in the current directory
- `--resume` / `-r`: resume a **specific** session by ID or name
- Optionally `--fork-session` to branch into a new session ID

**Continue the most recent**
```bash
claude -p "Review this codebase for performance issues"
claude -p "Now focus on database queries" --continue
claude -p "Summarize findings" --continue
```

**Capture session ID (for later resume)**
```bash
session_id=$(
  claude -p "Start a review" --output-format json \
  | jq -r '.session_id'
)

claude -p "Continue that review" --resume "$session_id"
```

**Fork a session (branching)**
```bash
claude -p "Try an alternative approach" --resume "$session_id" --fork-session
```

---

### Slide 10: CI/CD Integration (GitHub Actions Example)
Key ideas:
- Use `--output-format json` for artifacts
- Enforce `--max-budget-usd` per job
- Prefer `--allowedTools` allowlists
- Use matrix jobs for parallel fan-out

```yaml
name: Claude Batch Review

on:
  workflow_dispatch:
  pull_request:

jobs:
  review:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shard: [0,1,2,3] # 4-way parallel fan-out

    steps:
      - uses: actions/checkout@v4

      - name: Install Claude Code
        run: npm i -g @anthropic-ai/claude-code

      - name: Pick shard files
        run: |
          git ls-files '*.ts' | awk "NR % 4 == ${{ matrix.shard }}" > shard.txt

      - name: Run shard review (JSON)
        run: |
          mkdir -p out
          while read -r f; do
            claude -p "Review $f. Return JSON: {issues:[{severity,file,line,message}]} ." \
              --output-format json \
              --max-budget-usd 0.25 \
              --max-turns 4 \
              --allowedTools "Read" \
              | jq -c --arg file "$f" '. + {file:$file}' \
              >> out/results.ndjson
          done < shard.txt

      - name: Upload results
        uses: actions/upload-artifact@v4
        with:
          name: claude-results-${{ matrix.shard }}
          path: out/results.ndjson
```

---

### Slide 11: CI/CD Integration (GitLab CI + Jenkins Notes)
**GitLab CI (single job, JSON artifact)**
```yaml
claude_review:
  image: node:20
  script:
    - npm i -g @anthropic-ai/claude-code
    - claude -p "Review repo for security issues. Output JSON." \
        --output-format json \
        --max-budget-usd 5.00 \
        --max-turns 8 \
        --allowedTools "Read" \
      > security-report.json
  artifacts:
    paths:
      - security-report.json
```

**Jenkins**
- Use `sh` steps with `claude -p ... --output-format json`
- Archive artifacts (`archiveArtifacts`) and parse JSON for quality gates

---

### Slide 12: Observability for Scaled Runs
At scale, treat each invocation like a “job” with metadata.

**Recommended logging pattern**
- Store:
  - prompt/task name
  - file list / shard id
  - start/end timestamps
  - `session_id` (from JSON output)
  - budget/turn caps used
  - exit code + stderr
  - final JSON result blob

**Stream-json for real-time progress**
- Use `--output-format stream-json --verbose --include-partial-messages`
- Emit events into your log pipeline (e.g., CloudWatch, Datadog)
- Build dashboards by aggregating NDJSON

---

### Slide 13: Reliability Patterns (Retries + Checkpoints)
**Retry strategy**
- Retry on transient failures (network, model overload)
- Backoff with jitter
- Cap total retries to avoid budget blowups

**Checkpointing**
- For multi-step workflows:
  - Save `session_id` + shard state to an artifact or durable store
  - Resume with `--resume <session_id>`

**Avoid runaway costs**
- Always set:
  - `--max-budget-usd`
  - `--max-turns`
- Keep per-file budgets small in fan-out patterns

---

### Slide 14: Summary & Key Takeaways
**What to remember**
1. **Headless = print mode**: use `claude -p`
2. **Automation output**: `--output-format json` or `stream-json`
3. **Guardrails**: `--max-budget-usd`, `--max-turns`, and tool allowlists
4. **Parallelize** with OS tools (xargs/parallel) or CI matrix jobs
5. **Resume/continue** with `--continue` / `--resume` + captured `session_id`
6. **Productionize** with structured logs, retries, and checkpoints

**Production checklist**
- [ ] `--max-budget-usd` set for every job
- [ ] `--max-turns` set for every job
- [ ] `--allowedTools` allowlist defined (or `--tools` restricted)
- [ ] JSON/NDJSON outputs stored as artifacts
- [ ] Concurrency bounded (xargs -P / matrix size)
- [ ] session IDs captured for resumption
- [ ] Streaming logs enabled where needed

---

### References (docs used)
- Run Claude Code programmatically (print mode, output formats, resume/continue):  
  https://code.claude.com/docs/en/headless
- CLI reference (flags: `-p`, `--output-format`, `--json-schema`, `--max-budget-usd`, `--max-turns`, `--continue`, `--resume`, `--fork-session`, etc.):  
  https://code.claude.com/docs/en/cli-reference

---
*Video Duration: ~12 minutes*
