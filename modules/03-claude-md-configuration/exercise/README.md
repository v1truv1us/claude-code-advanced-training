# Module 03 Exercise: CLAUDE.md + Rules + Imports

## 🎯 Objective
Practice creating **project memory** that stays useful (and small) by using:
- `.claude/CLAUDE.md`
- `.claude/rules/*.md`
- `@path` imports

## 📋 What you’ll build
A minimal, doc-aligned Claude Code configuration for a sample repo.

Use the included example project at:
- `exercise/starter/sample-project/`

You’ll add `.claude/CLAUDE.md` and `.claude/rules/*.md` to that project.
## 🏗️ Steps
1) Create `.claude/CLAUDE.md` with:
   - how to run tests/lint
   - repo structure notes
   - 2–3 workflow rules (e.g. “write tests first”, “don’t touch generated files”)
2) Create `.claude/rules/security.md` with security invariants.
3) Create `.claude/rules/release.md` with a release checklist.
4) In `.claude/CLAUDE.md`, import the rules with `@.claude/rules/security.md` etc.
5) Validate behavior by starting a Claude Code session in the repo and asking it to:
   - summarize the rules
   - follow the release checklist

## 📁 Starter Files
See `starter/` for a suggested minimal structure and example prompts.

## ✅ Submission
- Your `.claude/CLAUDE.md`
- Your `.claude/rules/*.md`
- A short note: what you removed to keep it concise

## References
- Memory / rules / imports: https://code.claude.com/docs/en/memory
