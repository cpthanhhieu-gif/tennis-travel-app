# Breakpoint Tokens
> Brand: Tennis Travel Experience by Vietravel
> Mobile-first: viết style cho mobile trước, override lên lớn hơn

## Screen Breakpoints (Brand = Tailwind default)
| Token | Brand (px) | em | Tailwind prefix |
|---|---|---|---|
| xs (mobile nhỏ) | 390px | — | (default, no prefix) |
| sm | 640px | 40em | `sm:` |
| md | 768px | 48em | `md:` |
| lg | 1024px | 64em | `lg:` |
| xl | 1280px | 80em | `xl:` |
| 2xl | 1536px | 96em | `2xl:` |

## Target Demo Chính
```
Primary target : 390px — iPhone 14 Pro
Secondary      : 768px — iPad
Desktop        : 1280px
```

## Layout per Breakpoint
| Breakpoint | Layout | Columns | Nav | Page Margin |
|---|---|---|---|---|
| < 640px (mobile) | Single column | 4 col | Bottom nav (5 tabs) | 16px |
| 640–1023px (tablet) | 2 col grid | 8 col | Top nav optional | 24px |
| ≥ 1024px (desktop) | 3 col grid | 12 col | Top nav | 32px |

## Container Max Width
```css
max-width: 1280px;
margin: 0 auto;
padding: 0 var(--page-margin);
```

## Safe Areas (iOS notch + Android)
```css
/* Áp dụng cho bottom nav và top header */
padding-top: env(safe-area-inset-top);
padding-bottom: env(safe-area-inset-bottom);
padding-left: env(safe-area-inset-left);
padding-right: env(safe-area-inset-right);
```

## Responsive Rules
```
✅ ĐÚNG  : class="w-full sm:w-1/2 lg:w-1/3"
❌ SAI   : class="w-1/3 sm:w-full"

✅ ĐÚNG  : class="text-sm md:text-base"
❌ SAI   : class="md:text-sm text-base"
```

## Component Behavior per Breakpoint
| Component | Mobile (< 640px) | Tablet (640–1023px) | Desktop (≥ 1024px) |
|---|---|---|---|
| Navigation | Bottom tab bar 5 tabs | Bottom tab bar | Top nav bar |
| Card grid | 1 column full-width | 2 columns | 3 columns |
| Modal | Bottom sheet (slide up) | Centered dialog | Centered dialog |
| Booking summary | Sticky bottom bar | Sticky bottom bar | Right sidebar |
| CTA button | Full-width bottom | Auto width | Auto width |
| Page padding | px-4 (16px) | px-6 (24px) | px-8 (32px) |
