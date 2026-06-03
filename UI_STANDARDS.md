# UI_STANDARDS — Tiêu chuẩn UI Quốc tế

## Tổng quan
File này định nghĩa các tiêu chuẩn UI/UX quốc tế bắt buộc áp dụng trong quá trình build app Tennis Travel Experience. Claude Code phải tuân thủ toàn bộ các tiêu chuẩn này khi generate code.

---

## 1. WCAG 2.1 — Web Content Accessibility Guidelines

### Mức độ áp dụng: AA (bắt buộc) + một số AAA (khuyến nghị)

### 1.1 Tương phản màu sắc (Color Contrast)
- **Text thường** (< 18px): Tỷ lệ tương phản tối thiểu **4.5:1**
- **Text lớn** (≥ 18px bold hoặc ≥ 24px): Tối thiểu **3:1**
- **UI components** (button, input border): Tối thiểu **3:1**

Kiểm tra cặp màu chính:
| Foreground | Background | Contrast Ratio | Status |
|---|---|---|---|
| `#ffffff` (white) | `#1e3a5f` (navy-800) | 9.8:1 | ✅ AAA |
| `#d4af37` (gold) | `#1e3a5f` (navy-800) | 5.2:1 | ✅ AA |
| `#d4af37` (gold) | `#0a1628` (navy-900) | 6.1:1 | ✅ AA |
| `#1a1a1a` (dark) | `#f5f5f5` (gray-100) | 16.7:1 | ✅ AAA |

### 1.2 Keyboard Navigation
- Tất cả interactive elements phải có thể focus bằng `Tab`
- Focus indicator phải visible rõ ràng (không dùng `outline: none` mà không thay thế)
- Focus style: `ring-2 ring-gold-500 ring-offset-2`
- Thứ tự Tab phải hợp lý theo luồng đọc (logical tab order)

### 1.3 Semantic HTML
```html
<!-- ĐÚNG -->
<nav aria-label="Điều hướng chính">...</nav>
<main>...</main>
<section aria-labelledby="section-title">...</section>
<button type="button">Đặt tour</button>

<!-- SAI -->
<div onclick="...">Click me</div>
<span class="btn">Submit</span>
```

### 1.4 ARIA Labels
- Mọi icon-only button phải có `aria-label`
- Form inputs phải có `<label>` liên kết hoặc `aria-label`
- Images phải có `alt` text có nghĩa
- Loading states: `aria-busy="true"` khi đang load

### 1.5 Text Alternatives
- Images: `alt="Sân tennis tại Fusion Maia Resort Đà Nẵng"`
- Decorative images: `alt=""`
- Icons đơn lẻ: `aria-hidden="true"` + text ẩn cho screen reader

---

## 2. Nielsen's 10 Usability Heuristics

### 1. Visibility of System Status
> App luôn thông báo cho người dùng biết chuyện gì đang xảy ra

**Áp dụng:**
- Loading spinner khi fetch data (mọi async action)
- Progress bar ở Booking Flow (Bước 1/4, 2/4...)
- Toast notification khi XP tăng ("🎾 +100 XP!")
- Badge "LIVE 🔴" nhấp nháy khi trận đấu đang diễn ra
- Trạng thái timeline: ✅ Đã xong / 🔴 Đang diễn ra / ⏳ Sắp tới

### 2. Match Between System and the Real World
> Dùng ngôn ngữ và khái niệm người dùng đã quen

**Áp dụng:**
- Dùng "Đặt tour" không phải "Submit booking"
- Dùng "NTRP" vì đây là thuật ngữ tennis phổ biến trong cộng đồng
- Icon trực quan: 🎾 cho tennis, 🍽️ cho ẩm thực, 🏨 cho resort
- Ngày tháng theo định dạng VN: "Thứ Bảy, 14/06/2026" không phải "2026-06-14"

### 3. User Control and Freedom
> Người dùng có thể thoát và undo dễ dàng

**Áp dụng:**
- Booking flow có nút "← Quay lại" ở mỗi bước
- Modal thành công có nút đóng rõ ràng
- Không auto-redirect sau < 2 giây mà không có countdown

### 4. Consistency and Standards
> Các element giống nhau có cùng hành vi ở mọi nơi

**Áp dụng:**
- Primary CTA luôn là màu gold, ở vị trí bottom-right hoặc center
- "Đặt ngay" luôn dẫn đến /booking
- XP badge luôn màu xanh dương
- Tất cả card có padding p-6 và border-radius xl

### 5. Error Prevention
> Thiết kế ngăn lỗi xảy ra trước

**Áp dụng:**
- Disable nút "Tiếp tục" nếu chưa chọn đủ thông tin
- Confirm dialog trước khi hủy booking
- Input số người: chỉ cho nhập số, min=1 max=20
- Calendar: disable các ngày đã qua

### 6. Recognition over Recall
> Thông tin cần thiết luôn hiển thị, không bắt nhớ

**Áp dụng:**
- Booking summary luôn hiển thị side bar (desktop) hoặc sticky bottom (mobile)
- Tier badge luôn hiển thị trong header/profile
- FEI score hiển thị ngay trên từng bữa ăn, không chỉ ở trang riêng

### 7. Flexibility and Efficiency of Use
> Người dùng thành thạo có shortcut, người mới vẫn dùng được

**Áp dụng:**
- Bottom nav để điều hướng nhanh giữa các section
- "Xem tất cả" ở mọi danh sách rút gọn
- Hero CTA dẫn thẳng vào /booking (skip phần scroll)

### 8. Aesthetic and Minimalist Design
> Chỉ hiển thị thông tin thực sự cần thiết

**Áp dụng:**
- Mỗi card chỉ hiển thị 3–4 thông tin key
- Không nhồi nhét quá 3 CTA trên 1 màn hình
- White space rộng rãi, không tạo cảm giác chật chội
- Màu sắc tối đa 3 màu chính trên 1 màn hình

### 9. Help Users Recognize, Diagnose, Recover from Errors
> Thông báo lỗi rõ ràng, nhân văn

**Áp dụng:**
- Error state: text đỏ + icon cảnh báo + hướng dẫn sửa cụ thể
- Không viết "Error 404" → viết "Không tìm thấy trang này. Quay về trang chủ?"
- Validate form inline, không đợi submit mới báo lỗi

### 10. Help and Documentation
> Hướng dẫn dễ tìm khi cần

**Áp dụng:**
- Tooltip giải thích "NTRP là gì?" khi hover vào badge NTRP
- Tooltip giải thích "FEI score được tính như thế nào?"
- FAQ section trên trang Home (accordion, collapsible)

---

## 3. Mobile-First Design (iOS HIG & Material Design 3)

### Touch Targets
- **Minimum tap target:** 44×44px (iOS HIG) / 48×48dp (Material)
- Áp dụng cho: tất cả button, icon button, checkbox, radio, link
- Nếu visual nhỏ hơn, dùng padding ẩn để đạt 44px:
```css
.icon-btn {
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### Thumb Zone (vùng ngón cái)
- **Safe zone** (dễ chạm nhất): 2/3 phần dưới màn hình
- Primary CTA ("Đặt ngay", "Tiếp tục") → đặt ở bottom, không phải top
- Bottom navigation → thumb-friendly cho các màn hình 6"+

### Spacing trên Mobile
- Body padding: `px-4` (16px) ở màn hình < 640px
- Spacing tối thiểu giữa 2 tap targets: 8px
- Scroll tự nhiên, không dùng horizontal scroll ẩn

### Gestures
- Back swipe (iOS): không block gesture mặc định
- Pull-to-refresh: hỗ trợ nếu có data list
- Swipe to dismiss: cho modal/bottom sheet

### Safe Areas (notch, home indicator)
```css
/* Hỗ trợ iPhone notch và home indicator */
padding-top: env(safe-area-inset-top);
padding-bottom: env(safe-area-inset-bottom);
```

---

## 4. Responsive Breakpoints

```css
/* Tailwind config */
screens: {
  'sm': '640px',   /* Tablet nhỏ */
  'md': '768px',   /* Tablet */
  'lg': '1024px',  /* Laptop */
  'xl': '1280px',  /* Desktop */
  '2xl': '1536px', /* Wide screen */
}

/* Target chính cho demo video: 390px (iPhone 14 Pro) */
```

### Layout per breakpoint
| Breakpoint | Layout |
|---|---|
| < 640px (mobile) | Single column, bottom nav, cards full-width |
| 640–1023px (tablet) | 2 columns grid, side nav optional |
| ≥ 1024px (desktop) | 3 columns grid, top nav, sidebar |

---

## 5. Performance Standards (Core Web Vitals)

| Metric | Target | Ý nghĩa |
|---|---|---|
| LCP (Largest Contentful Paint) | < 2.5s | Thời gian load nội dung chính |
| FID / INP (Interaction to Next Paint) | < 200ms | Độ phản hồi tương tác |
| CLS (Cumulative Layout Shift) | < 0.1 | Tránh layout "nhảy" |
| FCP (First Contentful Paint) | < 1.8s | Lần đầu thấy nội dung |

### Kỹ thuật đạt target
- Dùng `next/image` cho tất cả ảnh (lazy load + WebP tự động)
- Font: dùng `next/font` với `display: swap`
- Ảnh hero: `priority` prop để preload
- Không import toàn bộ thư viện, dùng tree-shaking
- Mock data tĩnh → không có API latency

---

## 6. Internationalization (i18n) — Tiếng Việt

### Số và tiền tệ
```typescript
// ĐÚNG
const formatVND = (amount: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount)
// → "5.800.000 ₫"

// Hoặc viết tắt
const formatVNDShort = (amount: number) =>
  `${(amount / 1000000).toFixed(1)} triệu VNĐ`
// → "5.8 triệu VNĐ"
```

### Ngày tháng
```typescript
// ĐÚNG — định dạng VN
"Thứ Bảy, 14/06/2026"

// Dùng Intl
new Intl.DateTimeFormat('vi-VN', {
  weekday: 'long',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
}).format(new Date('2026-06-14'))
```

### Thứ tự họ tên
- VN: Họ + Tên đệm + Tên
- Hiển thị full: "Nguyễn Minh Khoa"
- Gọi thân mật: "Khoa" (tên cuối)

---

## 7. Motion & Animation Standards

### Thời lượng animation chuẩn
| Loại | Duration | Easing |
|---|---|---|
| Micro (hover, focus) | 100–200ms | ease-out |
| Transition (page, modal) | 200–300ms | ease-in-out |
| Complex (XP bar, counter) | 500–1000ms | ease-out |
| Celebration (badge unlock) | 600ms | spring |

### Prefers Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```
Hoặc dùng Framer Motion's `useReducedMotion()`.

### Không dùng animation khi
- Nội dung quan trọng về thông tin (bảng giá, điều khoản)
- Animation kéo dài > 5 giây trên loop
- Flashing > 3 lần/giây (nguy cơ epilepsy)
