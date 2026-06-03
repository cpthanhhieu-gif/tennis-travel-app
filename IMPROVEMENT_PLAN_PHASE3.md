# GIAI ĐOẠN 3 — ĐỀ XUẤT CẢI THIỆN & KẾ HOẠCH THỰC HIỆN
## Tennis Travel Experience App — Vietravel

> Ngày: 29/05/2026 | Dựa trên: Phase 1 (Research) + Phase 2 (Benchmark)
> Mục tiêu: Pilot tháng 6/2026 tại Đà Nẵng & Phú Quốc

---

## FRAMEWORK ƯU TIÊN — IMPACT × EFFORT

```
         IMPACT CAO
              │
   ┌──────────┼──────────┐
   │  QUICK   │ STRATEGIC│
   │  WINS    │ BET      │
   │  Làm ngay│ Lên kế   │
   │  (< 1W)  │ hoạch    │
───┼──────────┼──────────┼─── EFFORT
   │  FILL-IN │ QUESTION │  CAO
   │  Nếu có  │  MARK    │
   │  thời    │ Cân nhắc │
   │  gian    │ lại      │
   └──────────┼──────────┘
              │
         IMPACT THẤP
```

**8 điểm yếu từ Phase 2 → Phân loại và đề xuất cụ thể:**

---

## NHÓM 1 — QUICK WINS (Làm ngay, < 1 tuần)
> Impact cao · Effort thấp · Làm trước khi Pilot tháng 6/2026

---

### QW-1 — HIỂN THỊ GIÁ SỚM TRONG BOOKING FLOW
**Vấn đề (W1):** Giá chỉ hiện ở Bước 4 → user anxiety cao, drop-off trước khi commit

**Benchmark:** Klook và GetYourGuide hiển thị giá ngay trên listing card và trong suốt checkout

**Đề xuất thay đổi:**

*Trước (hiện tại):*
```
Bước 1: Chọn gói → Chọn ngày → Chọn số người
Bước 2: NTRP Quiz
Bước 3: Thông tin cá nhân
Bước 4: Xác nhận + Tổng tiền ← Giá xuất hiện lần đầu
```

*Sau (đề xuất):*
```
Bước 1: Chọn gói (giá hiện ngay trên card)
         ↓ Price summary sticky bar: "3 người × 5.800.000 đ = 17.400.000 đ"
Bước 2: NTRP Quiz (price bar vẫn hiển thị phía dưới)
Bước 3: Thông tin cá nhân (price bar vẫn hiển thị)
Bước 4: Xác nhận (tổng kết, không có surprise)
```

**Thay đổi cụ thể:**
- Thêm `PriceSummaryBar` component — sticky bottom bar trên mobile, sticky top trên desktop
- Hiển thị: Gói đã chọn · Số người · Đơn giá · **Tổng tiền**
- Update real-time khi user thay đổi số người ở Bước 1
- File cần sửa: `app/booking/page.tsx`, thêm component `components/features/PriceSummaryBar.tsx`

**Effort:** 4 giờ | **Impact:** Giảm drop-off ước tính 20–30% tại checkout

---

### QW-2 — THÊM PRICE TRANSPARENCY VÀO TOUR CARDS
**Vấn đề (W1 mở rộng):** SBU cards ở Home hiện chỉ có "4–8 triệu/người" — không có CTA rõ giá khi hover/click

**Đề xuất:**
- Khi hover/tap vào card → expand micro-panel hiển thị:
  - Giá từ (VD: "Từ 4.800.000 đ/người")
  - Gói ngắn nhất (2N1D)
  - "Xem tất cả gói" link
- Thêm badge "Phổ biến nhất" vào SBU 1

**Effort:** 2 giờ | **Impact:** Tăng click-to-book từ Home screen

---

### QW-3 — INSTAGRAM STORIES FORMAT CHO SHARE CARD
**Vấn đề (W8):** Share Card hiện tại là landscape/square — không tối ưu cho Instagram Stories, TikTok (9:16)

**Benchmark:** Không đối thủ nào có, nhưng đây là chuẩn share của Gen Z/Millennial

**Đề xuất:**
- Thêm toggle trên màn Share Card: `[4:5 Instagram Post]` ↔ `[9:16 Stories]`
- Layout Stories (9:16):
  ```
  ┌────────────────┐
  │  Logo + Brand  │  ← Header nhỏ
  │                │
  │   Avatar +     │
  │   Tên lớn      │  ← Hero section
  │                │
  │  ══════════════│
  │  1.240 XP      │
  │  FEI 89/100    │  ← Stats 2 cột
  │  2 trận thắng  │
  │  ══════════════│
  │                │
  │  SILVER TIER 🥈│  ← Tier badge nổi
  │                │
  │  #TennisTravelVN│ ← Hashtag + QR nhỏ
  └────────────────┘
  ```
- File cần sửa: `app/share-card/page.tsx`, thêm `StoriesCardLayout` component

**Effort:** 3 giờ | **Impact:** Tăng share rate ước tính 40% với Gen Z (Stories là format phổ biến hơn Post)

---

### QW-4 — PRE-TOUR EXCITEMENT SHARE
**Vấn đề (W5):** Share Card chỉ có sau tour — bỏ lỡ viral moment "Tôi sắp đi!"

**Benchmark:** Không đối thủ nào có — cơ hội tạo pre-trip buzz

**Đề xuất — Thêm "Pre-tour Share Card" vào màn Pre-tour Dashboard:**
```
┌─────────────────────────────────┐
│  🎾 Tôi sắp bắt đầu hành trình │
│                                 │
│  Nguyễn Minh Khoa               │
│  Đà Nẵng 3N2D · 13/06/2026     │
│  NTRP 3.5 · Silver Member       │
│                                 │
│  Tennis · Ẩm thực · Nghỉ dưỡng │
│  #TennisTravelVN                │
└─────────────────────────────────┘
[Chia sẻ ngay] [Để sau]
```
- Trigger: Modal xuất hiện sau khi user hoàn thành Checklist chuẩn bị (+100 XP)
- File cần sửa: `app/pre-tour/page.tsx`

**Effort:** 3 giờ | **Impact:** Tạo viral loop trước tour; awareness trước khi khách đến

---

## NHÓM 2 — STRATEGIC BETS (Cải thiện chiến lược, 2–4 tuần)
> Impact cao · Effort trung bình–cao · Thực hiện sau Pilot, trước Scale-up

---

### SB-1 — ĐƠN GIẢN HÓA BOOKING FLOW: 4 BƯỚC → 3 BƯỚC
**Vấn đề (W2):** 4 bước booking quá dài so với chuẩn ngành (Klook: 2–3 tap)

**Phân tích từng bước:**
| Bước | Nội dung | Giữ? | Lý do |
|---|---|---|---|
| Bước 1 | Chọn gói + ngày + số người | ✅ Giữ | Core booking info |
| Bước 2 | NTRP Quiz | ✅ Giữ nhưng **optional** | USP nhưng không nên bắt buộc |
| Bước 3 | Thông tin cá nhân | ✅ Giữ | Cần thiết |
| Bước 4 | Xác nhận | 🔄 **Merge vào Bước 3** | Có thể gộp thành một màn |

**Đề xuất flow mới:**
```
Bước 1: Chọn gói · Ngày · Số người + Price Summary Bar
  ↓
Bước 2: NTRP Quiz (có thể skip → "Tự chọn gói phù hợp")
  ↓
Bước 3: Thông tin + Xác nhận gộp (split-screen trên desktop)
         Trái: Form nhập liệu
         Phải: Order summary + CTA "Xác nhận đặt tour"
  ↓
Modal: Thành công → Pre-tour
```

**Benefit:** Giảm 1 màn, giảm thời gian booking từ ~3 phút → ~90 giây

**Effort:** 1 ngày | **Impact:** Tăng conversion rate ước tính 15–25%

---

### SB-2 — LEADERBOARD COMMUNITY
**Vấn đề (W4):** Thiếu social competition — app cô lập từng user, không tạo community

**Benchmark:** TripAdvisor Leaderboard tăng session stickiness 60%

**Đề xuất — Thêm tab "Cộng đồng" vào màn Gamification:**

```
┌─────────────────────────────────┐
│  [XP của tôi]  [Bảng xếp hạng] │ ← Tab toggle
├─────────────────────────────────┤
│  🏆 Top Tennis Travelers        │
│  Tuần này · Tháng này · Mọi thời│
│                                 │
│  1. 🥇 Trần Văn A     2.840 XP │
│  2. 🥈 Lê Thị B       2.720 XP │
│  3. 🥉 Phạm Văn C     2.610 XP │
│  ─────────────────────────────  │
│  ...                            │
│  47. Nguyễn Minh Khoa 1.240 XP │ ← User's position highlighted
│                                 │
│  [Mời bạn bè cạnh tranh +800XP]│
└─────────────────────────────────┘
```

**Data:** Dùng mock data 50 users; filter theo Tour (Đà Nẵng/Phú Quốc) hoặc All

**Effort:** 2 ngày | **Impact:** Tăng DAU và thời gian trong app; thúc đẩy referral

---

### SB-3 — MỞ RỘNG HỆ THỐNG BADGE (3 → 12 BADGES)
**Vấn đề (W6):** Chỉ có 3 badges → user "complete" quá nhanh, không có động lực dài hạn

**Benchmark:** TripAdvisor có hàng chục badges giữ user engaged nhiều năm

**Đề xuất — Badge system 4 danh mục:**

| Danh mục | Badge | Điều kiện | XP thưởng |
|---|---|---|---|
| **Tennis** | 🎾 First Serve | Hoàn thành tour đầu tiên | 0 (current) |
| | 🏆 Court Warrior | Thắng trận nội bộ | 0 (current) |
| | ⚡ Ace Machine | Đạt NTRP 4.0+ | +200 XP |
| | 🌟 Grand Slammer | Đặt cả 3 SBU | +500 XP |
| **Ẩm thực FEI** | 🍽️ FEI Master | FEI >85 (current) | 0 |
| | 🌿 Recovery Pro | FEI >90 liên tiếp 2 tour | +300 XP |
| | 👨‍🍳 Chef's Table | Private dining 3 lần | +200 XP |
| **Xã hội** | 🤝 Team Player | Refer 1 bạn thành công | +800 XP |
| | 👥 Squad Captain | Refer 3 bạn | +2.000 XP |
| | 📸 Content Creator | Share card được 10 lượt xem | +300 XP |
| **Hành trình** | 🗺️ Explorer | Tour cả Đà Nẵng lẫn Phú Quốc | +400 XP |
| | 💎 Legend | Đạt Diamond tier | +1.000 XP |

**Hiển thị:** Badges locked hiện mờ với progress bar ("Cần thêm 1 tour để unlock")

**Effort:** 1.5 ngày | **Impact:** Tăng long-term retention; thúc đẩy rebook và referral

---

### SB-4 — TÍCH HỢP THANH TOÁN VIỆT NAM
**Vấn đề (W3):** Booking flow dừng ở xác nhận mock — thiếu payment thực tế cho production

**Benchmark:** Traveloka tích hợp MoMo/ZaloPay → conversion cao hơn 35% so với card-only

**Đề xuất — Payment options ở Bước 3/Xác nhận:**
```
Phương thức thanh toán:
○ 💚 MoMo Wallet
○ 🔵 ZaloPay
○ 💳 Thẻ tín dụng/ghi nợ (Visa/Mastercard)
○ 🏦 Chuyển khoản ngân hàng
○ 📦 Thanh toán sau (đặt cọc 30%)
```

**Lưu ý prototype:** Thêm UI cho đủ option, nhưng giữ mock flow — chỉ cần visual realistic cho demo/Pilot

**Effort:** 1 ngày (UI only) | **Impact:** App trông production-ready hơn cho ban giám khảo

---

### SB-5 — AI COACH TIPS CÁ NHÂN HOÁ THEO NTRP
**Vấn đề:** Coach tips hiện là hardcoded 1 câu — không thay đổi theo NTRP level

**Đề xuất — Tips library theo NTRP:**
```typescript
// lib/coach-tips.ts
const coachTips = {
  "2.5": ["Tập trung vào consistency của groundstrokes...", ...],
  "3.0": ["Cải thiện placement, aim for corners...", ...],
  "3.5": ["Tăng tốc cú serve, hướng vào góc T...", ...], // current
  "4.0": ["Develop second serve spin variation...", ...],
  "4.5": ["Work on transition game net approach...", ...],
}
```
- Tips rotate mỗi "hoạt động" trong In-tour timeline
- Mỗi NTRP có 5–8 tips khác nhau
- Tips gắn với context: buổi sáng (warm-up), trận đấu (match), phục hồi (recovery)

**Effort:** 4 giờ | **Impact:** Tăng perceived AI personalization — quan trọng cho ban giám khảo

---

## NHÓM 3 — LONG-TERM VISION (3–6 tháng, sau Pilot)
> Cần phát triển sau khi Pilot thành công · Phụ thuộc vào resource Vietravel

---

### LT-1 — VIETRAVEL SUPER APP INTEGRATION
**Vấn đề (W7):** App standalone không tận dụng được ecosystem Vietravel

**Tầm nhìn:** Tích hợp Tennis Travel Experience vào Vietravel Super App như Traveloka Xperience

```
Vietravel Super App
├── Flights
├── Hotels
├── Tours (general)
└── Experiences ← Tennis Travel Experience vào đây
    ├── Sportcation (Tennis Travel)
    ├── Culinary Tours (FEI)
    └── Wellness Retreat
```

**Lợi ích:** Khai thác 2+ triệu user base Vietravel hiện có; CAC = 0

---

### LT-2 — REAL-TIME BACKEND & LIVE FEATURES
**Vấn đề:** Tất cả features hiện là mock → cần real backend cho production

**Roadmap kỹ thuật:**
| Feature | Tech | Timeline |
|---|---|---|
| Real NTRP AI scoring | Claude API + custom model | T7/2026 |
| Real FEI calculation | Nutrition API + algorithm | T7/2026 |
| HLV chat (real-time) | WebSocket / Supabase Realtime | T8/2026 |
| Live Score (real tennis) | Tournament API integration | T9/2026 |
| Push notifications | FCM / APNS | T7/2026 |
| Real user auth | NextAuth.js + Supabase | T7/2026 |

---

### LT-3 — LEADERBOARD + COMMUNITY PLATFORM
**Tầm nhìn:** Từ leaderboard mock → community thực sự

- Forum cho tennis players theo tier
- Match-making trong cùng tour (ghép cặp đấu theo NTRP)
- Peer-to-peer challenges ("Tôi thách bạn đạt FEI >90 tour này!")
- Club ranking (nhóm bạn bè cùng tier)

---

### LT-4 — OUTBOUND TENNIS TOURS
**Tầm nhìn:** Mở rộng từ Đà Nẵng/Phú Quốc → quốc tế

- Bangkok · Singapore · Bali (tier Gold trở lên)
- Grand Slam experience packages (Wimbledon, Australian Open)
- Kết hợp với Diamond tier đặc quyền

---

## IMPACT VS EFFORT MATRIX — TẤT CẢ CẢI THIỆN

```
IMPACT
  │
H │  QW-3(Stories) QW-4(Pre-share)     SB-1(Flow 3 bước)
I │  QW-1(Giá sớm)                     SB-2(Leaderboard)
G │  QW-2(Price card)  SB-5(AI Tips)   SB-3(Badges ×12)
H │                    SB-4(Payment)
  │
  ├──────────────────────────────────────────────────────
  │
L │                                    LT-1(Super App)
O │                                    LT-2(Backend)
W │                                    LT-3(Community)
  │                                    LT-4(Outbound)
  │
  └──────────────────────────────────────────────────────
         LOW EFFORT ──────────────────── HIGH EFFORT
```

---

## KẾ HOẠCH THỰC HIỆN — TIMELINE

### SPRINT 0 — Trước Pilot (Tuần 1–2, đến 15/06/2026)
> Mục tiêu: App sẵn sàng cho demo ban giám khảo & Pilot thực tế

| # | Task | Owner | Effort | Deadline |
|---|---|---|---|---|
| QW-1 | Price Summary Bar sticky | Dev | 4h | 01/06 |
| QW-2 | Price transparency trên Tour cards | Dev | 2h | 01/06 |
| QW-3 | Instagram Stories format (9:16) | Dev + Design | 3h | 03/06 |
| QW-4 | Pre-tour Excitement Share Card | Dev | 3h | 03/06 |
| SB-5 | AI Coach Tips theo NTRP library | Dev | 4h | 05/06 |
| SB-4 | Payment UI (mock nhưng đầy đủ options) | Dev | 1d | 07/06 |

**Tổng effort Sprint 0:** ~3 ngày dev

---

### SPRINT 1 — Sau Pilot (Tuần 3–6, tháng 7/2026)
> Mục tiêu: Tăng engagement và retention dựa trên feedback Pilot

| # | Task | Owner | Effort | Deadline |
|---|---|---|---|---|
| SB-1 | Simplify Booking Flow 4→3 bước | Dev | 1d | 14/07 |
| SB-3 | Mở rộng Badge system (3→12) | Dev + Content | 1.5d | 21/07 |
| SB-2 | Leaderboard mock (50 users) | Dev | 2d | 28/07 |

**Tổng effort Sprint 1:** ~4.5 ngày dev

---

### SPRINT 2 — Scale-up (Tháng 8–9/2026)
> Mục tiêu: Chuẩn bị production-ready cho launch chính thức

| # | Task | Owner | Effort |
|---|---|---|---|
| LT-2a | Real user auth (NextAuth + Supabase) | Backend Dev | 1 tuần |
| LT-2b | Real push notifications (FCM) | Backend Dev | 3 ngày |
| LT-2c | Real FEI calculation engine | Dev + Nutritionist | 2 tuần |
| LT-1 | Vietravel Super App integration plan | PM + Tech Lead | 1 tháng |

---

## ĐÁNH GIÁ ROI DỰ KIẾN

| Cải thiện | Metric tác động | Ước tính cải thiện |
|---|---|---|
| QW-1 + SB-1 (Booking UX) | Conversion rate | +20–30% |
| QW-3 + QW-4 (Social Share) | Viral coefficient | +40% share rate |
| SB-2 (Leaderboard) | DAU / Session time | +30–40% |
| SB-3 (Badges ×12) | 30-day retention | +25% |
| SB-5 (AI Coach Tips) | User satisfaction NPS | +15 điểm |
| SB-4 (Payment VN) | Payment completion | +35% (vs card-only) |

**Tổng impact ước tính nếu implement toàn bộ Quick Wins + Strategic Bets:**
- Rebook rate: 30% → **40%** (mục tiêu gốc 30% đã là aggressive)
- NPS Score: từ baseline → ước tính 70+
- Viral coefficient: 1 user → 1.4 users (từ referral + share)

---

## CHECKLIST ƯU TIÊN — DÀNH CHO BAN GIÁM KHẢO PRODUCT TO LEAD 2026

> Nếu chỉ có thể làm 3 việc trước ngày demo:

✅ **Ưu tiên 1 — QW-1:** Thêm Price Summary Bar sticky vào Booking Flow
→ Khắc phục điểm yếu lớn nhất; thể hiện sự am hiểu UX chuẩn ngành

✅ **Ưu tiên 2 — QW-3:** Instagram Stories format cho Share Card
→ Thể hiện tư duy viral marketing; tạo WOW moment khi demo

✅ **Ưu tiên 3 — SB-5:** AI Coach Tips theo NTRP
→ Làm sâu sắc thêm USP personalization; thuyết phục ban giám khảo về AI integration

---

## TÓM TẮT EXECUTIVE

### Vị thế cạnh tranh sau khi implement

```
TRƯỚC cải thiện:          SAU cải thiện:
─────────────────         ─────────────────
Booking Flow: 3/5    →    Booking Flow: 4.5/5
Gamification: 4/5    →    Gamification: 5/5
Social Share: 4/5    →    Social Share: 5/5
─────────────────         ─────────────────
Tổng: 31/35          →    Tổng: 34/35
```

### Định vị sau cải thiện
App sẽ là **sản phẩm travel-tech không có đối thủ** trong phân khúc Active Lifestyle Travel tại Việt Nam — dẫn đầu toàn diện 7/7 tiêu chí benchmark, không chỉ 5/7 như hiện tại.

### Rủi ro cần theo dõi
1. **Vận hành Pilot:** Features phức tạp (live score, HLV chat) cần protocol vận hành rõ ràng cho staff
2. **Scalability:** Khi mở rộng điểm đến, cần standardize FEI menu và HLV matching process
3. **Content production:** Badge descriptions, coach tips library cần content team duy trì
