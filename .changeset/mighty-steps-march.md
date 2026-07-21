---
'@beforeyoubid/design-system': minor
---

Add `Stepper` primitive — a generic horizontal progress-steps component (`src/components/ui/stepper.tsx`, main barrel export). Step labels arrive via a `steps` prop and an `activeStep` index derives per-step done/active/upcoming states: done dots are mint with a check icon, the active dot is cobalt with a soft glow ring, upcoming dots are neutral, with matching connector lines and labels. Horizontally scrollable on overflow, tokens only, no new dependencies.
