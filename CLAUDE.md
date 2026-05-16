# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

## Project-Specific Guidelines

- This repo is the STDS brand frontend served by Cloudflare Pages and backed by
  the core backend public brand API.
- Use Astro + TypeScript. Treat this as a brand/SEO-oriented public website, not an admin SPA.
- SEO-strengthening design thinking is a core rule: before page implementation, consider search intent, semantic page structure, crawlable/static content, title/meta/OG data, performance, and accessible content.
- Cloud-deployment fit is a core rule: document required environment variables, keep build/runtime configuration explicit, and avoid code that only works on one local machine.
- Keep public-facing pages simple, fast, and content-first. Prefer static or server-rendered content unless interactivity is clearly needed.
- Use `DESIGN.md` for product/design direction and `ARCHITECTURE.md` for implementation boundaries when present.
- Follow `docs/.rules/coding-style.md`, `docs/.rules/testing.md`, and `CICD.md` when those files are present.
- Backend public API reference: `~/stds_backend` issue #209 and the core
  OpenAPI public brand endpoints (`GET /api/v1/public/brand/profile`,
  `GET /api/v1/public/brand/faqs`, and
  `GET /api/v1/public/properties/availability`).
