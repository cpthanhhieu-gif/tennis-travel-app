# Typography Tokens
> Brand: Tennis Travel Experience by Vietravel

## Font Family
| Role | Default Value | Brand Value |
|---|---|---|
| font-sans | system-ui, Arial, sans-serif | **"Be Vietnam Pro"**, Inter, system-ui, sans-serif |
| font-mono | ui-monospace, Consolas, monospace | **"JetBrains Mono"**, monospace |
| font-heading | (inherit font-sans) | **"Be Vietnam Pro"** (cùng font body) |

```css
/* Google Fonts import */
@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
```

## Font Size Base
```
base-font-size: 16px
```

## Font Size Scale
| Token | Default (rem) | Default (px) | Brand Value (px) |
|---|---|---|---|
| text-xs | 0.75rem | 12px | **12px** (caption) |
| text-sm | 0.875rem | 14px | **14px** (body-sm) |
| text-base | 1rem | 16px | **16px** (body) |
| text-lg | 1.125rem | 18px | **18px** (body-lg) |
| text-xl | 1.25rem | 20px | **20px** |
| text-2xl | 1.5rem | 24px | **24px** |
| text-3xl | 1.875rem | 30px | **28px** (H2) |
| text-4xl | 2.25rem | 36px | **36px** (H1) |
| text-5xl | 3rem | 48px | **48px** (Display) |

## Font Weight
| Token | Default Value | Brand Value |
|---|---|---|
| font-regular | 400 | **400** |
| font-medium | 500 | **500** |
| font-semibold | 600 | **600** |
| font-bold | 700 | **700** |
| font-extrabold | 800 | **800** (Display, price, badge number) |

## Line Height
| Token | Default Value | Brand Value |
|---|---|---|
| leading-xs | 1.4 | **1.4** (caption) |
| leading-sm | 1.45 | **1.5** (body-sm) |
| leading-md | 1.55 | **1.6** (body) |
| leading-lg | 1.6 | **1.6** (body-lg) |
| leading-tight | 1.25 | **1.2** (H1) |

## Heading Scale (Brand)
| Role | Size | Weight | Line Height | Tailwind Class |
|---|---|---|---|---|
| Display | 48px / 3rem | 800 | 1.1 | `text-5xl font-extrabold` |
| H1 | 36px / 2.25rem | 700 | 1.2 | `text-4xl font-bold` |
| H2 | 28px / 1.75rem | 700 | 1.25 | `text-3xl font-bold` |
| H3 | 22px / 1.375rem | 600 | 1.3 | `text-2xl font-semibold` |
| H4 | 18px / 1.125rem | 600 | 1.35 | `text-lg font-semibold` |
| H5 | 16px / 1rem | 600 | 1.4 | `text-base font-semibold` |
| H6 | 14px / 0.875rem | 600 | 1.4 | `text-sm font-semibold` |

## Body & Supporting Text (Brand)
| Role | Size | Weight | Line Height | Tailwind Class |
|---|---|---|---|---|
| body-lg | 18px | 400 | 1.6 | `text-lg font-normal` |
| body | 16px | 400 | 1.6 | `text-base font-normal` |
| body-sm | 14px | 400 | 1.5 | `text-sm font-normal` |
| caption | 12px | 500 | 1.4 | `text-xs font-medium` |
| label | 14px | 500 | 1.45 | `text-sm font-medium` |
| overline | 12px | 600, uppercase, tracking-wide | 1.4 | `text-xs font-semibold uppercase tracking-wide` |
| mono-score | 16px | 400 | — | `font-mono text-base` |

## i18n Rules (Tiếng Việt)
```typescript
// Tiền tệ
new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amount)
// → "5.800.000 ₫"

// Ngày tháng
new Intl.DateTimeFormat('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }).format(date)
// → "Thứ Bảy, 14/06/2026"
```
