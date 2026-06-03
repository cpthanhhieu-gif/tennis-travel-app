# UI Improvement Plan — Tennis Travel App

> Tài liệu tổng hợp toàn bộ kế hoạch cải thiện UI/UX.  
> Cập nhật lần cuối: 2026-06-02

---

## Trạng thái tổng quan

| Phase | Tên | Trạng thái |
|---|---|---|
| Phase 1 | Fix bugs layout / overflow | ✅ Hoàn thành |
| Phase 2 | Redesign timeline / itinerary | 🔄 Đang thực hiện |
| Phase 3 | Content text reduction | ⏳ Chưa bắt đầu |

---

## Phase 1 — Fix bugs layout / overflow ✅

### P1.1 — Accordion header: fix text squeeze ✅
**File:** `components/features/PreTourDashboard.tsx`  
**Fix:** Thêm `min-w-0 flex-1` trên div title, `shrink-0` trên div XP+chevron → title wrap tự nhiên, không đè lên badge phải.

### P1.2 — Activity row: fix star rating squeeze ✅
**File:** `components/features/InTourLive.tsx`  
**Fix:** Chuyển star rating từ float-right cùng row → xuống dòng riêng bên trong `div.flex-1`. Text activity wrap thoải mái.

### P1.3 — MilestoneTrack: fix overlap labels ✅
**File:** `components/features/GamificationView.tsx`  
**Fix:** Giảm từ 5 label → 3 label (start · mid · end). Dots vẫn giữ 5 để visual đẹp. Đổi `text-[1.0rem]` → `text-xs`.

### P1.4 — Normalize hardcoded font sizes ✅
**Files:** `InTourLive.tsx`, `GamificationView.tsx`, `HeroSection.tsx`, `ToursSection.tsx`  
**Fix:** Thay toàn bộ `text-[x.xrem]` hardcoded bằng Tailwind scale chuẩn (`text-xs` / `text-sm` / `text-base` / `text-lg`...) để đi qua `@theme` override trong `globals.css`.

**Mapping:**
| Hardcoded | → | Class chuẩn |
|---|---|---|
| `text-[1.0rem]`, `text-[1.1rem]`, `text-[1.2rem]` | → | `text-xs` (12px) |
| `text-[1.3rem]`, `text-[1.4rem]` | → | `text-sm` (14px) |
| `text-[1.5rem]`, `text-[1.6rem]` | → | `text-base` (16px) |
| `text-[1.7rem]`, `text-[1.8rem]` | → | `text-lg` (18px) |
| `text-[2.0rem]` | → | `text-xl` (20px) |
| `text-[2.2rem]`, `text-[2.4rem]` | → | `text-2xl` (24px) |
| `text-[2.8rem]` | → | `text-3xl` (28px) |
| `text-[3.2rem]` | → | `text-4xl` (32px) |

---

## Phase 2 — Redesign timeline / itinerary 🔄

### P2.1 — Compact timeline với connector line ✅
**File:** `components/features/PreTourDashboard.tsx`

**Thay đổi đã thực hiện:**
- Flat list → vertical timeline với connector line chạy dọc
- Dot màu theo loại activity (tennis/food/recovery/logistics)
- Location lên dòng trên, title xuống dòng dưới
- Bỏ type chip
- Bỏ XP khỏi timeline và accordion header
- Accordion header: XP bỏ hẳn, chevron chỉ còn icon
- HLV section: nút "Nhắn tin" xuống dòng 2
- 3 tab navigation ("Lịch trình chi tiết" · "HLV" · "Chuẩn bị trước khi đi") → scroll to section
- Fix `pt-[var(--navbar-height)]` → `pt-0 md:pt-[var(--navbar-height)]` (bỏ padding thừa trên mobile)

**Layout hiện tại:**
```
Ngày 1 — Đến nơi, cảm nhận Đà Nẵng     ˅
Thứ Sáu, 13/06/2026

  08:00  ●  📍 Sân bay Đà Nẵng
             Xe đón tại sân bay Đà Nẵng
             
  09:00  ●  📍 Fusion Maia Resort
             Check-in Resort · Welcome kit
```

---

### P2.2 — Tách activity name → title + detail ⏳

**File:** `components/features/PreTourDashboard.tsx`  
**Không áp dụng cho** `InTourLive.tsx` (in-tour cần scan nhanh, không cần detail).

#### Vấn đề
Activity name hiện là 1 chuỗi dài chứa cả tên chính lẫn mô tả, khó scan:
```
"Bữa sáng – Bánh mì Đà Nẵng, trứng luộc, sinh tố xoài"
"Orientation session — HLV giới thiệu chương trình, đánh giá NTRP thực địa"
"Check-in Resort · Welcome kit (vợt, khăn, nước điện giải)"
```

#### Giải pháp: helper `parseActivity`

Tách tại dấu phân cách `–` / `—` / `·`:

```ts
function parseActivity(text: string): { title: string; detail: string | null } {
  const match = text.match(/^(.+?)\s*[–—·]\s*(.+)$/);
  if (!match) return { title: text, detail: null };
  return { title: match[1].trim(), detail: match[2].trim() };
}
```

**Ví dụ:**
| Input | title | detail |
|---|---|---|
| `"Bữa sáng – Bánh mì Đà Nẵng..."` | `"Bữa sáng"` | `"Bánh mì Đà Nẵng..."` |
| `"Tập luyện buổi 1 – Warm-up..."` | `"Tập luyện buổi 1"` | `"Warm-up, forehand/backhand"` |
| `"Check-in Resort · Welcome kit"` | `"Check-in Resort"` | `"Welcome kit (vợt, khăn...)"` |
| `"Xe đón tại sân bay Đà Nẵng"` | `"Xe đón tại sân bay Đà Nẵng"` | `null` |

#### Hiển thị sau khi tách

```
08:00  ●  📍 Sân bay Đà Nẵng
           Xe đón tại sân bay          ← title only

09:30  ●  📍 Nhà hàng resort
           Bữa sáng                    ← title: text-sm font-medium
           Bánh mì Đà Nẵng, trứng luộc ← detail: text-xs text-neutral-40
```

Detail **luôn hiển thị** (không collapse) vì đây là pre-tour — user cần đọc để chuẩn bị.

#### Vị trí thêm code
- Thêm `parseActivity()` ngay sau `stripFei()` trong `PreTourDashboard.tsx`
- Trong timeline render: thay `{stripFei(act.activity)}` bằng:
  ```tsx
  const { title, detail } = parseActivity(stripFei(act.activity));
  // render title + detail riêng biệt
  ```

---

### P2.3 — InTourLive: Activity card redesign ⏳
**File:** `components/features/InTourLive.tsx`

- Thêm day summary header: `"6 hoạt động · 3 tennis · 2 ẩm thực · 1 logistics"`
- Hiện tại đã fix star rating xuống dòng riêng (P1.2)

---

## Phase 3 — Content text reduction ⏳

### P3.1 — PreTour subtitle: tách 2 dòng
```
BEFORE: "Hành trình Đà Nẵng 3N2D · 13–15/06/2026 · Khởi hành sau 7 ngày nữa"

AFTER:
  "Đà Nẵng 3N2D · 13–15/06/2026"       ← text-xs neutral
  "Khởi hành sau 7 ngày nữa"            ← text-sm brand-primary bold
```

### P3.2 — Coach tip: giới hạn chiều dài
Thêm `line-clamp-3` + "Xem thêm" cho paragraph coach tip (~60–80 từ).

---

## Ghi chú kỹ thuật

### Font scale system
Root `html { font-size: 10px }` → 1rem = 10px. Tailwind `@theme` override:
- `--text-xs: 1.2rem` = 12px
- `--text-sm: 1.4rem` = 14px  
- `--text-base: 1.6rem` = 16px
- `--text-lg: 1.8rem` = 18px

### Component vs inline
- Activity timeline trong `PreTourDashboard` và `InTourLive` là **inline** (không phải shared component) — mục đích và data khác nhau, không cần extract.
- `ACTIVITY_TYPE_CONFIG` trong `PreTourDashboard` là single source of truth cho dot color theo loại.

### pt-[var(--navbar-height)]
Chỉ áp dụng trên `md:` trở lên. Mobile dùng `pt-0`.
