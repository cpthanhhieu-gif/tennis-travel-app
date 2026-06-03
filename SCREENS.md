# SCREENS — Danh sách màn hình

## Tổng quan navigation flow
```
[Home] → [Booking Flow] → [Pre-tour Dashboard]
                                    ↓
                            [In-tour Live]
                                    ↓
                            [Gamification]
                                    ↓
                            [Share Card]
                                    ↓
                         [Auto-Loop / Rebook]
```

---

## Screen 1: Home (`/`)

### Mục tiêu
Giới thiệu sản phẩm, thu hút khách chọn gói tour.

### Sections
1. **Hero Section**
   - Background: ảnh sân tennis resort cao cấp (full-width)
   - Headline: "Tennis Travel Experience"
   - Subline: "Play Hard. Recover Well. Taste the Story."
   - Tagline nhỏ: "Sản phẩm Sportcation Signature đầu tiên tại Việt Nam"
   - CTA button: "Khám phá ngay" → scroll xuống hoặc link /booking

2. **3 Trụ cột** (icon + title + mô tả ngắn)
   - 🎾 Tennis & Performance — Sân ITF chuẩn, HLV chuyên nghiệp, phân loại NTRP
   - 🍽️ Ẩm thực FEI — Chỉ số độc quyền, Chef bản địa, Recovery meal
   - 🏨 Nghỉ dưỡng 5 sao — Resort đối tác, Spa phục hồi, Private dining

3. **3 Gói Tour (SBU Cards)**
   - SBU 1 — Leisure & Learning: 2N1D/3N2D · 4–8 triệu/người
   - SBU 2 — Tournament Travel: 3N2D/4N3D · 8–18 triệu/người
   - SBU 3 — Sportcation Premium: 4N3D/5N4D · 25–60 triệu/người
   - Mỗi card: ảnh, tên gói, giá, thời lượng, nút "Đặt ngay"

4. **Chỉ số chất lượng** (số liệu nổi bật)
   - LEI 84/100 · ESG 89/100 · FEI ≥88/100

5. **Điểm đến Pilot**
   - Đà Nẵng 3N2D và Phú Quốc 4N3D (ảnh + tóm tắt)

6. **Footer**
   - Logo Vietravel · Liên hệ · Social links

---

## Screen 2: Booking Flow (`/booking`)

### Mục tiêu
Khách chọn tour, nhập thông tin, xác nhận đặt.

### Các bước (Step indicator hiển thị trên đầu)
**Bước 1 — Chọn gói tour**
- Radio cards 3 SBU (visual rõ ràng)
- Chọn điểm đến: Đà Nẵng / Phú Quốc
- Chọn ngày khởi hành (calendar picker — mock dates tháng 6/2026)
- Số người (1–20)

**Bước 2 — Đánh giá NTRP (AI)**
- Giới thiệu: "AI sẽ gợi ý gói phù hợp với trình độ của bạn"
- 5 câu hỏi trắc nghiệm nhanh về trình độ tennis
- Kết quả: NTRP Level (ví dụ: 3.5 — Intermediate) + badge
- Gợi ý gói phù hợp

**Bước 3 — Thông tin cá nhân**
- Họ tên, số điện thoại, email (mock, không validate thật)
- Ghi chú đặc biệt (dietary restriction, v.v.)

**Bước 4 — Xác nhận & Tóm tắt**
- Card tóm tắt: gói, ngày, số người, tổng tiền
- Nút "Xác nhận đặt tour" → hiện modal thành công
- Modal: "🎾 Đặt tour thành công! Hành trình của bạn bắt đầu." + nút "Xem Pre-tour"

---

## Screen 3: Pre-tour Dashboard (`/pre-tour`)

### Mục tiêu
Khách chuẩn bị hành trình, xem lịch, nhận tư vấn FEI.

### Sections
1. **Welcome Banner**
   - "Chào Minh Khoa! Tour Đà Nẵng của bạn còn 7 ngày nữa 🎾"
   - Countdown timer (ngày, giờ)

2. **Lịch trình tổng quan** (Timeline dọc)
   - Ngày 1, Ngày 2, Ngày 3 — mỗi ngày 3–4 hoạt động chính
   - Tap để expand xem chi tiết

3. **AI Tư vấn FEI Menu**
   - Card: "Menu phục hồi được cá nhân hóa cho NTRP 3.5 của bạn"
   - 3 bữa chính với FEI score từng bữa
   - Chỉ số NPI, LAI, EII, RWI, LPI (progress bars)
   - Tổng FEI Score: 89/100

4. **Kết nối HLV**
   - Avatar + tên HLV: "HLV Trần Văn Hùng · 8 năm kinh nghiệm · NTRP 5.0"
   - Nút "Nhắn tin HLV" (mock)

5. **Checklist chuẩn bị**
   - Checkbox: Vợt tennis, Giày chuyên dụng, Trang phục thể thao...

---

## Screen 4: In-tour Live (`/in-tour`)

### Mục tiêu
Khách theo dõi lịch thực tế, live score, kết nối trong tour.

### Sections
1. **Header ngày**
   - "Ngày 2 / 3 — Thứ Bảy, 14/06/2026"
   - Badge: "🟢 Đang diễn ra"

2. **Timeline hoạt động hôm nay** (theo giờ)
   - 06:30 — Bữa sáng FEI Recovery ✅ (đã xong)
   - 08:00 — Tập luyện với HLV ✅ (đã xong)
   - 10:00 — 🔴 LIVE: Trận đấu nội bộ (đang diễn ra — highlight đỏ)
   - 12:30 — Bữa trưa Chef bản địa (sắp tới)
   - 15:00 — Spa phục hồi (sắp tới)
   - 19:00 — Private dining (sắp tới)

3. **Live Score Box** (nổi bật)
   - "Minh Khoa vs Tuấn Anh"
   - Set: 6-4 · 3-2 (đang chơi)
   - Badge "LIVE 🔴"

4. **XP Realtime**
   - "+50 XP vừa kiếm được" (toast notification)
   - Tổng XP hiện tại: 720 / 1000 (thanh tiến trình)

5. **Kết nối HLV realtime**
   - Tip của HLV: "Tăng tốc cú serve, hướng vào góc T của đối thủ 💪"

---

## Screen 5: Gamification (`/gamification`)

### Mục tiêu
Hiển thị thành tích, tier, XP, động lực rebook.

### Sections
1. **Profile Card**
   - Avatar · Tên: Nguyễn Minh Khoa · Tier: SILVER 🥈
   - XP: 1.240 / 3.000 (để lên Gold)
   - Progress bar có animation

2. **Bảng XP chi tiết**
   - Hoàn thành tour Đà Nẵng: +500 XP
   - Điểm FEI >85: +300 XP
   - Check-in ngày 1: +150 XP
   - Trận đấu nội bộ: +200 XP
   - Refer bạn bè (chưa): +800 XP (locked)

3. **4 Tiers** (horizontal cards, current highlighted)
   - 🥉 Bronze (0–999 XP): Welcome kit, Voucher 5%
   - 🥈 Silver (1.000–2.999 XP): Upgrade room, Private chef 1 bữa, Voucher 10% ← CURRENT
   - 🥇 Gold (3.000–6.999 XP): Premium Vault, HLV Quốc tế 1 buổi (locked)
   - 💎 Diamond (7.000+ XP): Outbound Tour, Concierge 24/7 (locked)

4. **Badges đã nhận**
   - 🎾 First Serve — Hoàn thành tour đầu tiên
   - 🍽️ FEI Master — Đạt FEI >85
   - 🏆 Court Warrior — Thắng trận nội bộ

5. **Cách kiếm thêm XP**
   - Refer bạn bè: +800 XP (CTA nổi bật)
   - Tour tiếp theo: +500 XP

---

## Screen 6: Share Card (`/share-card`)

### Mục tiêu
App tự sinh thẻ thành tích đẹp để khách chia sẻ social → viral marketing.

### Sections
1. **Thẻ thành tích (visual card)**
   - Background: gradient Navy + Gold
   - Logo Tennis Travel Experience
   - Tên: "Nguyễn Minh Khoa"
   - Tour: "Đà Nẵng 3N2D · 13–15/06/2026"
   - Tier badge: SILVER 🥈
   - Stats: 1.240 XP · FEI 89/100 · 2 trận thắng
   - QR code (mock) + hashtag #TennisTravelVN

2. **Nút Share**
   - "Tải về" (download PNG)
   - "Copy link"
   - "Chia sẻ" (Web Share API nếu mobile)

3. **Auto-Loop CTA**
   - Banner: "🎁 Voucher 10% cho tour tiếp theo đã được kích hoạt!"
   - Countdown: "Hết hạn sau 30 ngày"
   - Nút: "Đặt tour tiếp theo" → /booking
