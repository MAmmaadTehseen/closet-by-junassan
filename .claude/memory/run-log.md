# Run log

Append one block per agent run. Most recent at the top.

Format:

```
## YYYY-MM-DD HH:MM UTC — <branch>
- Goal:
- Changed:
- Outcome:
```

- **Goal** — one line, what the run was trying to do.
- **Changed** — bullets of files touched / migrations added / scripts run. Elide unchanged noise.
- **Outcome** — shipped / merged / blocked / follow-up needed. If blocked, say what on.

---

<!-- New entries go above this line. -->
