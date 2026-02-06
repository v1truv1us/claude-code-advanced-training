# Repo-wide Exercise Audit (modules/*)

Scope: verify each `modules/<xx-...>/exercise/README.md` matches its `slides.md` (terminology, file locations, formats), starter/solution structure is coherent, and no outdated commands/paths are referenced.

Legend:
- ✅ ok / consistent
- ⚠️ minor mismatch / unclear
- ❌ broken / missing / outdated

---

## Module 01: Context Window Mastery
Files:
- `modules/01-context-window-mastery/slides.md`
- `modules/01-context-window-mastery/exercise/README.md`
- `modules/01-context-window-mastery/exercise/starter/*`
- `modules/01-context-window-mastery/exercise/solution/*`

Checklist
- ✅ Exercise topic matches slides (context bloat, `/clear`, `/compact`, subagents).
- ✅ Starter files referenced exist:
  - `starter/bloated-conversation.md`
  - `starter/context-analysis-template.md`
  - `starter/optimized-workflow-template.md`
- ⚠️ Deliverables list includes `token-comparison.md`, but no starter template or solution exists for that file.
- ⚠️ The README ends with “Ready for: Exercise 01-2” but no `01-2` is present in repo.

Patch suggestions
- `modules/01-context-window-mastery/exercise/README.md`
  - Either (A) remove `token-comparison.md` as a required deliverable and fold token comparison into `context-analysis.md`, or (B) add a starter template + solution file:
    - Add `exercise/starter/token-comparison-template.md`
    - Add `exercise/solution/token-comparison-solution.md`
  - If there is no Exercise 01-2, remove/adjust the “Ready for: Exercise 01-2” line.

---

## Module 02: Verification Strategies
Files:
- `modules/02-verification-strategies/slides.md`
- `modules/02-verification-strategies/exercise/README.md`

Checklist
- ⚠️ Exercise concept (TDD + verification) aligns with slides.
- ❌ Exercise README specifies a large project with many files (`tests/`, `src/`, `docs/`), but `modules/02-verification-strategies/exercise/` contains **only** the README (no `starter/` or `solution/`).
- ⚠️ README is very implementation-heavy (DB, recursion SQL, profanity trie, benchmarking) but slides are broader and do not establish a specific stack or repo skeleton. As written, learners have no scaffold.

Patch suggestions
- `modules/02-verification-strategies/exercise/README.md`
  - Add an explicit “This is a design + test-writing exercise; you may implement stubs only” OR provide a real scaffold.
- Add missing structure:
  - `modules/02-verification-strategies/exercise/starter/` with:
    - minimal `package.json` + test runner config (or language-agnostic instructions)
    - `src/` stubs, `tests/` stubs, and a small in-memory persistence option
  - `modules/02-verification-strategies/exercise/solution/` with at least the test suite and a reference implementation.

---

## Module 03: CLAUDE.md Configuration
Files:
- `modules/03-claude-md-configuration/slides.md`

Checklist
- ⚠️ No `exercise/` directory.

Patch suggestions
- Either add `modules/03-claude-md-configuration/exercise/README.md` + starter/solution, or add a note in slides/module index stating “no exercise for this module”.

---

## Module 04: Plan Mode Workflow
Files:
- `modules/04-plan-mode-workflow/slides.md`
- `modules/04-plan-mode-workflow/exercise/README.md`

Suggested patch (illustrative; fix code fences + plan-mode command)
```diff
diff --git a/modules/04-plan-mode-workflow/exercise/README.md b/modules/04-plan-mode-workflow/exercise/README.md
--- a/modules/04-plan-mode-workflow/exercise/README.md
+++ b/modules/04-plan-mode-workflow/exercise/README.md
@@
-**Instructions to Claude**:
-```
-/permission-mode plan
+**Instructions to Claude** (start Claude Code in Plan Mode using `claude --permission-mode plan`, or toggle to Plan Mode via Shift+Tab):
+```
+[Plan Mode]
@@
 Return a comprehensive analysis with recommendations for the new moderation system architecture.
 ```
@@
-**Instructions to Claude**:
-```
+**Instructions to Claude**:
+```
 Using the analysis from Phase 1, create a detailed implementation plan for the comment moderation system. The plan should include:
@@
-### Expected Deliverables:
+```
+
+### Expected Deliverables:
@@
-**Instructions to Claude**:
-```
+**Instructions to Claude**:
+```
 Switch to Normal Mode and implement the comment moderation feature following the plan from Phase 2. The implementation should include:
@@
-### Success Criteria for Phase 3:
+```
+
+### Success Criteria for Phase 3:
@@
-**Instructions to Claude**:
-```
+**Instructions to Claude**:
+```
 Create comprehensive documentation for the new comment moderation system including:
@@
-### Success Criteria for Phase 4:
+```
+
+### Success Criteria for Phase 4:
@@
-```
+```
 exercise-04-1/
@@
-  ...
+  ...
+```
```

Checklist
- ⚠️ Exercise intent matches slides (Explore → Plan → Implement → Commit).
- ❌ The exercise README has **broken Markdown formatting**: multiple triple-backtick code fences are opened and not closed, causing large sections to render inside code blocks.
- ❌ Uses `/permission-mode plan` in the prompt block. Slides teach:
  - start with `claude --permission-mode plan`, or
  - toggle with `Shift+Tab`.
  `/permission-mode` may not be a real slash command.
- ❌ README describes an `exercise-04-1/` folder structure that does not exist in the module directory.
- ⚠️ No `starter/` or `solution/` directory; may be fine, but then remove references to non-existent files/paths.

Patch suggestions
- `modules/04-plan-mode-workflow/exercise/README.md`
  - Close code fences properly (see line refs below).
  - Replace `/permission-mode plan` with a doc-aligned instruction:
    - “Start Claude Code with `claude --permission-mode plan`” OR “Toggle to Plan Mode via Shift+Tab”.
  - Replace the fictional `exercise-04-1/` tree with paths that exist (or create that structure).

Broken fence locations (approximate)
- At line ~71: a code fence opens but should close before “### Expected Deliverables:”.
- At line ~118: code fence opens but should close before “### Success Criteria for Phase 3:”.
- At line ~151: code fence opens but should close before “### Success Criteria for Phase 4:”.
- At line ~173: the file tree fence opens but never closes.

---

## Module 05: Skills Fundamentals
Files:
- `modules/05-skills-fundamentals/slides.md`

Checklist
- ⚠️ No `exercise/` directory.

Patch suggestions
- Either add `modules/05-skills-fundamentals/exercise/README.md` + starter/solution, or explicitly note “no exercise”.

---

## Module 06: Building Custom Skills
Files:
- `modules/06-building-custom-skills/slides.md`
- `modules/06-building-custom-skills/exercise/README.md`
- `modules/06-building-custom-skills/exercise/starter/*`
- `modules/06-building-custom-skills/exercise/solution/*`

Suggested patch
```diff
diff --git a/modules/06-building-custom-skills/exercise/README.md b/modules/06-building-custom-skills/exercise/README.md
--- a/modules/06-building-custom-skills/exercise/README.md
+++ b/modules/06-building-custom-skills/exercise/README.md
@@
-- Check `solutions/` for complete implementations when stuck
+- Check `solution/` for complete implementations when stuck
```

Checklist
- ✅ Starter and solution directories exist and contain relevant templates and examples.
- ✅ Exercise theme matches slides (knowledge skill, workflow skill, distribution strategy).
- ⚠️ README references `solutions/` (plural) but directory is `solution/` (singular).

Patch suggestions
- `modules/06-building-custom-skills/exercise/README.md`
  - Change “Check `solutions/`” → “Check `solution/`”.

---

## Module 07: Subagents & Delegation
Files:
- `modules/07-subagents-delegation/slides.md`
- `modules/07-subagents-delegation/exercise/README.md`
- `modules/07-subagents-delegation/exercise/starter/*`
- `modules/07-subagents-delegation/exercise/solution/*`

Checklist
- ✅ Terminology matches slides: `.claude/agents/` (not `.claude/subagents/`).
- ✅ Starter templates exist at `starter/subagent-templates/*.md`.
- ✅ Mentions constraints consistent with slides (no subagent nesting).
- ⚠️ Optional automation path suggests `claude -p` usage; this is aligned with Module 10, so ok.

Patch suggestions
- Optional: add a short snippet showing how to run the provided `pipeline-starter.ts` (node/ts-node/tsx), since the README references building a pipeline but doesn’t specify runtime commands.

---

## Module 08: Hooks & Automation
Files:
- `modules/08-hooks-automation/slides.md`
- `modules/08-hooks-automation/exercise/README.md`
- `modules/08-hooks-automation/exercise/starter/settings.json`
- `modules/08-hooks-automation/exercise/starter/scripts/*`

Suggested patch (align starter paths + Claude Code terminology)
```diff
diff --git a/modules/08-hooks-automation/exercise/README.md b/modules/08-hooks-automation/exercise/README.md
--- a/modules/08-hooks-automation/exercise/README.md
+++ b/modules/08-hooks-automation/exercise/README.md
@@
-✅ Pre-save hook blocks files with secrets  
-✅ Pre-commit hook runs tests and checks coverage  
+✅ PreToolUse hook blocks Write/Edit when secrets are detected  
+✅ PostToolUse hook runs tests/lint/coverage after edits  
@@
-See `starter/` directory for:
-- `hooks/` - Starter hook configurations
-- `scripts/` - Partial hook script implementations
-- `sample-code/` - Files to test hooks with
-- `tests/` - Sample test files
+See `starter/` directory for:
+- `settings.json` - Starter Claude Code hook configuration
+- `scripts/` - Hook script implementations
+- `sample-code/` - Files to test hooks with
@@
-- [ ] Created pre-save hook that detects secrets
+- [ ] Created PreToolUse hook that detects secrets
@@
-- [ ] Created pre-commit hook that runs tests
-- [ ] Pre-commit hook verifies 80% coverage threshold
+- [ ] Created PostToolUse hook that runs tests
+- [ ] PostToolUse hook verifies 80% coverage threshold (or your team standard)
```

Checklist
- ✅ Concept matches slides: hooks are configured in JSON settings; PreToolUse and PostToolUse.
- ❌ README’s “Starter Files” list is inaccurate:
  - claims `starter/hooks/` and `starter/tests/` exist (they don’t)
  - actual starter contains `starter/settings.json`, `starter/scripts/`, `starter/sample-code/`
- ⚠️ Success criteria/checklist references “pre-save” and “pre-commit” hooks.
  - Slides focus on Claude Code hooks (lifecycle/tool hooks), not git hooks.
  - If you intend git hooks too, say so explicitly; otherwise rename to PreToolUse/PostToolUse.

Patch suggestions
- `modules/08-hooks-automation/exercise/README.md`
  - Update “Starter Files” section to match repo:
    - `settings.json`, `scripts/`, `sample-code/`
  - Replace “Pre-save” → “PreToolUse (Write/Edit)”, and “Pre-commit” → either:
    - “PostToolUse (Edit|Write) runs tests/coverage” (Claude Code hook), or
    - explicitly add an optional stretch goal: “git pre-commit hook”.

---

## Module 09: MCP Integration
Files:
- `modules/09-mcp-integration/slides.md`
- `modules/09-mcp-integration/exercise/README.md`
- `modules/09-mcp-integration/exercise/starter/*`
- `modules/09-mcp-integration/exercise/solution/*`

Checklist
- ✅ Exercise commands match slides (`claude mcp add/list/get/remove`, `.mcp.json` usage).
- ✅ Starter directories mentioned exist (`starter/mcp-config`, `starter/workflow`, `starter/database`).
- ⚠️ Exercise assumes GitHub/Slack access; ok since it mentions mock versions.

Patch suggestions
- Optional: in README, mention `.mcp.json` scope explicitly (project vs local) to reinforce slides’ scope/precedence section.

---

## Module 10: Scaling & Parallel Execution
Files:
- `modules/10-scaling-parallel-execution/slides.md`
- `modules/10-scaling-parallel-execution/exercise/README.md`
- `modules/10-scaling-parallel-execution/exercise/starter/*`

Suggested patch (make starter references + success criteria match repo)
```diff
diff --git a/modules/10-scaling-parallel-execution/exercise/README.md b/modules/10-scaling-parallel-execution/exercise/README.md
--- a/modules/10-scaling-parallel-execution/exercise/README.md
+++ b/modules/10-scaling-parallel-execution/exercise/README.md
@@
-See `starter/` directory for:
-- `legacy-code/` - Sample legacy JavaScript files to modernize
-- `batch-starter.ts` - Partial implementation
-- `workers/` - Worker subagent templates
-- `templates/` - CI/CD integration templates
+See `starter/` directory for:
+- `legacy-code/` - Sample legacy JavaScript files to modernize
+- `batch-starter.ts` - Partial implementation
+- `templates/` - CI/CD integration templates
@@
-✅ Discovers 50+ files in sample directory  
+✅ Discovers legacy patterns in the provided sample directory  
```

Alternative (if you want to keep the “50+ files” requirement): generate/commit more sample files under `starter/legacy-code/` and/or add a `starter/workers/` folder.

Checklist
- ⚠️ Exercise theme matches slides (batching, parallelism, CI template), but several repo structure mismatches exist.
- ❌ README “Starter Files” claims `workers/` exists; it does not.
- ❌ Success criteria says “Discovers 50+ files in sample directory”, but starter has only **one** legacy file: `starter/legacy-code/legacy-patterns.js`.
- ⚠️ Exercise mentions “spawns parallel workers via subagents” while slides emphasize `claude -p` fan-out patterns. Not wrong, but consider aligning language.

Patch suggestions
- `modules/10-scaling-parallel-execution/exercise/README.md`
  - Fix starter tree references (remove or add `starter/workers/`).
  - Either add many sample legacy files under `starter/legacy-code/` (50+) or reduce success criteria to match what exists.
  - Optionally add a `claude -p` based fan-out variant as an alternative implementation path.

---

## Global grep for outdated commands/paths
- ✅ No references found to `.claude/subagents`.
- ✅ No references found to “claude headless”.
- ⚠️ Module 04 uses `/permission-mode plan` which is likely not a valid slash command; replace with CLI flag or Shift+Tab toggle.
