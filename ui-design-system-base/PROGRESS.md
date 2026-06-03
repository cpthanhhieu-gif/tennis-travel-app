# TIẾN ĐỘ — UI Design System
> Cập nhật lần cuối: 2026-06-02

## Mục tiêu
Chuyển toàn bộ UI app Tennis Travel sang Design System mới: **light mode · nền trắng · xanh Vietravel `#0046C1` · font Be Vietnam Pro · chuẩn UI quốc tế · 100% token name (không hardcode).**

---

## Tiến độ tổng thể: 100% ✅

| Phase | Tên | Trạng thái |
|---|---|---|
| Phase 1 | Tài liệu Design System | ✅ 100% |
| Phase 2 | Setup kỹ thuật | ✅ 100% |
| Phase 3 | Áp dụng UI thực tế | ✅ 100% (18/18 bước) |

---

## Phase 1 — Tài liệu Design System ✅ 100%

| File | Trạng thái |
|---|---|
| `BRAND-IDENTITY-INPUT.md` | ✅ |
| `MANDATORY-RULES.md` | ✅ Light theme, xanh Vietravel + Mục 14: Chuẩn hóa tên class |
| `tokens/colors.md` | ✅ Light theme, xanh Vietravel |
| `tokens/typography.md` | ✅ Be Vietnam Pro |
| `tokens/spacing.md` | ✅ 4px base |
| `tokens/effects.md` | ✅ Radius, shadow, z-index |
| `tokens/breakpoints.md` | ✅ |
| `components/button.md` | ✅ 6 variants, brand values xanh Vietravel |
| `components/card.md` | ✅ |
| `components/form.md` | ✅ |
| `components/feedback.md` | ✅ |
| `components/typography.md` | ✅ Be Vietnam Pro scale |
| `components/navigation.md` | ✅ Light, xanh Vietravel |
| `rules/accessibility.md` | ✅ |
| `rules/layout-rules.md` | ✅ |
| `rules/interaction-rules.md` | ✅ |
| `rules/naming-conventions.md` | ✅ |

---

## Phase 2 — Setup kỹ thuật ✅ 100%

| Việc | Trạng thái | Ghi chú |
|---|---|---|
| Backup dự án | ✅ | `tennis-travel-app-backup-20260602` |
| Token mới trong `globals.css` | ✅ | Thêm vào `@theme`, không đụng code cũ |
| Shadcn variables trong `globals.css` | ✅ | Đang comment — kích hoạt ở Phase 3 |
| `CLAUDE.md` → bắt buộc đọc `MANDATORY-RULES.md` | ✅ | |

---

## Phase 3 — Áp dụng UI thực tế ✅ 100% (18/18 bước)

### ✅ Hoàn thành (Bước 1–18)

| Bước | File(s) | Kết quả |
|---|---|---|
| 1 | `app/layout.tsx` + `globals.css` | Font Be Vietnam Pro, CSS var layout dimensions |
| 2 | `components/layout/BottomNav.tsx` | z-[200], icon 24px, inactive `text-neutral-30`, label text-xs |
| 3 | `components/layout/Navbar.tsx` | z-[200] |
| 4 | `components/layout/PageWrapper.tsx` | `var(--bottom-nav-height)`, `md:pt-14` |
| 5 | `components/ui/Button.tsx` | 10 variants, height-based sizes, `active:scale-[0.98]`, token names |
| 6 | `components/ui/Card.tsx` | 7 variants, sub-components (CardHeader/Content/Footer...), token names |
| 7 | `components/ui/Input.tsx` | 3 sizes, disabled state, AlertCircle icon, token names |
| 8 | `components/ui/Badge.tsx` | Tier color tokens, token names toàn bộ |
| 9 | `components/ui/Toast.tsx` | z-[400], fade-up animation, `var(--duration-slow)`, token names |
| 10 | `components/ui/Modal.tsx` | z-[300], backdrop var, radius var, animation |
| 11 | `components/ui/ProgressBar.tsx` | Gold gradient, `var(--duration-expressive)`, token names |
| 12 | `components/ui/TourPackageCard.tsx` | Card spec mới, token names toàn bộ |
| 13 | `app/page.tsx` + `HeroSection` / `ToursSection` / `DestinationsSection` | Token names, spacing Tailwind scale, z-index đúng layer, Lucide icons, touch target 44px, `scroll-x-hidden` class |
| 14 | `app/booking/page.tsx` + `BookingFlow` / `BookingStep1–4` | Token names, `rounded-md`, `shadow-card`, `min-h-11`, `PKG_COLORS` → `bg-navy-800/bronze-600/tier-diamond` |
| 15 | `app/gamification/page.tsx` + `GamificationView` | Token names, `shadow-card/floating/elevated`, `bg-success-light/text-success`, z-[100] sticky CTA |
| 16 | `app/pre-tour/page.tsx` + `PreTourDashboard` | Token names, `shadow-card`, `rounded-xl`, `scroll-x-hidden`, `pt-[var(--navbar-height)]`, `min-h-11` |
| 17 | `app/in-tour/page.tsx` + `InTourLive` | Token names, `shadow-card`, `rounded-xl/full`, transition + ease, `text-neutral-10` thay `neutral-20`, `bg-[var(--color-myleague-bg)]` |
| 18 | `app/share-card/page.tsx` + `ShareCardView` | Token names, `shadow-card`, `rounded-xl/full/md`, `text-neutral-01` thay `text-white`, `transition + ease`, `min-h-11` |

### CSS Variables đã khai báo trong `globals.css`

| Nhóm | Variables |
|---|---|
| Layout | `--bottom-nav-height`, `--navbar-height`, `--toast-bottom-offset`, `--progress-bar-height`, `--tour-card-image-height`, `--destination-card-image-height` |
| Overlay | `--color-backdrop`, `--radius-bottom-sheet` |
| Tier badge | `--color-tier-bronze/silver/gold-bg/text` |
| Tour card | `--color-myleague-bg` |
| Gradients | `--gradient-hero`, `--gradient-primary`, `--gradient-gold-bar` |
| Semantic | `--color-warning-light` |

---

---

## Quy tắc bắt buộc (áp dụng từ Bước 13)

| # | Quy tắc |
|---|---|
| 1 | **Spacing** → Tailwind scale (`px-4`, `gap-2`, `mb-3`...) — không dùng `[xrem]` |
| 2 | **Màu** → token name (`text-brand-primary`, `bg-neutral-01`...) — không dùng `[#hex]` hay `[var(--...)]` |
| 3 | **Radius** → `rounded-xs/sm/md/lg/xl/2xl/3xl` (map từ `--radius-*` trong `@theme`) |
| 4 | **Shadow** → `shadow-card`, `shadow-floating`, `shadow-elevated`, `shadow-dialog` |
| 5 | **Touch target** → mọi interactive element `min-h-11` (44px) |
| 6 | **Z-index** → đúng layer: `z-[100]` dropdown · `z-[200]` nav · `z-[300]` modal · `z-[400]` toast |
| 7 | **Màu semantic** → `text-success/text-error/text-warning` + light variants thay vì Tailwind green/red/amber |
| 8 | **Dùng lại component** → `Button`, `Card`, `Badge`, `Input`, `Toast`, `Modal`, `ProgressBar`, `TourPackageCard` |
| 9 | **Ngoại lệ `var()`** → chỉ dùng khi token nằm trong `:root` (layout vars): `h-[var(--tour-card-image-height)]` |

---

## Quyết định đã chốt

| Chủ đề | Quyết định |
|---|---|
| Theme | Light mode — nền trắng `#ffffff` |
| Màu chính | Xanh Vietravel `#0046C1` → class `brand-primary` |
| Màu phụ | Đỏ Vietravel `#ED1D24` → class `brand-secondary` |
| Font | Be Vietnam Pro → class `font-sans` |
| Gamification colors | Navy/Gold giữ nguyên cho XP, badge, tier gradient |
| Badge colors | blue/amber/purple Tailwind giữ nguyên (không có token tương đương) |
| Tailwind config | Giữ nguyên `tailwind.config.ts`, token khai báo trong `globals.css @theme` |
| Naming | Token name trực tiếp (`bg-neutral-01`, `text-brand-primary`) — không wrap `[var(--...)]` |
| Folder tài liệu | `ui-design-system-base/` |
| Backup | `tennis-travel-app-backup-20260602` |

---

## Source tham khảo

| Source | Dùng cho |
|---|---|
| shadcn/ui — ui.shadcn.com | Component spec, token system |
| `DESIGN.md` | Brand identity Vietravel gốc |
| `UI_STANDARDS.md` | WCAG, Nielsen, mobile-first rules |
