# REQUIREMENTS_RULES — Các Quy tắc Bắt buộc

## ⚠️ Ghi chú quan trọng
Toàn bộ các rule trong file này là **BẮT BUỘC (MUST)**. Claude Code không được bỏ qua hoặc tạm thời bypass bất kỳ rule nào khi build app, kể cả khi điều đó làm tăng độ phức tạp của code.

---

## NHÓM 1 — Kỹ thuật (Technical Rules)

### T1. Framework & Setup
- **MUST** dùng Next.js 14+ với App Router (không dùng Pages Router)
- **MUST** dùng TypeScript (không dùng JavaScript thuần)
- **MUST** dùng Tailwind CSS cho styling (không dùng CSS modules hoặc styled-components)
- **MUST** dùng `next/image` cho tất cả thẻ `<img>` (không dùng HTML `<img>` trực tiếp)
- **MUST** dùng `next/font` để load font (không import CDN trong HTML)
- **MUST NOT** dùng `any` type trong TypeScript — dùng interface/type cụ thể

### T2. File Structure
- **MUST** tổ chức theo folder structure trong OVERVIEW.md
- **MUST** đặt tất cả mock data vào `lib/mock-data.ts` (không hardcode trong component)
- **MUST** tạo `components/ui/` cho primitive components (Button, Card, Badge, Input)
- **MUST** mỗi page component không vượt quá 200 dòng — tách ra sub-components nếu cần

### T3. Performance
- **MUST** tất cả ảnh có `width` và `height` attributes (tránh CLS)
- **MUST** ảnh hero dùng `priority={true}` (preload LCP)
- **MUST** dùng dynamic import cho components nặng (charts, animations)
- **MUST NOT** import toàn bộ icon library — chỉ import icon cần dùng:
  ```typescript
  // ĐÚNG
  import { Trophy, Star } from 'lucide-react'
  // SAI
  import * as Icons from 'lucide-react'
  ```

### T4. State Management
- **MUST** dùng React `useState` và `useContext` (không cần Redux/Zustand cho prototype)
- **MUST** tạo `BookingContext` để share booking state giữa các step
- **MUST** persist user tier và XP trong `localStorage` để giữ state khi reload

### T5. Error Handling
- **MUST** mọi component có error boundary hoặc fallback UI
- **MUST** loading skeleton thay vì spinner trơn cho content sections
- **MUST NOT** để màn hình trắng khi component đang load

---

## NHÓM 2 — Giao diện (UI Rules)

### U1. Responsive — BẮT BUỘC cho mọi component
- **MUST** mọi layout hoạt động đúng ở 3 breakpoint: 390px / 768px / 1440px
- **MUST** kiểm tra bằng Chrome DevTools trước khi coi là xong
- **MUST NOT** có horizontal scroll ở bất kỳ breakpoint nào
- **MUST NOT** có text overflow tràn ra ngoài container

### U2. Touch Targets
- **MUST** tất cả button, link, checkbox, radio có min-height và min-width 44px
- **MUST NOT** đặt 2 tap targets cách nhau < 8px

### U3. Typography
- **MUST** không có text nhỏ hơn 12px trong UI (kể cả caption)
- **MUST** line-height tối thiểu 1.4 cho body text
- **MUST NOT** dùng quá 2 font-weight khác nhau trong 1 component
- **MUST** số liệu quan trọng (XP, giá, FEI score) in đậm ≥ font-weight 600

### U4. Color & Contrast
- **MUST** mọi text trên nền tối đạt contrast ratio ≥ 4.5:1 (WCAG AA)
- **MUST** không truyền thông tin chỉ bằng màu sắc — luôn kèm icon hoặc text
- **MUST NOT** dùng màu ngoài palette đã định nghĩa trong DESIGN.md

### U5. Spacing & Layout
- **MUST** padding container: `px-4` (mobile) / `px-6` (tablet) / `px-8` (desktop)
- **MUST** section spacing: `py-12` (mobile) / `py-16` (desktop)
- **MUST NOT** có 2 section liền nhau không có visual separator (spacing hoặc divider)

### U6. Loading States
- **MUST** mọi trang có skeleton loading khi lần đầu mount
- **MUST** buttons disable + show spinner khi đang xử lý action
- **MUST** thời gian skeleton hiển thị tối thiểu 600ms (dùng mock delay) để demo mượt

### U7. Empty States
- **MUST** có empty state UI nếu list có thể rỗng (icon + text + CTA)

---

## NHÓM 3 — Accessibility (A11y Rules)

### A1. Semantic HTML
- **MUST** dùng đúng HTML elements: `<nav>`, `<main>`, `<section>`, `<article>`, `<button>`, `<a>`
- **MUST NOT** dùng `<div>` hoặc `<span>` làm button/link nếu có thể dùng element gốc
- **MUST** mỗi page có đúng 1 thẻ `<h1>`
- **MUST** heading hierarchy đúng: h1 → h2 → h3 (không skip)

### A2. Form Accessibility
- **MUST** mọi `<input>` có `<label>` liên kết bằng `htmlFor` + `id`
- **MUST** required fields có `aria-required="true"`
- **MUST** error messages liên kết với field bằng `aria-describedby`
- **MUST NOT** dùng placeholder thay thế label

### A3. Images
- **MUST** mọi ảnh có `alt` attribute có nghĩa
- **MUST** ảnh decorative có `alt=""`
- **MUST** icons có `aria-hidden="true"` nếu đi kèm text

### A4. Focus Management
- **MUST** focus ring visible rõ ràng: `focus:ring-2 focus:ring-gold-500`
- **MUST NOT** dùng `outline: none` mà không có focus alternative
- **MUST** khi modal mở, focus di chuyển vào modal; khi đóng, focus trả về trigger

### A5. Live Regions
- **MUST** XP toast notifications dùng `role="status"` hoặc `aria-live="polite"`
- **MUST** Error messages dùng `role="alert"`

---

## NHÓM 4 — Content (Content Rules)

### C1. Ngôn ngữ
- **MUST** toàn bộ nội dung tiếng Việt (không lẫn tiếng Anh trong UI text)
- **MUST** ngoại lệ được phép giữ tiếng Anh: "NTRP", "FEI", "XP", "SBU", "LEI", "ESG" (thuật ngữ chuyên ngành)
- **MUST** số tiền theo định dạng VN: "5.800.000 đ" hoặc "5,8 triệu VNĐ"
- **MUST** ngày tháng theo định dạng VN: "14/06/2026" hoặc "Thứ Bảy, 14 tháng 6, 2026"

### C2. Tính nhất quán Data
- **MUST** tên user mock nhất quán toàn app: "Nguyễn Minh Khoa"
- **MUST** XP mock nhất quán: 1.240 XP, tier Silver
- **MUST** tour mock nhất quán: Đà Nẵng 3N2D, 13–15/06/2026
- **MUST** FEI score mock nhất quán: tổng 89/100
- **MUST NOT** có dữ liệu mâu thuẫn giữa các màn hình

### C3. Số liệu từ tài liệu gốc — Không được thay đổi
Các số liệu sau phải dùng đúng theo tài liệu gốc của sản phẩm:
- Thị trường: 1,5 triệu người chơi VN · 106 triệu toàn cầu · 264 sân chính thống VN
- LEI: 84/100 · ESG: 89/100 · FEI target: ≥85/100
- Tỷ lệ nữ: 40% (ITF) · Tăng trưởng: +30%/5 năm
- SBU 1: 4–8 triệu · SBU 2: 8–18 triệu · SBU 3: 25–60 triệu
- ROI: 186% sau 24 tháng · Điểm hoà vốn: tháng 5 sau ra mắt
- XP tiers: Bronze 0–999 · Silver 1.000–2.999 · Gold 3.000–6.999 · Diamond 7.000+

---

## NHÓM 5 — Navigation & Flow (UX Rules)

### N1. Navigation
- **MUST** Bottom navigation hiển thị trên mobile (< 768px)
- **MUST** Top navigation hiển thị trên desktop (≥ 768px)
- **MUST** active tab/link được highlight rõ ràng
- **MUST** logo luôn là link về trang Home

### N2. Booking Flow
- **MUST** step indicator hiển thị ở top (Bước 1/4, 2/4, 3/4, 4/4)
- **MUST** nút "Quay lại" ở mọi bước (không trap user)
- **MUST** nút "Tiếp tục" disable cho đến khi bước hiện tại hoàn thành
- **MUST** confirm dialog "Bạn có chắc muốn hủy?" nếu user bấm back ở bước 3 trở đi

### N3. CTA Hierarchy
- Mỗi màn hình chỉ có **1 Primary CTA** (gold button)
- Secondary actions dùng ghost/outline button
- Destructive actions (hủy, xóa) dùng màu đỏ/xám

### N4. External Links
- **MUST** link ngoài (nếu có) mở tab mới: `target="_blank" rel="noopener noreferrer"`

---

## NHÓM 6 — Deploy & Production Readiness

### D1. Environment
- **MUST** tạo file `.env.local.example` với list tất cả env variables (không commit `.env.local`)
- **MUST** tạo file `.gitignore` đúng chuẩn Next.js (bao gồm `node_modules`, `.env.local`, `.next`)

### D2. Build
- **MUST** `npm run build` phải chạy thành công không có error trước khi commit
- **MUST** không có TypeScript errors (`npm run type-check`)
- **MUST NOT** có `console.error` hoặc uncaught promise rejections

### D3. README
- **MUST** tạo `README.md` với hướng dẫn:
  1. Clone repo
  2. `npm install`
  3. `npm run dev` (chạy local)
  4. URL local: `http://localhost:3000`
  5. Cấu trúc thư mục
  6. Cách deploy lên Vercel

### D4. Vercel Config
- **MUST** tạo file `vercel.json` với config cơ bản:
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next"
}
```

---

## CHECKLIST trước khi bàn giao

Claude Code phải tự kiểm tra toàn bộ danh sách này trước khi báo "Done":

**Technical**
- [ ] `npm run build` chạy OK, không error
- [ ] `npm run dev` chạy OK tại localhost:3000
- [ ] Không có TypeScript errors
- [ ] Tất cả 6 routes hoạt động: `/`, `/booking`, `/pre-tour`, `/in-tour`, `/gamification`, `/share-card`

**Responsive**
- [ ] Mobile 390px: layout đúng, không overflow
- [ ] Tablet 768px: layout đúng
- [ ] Desktop 1440px: layout đúng

**Content**
- [ ] Tên user nhất quán: "Nguyễn Minh Khoa"
- [ ] XP nhất quán: 1.240 XP, Silver tier
- [ ] Tour nhất quán: Đà Nẵng 3N2D, 13–15/06/2026
- [ ] Tất cả số liệu khớp với tài liệu gốc

**UX Flow**
- [ ] Happy path từ Home → Share Card chạy hoàn chỉnh
- [ ] Booking flow 4 bước hoạt động đúng
- [ ] NTRP quiz 5 câu hoạt động
- [ ] XP animation khi vào màn Gamification
- [ ] Share Card generate và hiển thị đúng
- [ ] Voucher 10% hiển thị ở Auto-Loop section

**Accessibility**
- [ ] Không có console errors accessibility warnings
- [ ] Tab navigation hoạt động qua toàn bộ interactive elements
- [ ] Mọi ảnh có alt text
