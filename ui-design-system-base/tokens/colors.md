# Color Tokens
> Source: shadcn/ui semantic token system
> Brand: Tennis Travel Experience by Vietravel

## Semantic Color Pairs (surface + foreground)
| Token | Brand Value | Ghi chú |
|---|---|---|
| `--background` | **#ffffff** | Nền trang |
| `--foreground` | **#000E1A** | Text chính |
| `--card` | **#ffffff** | Nền card |
| `--card-foreground` | **#000E1A** | Text trong card |
| `--popover` | **#ffffff** | Nền popover, dropdown |
| `--popover-foreground` | **#000E1A** | Text trong popover |
| `--primary` | **#0046C1** | Xanh Vietravel — CTA chính |
| `--primary-foreground` | **#ffffff** | Text trên primary |
| `--secondary` | **#ED1D24** | Đỏ Vietravel — accent phụ |
| `--secondary-foreground` | **#ffffff** | Text trên secondary |
| `--muted` | **#F7F7F7** | Nền muted, section phụ |
| `--muted-foreground` | **#636363** | Text phụ, placeholder |
| `--accent` | **#D9EEFF** | Tint xanh nhạt |
| `--accent-foreground` | **#0046C1** | Text trên accent |
| `--destructive` | **#ED1D24** | Lỗi, xóa |
| `--border` | **#DDDDDD** | Đường viền |
| `--input` | **#DDDDDD** | Viền input |
| `--ring` | **#0046C1** | Focus ring |

## Semantic Colors
| Token | Brand Value | Dùng cho |
|---|---|---|
| success | **#007C19** | Thành công |
| success-foreground | **#ffffff** | Text trên success |
| success-light | **#DEFFE5** | Nền badge success |
| warning | **#FF6F34** | Cảnh báo |
| warning-foreground | **#ffffff** | Text trên warning |
| warning-light | **#FFF8DA** | Nền badge warning |
| info | **#0391FF** | Thông tin |
| info-foreground | **#ffffff** | Text trên info |
| info-light | **#D9EEFF** | Nền badge info |

## Brand Colors
| Token | Brand Value | Dùng cho |
|---|---|---|
| brand-primary | **#0046C1** | Xanh Vietravel chính (= `--primary`) |
| brand-primary-dark | **#003DA8** | Hover trên primary |
| brand-primary-light | **#0391FF** | Xanh nhạt hơn |
| brand-tint | **#D9EEFF** | Tint xanh (= `--accent`) |
| brand-tint-light | **#F1F9FF** | Tint cực nhạt |
| brand-secondary | **#ED1D24** | Đỏ Vietravel (= `--secondary`) |

## Neutral Colors
| Token | Brand Value | Dùng cho |
|---|---|---|
| neutral-100 | **#191919** | Text đậm nhất |
| neutral-90 | **#000E1A** | Text chính (= `--foreground`) |
| neutral-50 | **#4D4D4D** | Text phụ đậm |
| neutral-40 | **#636363** | Text phụ (= `--muted-foreground`) |
| neutral-30 | **#999999** | Placeholder, disabled text |
| neutral-10 | **#DDDDDD** | Border (= `--border`) |
| neutral-05 | **#E5E5E5** | Divider nhạt |
| neutral-03 | **#F7F7F7** | Nền muted (= `--muted`) |
| neutral-01 | **#ffffff** | Trắng, nền chính |

## Gamification Colors (riêng cho tính năng game)
| Token | Brand Value | Dùng cho |
|---|---|---|
| gold-300 | **#f0d870** | Gradient-to XP bar |
| gold-400 | **#e8c84a** | Hover gold |
| gold-500 | **#d4af37** | XP badge, tier gold accent |
| xp-blue | **#3b82f6** | XP bar, XP badge |
| xp-blue-light | **rgba(59,130,246,0.2)** | XP badge background |
| xp-blue-border | **rgba(59,130,246,0.3)** | XP badge border |
| tier-silver | **#9ca3af** | Silver tier badge |
| tier-gold | **#d97706** | Gold tier badge |
| tier-diamond | **#7c3aed** | Diamond tier badge |
| live-red | **#ef4444** | Live badge, in-progress |

## Gradient
| Token | Brand Value |
|---|---|
| gradient-primary | `linear-gradient(90deg, #0046C1, #0391FF)` |
| gradient-gold-bar | `linear-gradient(to right, #d4af37, #f0d870)` (XP bar fill) |

## Theme
```
App dùng light mode (nền trắng).
Không có dark mode.
```

## Chart Colors (nếu cần data visualization)
| Token | Brand Value |
|---|---|
| chart-1 | **#0046C1** (xanh Vietravel) |
| chart-2 | **#ED1D24** (đỏ Vietravel) |
| chart-3 | **#007C19** (green) |
| chart-4 | **#FF6F34** (orange) |
| chart-5 | **#7c3aed** (purple) |
