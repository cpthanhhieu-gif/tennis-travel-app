# YÊU CẦU BẮT BUỘC — Trước khi thiết kế UI

> ⚠️ **BẮT BUỘC ĐỌC TOÀN BỘ FILE NÀY TRƯỚC KHI THỰC HIỆN BẤT KỲ THAY ĐỔI UI NÀO.**
> Không được bỏ qua bất kỳ mục nào. Không có ngoại lệ.

---

## 1. ĐỌC CÁC FILE DESIGN SYSTEM TRƯỚC

Trước khi code bất kỳ UI nào, phải đọc và nắm đủ các file sau:

| File | Nội dung bắt buộc nắm |
|---|---|
| `DESIGN.md` | Color palette, typography scale, spacing, border-radius, shadow, component specs |
| `UI_STANDARDS.md` | WCAG AA, Nielsen heuristics, mobile-first rules, breakpoints, animation standards |
| `tailwind.config.ts` | Custom tokens đã map sẵn — chỉ dùng class từ đây, không hardcode hex/px |
| `ui-design-system/tokens/` | Giá trị nền tảng: màu, font, spacing, effects, breakpoints |
| `ui-design-system/components/` | Spec từng component — đọc trước khi tạo mới |
| `ui-design-system/rules/` | Accessibility, layout, interaction, naming rules |

---

## 2. KIỂM TRA COMPONENT TRƯỚC KHI TẠO MỚI

### Quy trình bắt buộc:

```
1. Trước khi tạo component → tìm trong /components/ xem đã có chưa
2. Đã có → dùng lại, không tạo mới
3. Chưa có → đánh giá: component này có dùng ở ≥ 2 vị trí không?
   → Có: HỎI user trước khi tạo
   → Không: tạo inline, không tách thành component riêng
4. User nói không cần → KHÔNG tạo component mới
```

### Mục tiêu:
- **Tiết kiệm token** — không generate code thừa
- **Đồng nhất UI** — cùng 1 component, cùng 1 style ở mọi nơi
- **Tránh duplicate** — không có 2 button khác nhau làm cùng việc

---

## 3. SPACING — CHỈ DÙNG TỪ SCALE

```
✅ ĐÚNG: p-4, gap-6, mt-8, px-6
❌ SAI:  p-[14px], gap-[18px], mt-[20px]
```

Scale bắt buộc (4px base):
- `1` = 4px · `2` = 8px · `3` = 12px · `4` = 16px
- `5` = 20px · `6` = 24px · `8` = 32px · `10` = 40px · `12` = 48px · `16` = 64px

---

## 4. MÀU SẮC — CHỈ DÙNG TOKEN ĐÃ ĐỊNH NGHĨA

```
✅ ĐÚNG: text-gold-500, bg-navy-800, border-navy-600
❌ SAI:  text-[#d4af37], bg-[#1e3a5f], color: '#d4af37'
```

Không được tự ý thêm màu mới. Nếu cần màu mới → hỏi user, cập nhật `tailwind.config.ts` và `tokens/colors.md`.

---

## 5. TYPOGRAPHY — THEO TYPE SCALE

| Role | Class bắt buộc |
|---|---|
| Display | `text-5xl font-extrabold` |
| H1 | `text-4xl font-bold` |
| H2 | `text-3xl font-bold` |
| H3 | `text-2xl font-semibold` |
| Body Large | `text-lg font-normal` |
| Body | `text-base font-normal` |
| Body Small | `text-sm font-normal` |
| Caption | `text-xs font-medium` |

Font family: chỉ dùng `font-sans` (Be Vietnam Pro) và `font-mono` (JetBrains Mono).

---

## 6. INTERACTION — TIMING CHUẨN

```css
/* Hover, focus (micro) */
transition-all duration-150 ease-out

/* Expand, collapse, dropdown */
transition-all duration-250 ease-in-out

/* Page transition, modal */
transition-all duration-300 ease-in-out

/* XP bar, counter, celebration */
transition-all duration-1000 ease-out
```

Không được dùng `transition` mà không có `duration` và `ease`.

---

## 7. ACCESSIBILITY — KHÔNG ĐƯỢC BỎ QUA

- **Contrast ratio**: text thường ≥ 4.5:1, text lớn ≥ 3:1, UI components ≥ 3:1
- **Touch target**: mọi interactive element ≥ 44×44px
- **Focus ring**: bắt buộc có `focus:ring-2 focus:ring-gold-500 focus:ring-offset-2`
- **Icon-only button**: bắt buộc có `aria-label`
- **Images**: bắt buộc có `alt` text
- **Form inputs**: bắt buộc có `<label>` hoặc `aria-label`
- **Không dùng**: `outline: none` mà không thay thế bằng focus style khác

---

## 8. BORDER RADIUS — THEO QUY ĐỊNH

| Component | Class |
|---|---|
| Button | `rounded-lg` (8px) |
| Card | `rounded-xl` (12px) |
| Badge / Pill | `rounded-full` |
| Input | `rounded-lg` (8px) |
| Modal | `rounded-2xl` (16px) |
| Avatar | `rounded-full` |

Không được tự ý dùng radius khác ngoài bảng trên.

---

## 9. SHADOW — THEO LEVEL

```
Card thường:   shadow-card   → 0 4px 24px rgba(0,0,0,0.15)
Card elevated: shadow-elevated → 0 8px 32px rgba(0,0,0,0.25)
Gold glow CTA: shadow-gold  → 0 0 20px rgba(212,175,55,0.3)
```

---

## 10. RESPONSIVE — MOBILE FIRST

```
✅ ĐÚNG: class="w-full md:w-1/2 lg:w-1/3"
❌ SAI:  class="w-1/3 md:w-full" (desktop-first)
```

Target demo chính: **390px (iPhone 14 Pro)**. Phải test mobile trước, desktop sau.

---

## 11. COMPONENT STATES BẮT BUỘC

Mọi interactive component phải có đủ states:

| Component | States bắt buộc |
|---|---|
| Button | default · hover · active · disabled · loading |
| Input | default · focus · filled · error · disabled |
| Card (interactive) | default · hover · active |
| Link | default · hover · visited · focus |

Không được thiếu bất kỳ state nào trong danh sách trên.

---

## 12. ICONS — CHỈ DÙNG LUCIDE REACT

```
✅ ĐÚNG: import { Trophy, Star, MapPin } from 'lucide-react'
❌ SAI:  dùng emoji, SVG inline tùy tiện, icon library khác
```

Size chuẩn: `size={16}` · `size={20}` · `size={24}` · `size={32}`

---

## CHECKLIST TRƯỚC KHI SUBMIT CODE

- [ ] Đã đọc DESIGN.md và UI_STANDARDS.md
- [ ] Không có hardcode hex hoặc px lẻ
- [ ] Spacing dùng đúng scale
- [ ] Màu dùng đúng token
- [ ] Đã kiểm tra component có sẵn chưa
- [ ] Mọi button/input có đủ states
- [ ] Touch target ≥ 44px
- [ ] Focus ring có mặt ở mọi interactive element
- [ ] Mobile-first classes
- [ ] Transition có duration và easing
