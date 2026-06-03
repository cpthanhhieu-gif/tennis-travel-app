# DESIGN — Hệ thống thiết kế

## Brand Identity
**Tên thương hiệu:** Tennis Travel Experience by Vietravel
**Sub-brand:** Ace & Taste Journey
**Định vị visual:** Premium · Athletic · Sophisticated · Vietnamese Soul

---

## Color Palette

### Primary Colors
| Token | Hex | Dùng cho |
|---|---|---|
| `navy-900` | `#0a1628` | Background tối, header |
| `navy-800` | `#1e3a5f` | Primary background |
| `navy-700` | `#1e4976` | Card backgrounds |
| `navy-600` | `#1a6091` | Borders, dividers |

### Accent Colors (Gold/Bronze)
| Token | Hex | Dùng cho |
|---|---|---|
| `gold-500` | `#d4af37` | Primary CTA, highlights |
| `gold-400` | `#e8c84a` | Hover state |
| `gold-300` | `#f0d870` | Light accent |
| `bronze-600` | `#b45309` | Secondary accent, SBU2 |

### Neutral Colors
| Token | Hex | Dùng cho |
|---|---|---|
| `white` | `#ffffff` | Text on dark bg |
| `gray-100` | `#f5f5f5` | Light backgrounds |
| `gray-300` | `#d1d5db` | Muted text |
| `gray-500` | `#6b7280` | Placeholder text |

### Semantic Colors
| Token | Hex | Dùng cho |
|---|---|---|
| `success` | `#10b981` | Completed, FEI passed |
| `live-red` | `#ef4444` | Live badge, in-progress |
| `xp-blue` | `#3b82f6` | XP bar, gamification |
| `tier-silver` | `#9ca3af` | Silver tier |
| `tier-gold` | `#d97706` | Gold tier |
| `tier-diamond` | `#7c3aed` | Diamond tier |

---

## Typography

### Font Stack
```css
/* Heading */
font-family: 'Be Vietnam Pro', 'Inter', sans-serif;

/* Body */
font-family: 'Be Vietnam Pro', system-ui, sans-serif;

/* Monospace (scores, numbers) */
font-family: 'JetBrains Mono', monospace;
```

### Type Scale
| Role | Size | Weight | Line Height |
|---|---|---|---|
| Display | 48px / 3rem | 800 | 1.1 |
| H1 | 36px / 2.25rem | 700 | 1.2 |
| H2 | 28px / 1.75rem | 700 | 1.25 |
| H3 | 22px / 1.375rem | 600 | 1.3 |
| Body Large | 18px / 1.125rem | 400 | 1.6 |
| Body | 16px / 1rem | 400 | 1.6 |
| Body Small | 14px / 0.875rem | 400 | 1.5 |
| Caption | 12px / 0.75rem | 500 | 1.4 |

---

## Spacing System
Dùng bội số 4px:
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px
- `3xl`: 64px

---

## Border Radius
| Component | Radius |
|---|---|
| Button | 8px (rounded-lg) |
| Card | 12px (rounded-xl) |
| Badge | 20px (rounded-full) |
| Input | 8px (rounded-lg) |
| Modal | 16px (rounded-2xl) |
| Avatar | 50% (circle) |

---

## Shadows
```css
/* Card shadow */
box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);

/* Elevated card */
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);

/* Gold glow (CTA, active elements) */
box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
```

---

## Component Specs

### Button
```
Primary:   bg-gold-500  text-navy-900  font-600  px-24  py-12  rounded-lg
           hover: bg-gold-400, shadow gold glow
Secondary: border-gold-500  text-gold-500  bg-transparent
           hover: bg-gold-500/10
Ghost:     text-white  bg-white/10
           hover: bg-white/20
```

### Card
```
Background:   bg-navy-700  border border-navy-600
Dark card:    bg-navy-800/80  backdrop-blur-sm
Light card:   bg-white/95 (dùng trên nền sáng)
Padding:      p-6 (24px)
```

### Badge
```
Live:       bg-red-500  text-white  text-xs  font-700  px-3 py-1  rounded-full  animate-pulse
Tier Silver: bg-gray-400  text-white
Tier Gold:   bg-amber-500  text-white
Tier Diamond: bg-purple-600  text-white
XP:          bg-blue-500/20  text-blue-300  border border-blue-500/30
```

### Progress Bar (XP)
```
Track:   bg-navy-600  h-3  rounded-full
Fill:    bg-gradient-to-r from-gold-500 to-gold-300  rounded-full
Animate: transition-all duration-1000 ease-out
```

### Input
```
Background: bg-navy-700  border border-navy-600
Text:       text-white  placeholder-gray-400
Focus:      border-gold-500  ring-2 ring-gold-500/20
```

### Navigation (Bottom Nav — Mobile)
```
5 tabs: Trang chủ / Đặt tour / Hành trình / Thành tích / Thẻ của tôi
Icons:  Lucide React
Active: text-gold-500  border-t-2 border-gold-500
```

---

## Icons
Dùng **Lucide React** cho tất cả icons.

Mapping chức năng → icon:
| Chức năng | Icon |
|---|---|
| Tennis | `Zap` hoặc SVG tùy chỉnh |
| Food/FEI | `UtensilsCrossed` |
| Resort/Nghỉ dưỡng | `Building2` |
| Gamification/XP | `Trophy` |
| Share | `Share2` |
| Live | `Radio` |
| Timer/Countdown | `Timer` |
| HLV/Coach | `User` |
| Check-in | `MapPin` |
| Calendar | `Calendar` |
| Star/Rating | `Star` |
| Arrow | `ChevronRight` |

---

## Imagery Guidelines

### Ảnh sân tennis
- Chụp từ góc thấp, ánh sáng vàng cuối chiều
- Background là resort/biển, không phải sân thương mại
- Keywords Unsplash: "tennis court resort luxury", "tennis sea view"

### Ảnh ẩm thực FEI
- Close-up đẹp, ánh sáng tự nhiên
- Tập trung nguyên liệu địa phương (rau, hải sản)
- Keywords: "Vietnamese seafood fine dining", "local food plating"

### Ảnh resort
- View từ trên cao hoặc góc rộng bao quát
- Thể hiện bể bơi + biển + cọ dừa
- Keywords: "luxury resort Vietnam beach", "Da Nang five star resort"

### Ảnh avatar HLV
- Professional, mặc trang phục thể thao
- Nền sân tennis hoặc resort
- Dùng ảnh placeholder đẹp từ thư viện ui-avatars.com hoặc pravatar.cc

---

## Animation Guidelines

### Micro-interactions
- Button hover: `transition-all duration-200`
- Card hover: `hover:scale-[1.02] transition-transform duration-200`
- XP bar fill: `transition-all duration-1000 ease-out` (on mount)
- Toast XP: slide in từ dưới, fade out sau 3s

### Page transitions
- Dùng Framer Motion `AnimatePresence`
- Fade + slide up: `opacity 0→1, y 20→0, duration 0.3s`

### Live badge
- `animate-pulse` trên dot đỏ để thể hiện realtime

### Score counter
- Số đếm lên khi vào màn gamification (`useCountUp`)
