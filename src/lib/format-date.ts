const pad = (n: number) => String(n).padStart(2, "0")

/** A date as DD/MM/YYYY, e.g. 16/10/2026. */
export const formatDateDMY = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
