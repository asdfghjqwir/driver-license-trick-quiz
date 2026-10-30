type ClassPart = string | false | null | undefined

/** className を条件つきでつなげる(false や空は無視する) */
export function cn(...parts: ClassPart[]): string {
  return parts.filter(Boolean).join(' ')
}
