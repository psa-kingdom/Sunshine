# Workspace Rules & Protocol

## Build & Dev Server Cache Safety Protocol
1. **Hard Dev Server Restart**: After any batch of file edits (especially `app/globals.css` or anything touching `app/layout.tsx`), always do a hard restart:
   - Stop the running Node server process
   - Remove the `.next` directory completely (`Remove-Item -Path ".next" -Recurse -Force`)
   - Re-launch `npm run dev`
   - Do NOT rely solely on HMR hot-reloading for major CSS/layout updates.

2. **Visual & Network Styling Verification**:
   - Before reporting any task as complete or "build passed", verify in devtools / network inspection that CSS assets are requested and return `HTTP 200` with non-zero byte size.
   - Visually confirm in the browser that styling is intact (dark navy header, gold crest, typography, layout cards). A clean `next build` does NOT guarantee CSS loaded correctly in dev.
