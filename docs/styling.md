# Styling

Every value in BYB UI comes from a token: a colour, a size on the type scale, a spacing step, a radius. The package defines them in `globals.css` and Tailwind turns each into a utility class.

## Colour

Prefer the semantic token. It names what a colour is for, so an app can change it in one place. Reach for a brand colour only when no role fits, for example a marketing illustration or a product badge.

| Use | Not | Role |
|---|---|---|
| `bg-background`, `bg-card` | | Page and card surface. `bg-white` stays right for white that isn't a surface (a dot, a chip on a dark panel) |
| `text-foreground` | `text-dark-100` | Body text |
| `text-muted-foreground` | `text-dark-75` | Secondary text |
| `bg-muted` | `bg-light-l1` | Quiet fill |
| `bg-secondary` | `bg-light-l2` | Secondary fill |
| `bg-primary`, `text-primary-foreground` | `bg-mint-45`, `text-navy` | Main action |
| `bg-accent`, `text-accent-foreground` | `bg-mint-l3`, `text-mint-90` | Selected or highlighted rows |
| `text-destructive`, `bg-destructive` | `text-error-75` | Errors and destructive actions |
| `bg-success`, `text-success-foreground` | `bg-mint-15` | Success |
| `bg-warning`, `text-warning-foreground` | `bg-warning-45` | Warning |
| `border-border` | `border-dark-15` | Dividers, card edges |
| `border-input` | `border-dark-45` | Form control edges |
| `ring-ring` | `ring-mint-45` | Focus rings |

Status colours (success, warning, error) always come from these roles or a `Badge` variant. Don't pick a brand colour that happens to look right.

For transparency use an opacity modifier, `bg-dark-100/50`, never a new colour.

No `dark:` classes. The package has dark values in code, but dark mode isn't configured or optimised yet.

## No arbitrary values

Don't bypass the utilities with square brackets: `w-[312px]`, `text-[18px]`, `leading-[1.4]`, `rounded-[16px]`, `bg-[#F4F4F4]`, `[mask-type:luminance]`. Each one is a value the design system doesn't know about, so it drifts when the tokens change.

- A size, colour or radius the scale lacks: ask for a token in the package rather than hard-coding it.
- A layout width with no token (a fixed sidebar, an illustration): use a CSS variable the app owns, `w-(--sidebar-width)`, and set it once.
- Arbitrary *variants* are fine: `data-[state=open]:`, `has-[input:checked]:`, `group-data-[size=sm]/card:`.

No inline `style={{…}}` either, unless the value is computed at runtime (a progress percentage, a position from a drag).

## Type

Use the design system's type classes. Each sets size, line height and weight together, and display and heading classes add their letter spacing.

| Class | Size | Use |
|---|---|---|
| `text-display-1` … `text-display-4` | 72 / 64 / 56 / 52px | Standout numbers and screen titles |
| `text-h1` … `text-h6` | 40 / 36 / 28 / 24 / 20 / 18px | Headings |
| `text-body-1` … `text-body-5` | 24 / 20 / 18 / 16 / 14px | Running text (`text-body-4` is the default) |
| `text-caption-1` … `text-caption-3` | 12 / 10 / 8px | Captions, fine print |
| `text-overline` | 12px, uppercase | Eyebrows, table headers, stat labels |
| `text-button-lg/md/sm` | 18 / 16 / 14px, uppercase | Button-style labels outside a `Button` |

- Never Tailwind's `text-xs` … `text-9xl`.
- Change weight with `font-medium` or `font-semibold` on the same class: `text-body-5 font-medium`.
- Heading classes are looks, not tags. Pick the tag for the document outline and the class for the size: `<h2 className="text-h4">`.
- Write copy in sentence case. `text-overline` and `text-button-*` do the uppercasing, so the text stays readable to screen readers and translators.
- `truncate` for one line, `line-clamp-2` (and so on) for more.
- `tabular-nums` on prices and columns of numbers so digits line up.

## Layout and spacing

- Space siblings with `gap-*` on a flex or grid parent. Not margins on each child, not `space-x-*` / `space-y-*`.
- `size-10`, not `w-10 h-10`.
- Page content sits in `max-w-site` (1280px), centred.
- Section padding uses `p-section-sm` (48px), `p-section-md` (80px) and `p-section-lg` (120px).
- Radius steps: `rounded-sm` 4px, `rounded-md` 8px, `rounded-lg` 12px (cards, inputs, small buttons), `rounded-xl` 16px, `rounded-2xl` 20px (alerts, toasts, popovers), `rounded-3xl` 24px (dialogs), `rounded-4xl` 32px, `rounded-full`.

## Logical sides

Write sides as start and end, not left and right, so a layout flips for right-to-left languages.

| Use | Not |
|---|---|
| `ms-*`, `me-*` | `ml-*`, `mr-*` |
| `ps-*`, `pe-*` | `pl-*`, `pr-*` |
| `start-*`, `end-*` | `left-*`, `right-*` |
| `text-start`, `text-end` | `text-left`, `text-right` |
| `rounded-s-*`, `rounded-e-*`, `rounded-ss-*` … | `rounded-l-*`, `rounded-r-*`, `rounded-tl-*` … |
| `border-s`, `border-e` | `border-l`, `border-r` |
| `float-start`, `float-end` | `float-left`, `float-right` |

`mx-*`, `px-*` and `inset-x-*` are already symmetric. Centring with `left-1/2 -translate-x-1/2` is the one place physical sides are fine.

## Breakpoints

Mobile first. Unprefixed classes style the smallest screens. Each prefix applies from its width up, so a value carries to larger screens until a larger prefix overrides it.

| Prefix | From | Typical device |
|---|---|---|
| none | 0 | Phones |
| `sm:` | 640px | Large phones |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Small laptops, desktops |
| `xl:` | 1280px | Most laptops |
| `2xl:` | 1440px | Large screens |

`p-4 md:p-6 xl:p-8` is 16px on phones, 24px from 768px and 32px from 1280px. For one range only, pair a prefix with `max-*`: `md:max-lg:hidden`.

Check every change at a phone width (375px) and at each breakpoint where its classes change.
