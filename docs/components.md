# Components

## Find before you build

Every component, with its variants, sizes and component tokens, is in [registry.md](./registry.md). Import from the package root:

```tsx
import { Button, Card, CardHeader, CardTitle, cn } from '@beforeyoubid/design-system'
import { IconArrowRight } from '@beforeyoubid/design-system/icons'
```

- Icons come from `@beforeyoubid/design-system/icons` (Tabler, the main set) or `/icons/lucide`. Don't add `@tabler/icons-react` or `lucide-react` to the app.
- Merge classes with the package's `cn`. It knows the design system's type and colour classes, so `cn('text-body-4', 'text-h3')` keeps only `text-h3`.
- If nothing fits, compose existing components before writing new markup. Build your own only when there's no other way, keep it in one file, and tell the design-system team: what you built may belong in the package.

## Choosing a component

| You need | Use |
|---|---|
| Brief news after an action ("Report saved") | `toast.add({ type: 'success', title })`, with `<Toaster />` mounted once at the app root |
| A message that stays on the page | `Alert` (`info`, `success`, `warning`, `destructive`) |
| To block the page for a task | `Dialog` |
| To confirm a choice before it happens | `ConfirmDialog` (`destructive` for deletes) |
| A secondary flow from the edge | `Sheet` or `Drawer` |
| Nothing to show yet | `Empty` |
| Content still loading | `Skeleton` in the shape of what's coming, or `Spinner` for a short wait |
| A choice of 2 to 7 options | `ToggleGroup` or `RadioGroup` |
| A long list to pick from | `Select`, or `Combobox` when people need to type to filter |
| A status label | `Badge` with its status variant |
| A command or link styled as a button | `Button`, with `render` for links (below) |

**Every view that loads data has three states:** loading (`Skeleton` or `Spinner`), empty (`Empty`) and error (`Alert` or a `destructive` toast), not only the happy path.

**Deleting asks first.** A delete or remove action opens `ConfirmDialog destructive` with a title naming the thing ("Delete this file?") and Cancel focused. After the delete, a `success` toast ("File deleted"), with Undo where the delete can be reversed.

**One primary button per view.** Other actions use `secondary`, `tertiary` or `ghost`.

## Composing

- Items go inside their group: `SelectItem` in `SelectGroup`, `DropdownMenuItem` in `DropdownMenuGroup`, `CommandItem` in `CommandGroup`, `TabsTrigger` in `TabsList`.
- `Dialog`, `Sheet` and `Drawer` always have a title (`DialogTitle`, …). Hide it with `className="sr-only"` if the design has none.
- Use the full card: `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.
- `Avatar` always has an `AvatarFallback`.
- To render a component as another element, use the `render` prop, not `asChild`:

  ```tsx
  <Button nativeButton={false} render={<Link href="/get-a-quote" />}>Get a quote</Button>
  ```

- `Button` takes `loading` and `icon` (with `iconPosition`) props. Don't build your own spinner or icon slot.
- Overlays (dialogs, popovers, menus, tooltips, toasts) manage their own stacking. Don't give them a `z-index`.

## Changing how a component looks

Try these in order:

1. **Props.** `variant`, `size`, `appearance` and the like cover the designed options.
2. **Component tokens.** Each component reads its look (colours, radius, height, padding) from tokens listed in [registry.md](./registry.md). Set them in the app's CSS, on `:root` for the whole app or on a class for one area:

   ```css
   .checkout {
     --button-radius: var(--radius-md);
     --card-gap: calc(var(--spacing) * 4);
   }
   ```

   Every component inside `.checkout` picks the values up, nested ones included.
3. **`className`.** Use it freely for layout: width, placement, margins in a layout, grid placement. Use it sparingly for looks. A `className` that changes a component's colours or type is a last resort and needs a comment saying why.

Don't copy a component's source into the app to restyle it.

## Forms

If the app has `@beforeyoubid/form` in its `package.json`, build forms with it: its fields (`InputField`, `SelectField`, `DateField`, …) and `createBybFormHook`. Read `node_modules/@beforeyoubid/form/README.md` before you start.

Without it, compose the design system's field parts:

```tsx
<FieldGroup>
  <Field data-invalid={!!error}>
    <FieldLabel htmlFor="email">Email</FieldLabel>
    <Input id="email" aria-invalid={!!error} />
    {error ? <FieldError>{error}</FieldError> : <FieldDescription>We'll send the report here.</FieldDescription>}
  </Field>
</FieldGroup>
```

- `FieldGroup` lays out the fields. Don't stack them with margins.
- Errors set `data-invalid` on `Field` and `aria-invalid` on the control.
- Disabled sets `data-disabled` on `Field` and `disabled` on the control.
- Related checkboxes or radios go in `FieldSet` with a `FieldLegend`.
- Inputs fill their container. The layout around them sets the width.

## Accessibility

- An icon-only button has an `aria-label` naming the action ("Close", "Delete file").
- Never remove focus rings (`outline-none` without a replacement).
- Anything clickable is a `button` or a link, never a `div` with `onClick`.
- Every input has a label, visible or `sr-only`.
- Loading regions set `aria-busy`. `Button loading` does it for you.
- Respect reduced motion: `motion-reduce:animate-none` on any animation you add.
