Example `SKILL.md`:

```yaml
---
name: api-review
description: Review an API change for correctness, security, and backwards compatibility
allowed-tools: Read, Grep, Glob
argument-hint: "<file-or-endpoint>"
---

# API Review Checklist

When reviewing $ARGUMENTS:
- Validate authn/authz
- Validate input/output schema
- Identify breaking changes
- Ensure errors are consistent
```
