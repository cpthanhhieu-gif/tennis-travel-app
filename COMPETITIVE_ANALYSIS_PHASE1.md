# GIAI ĐOẠN 1 — PHÂN TÍCH ĐỐI THỦ CẠNH TRANH
## Tennis Travel Experience App — Vietravel

> Ngày nghiên cứu: 29/05/2026 | Người thực hiện: Claude Code

---

## 1. BẢN ĐỒ ĐỐI THỦ

```
                    QUỐC TẾ
                       │
         ┌─────────────┼─────────────┐
         │             │             │
    Trải nghiệm   Tennis chuyên   Gamification
    tổng hợp      biệt           & Loyalty
    (Klook,        (CTT, Grand    (TripAdvisor,
    GetYourGuide,  Slam Tours,    Headout)
    Airbnb Exp,    TopNotch)
    Viator)
                       │
    ───────────────────┼───────────────────
                       │
                   TRONG NƯỚC
         ┌─────────────┼─────────────┐
         │             │             │
    OTA lớn       OTA nội địa   Công ty mẹ
    (Traveloka)   (VnTrip,       (Vietravel
                  Gotadi)        hiện tại)
```

---

## 2. USER PERSONA — TỔNG HỢP TỪ ĐỐI THỦ

### Persona A — "The Active Millennial" (Đối tượng chính của app)
> Tổng hợp từ: Klook, Airbnb Experiences, Traveloka Xperience

| Thuộc tính | Chi tiết |
|---|---|
| **Độ tuổi** | 28–40 tuổi |
| **Thu nhập** | Trung – cao (>25 triệu/tháng) |
| **Thiết bị** | Smartphone-first (>80% đặt tour qua app mobile) |
| **Động lực du lịch** | Trải nghiệm chủ động, nâng cao kỹ năng (tennis), kết nối cộng đồng |
| **Hành vi booking** | Nghiên cứu kỹ (đọc review), quyết định nhanh khi có deal tốt |
| **Kỳ vọng** | Cá nhân hoá cao, nội dung minh bạch, không phí ẩn |
| **Mạng xã hội** | Facebook, Instagram, TikTok — thích share thành tích |
| **Điểm đau (Pain points)** | Lịch trình không rõ ràng, thiếu hỗ trợ trong tour, booking phức tạp |

### Persona B — "The Premium Wellness Traveler"
> Tổng hợp từ: Airbnb Experiences, GetYourGuide, luxury travel reports

| Thuộc tính | Chi tiết |
|---|---|
| **Độ tuổi** | 35–55 tuổi |
| **Thu nhập** | Cao (>50 triệu/tháng) |
| **Thiết bị** | Cả desktop và mobile |
| **Động lực du lịch** | Phục hồi sức khoẻ, ẩm thực cao cấp, nghỉ dưỡng 5 sao |
| **Hành vi booking** | Sẵn sàng chi nhiều cho trải nghiệm độc đáo; book sớm, lên kế hoạch kỹ |
| **Kỳ vọng** | Dịch vụ cao cấp, hỗ trợ 24/7, xác nhận tức thì |
| **Điểm đau** | Lo ngại chất lượng dịch vụ không đồng đều, thiếu personalization |

### Persona C — "The Social Sharer / Refer-a-Friend"
> Tổng hợp từ: Viator, Headout, gamification research

| Thuộc tính | Chi tiết |
|---|---|
| **Độ tuổi** | 22–35 tuổi (Gen Z – Millennial) |
| **Hành vi** | Thích share lên mạng xã hội, tag bạn bè, săn badge/thành tích |
| **Động lực tham gia** | FOMO (Fear of Missing Out), địa vị xã hội qua achievement |
| **Kỳ vọng** | App gamify hoá trải nghiệm, có thứ để flex sau chuyến đi |
| **Điểm đau** | Không có nội dung "share-worthy" sau tour, thiếu visual thành tích |

---

## 3. USER FLOW — SO SÁNH CÁC ĐỐI THỦ

### 3.1 Klook — Flow Đặt Trải Nghiệm
```
Browse by category/destination
  → Filter (price, duration, rating, accessibility)
  → View experience detail (photos, reviews, inclusions)
  → Check availability → Select date/time
  → Optional extras upsell
  → Checkout (name + email + payment)
  → Ticket in app (QR code, offline-accessible)
  → Day-before reminder notification
```
**Điểm nổi bật:** Không phí ẩn — hiển thị tổng giá trước khi thanh toán; Wishlist với price alert.

### 3.2 GetYourGuide — Flow Tập Trung Trust
```
Search destination/landmark
  → AI-curated suggestions + themed collections
  → Listing with AI Content Insights (verify accuracy)
  → Seat selection (for shows/events)
  → Book now → Instant confirmation
  → QR ticket (offline)
  → Day-before push notification + meeting point detail
```
**Điểm nổi bật:** 100% verified reviews; AI tự động kiểm tra nội dung listing; 24/7 support.

### 3.3 Airbnb Experiences — Flow Cộng Đồng & Local
```
Discover local experiences (map/list)
  → Host profile + reviews
  → One-tap booking & rebooking
  → Personalized recommendations (from search history)
  → Dynamic map UX with real-time filters
  → Post-experience: rate → recommend to friends
```
**Điểm nổi bật:** Two-sided marketplace (host + guest journey map); community-driven trust.

### 3.4 Traveloka Xperience — Flow Super App
```
Mở app (flight/hotel context → cross-sell Xperience)
  → Browse: Attractions / Tours / Sports / Classes
  → One-touch booking + payment (MoMo, ZaloPay tích hợp)
  → Lịch sử booking tập trung 1 app
  → Customer support 24/7
```
**Điểm nổi bật:** Ecosystem integration — đặt vé bay + khách sạn + trải nghiệm trong 1 app.

### 3.5 CTT / Grand Slam Tennis Tours — Flow Chuyên Biệt
```
Browse tournament packages (Wimbledon, US Open, etc.)
  → Custom package builder (tickets + hotel + transfers)
  → Personalized by budget/preference
  → Agent consultation available
  → Itinerary delivered via email/app
```
**Điểm nổi bật:** Deep tennis expertise; custom package; pero thiếu digital-first experience.

---

## 4. USER JOURNEY MAP — TỔNG HỢP CHUẨN NGÀNH

### Giai đoạn & Cảm xúc điển hình (từ nghiên cứu đối thủ)

| Stage | Hành động | Cảm xúc | Touchpoints |
|---|---|---|---|
| **Awareness** | Thấy quảng cáo, bạn bè tag, social feed | Tò mò, hứng thú | Social media, referral, SEO |
| **Consideration** | So sánh packages, đọc review, xem ảnh | Cân nhắc, lo lắng về chất lượng | App listing, reviews, website |
| **Decision** | Chọn gói, kiểm tra availability, xem giá | Phấn khích + lo ngại phí ẩn | Checkout flow, pricing page |
| **Booking** | Thanh toán, nhận xác nhận | Nhẹ nhõm, mong chờ | Confirmation email/notification |
| **Pre-experience** | Chuẩn bị, đọc lịch trình, kết nối hướng dẫn | Hồi hộp, muốn chuẩn bị tốt | Pre-tour dashboard, reminder |
| **In-experience** | Check-in, tham gia hoạt động, rate | Hứng khởi, engaged | In-tour companion app |
| **Post-experience** | Share, review, xem thành tích | Thoả mãn, muốn chia sẻ | Share card, review prompt |
| **Retention** | Xem ưu đãi rebook, giới thiệu bạn bè | Cân nhắc tái mua | Loyalty program, voucher |

### Cảm xúc theo hình sóng (Emotional Arc)
```
Cảm xúc
   ^
10 |         ████                    ████████
 8 |    ████      ████          ████
 6 |  ██              ████  ████
 4 |██                    ██
 2 |
   └─────────────────────────────────────────→ Thời gian
     Aware  Consider  Book  Pre   In-tour  Post  Rebook
```
*Điểm thấp nhất: Checkout (lo ngại phí ẩn, UX phức tạp)*
*Điểm cao nhất: In-experience + Post-share*

---

## 5. GAMIFICATION BENCHMARK

| Nền tảng | Points | Badges | Tiers | Leaderboard | Social Share | Referral |
|---|---|---|---|---|---|---|
| **Klook** | ✓ (Klook Credits) | ✗ | ✓ (Basic) | ✗ | ✓ | ✓ |
| **Traveloka** | ✓ | ✗ | ✓ | ✗ | ✓ | ✓ |
| **TripAdvisor** | ✓ | ✓ (nhiều) | ✓ | ✓ | ✓ | ✓ |
| **Headout** | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ |
| **Tennis Tours (CTT)** | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| **App của mình** | ✓ (XP) | ✓ (3 loại) | ✓ (Silver/Gold/Diamond) | ✗ | ✓ (Share Card) | ✓ (+800 XP) |

**Nhận xét:** App của mình có gamification phong phú hơn tất cả đối thủ trực tiếp trong phân khúc tennis travel. TripAdvisor là benchmark gần nhất về depth của gamification.

---

## 6. KEY INSIGHTS — RÚT RA CHO APP

### 6.1 Về User Persona
- **Persona A (Active Millennial)** là match hoàn hảo với target của app — cần tập trung UX cho mobile-first, booking nhanh, personalization rõ ràng
- **Persona B (Premium Wellness)** cần được phục vụ qua FEI score và resort 5 sao — hiện app đã có, cần visual hơn
- **Persona C (Social Sharer)** là viral loop — Share Card feature là đúng hướng, cần polish thêm

### 6.2 Về User Flow
- Klook và GetYourGuide đều ưu tiên **transparency về giá** — bài học: hiển thị tổng chi phí sớm trong booking flow
- GetYourGuide dùng **AI để verify content** — app có thể dùng AI để personalize FEI menu tốt hơn (đã có concept)
- Traveloka thành công nhờ **ecosystem** — app bị hạn chế standalone, cần kết nối với Vietravel ecosystem

### 6.3 Về User Journey Map
- **Pre-experience stage** thường bị bỏ qua bởi đối thủ — đây là **USP lớn nhất** của app (Pre-tour dashboard với HLV, checklist, FEI menu)
- **Emotional dip tại Checkout** là vấn đề phổ biến — cần simplify booking flow, không để lộ phí ẩn muộn
- **Post-experience sharing** là cơ hội viral nhưng phần lớn đối thủ chưa làm tốt — Share Card là đúng hướng

### 6.4 Về Gamification
- App của mình **dẫn đầu phân khúc tennis travel** về gamification depth
- **Leaderboard** là mechanic mà đối thủ lớn (TripAdvisor) có nhưng app chưa có — cơ hội để tạo community
- **AI-driven personalization** trong challenges/missions là trend 2025–2026 chưa ai trong phân khúc làm

---

## NGUỒN THAM KHẢO

- [Klook App - App Store](https://apps.apple.com/us/app/klook-travel-hotels-leisure/id961850126)
- [UX Lessons from GetYourGuide App](https://behindlogin.com/news/ux-lessons-from-getyourguide-app/)
- [GetYourGuide New Tools 2025](https://www.getyourguide.press/blog/getyourguide-elevates-experiences-with-new-tools-previews-shows-events)
- [User Journeys: Airbnb Experiences](https://www.journeymapper.co/blog/user-journeys-airbnb-experiences)
- [Traveloka Vietnam Xperience Feature](https://vntravellive.com/en/traveloka-viet-nam-ra-mat-tinh-nang-moi-d29572.html)
- [Vietnam Online Travel Platforms - Cimigo](https://www.cimigo.com/en/trends/vietnams-online-travel-booking-platforms/)
- [Gamification in Travel Apps 2025](https://guul.games/blog/gamification-in-travel-apps-driving-engagement-and-loyalty-2025)
- [Gen Z Travel Trends 2025](https://www.atlys.com/blog/gen-z-travel-trends)
- [Millennial Travel Statistics 2025](https://www.smartorder.ai/resources/blog/millennial-travel-2025-trends-and-statistics/)
- [CTT Tennis Tours](https://m.tennistours.com/)
- [Grand Slam Tennis Tours](https://www.grandslamtennistours.com/)
- [Vietravel Super App Direction](https://www.webintravel.com/vietnams-online-travel-market-set-to-double-to-8b-by-2030-as-otas-super-apps-and-ai-race-for-control/)
