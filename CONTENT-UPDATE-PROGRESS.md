# TIẾN ĐỘ — Cập nhật Content Tone Toàn App
> Mục tiêu: Đổi tone content theo hướng travel Vietravel, có giá trị với khách hàng
> Nguồn tham khảo: `CONTENT-BRIEF.md` (tổng hợp từ travel.com.vn)
> Cập nhật lần cuối: 2026-06-02

---

## Tiến độ tổng thể: 100% (6/6 bước) ✅

| Bước | Tên | Trạng thái |
|---|---|---|
| 1 | Data layer — `mock-data.ts` | ✅ Hoàn thành |
| 2 | Màn Home — 5 components | ✅ Hoàn thành |
| 3 | Màn Booking — 4 components | ✅ Hoàn thành |
| 4 | Màn Pre-tour / In-tour / Share Card | ✅ Hoàn thành |
| 5 | Gamification | ✅ Hoàn thành |
| 6 | Footer | ✅ Hoàn thành |

---

## ✅ Bước 1 — `lib/mock-data.ts` (Hoàn thành 2026-06-02)

### Thay đổi đã thực hiện

| Mục | Trước | Sau |
|---|---|---|
| SBU1 name | `Leisure & Learning` | `Khám phá & Tận hưởng` |
| SBU1 tagline | `Học - Chơi - Khám phá` | `Hành trình tennis trọn vẹn cho người mới bắt đầu` |
| SBU2 name | `Tournament Travel` | `Chinh phục & Kết nối` |
| SBU2 tagline | `Thi đấu – Cạnh tranh – Kết nối` | `Thi đấu có điểm số · Kết nối cộng đồng tennis toàn quốc` |
| SBU3 name | `Sportcation Premium` | `Đẳng cấp & Trọn vẹn` |
| SBU3 tagline | `Khổ luyện – Phục hồi – Luxury` | `Trải nghiệm tennis 5 sao · Vietravel lo từ A đến Z` |
| SBU1 highlights | Generic | Benefit-focused, dùng "HLV Vietravel", "8 bữa ăn FEI" |
| SBU2 highlights | Kỹ thuật | "Giải đấu nội bộ có điểm ELO — kỷ niệm đáng nhớ" |
| SBU3 highlights | Generic | Thêm "Vietravel" vào Concierge |
| Ngày 1 title | `Arrival & First Serve` | `Đến nơi, cảm nhận Đà Nẵng` |
| Ngày 2 title | `The Tournament Day` | `Ngày chinh phục sân đấu` |
| Ngày 3 title | `Recovery & Farewell` | `Kết nối & Lên đường` |
| xpActions (6 dòng) | Generic | Tone hành trình: "Hoàn thành hành trình", "Rủ bạn bè cùng nâng tầm" |
| Badges (3 dòng) | Kỹ thuật | Gắn với trải nghiệm: "Khởi đầu hành trình cùng Vietravel" |
| Tiers perks (4 tiers) | Generic | Làm rõ giá trị: "Voucher 10% đặt lại hành trình" |
| ntrpLevels + getNtrpLevel | Kỹ thuật | Thân thiện: "HLV sẽ đồng hành từng bước" |

---

## ✅ Bước 2 — Màn Home (5 components) (Hoàn thành 2026-06-02)

### Thay đổi đã thực hiện

| Component | Thay đổi |
|---|---|
| `HeroSection.tsx` | Filter labels: Leisure/Tournament/Premium → Khám phá/Chinh phục/Đẳng cấp · Filter desc → tone Vietravel · Search placeholder → "Tìm hành trình phù hợp với bạn..." |
| `ToursSection.tsx` | Tab labels → Khám phá/Chinh phục/Đẳng cấp · Section title → "Hành trình phù hợp với bạn" · Subtitle → "3 hành trình · Vietravel lo từ A đến Z" · "Xem tất cả" → "Khám phá thêm" |
| `DestinationsSection.tsx` | CTA "Đặt ngay" → "Bắt đầu hành trình" |
| `PillarsSection.tsx` | Pillar 1 title → "Tennis cùng HLV Vietravel" · Desc benefit-first · Pillar 2 desc → "ăn ngon mà vẫn phục hồi tốt" · Pillar 3 desc → "Vietravel lo từng chi tiết" · Subtitle → "Hành trình tennis trọn vẹn — Vietravel lo từ A đến Z" |
| `QualitySection.tsx` | Heading → "Vì sao chọn Vietravel Tennis?" · Subtitle → "30+ năm uy tín" · LEI/FEI desc → benefit-first, ngôn ngữ khách hàng · CTA "Đặt tour ngay" → "Bắt đầu hành trình" |

---

## ✅ Bước 3 — Màn Booking (4 components) (Hoàn thành 2026-06-02)

### Thay đổi đã thực hiện

| Component | Thay đổi |
|---|---|
| `BookingStep1.tsx` | Heading → "Chọn hành trình & ngày khởi hành" · Filter label → "Loại hành trình" · PKG tabs → Khám phá/Chinh phục/Đẳng cấp · Count → "hành trình phù hợp" · "Chọn tour" → "Chọn hành trình" · CTA → "Tiếp theo — Đánh giá trình độ" |
| `BookingStep2.tsx` | Heading → "Khám phá trình độ của bạn" · Subtitle → "Vietravel sẽ gợi ý hành trình phù hợp nhất" · "Gói AI đề xuất" → "Hành trình Vietravel đề xuất" · Mismatch banner → "Hành trình bạn chọn..." · CTA → "Tiếp theo — Điền thông tin" · "Xem kết quả NTRP" → "Xem kết quả trình độ" |
| `BookingStep3.tsx` | Subtitle → "Để Vietravel liên hệ xác nhận hành trình" · CTA → "Tiếp theo — Xem tóm tắt hành trình" |
| `BookingStep4.tsx` | Heading → "Xác nhận hành trình của bạn" · "Tóm tắt đặt chỗ" → "Tóm tắt hành trình" · Row "Tour" → "Hành trình" · CTA → "Xác nhận hành trình của tôi" |

---

## ✅ Bước 4 — Màn Pre-tour / In-tour / Share Card (Hoàn thành 2026-06-02)

### Thay đổi đã thực hiện

| Component | Thay đổi |
|---|---|
| `PreTourDashboard.tsx` | "Tour Đà Nẵng" → "Hành trình Đà Nẵng" · "Checklist chuẩn bị" → "Chuẩn bị trước hành trình" · "Vào Tour Live" → "Bắt đầu trải nghiệm" |
| `InTourLive.tsx` | Coach tips cả 3 ngày → tone trải nghiệm, gắn "HLV Vietravel" · "XP Hôm nay" → "Điểm hành trình hôm nay" · "voucher 10% cho tour tiếp theo" → "ưu đãi 10% cho hành trình tiếp theo" · "Nhận Share Card" → "Chia sẻ hành trình" · "Xem Thành tích & XP" → "Xem thành tích hành trình" |
| `ShareCardView.tsx` | "Tour Đà Nẵng 3N2D" → "Hành trình Đà Nẵng 3N2D" · Card tagline → "Hành trình của bạn — trọn vẹn và đáng nhớ" · Rating → "Hành trình của bạn thế nào?" · Voucher CTA → "Bắt đầu hành trình tiếp theo" · Next tour CTA → "Khám phá hành trình" |

---

## ✅ Bước 5 — Gamification (Hoàn thành 2026-06-02)

| Component | Thay đổi |
|---|---|
| `GamificationView.tsx` | "Tour Đà Nẵng" → "Hành trình Đà Nẵng" · "Hoàn thành 3 tours" → "Hoàn thành 3 hành trình" · "Completed" → "Hoàn thành" · "Refer bạn bè" → "Rủ bạn bè cùng nâng tầm" · Sticky CTA → "Xem thẻ hành trình · Ưu đãi 10%" |

---

## ✅ Bước 6 — Footer (Hoàn thành 2026-06-02)

| Component | Thay đổi |
|---|---|
| `HomeFooter.tsx` | Brand tagline → "Nâng tầm giá trị cuộc sống qua hành trình tennis trọn vẹn" · Link "Đặt tour" → "Bắt đầu hành trình" |

---

## Nguyên tắc tone xuyên suốt (từ CONTENT-BRIEF.md)

| Nguyên tắc | Áp dụng |
|---|---|
| Dùng từ "hành trình" thay "chuyến đi" | Mọi nơi |
| CTA chủ động: "Bắt đầu", "Khám phá", "Chinh phục" | Buttons, headings |
| Benefit trước, feature sau | Descriptions, highlights |
| Gắn tên Vietravel vào dịch vụ cụ thể | HLV, Concierge, Chef |
| Slogan "Nâng tầm giá trị cuộc sống" | Hero, footer |
| Tránh từ: "rẻ", "giảm giá" → dùng "ưu đãi", "giá trị" | Pricing |
