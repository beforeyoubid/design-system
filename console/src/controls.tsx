import * as React from 'react'
import {
  colorFamilies,
  colorHex,
  colorLabel,
  familyLabel,
  formatColor,
  formatLength,
  manifest,
  parseColor,
  parseLength,
  prettyVar,
  radiusSteps,
  SHADOWS,
  TRACKING,
  TEXT_SIZES,
  LEADINGS,
  WEIGHTS,
  type ValueType,
} from './tokens'

interface ControlProps {
  id: string
  value: string
  onChange: (v: string) => void
}

/** A swatch for any colour value: the colour over a checkerboard, so transparency shows. */
export function Swatch({ value, size = 'md' }: { value: string; size?: 'sm' | 'md' }) {
  return (
    <span className={`pg-swatch pg-swatch-${size}`} aria-hidden="true">
      <span style={{ background: value }} />
    </span>
  )
}

function ColorControl({ id, value, onChange }: ControlProps) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  const parsed = parseColor(value) ?? { ref: 'transparent', alpha: 100 }
  React.useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false)
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', esc)
    }
  }, [open])
  const pick = (ref: string) => onChange(formatColor({ ref, alpha: ref === 'transparent' ? 100 : parsed.alpha }))
  return (
    <div className="pg-color" ref={ref}>
      <button id={id} type="button" className="pg-color-trigger" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <Swatch value={value} />
        <span className="pg-color-name">{colorLabel(value)}</span>
        <span className="pg-color-hex">{colorHex(parsed.ref) ?? ''}</span>
      </button>
      {open && (
        <div className="pg-palette" role="dialog" aria-label="Choose a colour">
          <div className="pg-palette-row">
            <span className="pg-palette-label">Colour roles</span>
            <span className="pg-palette-hint">Prefer a role: apps can retheme it in one place.</span>
            <div className="pg-palette-roles">
              {manifest.semantic.map((s) => (
                <button key={s.name} type="button" aria-pressed={parsed.ref === s.name} className="pg-role-chip" onClick={() => pick(s.name)} title={`Follows the ${prettyVar(s.name)} role, so it changes when that role does`}>
                  <Swatch value={`var(${s.name})`} size="sm" />
                  {prettyVar(s.name)}
                </button>
              ))}
              <button type="button" aria-pressed={parsed.ref === 'transparent'} className="pg-role-chip" onClick={() => pick('transparent')}>
                <Swatch value="transparent" size="sm" />
                None
              </button>
            </div>
          </div>
          {colorFamilies.map(({ family, colors }) => (
            <div key={family} className="pg-palette-row">
              <span className="pg-palette-label">{familyLabel[family]}</span>
              <div className="pg-palette-swatches">
                {colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    title={`${prettyVar(c.name)} · ${c.hex}`}
                    aria-label={prettyVar(c.name)}
                    aria-pressed={parsed.ref === c.name}
                    className="pg-palette-swatch"
                    style={{ background: c.hex }}
                    onClick={() => pick(c.name)}
                  />
                ))}
              </div>
            </div>
          ))}
          {parsed.ref !== 'transparent' && (
            <label className="pg-palette-alpha">
              <span>Strength</span>
              <input type="range" min={5} max={100} step={5} value={parsed.alpha} onChange={(e) => onChange(formatColor({ ref: parsed.ref, alpha: +e.target.value }))} />
              <output>{parsed.alpha}%</output>
            </label>
          )}
        </div>
      )}
    </div>
  )
}

function Segmented<T extends string>({ id, options, value, onChange, render }: { id: string; options: { value: T; label: string }[]; value: string; onChange: (v: T) => void; render?: (o: { value: T; label: string }) => React.ReactNode }) {
  return (
    <div className="pg-segmented" role="radiogroup" id={id}>
      {options.map((o) => (
        <button key={o.value} type="button" role="radio" aria-checked={value === o.value} onClick={() => onChange(o.value)} title={o.label}>
          {render ? render(o) : o.label}
        </button>
      ))}
    </div>
  )
}

function RadiusControl({ id, value, onChange }: ControlProps) {
  const current = radiusSteps.find((r) => value.trim() === r.value || value.trim().endsWith(`${r.value})`) || (r.value === '0' && value.trim() === '0'))?.value ?? value
  return (
    <Segmented
      id={id}
      value={current}
      onChange={onChange}
      options={radiusSteps.map((r) => ({ value: r.value, label: r.name === 'full' ? 'Fully round' : `${r.px}px` }))}
      render={(o) => {
        const px = radiusSteps.find((r) => r.value === o.value)!.px
        return (
          <span className="pg-radius-option">
            <span className="pg-radius-corner" style={{ borderTopLeftRadius: Math.min(px, 14) }} />
            <span>{o.label === 'Fully round' ? 'Round' : o.label}</span>
          </span>
        )
      }}
    />
  )
}

function LengthControl({ id, value, onChange, max = 64 }: ControlProps & { max?: number }) {
  const px = parseLength(value) ?? 0
  return (
    <div className="pg-length">
      <input id={id} type="range" min={0} max={Math.max(max, px)} step={2} value={px} onChange={(e) => onChange(formatLength(+e.target.value))} />
      <output>{px}px</output>
    </div>
  )
}

function OpacityControl({ id, value, onChange }: ControlProps) {
  const pct = Math.round(parseFloat(value) * 100) || 0
  return (
    <div className="pg-length">
      <input id={id} type="range" min={0} max={100} step={5} value={pct} onChange={(e) => onChange(String(+e.target.value / 100))} />
      <output>{pct}%</output>
    </div>
  )
}

export function ValueControl({ type, id, value, onChange, max }: ControlProps & { type: ValueType; max?: number }) {
  switch (type) {
    case 'color':
      return <ColorControl id={id} value={value} onChange={onChange} />
    case 'radius':
      return <RadiusControl id={id} value={value} onChange={onChange} />
    case 'length':
      return <LengthControl id={id} value={value} onChange={onChange} max={max} />
    case 'shadow':
      return <Segmented id={id} value={value} onChange={onChange} options={SHADOWS.map((s) => ({ value: s.value, label: s.label }))} />
    case 'font-weight':
      return <Segmented id={id} value={value} onChange={onChange} options={WEIGHTS} render={(o) => <span style={{ fontWeight: +o.value }}>{o.label}</span>} />
    case 'opacity':
      return <OpacityControl id={id} value={value} onChange={onChange} />
    case 'tracking':
      return <Segmented id={id} value={value} onChange={onChange} options={TRACKING} />
    case 'font-size':
      return <Segmented id={id} value={value} onChange={onChange} options={TEXT_SIZES} />
    case 'leading':
      return <Segmented id={id} value={value} onChange={onChange} options={LEADINGS} />
  }
}

/** What kind of value a component token takes, in words, so nobody has to guess. */
export const typeHint: Record<ValueType, string> = {
  color: 'Colour from the BYB palette',
  radius: 'Corner radius',
  length: 'Size in pixels',
  shadow: 'Shadow preset',
  'font-weight': 'Font weight',
  opacity: 'Opacity',
  tracking: 'Letter spacing',
  'font-size': 'Text size from the type scale',
  leading: 'Line height (multiple of the text size)',
}
