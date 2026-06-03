# Effects Tokens
> Brand: Tennis Travel Experience by Vietravel

## Border Radius
| Token | Formula | Default | Brand Value | Tailwind |
|---|---|---|---|---|
| `--radius` (base) | — | 10px | **12px** | — |
| radius-xs | base - 8px | 2px | **4px** | `rounded-sm` |
| radius-sm | base - 4px | 6px | **8px** | `rounded-lg` |
| radius-md | base | 10px | **12px** | `rounded-xl` |
| radius-lg | base + 4px | 14px | **16px** | `rounded-2xl` |
| radius-xl | base + 8px | 18px | **20px** | `rounded-[20px]` |
| radius-full | 9999px | 9999px | **9999px** | `rounded-full` |

## Semantic Radius (per component — Brand)
| Component | Brand Value | Tailwind |
|---|---|---|
| button | 8px | `rounded-lg` |
| input | 8px | `rounded-lg` |
| card | 12px | `rounded-xl` |
| badge / pill | 9999px | `rounded-full` |
| modal / dialog | 16px | `rounded-2xl` |
| avatar | 9999px | `rounded-full` |
| tooltip | 8px | `rounded-lg` |
| dropdown / popover | 12px | `rounded-xl` |
| progress bar | 9999px | `rounded-full` |
| bottom sheet | 16px top-only | `rounded-t-2xl` |

## Shadow / Elevation (Brand)
| Token | Brand Value | Dùng cho |
|---|---|---|
| shadow-card | `0 4px 24px rgba(0,0,0,0.15)` | Card thường |
| shadow-elevated | `0 8px 32px rgba(0,0,0,0.25)` | Card elevated, modal |
| shadow-gold | `0 0 20px rgba(212,175,55,0.3)` | CTA button, active gold element |
| shadow-dropdown | `0 8px 24px rgba(0,0,0,0.2)` | Dropdown, popover |
| shadow-sm | `0 2px 8px rgba(0,0,0,0.1)` | Badge, chip |

## Transition (Brand)
| Token | Brand Value | Easing | Dùng cho |
|---|---|---|---|
| duration-fast | **150ms** | ease-out | hover, focus, color change |
| duration-normal | **200ms** | ease-in-out | card hover, dropdown |
| duration-slow | **300ms** | ease-in-out | modal open/close, page |
| duration-expressive | **1000ms** | ease-out | XP bar fill (on mount) |
| duration-celebration | **600ms** | spring | Badge unlock, tier up |

```css
/* Prefers reduced motion — BẮT BUỘC có */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Opacity (Brand)
| Token | Brand Value | Dùng cho |
|---|---|---|
| opacity-disabled | **0.5** | Disabled elements |
| opacity-overlay | **0.4** | Modal backdrop |
| opacity-scrim | **0.8** | Full screen overlay |
| opacity-hover-dark | **0.8** | Hover trên nền tối (bg-white/10 → bg-white/20) |

## Z-Index Layers (Brand — nghiêm ngặt)
| Token | Value | Dùng cho |
|---|---|---|
| z-base | 0 | Nội dung thường |
| z-raised | 10 | Card hover |
| z-dropdown | 100 | Dropdown, popover, select |
| z-sticky | 200 | Top header, bottom nav |
| z-modal | 300 | Modal, dialog, bottom sheet |
| z-toast | 400 | Toast, XP notification |
| z-tooltip | 500 | Tooltip — trên cùng |

## Brand Animations (đặc thù dự án)
| Animation | CSS / Tailwind | Dùng cho |
|---|---|---|
| Live badge pulse | `animate-pulse` | Dot đỏ live badge |
| XP bar fill | `transition-all duration-1000 ease-out` | XP progress bar on mount |
| Card hover lift | `hover:scale-[1.02] transition-transform duration-200` | Interactive cards |
| Toast slide-in | `fade-up` keyframe (y:20→0, opacity:0→1, 300ms) | XP toast notification |
| Page transition | Framer Motion: opacity+y (0.3s ease-out) | Route change |
| Score count-up | `useCountUp` hook | Gamification screen |
| Badge unlock | scale + opacity spring 600ms | Achievement badge |
