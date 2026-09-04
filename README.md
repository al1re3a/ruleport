# RulePort

[![CI](https://github.com/al1re3a/ruleport/actions/workflows/ci.yml/badge.svg)](https://github.com/al1re3a/ruleport/actions/workflows/ci.yml)

**Write your project rules once. Port them to every coding agent.**

RulePort turns one small JSON policy into consistent instructions for:

- `AGENTS.md` (Codex and compatible agents)
- `CLAUDE.md` (Claude Code)
- `.github/copilot-instructions.md` (GitHub Copilot)
- `.cursor/rules/project.mdc` (Cursor)

Use the visual studio in a browser or automate it with the zero-dependency CLI. Your policy stays local either way.

## Quick start

```bash
npx ruleport --init
# edit ruleport.json
npx ruleport
```

RulePort writes all four targets while preserving the vocabulary and constraints in your source policy.

## Browser studio

```bash
git clone https://github.com/al1re3a/ruleport.git
cd ruleport
npm run dev
```

Open `http://127.0.0.1:4173`. Edit the policy and preview or download each target instantly. No data is uploaded.

## Policy format

```json
{
  "name": "My app",
  "summary": "What this repository does.",
  "stack": ["TypeScript", "React"],
  "commands": { "test": "npm test", "check": "npm run check" },
  "conventions": ["Prefer named exports."],
  "boundaries": ["Never commit secrets."],
  "verification": ["Run tests before finishing."],
  "scope": "**/*.{ts,tsx}"
}
```

See [`examples/ruleport.json`](examples/ruleport.json) for a complete policy.

## CI drift check

Commit `ruleport.json` and generated instructions, then ensure nobody edits outputs by hand:

```yaml
- run: npx ruleport --check
```

The command exits with code `2` when any generated file is missing or stale.

## Focused output

```bash
# Generate only Codex and Claude instructions
ruleport -t agents,claude

# Preview without writing
ruleport examples/ruleport.json --dry-run

# Generate into another repository
ruleport team-policy.json --out ../service-a
```

## Why RulePort

Agent instruction formats are multiplying, but project intent should have one source of truth. RulePort deliberately covers the portable core—project context, commands, conventions, boundaries, and verification—without hiding target-specific output behind a hosted service.

## Development

```bash
npm run check
npm run dev
```

Contributions are welcome, especially new target adapters, policy validation, and examples from real projects.

## License

MIT
