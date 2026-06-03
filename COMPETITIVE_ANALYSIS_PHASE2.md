# GIAI ĐOẠN 2 — BENCHMARK & SO SÁNH CẠNH TRANH
## Tennis Travel Experience App vs. Đối thủ

> Ngày: 29/05/2026 | Dựa trên: Phase 1 research + app specs (SCREENS.md, USER_FLOW.md)

---

## PHƯƠNG PHÁP ĐÁNH GIÁ

**7 tiêu chí benchmark** — mỗi tiêu chí chấm theo thang 1–5:

| # | Tiêu chí | Mô tả |
|---|---|---|
| 1 | **Onboarding & Personalization** | Mức độ cá nhân hoá từ bước đầu |
| 2 | **Booking Flow UX** | Độ mượt mà, ít ma sát khi đặt tour |
| 3 | **Pre-Experience Companion** | Hỗ trợ trước khi trải nghiệm bắt đầu |
| 4 | **In-Experience Companion** | Đồng hành trong khi trải nghiệm |
| 5 | **Gamification & Loyalty** | Hệ thống XP, badge, tier, retention |
| 6 | **Social Sharing & Viral** | Cơ chế lan truyền tự nhiên |
| 7 | **Niche/Vertical Depth** | Độ chuyên sâu vào phân khúc cụ thể |

---

## BẢNG ĐIỂM TỔNG HỢP

| Tiêu chí | App của mình | Klook | GetYourGuide | Airbnb Exp. | Traveloka | CTT Tennis |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Onboarding & Personalization | **5** | 3 | 4 | 3 | 3 | 2 |
| Booking Flow UX | **3** | 5 | 5 | 4 | 5 | 2 |
| Pre-Experience Companion | **5** | 1 | 2 | 2 | 1 | 3 |
| In-Experience Companion | **5** | 1 | 1 | 2 | 1 | 1 |
| Gamification & Loyalty | **4** | 3 | 2 | 2 | 3 | 1 |
| Social Sharing & Viral | **4** | 3 | 2 | 3 | 2 | 1 |
| Niche/Vertical Depth | **5** | 2 | 2 | 2 | 2 | 4 |
| **TỔNG** | **31/35** | **18/35** | **18/35** | **18/35** | **17/35** | **14/35** |

> **App của mình dẫn đầu tổng điểm** — nhưng có 1 điểm yếu nghiêm trọng: **Booking Flow UX chỉ 3/5**

---

## PHÂN TÍCH CHI TIẾT TỪNG TIÊU CHÍ

---

### TIÊU CHÍ 1 — ONBOARDING & PERSONALIZATION

#### App của mình ★★★★★ (5/5)
**Điểm mạnh:**
- NTRP Quiz (5 câu hỏi) → phân loại trình độ tennis → gợi ý gói phù hợp ngay trong booking flow
- AI gợi ý FEI Menu dựa trên NTRP level (Pre-tour screen)
- Welcome banner cá nhân hoá: tên, tour, countdown
- HLV được phân công phù hợp với trình độ (NTRP 5.0 cho NTRP 3.5)
- Persistent state: XP + tier giữ nguyên qua localStorage

**Điểm yếu:**
- Personalization hiện là mock static — không có real AI inference
- Chưa có behavioural personalization (dựa trên lịch sử hành động trong app)

#### Đối thủ so sánh:
| Nền tảng | Điểm | Ghi chú |
|---|---|---|
| Klook | 3/5 | Filter theo sở thích, nhưng không quiz onboarding; recommendations generic |
| GetYourGuide | 4/5 | AI-powered search personalization, AI summary reviews; thiếu pre-booking quiz |
| Airbnb Exp. | 3/5 | One-tap rebooking, behavioral tracking nhưng không quiz niche |
| Traveloka | 3/5 | Xperience cross-sell từ flight/hotel data, nhưng không phân loại skill level |
| CTT Tennis | 2/5 | Agent tư vấn manual qua phone, không có digital onboarding |

**Kết luận:** App có **USP rõ ràng** — NTRP quiz là cơ chế onboarding unique trong phân khúc này.

---

### TIÊU CHÍ 2 — BOOKING FLOW UX

#### App của mình ★★★☆☆ (3/5)
**Điểm mạnh:**
- Step indicator 4 bước rõ ràng (Bước 1/4)
- Nút "Quay lại" ở mọi bước (không trap user)
- Confirm dialog khi cancel từ bước 3 trở đi
- Modal success → redirect tự động sang Pre-tour (flow liền mạch)
- Tổng giá hiển thị ở Bước 4

**Điểm yếu (nghiêm trọng):**
- **Giá hiện muộn** — chỉ hiển thị tổng ở Bước 4; user không biết giá đến cuối flow → anxiety cao
- **4 bước dài** so với Klook/GetYourGuide (2–3 tap là booking xong)
- Không có quick-book option cho returning user
- Không có price transparency sớm (hidden cost syndrome)
- Thiếu payment options (mock chỉ confirm, không có MoMo/ZaloPay integration)
- Không có "Save for later" / wishlist

#### Đối thủ so sánh:
| Nền tảng | Điểm | Cơ chế nổi bật |
|---|---|---|
| Klook | 5/5 | Price rõ từ listing; 2–3 tap to book; no hidden fees; wishlist với price alert |
| GetYourGuide | 5/5 | Transparent pricing; instant confirmation; seat selection; verified reviews trước khi book |
| Airbnb Exp. | 4/5 | One-tap booking & rebooking; dynamic availability; nhưng không có add-ons |
| Traveloka | 5/5 | One-touch booking; MoMo/ZaloPay native; cross-sell trong 1 app |
| CTT Tennis | 2/5 | Manual quote via agent; không có self-serve digital booking |

**Benchmark tốt nhất:** Klook — hiển thị giá từ đầu, 2 bước checkout, không phí ẩn.

---

### TIÊU CHÍ 3 — PRE-EXPERIENCE COMPANION

#### App của mình ★★★★★ (5/5)
**Điểm mạnh — Độc nhất trong ngành:**
- Pre-tour dashboard cá nhân hoá ngay sau booking
- Expandable timeline từng ngày (Ngày 1, 2, 3 với 3–4 hoạt động/ngày)
- AI FEI Menu gợi ý 3 bữa + chỉ số dinh dưỡng (NPI/LAI/EII/RWI/LPI)
- Kết nối HLV trước tour (nhắn tin mock)
- Checklist chuẩn bị (gear, giày, trang phục)
- Countdown timer tạo anticipation
- XP kiếm được khi hoàn thành checklist (+100 XP)

**Điểm yếu:**
- HLV chat là mock — không có real messaging
- Timeline không có map integration (không biết địa điểm)

#### Đối thủ so sánh:
| Nền tảng | Điểm | Ghi chú |
|---|---|---|
| Klook | 1/5 | Chỉ có email confirmation + QR ticket; không có pre-experience dashboard |
| GetYourGuide | 2/5 | Day-before push notification + meeting point; không có itinerary dashboard |
| Airbnb Exp. | 2/5 | Host message pre-experience; không có structured dashboard |
| Traveloka | 1/5 | Booking history; không có companion dashboard |
| CTT Tennis | 3/5 | Detailed itinerary qua email; agent contact; nhưng không có app UI |

**Kết luận:** Đây là **khoảng trắng lớn nhất** trong ngành mà app của mình đang fill. **Không đối thủ nào có Pre-Experience Companion tốt.**

---

### TIÊU CHÍ 4 — IN-EXPERIENCE COMPANION

#### App của mình ★★★★★ (5/5)
**Điểm mạnh — Hoàn toàn độc nhất:**
- Timeline real-time theo giờ với status (✅ đã xong / 🔴 LIVE / upcoming)
- Live Score Box: tên vs. tên, set score real-time với badge "LIVE 🔴"
- XP toast notification real-time (+50 XP vừa kiếm)
- Thanh XP tiến trình (720/1000)
- Tips real-time từ HLV ("Tăng tốc cú serve...")
- Badge "🟢 Đang diễn ra" cảm giác live

**Điểm yếu:**
- Tất cả là mock/static; không có real-time server
- Live score là hardcoded (không có real tennis scoring engine)
- Không có push notification thực sự

#### Đối thủ so sánh:
| Nền tảng | Điểm | Ghi chú |
|---|---|---|
| Klook | 1/5 | Không có in-experience feature; app chỉ là ticket holder |
| GetYourGuide | 1/5 | QR ticket + meeting info; không có companion features |
| Airbnb Exp. | 2/5 | Host có thể chat; không có live activity tracking |
| Traveloka | 1/5 | Không có in-experience companion |
| CTT Tennis | 1/5 | Tour guide có mặt trực tiếp; không có app support |

**Kết luận:** App của mình **tạo ra category mới** trong travel apps — In-Experience Digital Companion. **Không đối thủ nào có feature này.** Đây là differentiator chiến lược lớn nhất.

---

### TIÊU CHÍ 5 — GAMIFICATION & LOYALTY

#### App của mình ★★★★☆ (4/5)
**Điểm mạnh:**
- XP system gắn với hành vi cụ thể trong tour (không chỉ booking)
- 4 tiers có lợi ích thực tế khác biệt (Bronze → Diamond)
- 3 loại badges có ý nghĩa (First Serve, FEI Master, Court Warrior)
- Referral reward mạnh (+800 XP)
- Voucher auto-loop 10% sau tour với countdown 30 ngày
- XP animation khi vào Gamification screen

**Điểm yếu:**
- Không có **Leaderboard** → thiếu social competition
- Không có **Challenges/Missions** theo thời gian (daily/weekly)
- Badge số lượng ít (3 badges) → nhanh "done", thiếu long-term engagement
- Không có community giữa các player cùng tier

#### Đối thủ so sánh:
| Nền tảng | Điểm | Ghi chú |
|---|---|---|
| Klook | 3/5 | Klook Credits system; tier program basic; referral program; thiếu badges |
| GetYourGuide | 2/5 | Không có gamification rõ ràng; loyalty qua partner discounts |
| Airbnb Exp. | 2/5 | Superhost program cho host side; user side không có gamification |
| Traveloka | 3/5 | Traveloka Points; tier program; thiếu badges và missions |
| TripAdvisor* | 4/5 | Badges phong phú; leaderboard; level system; thiếu niche context |

*TripAdvisor không phải đối thủ trực tiếp nhưng là benchmark gamification tốt nhất.

---

### TIÊU CHÍ 6 — SOCIAL SHARING & VIRAL

#### App của mình ★★★★☆ (4/5)
**Điểm mạnh:**
- **Share Card** là điểm khác biệt rõ nhất — visual card được generate tự động
- Card chứa: tên, tour, tier badge, XP, FEI score, QR, hashtag #TennisTravelVN
- Multiple share options: Download PNG, Copy link, Web Share API
- Referral mechanic mạnh: tag bạn → bạn nhận voucher, mình nhận +800 XP
- Hashtag branded tạo community UGC

**Điểm yếu:**
- Share card là static design — không có dynamic customization
- Không có pre-tour share ("Tôi sắp đi tennis tour!") → chỉ share post-tour
- Không có Stories template tối ưu cho Instagram/TikTok format (9:16)
- Referral tracking là mock (không có real attribution)

#### Đối thủ so sánh:
| Nền tảng | Điểm | Ghi chú |
|---|---|---|
| Klook | 3/5 | Referral credits; share links; không có visual share card |
| GetYourGuide | 2/5 | Basic share links; review incentive; không có branded share card |
| Airbnb Exp. | 3/5 | Word-of-mouth mạnh; host stories; thiếu structured share card |
| Traveloka | 2/5 | Referral program; thiếu visual achievement sharing |

---

### TIÊU CHÍ 7 — NICHE/VERTICAL DEPTH

#### App của mình ★★★★★ (5/5)
**Điểm mạnh — Core Differentiator:**
- Phân loại NTRP (hệ thống chuẩn quốc tế ITF)
- FEI Score riêng với 5 chỉ số dinh dưỡng thể thao (NPI, LAI, EII, RWI, LPI)
- Recovery meal được tư vấn bởi NTRP level
- HLV được match theo trình độ
- Live Score trong tour
- Coach tips real-time
- Tour design quanh cả 3 trụ cột: Tennis + FEI + Resort 5 sao
- 3 SBU tier phù hợp từng segment (Leisure → Tournament → Premium)

**Điểm yếu:**
- Chỉ có 2 điểm đến pilot (Đà Nẵng, Phú Quốc)
- Không có calendar lịch giải đấu tennis VN/quốc tế để upsell
- Thiếu community forum/group cho tennis players

#### Đối thủ so sánh:
| Nền tảng | Điểm | Ghi chú |
|---|---|---|
| Klook | 2/5 | Category "Sports" có tennis nhưng không có NTRP, FEI, hay coach matching |
| GetYourGuide | 2/5 | Tương tự Klook — generic activity listing |
| Airbnb Exp. | 2/5 | Có tennis lessons bởi local hosts; không có tour package depth |
| CTT Tennis | 4/5 | Deep tennis tournament packages; nhưng thiếu FEI, recovery, digital companion |

---

## RADAR CHART — TỔNG HỢP ĐIỂM MẠNH YẾU

```
                 Personalization
                       5
                    ___●___
                   /       \
    Niche     5●  /         \  ●3  Booking Flow
    Depth        /           \
                /             \
    Social  4● /               \ ●5  Pre-Experience
    Sharing    \               /
                \             /
                 \           /
    Gamification 4●\         /●5  In-Experience
                    \_______/

    ──── App của mình
```

**Hình dạng:** Mạnh ở 5/7 tiêu chí (phần trên và 2 bên). Điểm yếu nằm ở **Booking Flow** (đáy trái).

---

## MA TRẬN ĐIỂM MẠNH / ĐIỂM YẾU

### ✅ ĐIỂM MẠNH (Strengths)

| # | Điểm mạnh | So với đối thủ | Mức độ |
|---|---|---|---|
| S1 | NTRP Quiz onboarding → personalization ngay từ đầu | Không đối thủ nào có | 🔥 Unique |
| S2 | Pre-tour dashboard toàn diện (timeline + FEI + HLV + checklist) | Tốt hơn tất cả | 🔥 Unique |
| S3 | In-Experience Companion (live score + coach tips + XP real-time) | Không đối thủ nào có | 🔥 Category-Creating |
| S4 | FEI Score — chỉ số ẩm thực thể thao độc quyền | Không đối thủ nào có | 🔥 Unique IP |
| S5 | Share Card visual với thành tích cá nhân hoá | Tốt hơn tất cả OTA | ⭐ Strong |
| S6 | Gamification gắn liền với hành vi thực (không chỉ booking) | Tốt hơn Klook/Traveloka | ⭐ Strong |
| S7 | Flywheel 5 stage hoàn chỉnh (Pre → In → Gamify → Share → Rebook) | Không đối thủ nào có | 🔥 Unique |

### ❌ ĐIỂM YẾU (Weaknesses)

| # | Điểm yếu | Đối thủ làm tốt hơn | Mức độ rủi ro |
|---|---|---|---|
| W1 | **Giá hiện muộn** — chỉ ở Bước 4 | Klook, GetYourGuide (từ listing) | 🔴 Cao — drop-off |
| W2 | **Booking flow 4 bước** — quá nhiều friction | Klook (2–3 tap), Traveloka | 🔴 Cao — conversion |
| W3 | **Thiếu payment options** — không có MoMo/ZaloPay | Traveloka, VnTrip | 🟡 Trung bình |
| W4 | **Không có Leaderboard** — thiếu social competition | TripAdvisor | 🟡 Trung bình |
| W5 | **Share Card chỉ post-tour** — không có pre-tour excitement | N/A (cơ hội mới) | 🟡 Trung bình |
| W6 | **Chỉ 3 badges** — quản lý thiếu long-term engagement | TripAdvisor (nhiều hơn) | 🟡 Trung bình |
| W7 | **Standalone app** — không có ecosystem integration | Traveloka (super app) | 🟡 Trung bình |
| W8 | **Thiếu Stories format** (9:16) cho Instagram/TikTok | N/A (cơ hội mới) | 🟢 Thấp |

---

## COMPETITIVE POSITIONING MAP

```
         NICHE DEPTH (Chuyên sâu phân khúc)
              HIGH
               │
    CTT Tennis ●                    ● App của mình
               │                  /
               │                /
               │              /
               │            /
  LOW ─────────┼──────────────────────── HIGH
  DIGITAL      │          ╱        DIGITAL
  COMPANION    │        ╱         COMPANION
               │      ╱
               │    ╱
    Airbnb Exp.●  ╱ ● GetYourGuide
               │╱
           Klook ●  ● Traveloka
               │
              LOW
```

**App của mình** nằm ở góc phần tư lý tưởng: **High Niche Depth + High Digital Companion** — không đối thủ nào chiếm vị trí này.

---

## TÓM TẮT EXECUTIVE

### 3 Kết luận chiến lược

**1. App tạo ra category mới — "Active Travel Companion"**
Không đối thủ nào có sự kết hợp Pre-tour + In-tour Companion + Niche Gamification. Đây là white space thực sự, không chỉ differentiation nhỏ.

**2. Điểm yếu nguy hiểm nhất là Booking Flow**
Trong khi app dẫn đầu ở 5/7 tiêu chí, Booking Flow là bottleneck chuyển đổi. Người dùng có thể bị mất trước khi trải nghiệm được các USP. Đây là ưu tiên cải thiện số 1.

**3. Gamification cần thêm chiều sâu**
Badge ít (3) và không có Leaderboard khiến engagement long-term thấp sau tour đầu tiên. Cần thêm để giữ người dùng quay lại giữa các tour.

---

## NGUỒN THAM KHẢO

- [Klook Booking Flow - PageFlows](https://pageflows.com/post/desktop-web/booking-an-activity/klook/)
- [Checkout UX Best Practices 2025 - Baymard](https://baymard.com/blog/current-state-of-checkout-ux)
- [GetYourGuide AI Features Spring 2026](https://www.getyourguide.press/blog/springrelease2026)
- [GetYourGuide Fall 2025 Product Release](https://www.getyourguide.supply/fall2025)
- [GetYourGuide SWOT Analysis 2025](https://www.swotanalysis.com/getyourguide)
- [Gamification in Travel Apps 2025](https://guul.games/blog/gamification-in-travel-apps-driving-engagement-and-loyalty-2025)
- [Mindtrip AI Travel Companion](https://mindtrip.ai/)
- [Booking UX Best Practices 2025](https://ralabs.org/blog/booking-ux-best-practices/)
