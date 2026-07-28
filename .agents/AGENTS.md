# Workspace Rules & Protocol

## Rules

### Rule 0 — Evidence Before Completion (Highest Priority)

This rule overrides every other instruction in this workspace.

Never state, imply, or mark a feature as complete unless there is objective evidence that it works.

Acceptable evidence includes at least one of the following:

- Browser screenshot
- Browser console output
- Network request/response
- Server log
- API response payload
- Successful build output
- Database record verification (when applicable)

If evidence is unavailable, the feature MUST be reported as:

NOT VERIFIED

instead of:

VERIFIED

Never assume.
Never infer.
Never "likely works".
Never replace missing evidence with confidence.

If any browser console contains an error, or any API returns a 4xx or 5xx response related to the implemented feature, that task is NOT complete.

When uncertain, explicitly write:

BLOCKED

or

NOT VERIFIED

and explain why.

This rule has higher priority than completing the requested task.

### Rule 1 — No Hallucinated QA

Never generate QA reports from assumptions.

Every statement inside a QA report must be backed by evidence gathered during this session.

Do not write:

✓ Verified
✓ Tested
✓ Confirmed
✓ Production Ready

unless those actions were actually performed.

If testing could not be performed, explicitly write:

NOT TESTED

instead of inventing results.

### Rule 2 — Stop on Blockers

If a blocker prevents successful completion of the current task:

- Stop immediately.
- Explain the blocker.
- Explain what is required to continue.
- Do not continue implementing unrelated features.
- Do not mark any blocked task as complete.

It is better to stop than to fabricate success.

### Rule 3 — Preserve Architecture

When modifying an existing feature:

- Prefer extending existing architecture over creating duplicate implementations.
- Do not leave unused components, routes, models, APIs, utilities or dead code.
- Update imports, references and navigation after moving files.
- Remove obsolete code introduced by refactors.
- Keep a single source of truth for every feature.

Every architectural change must leave the repository cleaner than before.

### Rule 4 — Responsive Verification

Any UI modification must be checked for responsive behavior.

Minimum viewport coverage:

- 320px
- 375px
- 390px
- 414px
- 768px
- 1024px
- 1280px
- 1440px
- 1920px

Verify:

- No clipping
- No overlap
- No hidden controls
- No overflowing text
- Proper scrolling
- Correct z-index stacking

### Rule 5 — Incremental Delivery

If the requested work is large or spans multiple systems:

- Divide it into logical phases.
- Complete one phase fully before beginning the next.
- Verify each phase independently.
- Do not claim completion of future phases.

Prioritize correctness over speed.

## Build & Dev Server Cache Safety Protocol
1. **Hard Dev Server Restart**: After any batch of file edits (especially `app/globals.css` or anything touching `app/layout.tsx`), always do a hard restart:
   - Stop the running Node server process
   - Remove the `.next` directory completely (`Remove-Item -Path ".next" -Recurse -Force`)
   - Re-launch `npm run dev`
   - Do NOT rely solely on HMR hot-reloading for major CSS/layout updates.

2. **Visual & Network Styling Verification**:
   - Before reporting any task as complete or "build passed", verify in devtools / network inspection that CSS assets are requested and return `HTTP 200` with non-zero byte size.
   - Visually confirm in the browser that styling is intact (dark navy header, gold crest, typography, layout cards). A clean `next build` does NOT guarantee CSS loaded correctly in dev.

