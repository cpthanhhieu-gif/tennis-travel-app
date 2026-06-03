# USER_FLOW — Hành trình 5 Stage của khách hàng

## Tổng quan Loyalty Flywheel
```
STAGE 1          STAGE 2         STAGE 3           STAGE 4         STAGE 5
Pre-tour    →   In-tour    →   Gamification   →   Share Card   →   Auto-Loop
(Chuẩn bị)    (Trải nghiệm)   (Tích điểm)      (Chia sẻ)       (Tái mua)
```

---

## STAGE 1 — Pre-tour (Trước hành trình)

### Trigger
Khách vừa đặt tour thành công → redirect vào /pre-tour

### Các hành động của khách
1. Xem dashboard cá nhân hoá (tên, ngày đi, gói tour, đếm ngược)
2. Xem lịch trình chi tiết từng ngày (expandable timeline)
3. Đọc menu FEI được AI gợi ý dựa trên NTRP level
4. Kết nối với HLV được phân công
5. Hoàn thành checklist chuẩn bị (gear, giày, v.v.)

### Giá trị trao cho khách
- Cảm giác được cá nhân hoá ngay từ đầu
- Giảm lo lắng vì biết rõ lịch trình
- Kỳ vọng cao về trải nghiệm FEI

### XP kiếm được ở stage này
- Xem lịch trình lần đầu: +50 XP
- Kết nối HLV: +50 XP
- Hoàn thành checklist: +100 XP

---

## STAGE 2 — In-tour (Trong hành trình)

### Trigger
Ngày đầu tiên của tour → khách mở app check-in

### Các hành động của khách
1. Check-in điểm đến (mock: tap nút Check-in)
2. Xem timeline hoạt động theo giờ real-time
3. Theo dõi Live Score trận đấu nội bộ
4. Nhận tips từ HLV qua app
5. Rate từng hoạt động (1–5 sao → dùng tính FEI)
6. Xem XP tăng dần theo thời gian thực

### Giá trị trao cho khách
- Không bao giờ bị lạc lịch
- Cảm giác "game" khi thấy XP tăng
- Kết nối chặt với HLV → cải thiện kỹ năng

### XP kiếm được ở stage này
- Check-in ngày 1: +150 XP
- Hoàn thành buổi tập: +100 XP/buổi
- Thắng trận nội bộ: +200 XP
- Rate hoạt động ≥4 sao: +30 XP/lần
- Điểm FEI bữa ăn >85: +50 XP/bữa

---

## STAGE 3 — Gamification (Sau khi kết thúc tour)

### Trigger
Tour kết thúc → tổng kết XP, cấp badge, hiển thị tier

### Các hành động của khách
1. Nhận tổng kết XP toàn tour
2. Xem badge mới được unlock
3. Check tier hiện tại và khoảng cách lên tier tiếp theo
4. Xem đặc quyền tier đang có

### Giá trị trao cho khách
- Cảm giác thành tựu rõ ràng
- Động lực để lên tier tiếp (Gold, Diamond)
- Hiểu rõ lợi ích nếu đặt tour tiếp

### XP kiếm được ở stage này
- Hoàn thành tour: +500 XP (lớn nhất, trigger khi tour kết thúc)
- Điểm FEI tổng tour >85: +300 XP

---

## STAGE 4 — Share Card (Chia sẻ thành tích)

### Trigger
Sau khi nhận tổng kết → app tự generate thẻ thành tích

### Các hành động của khách
1. Xem thẻ thành tích cá nhân hoá (tên, tour, XP, tier, FEI score)
2. Tải về dạng PNG
3. Chia sẻ lên mạng xã hội (Facebook, Instagram Story, Zalo)
4. Tag bạn bè → bạn nhận được voucher giới thiệu

### Giá trị trao cho app
- Free marketing: mỗi lượt share = 1 lần quảng bá
- Viral loop: bạn bè của khách thấy → tò mò → vào app

### XP kiếm được
- Chia sẻ thẻ: +100 XP
- Bạn bè đăng ký qua link refer: +800 XP

---

## STAGE 5 — Auto-Loop (Vòng lặp tái mua)

### Trigger
Ngay sau khi tour kết thúc → voucher 10% tự động kích hoạt trong app

### Cơ chế
- Voucher 10% rebook hiệu lực trong 30 ngày
- Push notification nhắc nhở (mock trong app)
- Gợi ý tour tiếp theo dựa trên tier và NTRP mới

### Mục tiêu business
- Tỷ lệ rebook mục tiêu: 30%
- CAC (Chi phí thu hút khách) = 0 đồng cho khách rebook
- Vòng lặp tự động → không tốn nhân sự CSKH

---

## Luồng điều hướng trong app

### Happy path (luồng chính cho demo video)
```
Home
  → Xem 3 gói tour
  → Click "Đặt ngay" (SBU 1 Leisure / Đà Nẵng)
  → Booking Flow Bước 1: Chọn gói + ngày
  → Booking Flow Bước 2: Quiz NTRP → kết quả 3.5
  → Booking Flow Bước 3: Nhập thông tin
  → Booking Flow Bước 4: Xác nhận → Modal thành công
  → Pre-tour Dashboard
    → Xem lịch trình
    → Xem FEI menu
    → Kết nối HLV
  → In-tour Live (giả lập đang ở Ngày 2)
    → Xem timeline hôm nay
    → Xem Live Score đang đá
    → XP tăng realtime
  → Gamification
    → Xem tổng XP: 1.240
    → Tier: Silver
    → Badges: 3 badges
  → Share Card
    → Xem thẻ thành tích
    → Tap "Tải về"
    → Banner voucher 10% rebook
    → CTA "Đặt tour tiếp theo"
```

### Thời lượng demo ước tính
- Toàn bộ happy path: ~4–5 phút khi quay video
- Mỗi stage: ~45–60 giây
