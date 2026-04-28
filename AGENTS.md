# Personal Site — Agent Operating Notes

This file is for Codex, terminal agents, and future AI-assisted development sessions working inside this repository.

## Repo identity

This repository appears to be Ahmed Mahmoud's GitHub Pages / personal public project hub.

It should stay focused on public-facing personal work, project links, and builder/operator credibility.

This is not the private business wiki and should not contain sensitive business strategy, credentials, private client details, or internal notes.

## Public positioning

Keep the site aligned with Ahmed's current direction:

- Calgary-based founder/operator
- ZalaStack founder
- practical systems and automation work
- CLI-first tools
- local-first systems where useful
- agent-friendly workflows
- useful software over dashboard theater

Tone should be:

- direct
- practical
- credible
- founder-led
- technically grounded
- not over-polished or hype-driven

## Standard workflow for agents

This is Ahmed's preferred workflow across repos:

1. Use ChatGPT for strategy, planning, copy, and decision-making.
2. Use Codex for concrete repo implementation.
3. Use terminal agents for execution loops, checks, and local/system tasks.
4. Keep each repo self-explaining with an `AGENTS.md` file.
5. Start every coding/editing session by reading `README.md`, `AGENTS.md`, and relevant source/config files.
6. Make the smallest useful change first.
7. Run relevant checks before finalizing.
8. Summarize changed files, risks, and next recommended actions.

## How agents should work in this repo

Before editing, inspect the repo structure first. Do not assume a framework.

Check for:

- README or project notes
- HTML/CSS/JS files
- package/config files
- routing or static site structure
- public assets
- links to other projects or ZalaStack surfaces

When changing the site:

- keep public links accurate
- avoid inflated claims
- keep the design simple and credible
- prioritize clarity over decoration
- make sure project descriptions are useful to humans, not just keyword lists
- do not add private or sensitive information

## Good Codex tasks for this repo

Use Codex for:

1. Auditing the current site structure.
2. Improving homepage/profile clarity.
3. Updating public project links.
4. Aligning the personal site with ZalaStack and current public work.
5. Improving responsive layout and accessibility.
6. Checking deploy behavior for GitHub Pages.
7. Cleaning outdated copy or broken links.

## Avoid

- overdesigning the personal site
- making fake traction or client claims
- duplicating the full ZalaStack website
- adding private notes
- adding unnecessary dependencies
- replacing the site blindly without inspecting what exists

## Suggested first Codex prompt

```text
You are working in the mizoz/mizoz.github.io repo.

Goal:
Audit and improve the personal GitHub Pages site as a public project hub for Ahmed Mahmoud.

Inspect:
- AGENTS.md
- all source files
- config/package files if present
- public links and project references

Tasks:
1. Identify the site structure and framework, if any.
2. Check for broken or outdated public links.
3. Improve clarity around Ahmed's current work: ZalaStack, practical automation, CLI tools, and operator software.
4. Keep tone direct, practical, and public-safe.
5. Do not add fake claims or private information.
6. Run any available build/check command if present.

Return:
- repo summary
- files changed if any
- commands run
- risks or missing context
- next best improvement
```

## Notes for future sessions

When Ahmed asks what to do next in this repo, prioritize public clarity, link accuracy, and clean positioning over flashy redesigns.
