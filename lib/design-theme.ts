export const DESIGN_THEME_COOKIE = "tennis-design-preview";
// Change only after the new system has been reviewed. Set to classic to roll back.
export const DEFAULT_DESIGN_THEME: DesignTheme = "next";
export type DesignTheme = "classic" | "next";
export function resolveDesignTheme(value?: string): DesignTheme {
  return value === "classic" || value === "next" ? value : DEFAULT_DESIGN_THEME;
}
