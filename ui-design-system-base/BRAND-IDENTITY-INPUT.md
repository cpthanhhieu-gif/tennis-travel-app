# BRAND IDENTITY INPUT
> Source: DESIGN.md — Tennis Travel Experience by Vietravel
> Trạng thái: ĐÃ ĐIỀN ĐỦ — sẵn sàng map vào token files + tailwind.config.ts

---

## 1. THÔNG TIN DỰ ÁN

```
Tên dự án      : Tennis Travel Experience
Tên thương hiệu: Tennis Travel Experience by Vietravel
Sub-brand      : Ace & Taste Journey
Định vị        : Premium · Athletic · Sophisticated · Vietnamese Soul
Target user    : Tennis player 25-45 tuổi, mobile-first, tiếng Việt, thu nhập cao
```

---

## 2. COLORS — Màu sắc

### 2.1 Primary Color
```
primary            : #d4af37   (gold-500 — CTA, highlights)
primary-hover      : #e8c84a   (gold-400)
primary-active     : #f0d870   (gold-300)
primary-light      : rgba(212,175,55,0.1)
primary-foreground : #0a1628   (navy-900 — chữ trên nền gold)
```

### 2.2 Secondary Color
```
secondary            : #b45309   (bronze-600)
secondary-hover      : #92400e
secondary-foreground : #ffffff
```

### 2.3 Background & Surface
```
background      : #0a1628   (navy-900 — nền trang chính)
surface / card  : #1e4976   (navy-700 — nền card)
surface-raised  : #1e3a5f   (navy-800 — nền dropdown, popover, dark card)
```

### 2.4 Text Colors
```
text-default    : #ffffff   (trắng — chữ chính trên nền tối)
text-muted      : #d1d5db   (gray-300 — chữ phụ)
text-disabled   : #6b7280   (gray-500)
text-on-primary : #0a1628   (navy-900 — chữ trên nền gold)
text-on-dark    : #ffffff
```

### 2.5 Border & Divider
```
border-default  : #1a6091   (navy-600)
border-focus    : #d4af37   (gold-500)
border-error    : #ef4444   (live-red)
```

### 2.6 Semantic Colors
```
success            : #10b981   (Completed, FEI passed)
success-light      : rgba(16,185,129,0.1)
error / destructive: #ef4444   (live-red — lỗi, in-progress)
error-light        : rgba(239,68,68,0.1)
warning            : #f59e0b
warning-light      : rgba(245,158,11,0.1)
info               : #3b82f6   (xp-blue)
info-light         : rgba(59,130,246,0.1)
```

### 2.7 Dark Mode
```
Có dark mode không? : Không — app thuần dark theme, không có light mode
```

### 2.8 Brand Extra
```
gradient-from   : #d4af37   (gold-500)
gradient-to     : #f0d870   (gold-300)
gradient-angle  : 90deg

shadow-brand (card)    : 0 4px 24px rgba(0,0,0,0.15)
shadow-brand (elevated): 0 8px 32px rgba(0,0,0,0.25)
shadow-brand (gold glow): 0 0 20px rgba(212,175,55,0.3)

Gamification colors:
  xp-blue        : #3b82f6
  tier-silver    : #9ca3af
  tier-gold      : #d97706
  tier-diamond   : #7c3aed
  live-red       : #ef4444   (animate-pulse)
```

---

## 3. TYPOGRAPHY

### 3.1 Font Family
```
font-primary (sans)  : Be Vietnam Pro
  Nguồn              : Google Fonts
  Fallback           : Inter, system-ui, sans-serif

font-secondary       : (không có — heading dùng cùng font-primary)

font-mono            : JetBrains Mono
  Nguồn              : Google Fonts
  Dùng cho           : scores, numbers, stats
```

### 3.2 Font Size Base
```
base-font-size  : 16px
```

### 3.3 Type Scale
```
Display : 48px  weight: 800  line-height: 1.1
H1      : 36px  weight: 700  line-height: 1.2
H2      : 28px  weight: 700  line-height: 1.25
H3      : 22px  weight: 600  line-height: 1.3
Body Lg : 18px  weight: 400  line-height: 1.6
Body    : 16px  weight: 400  line-height: 1.6
Body Sm : 14px  weight: 400  line-height: 1.5
Caption : 12px  weight: 500  line-height: 1.4
```

---

## 4. SHAPE

### 4.1 Border Radius
```
Phong cách tổng thể : Rounded-Premium (8-16px)

radius-button  : 8px    (rounded-lg)
radius-input   : 8px    (rounded-lg)
radius-card    : 12px   (rounded-xl)
radius-badge   : 9999px (rounded-full)
radius-modal   : 16px   (rounded-2xl)
radius-avatar  : 9999px (rounded-full)
radius-progress: 9999px (rounded-full)
```

---

## 5. ICON LIBRARY

```
Thư viện icon      : Lucide React
Icon size mặc định : 20px (inline), 24px (standalone)

Mapping chức năng → icon:
  Tennis / Zap     : Zap
  Food / FEI       : UtensilsCrossed
  Resort           : Building2
  XP / Trophy      : Trophy
  Share            : Share2
  Live             : Radio
  Timer            : Timer
  Coach            : User
  Location         : MapPin
  Calendar         : Calendar
  Rating           : Star
  Arrow            : ChevronRight
```

---

## 6. SPACING & LAYOUT

```
Spacing base unit   : 4px
Page margin mobile  : 16px  (px-4)
Page margin desktop : 24px  (px-6)
Max content width   : 1280px
Section gap         : 48px  (gap-12)
Component gap       : 24px  (gap-6)

Breakpoints (Tailwind default):
  sm  : 640px   (tablet nhỏ)
  md  : 768px   (tablet)
  lg  : 1024px  (laptop)
  xl  : 1280px  (desktop)
  2xl : 1536px  (wide)

Target demo chính   : 390px (iPhone 14 Pro)
```

---

## 7. ANIMATION PREFERENCE

```
Phong cách animation          : Expressive (có micro-interaction, XP bar, celebration)
prefers-reduced-motion support: Có

Timing chuẩn:
  Micro (hover, focus)   : 100-200ms  ease-out
  Transition (modal,page): 200-300ms  ease-in-out
  Complex (XP, counter)  : 500-1000ms ease-out
  Celebration (badge)    : 600ms      spring

Animations đặc biệt:
  - XP bar fill on mount : transition-all duration-1000 ease-out
  - Live badge           : animate-pulse (dot đỏ)
  - Toast XP             : slide-in từ dưới, fade-out sau 3s
  - Card hover           : hover:scale-[1.02] transition-transform duration-200
  - Page transition      : Framer Motion AnimatePresence (fade + slide-up y:20→0, 0.3s)
  - Score counter        : useCountUp khi vào màn gamification
```

---

## 8. ĐẶC THÙ DỰ ÁN

```
Màu TUYỆT ĐỐI không dùng : Màu trắng làm nền chính (app là dark theme)

Component đặc biệt cần có :
  - XP Progress Bar (gamification)
  - Tier Badge (Silver / Gold / Diamond)
  - Live Badge (animate-pulse)
  - Countdown Timer
  - Score Counter (animated)
  - Bottom Navigation (5 tabs mobile)
  - Booking Progress Steps (Bước 1/4...)
  - FEI Score Display
  - NTRP Badge

Yêu cầu ngôn ngữ    : Tiếng Việt — định dạng tiền "5.800.000 ₫", ngày "Thứ Bảy, 14/06/2026"
Có gamification     : Có — XP, tier (Bronze/Silver/Gold/Diamond), badge unlock
Có live/realtime    : Có — Live badge nhấp nháy, countdown timer, trạng thái trận đấu

Thumb zone (mobile) : Primary CTA ("Đặt ngay", "Tiếp tục") đặt ở bottom
Bottom nav          : 5 tabs — Trang chủ / Đặt tour / Hành trình / Thành tích / Thẻ của tôi
Safe area           : Hỗ trợ iOS notch + home indicator (env(safe-area-inset-*))
```

---

## CHECKLIST

- [x] Đã điền đủ Primary Color (2.1)
- [x] Đã điền Background & Surface (2.3)
- [x] Đã điền Text Colors (2.4)
- [x] Đã điền Semantic Colors (2.6)
- [x] Đã điền Font Family (3.1)
- [x] Đã điền Border Radius style (4.1)
- [x] Đã chọn Icon Library (5)
