---
"@beforeyoubid/design-system": major
---

**BREAKING: Chart, Calendar, and Carousel move to dedicated subpath exports with optional peer dependencies.**

The main barrel no longer exports `Chart*`, `Calendar*`, or `Carousel*` components, and `recharts`,
`react-day-picker`, and `embla-carousel-react` are no longer bundled dependencies — consumers who
don't use these components no longer install ~1 MB of charting/date/carousel libraries.

Migration (only if you use Chart, Calendar, or Carousel — two lines each):

```diff
- import { ChartContainer, ChartTooltip } from '@beforeyoubid/design-system'
+ import { ChartContainer, ChartTooltip } from '@beforeyoubid/design-system/chart'
```

and install the matching peer in your app:

| Import | Peer to install |
| --- | --- |
| `@beforeyoubid/design-system/chart` | `recharts@>=3.8` |
| `@beforeyoubid/design-system/calendar` | `react-day-picker@>=9` |
| `@beforeyoubid/design-system/carousel` | `embla-carousel-react@>=8.6` |

Also removed: `date-fns` (was an unused leftover dependency — nothing in the package imports it).

No changes for consumers of any other component — Button, Card, Dialog, etc. are untouched, and
`/icons` works as before.
