# MOCK_DATA — Dữ liệu mẫu đầy đủ

---

## 1. Mock User Profile

```typescript
const mockUser = {
  id: "user_001",
  name: "Nguyễn Minh Khoa",
  age: 32,
  segment: "A", // White Collar
  ntrpLevel: 3.5,
  ntrpLabel: "Intermediate",
  tier: "Silver",
  xp: 1240,
  xpToNextTier: 3000,
  email: "minhkhoa@gmail.com",
  phone: "0901 234 567",
  tourBooked: "tour_danang_3n2d_001"
}
```

---

## 2. Gói Tour (SBU)

```typescript
const tourPackages = [
  {
    id: "sbu1",
    name: "Leisure & Learning",
    tagline: "Học - Chơi - Khám phá",
    duration: ["2N1D", "3N2D"],
    priceRange: { min: 4000000, max: 8000000 },
    targetSegment: "White Collar (25–40 tuổi)",
    highlights: [
      "Huấn luyện tennis cơ bản với HLV",
      "Ẩm thực FEI bản địa",
      "Nghỉ dưỡng resort 4 sao"
    ],
    destinations: ["danang", "phuquoc"],
    margin: "10%",
    color: "#1e3a5f"
  },
  {
    id: "sbu2",
    name: "Tournament Travel",
    tagline: "Thi đấu – Cạnh tranh – Kết nối",
    duration: ["3N2D", "4N3D"],
    priceRange: { min: 8000000, max: 18000000 },
    targetSegment: "CLB Semi-Pro (25–45 tuổi, nhóm 8–20 người)",
    highlights: [
      "Tổ chức giải đấu nội bộ có tính điểm ELO",
      "Live score + bảng xếp hạng realtime",
      "Ảnh chuyên nghiệp trận đấu",
      "Tích hợp MyLeague.vn"
    ],
    destinations: ["danang", "phuquoc"],
    margin: "18%",
    color: "#b45309"
  },
  {
    id: "sbu3",
    name: "Sportcation Premium",
    tagline: "Khổ luyện – Phục hồi – Luxury",
    duration: ["4N3D", "5N4D"],
    priceRange: { min: 25000000, max: 60000000 },
    targetSegment: "Doanh nhân HNWIs (30–55 tuổi)",
    highlights: [
      "HLV quốc tế 1-1",
      "Private dining với Chef nổi tiếng",
      "Resort 5 sao đối tác độc quyền",
      "Spa phục hồi chuyên sâu",
      "Concierge 24/7"
    ],
    destinations: ["danang", "phuquoc"],
    margin: "25%",
    color: "#7c3aed"
  }
]
```

---

## 3. Lịch trình chi tiết — Đà Nẵng 3N2D (SBU 1 & 2)

### Thông tin chung
- **Điểm đến:** Đà Nẵng
- **Resort đối tác:** Fusion Maia Resort Đà Nẵng (5 sao)
- **Sân tennis:** Sân ITF chuẩn tại Fusion Maia (2 sân)
- **HLV:** Trần Văn Hùng — 8 năm kinh nghiệm, NTRP 5.0
- **Chef bản địa:** Lê Thị Thanh — Chuyên ẩm thực Quảng Nam truyền thống
- **Ngày tiêu biểu:** 13–15/06/2026 (Thứ Sáu → Chủ Nhật)

---

### 📅 NGÀY 1 — Thứ Sáu, 13/06/2026 — "Arrival & First Serve"

| Thời gian | Hoạt động | Địa điểm | XP |
|---|---|---|---|
| 08:00 | Xe đón tại sân bay Đà Nẵng (biển tên riêng) | Sân bay Đà Nẵng | — |
| 09:00 | Check-in Resort · Welcome kit (vợt, khăn, nước điện giải) | Fusion Maia Resort | +150 XP |
| 09:30 | **Bữa sáng FEI #1** — Bánh mì Đà Nẵng, trứng luộc, sinh tố xoài việt · FEI: 87/100 | Nhà hàng resort | +50 XP |
| 10:30 | **Orientation session** — HLV giới thiệu chương trình, đánh giá lại NTRP thực địa | Sân tennis 1 | — |
| 11:30 | **Tập luyện buổi 1** — Warm-up, forehand/backhand cơ bản, phân loại nhóm | Sân tennis 1 | +100 XP |
| 13:00 | **Bữa trưa FEI #2** — Mỳ Quảng chay phục hồi, gỏi bưởi tôm thịt, nước ép dừa tươi · FEI: 89/100 | Nhà hàng bản địa trong khuôn viên | +50 XP |
| 14:00 | **Nghỉ trưa / Tự do** — Hồ bơi, beach walk | Resort | — |
| 15:30 | **Buổi tập 2** — Serve & return drills, match play nội bộ thử | Sân tennis 2 | +100 XP |
| 17:30 | **Spa phục hồi buổi 1** — Massage cơ bắp 60 phút, đắp nóng vai/lưng | Spa Fusion | — |
| 19:00 | **Private Dining FEI #3** — Bàn ngoài trời view biển · Cá biển nướng muối ớt, rau địa phương, cơm gạo lứt · Chef Thanh kể chuyện nguyên liệu · FEI: 91/100 | Bãi biển riêng resort | +50 XP |
| 20:30 | **Check-in app + XP tổng kết ngày 1** — Nhận badge "First Serve 🎾" | App | +50 XP |

**Tổng XP Ngày 1: 550 XP**
**FEI Trung bình ngày 1: 89/100**

---

### 📅 NGÀY 2 — Thứ Bảy, 14/06/2026 — "The Tournament Day"

| Thời gian | Hoạt động | Địa điểm | XP |
|---|---|---|---|
| 06:30 | **Bữa sáng FEI #4** — Phở bò local, trứng protein, trà gừng kháng viêm · FEI: 88/100 | Nhà hàng resort | +50 XP |
| 07:30 | **Warm-up buổi sáng** — Cùng HLV, chuỗi dynamic stretching | Sân tennis 1 | — |
| 08:00 | **🏆 GIẢI ĐẤU NỘI BỘ** — Vòng tròn đơn nam/nữ · Live score trên app · HLV làm trọng tài | Sân tennis 1 & 2 | +200 XP (thắng) |
| 11:00 | **Lễ trao giải nội bộ** — Ảnh chuyên nghiệp · Post lên Share Card | Sân tennis | — |
| 11:30 | **Bữa trưa FEI #5** — Cơm niêu bản địa, canh chua cá tươi, rau muống xào tỏi · FEI: 90/100 | Nhà hàng bản địa | +50 XP |
| 13:00 | **Workshop ẩm thực** — Cùng Chef Thanh học nấu 1 món FEI · Trải nghiệm đi chợ Hàn (30 phút) | Bếp mở resort | +100 XP |
| 15:00 | **Tham quan bản địa** — Phố cổ Hội An (tùy chọn, xe đưa đón) hoặc tự do ở resort | Hội An / Resort | — |
| 17:00 | **Spa phục hồi buổi 2** — Hydrotherapy, foot massage | Spa Fusion | — |
| 18:30 | **Cocktail sunset** — Đồ uống phục hồi điện giải, trái cây địa phương | Rooftop bar | — |
| 19:30 | **Bữa tối FEI #6 (Gala)** — Set menu 5 món · Tôm hùm nướng, cá chẽm hấp gừng, salad rong biển · Chef kể story từng món · FEI: 93/100 | Nhà hàng chính | +50 XP |
| 21:00 | **Tổng kết ngày 2 trên app** — XP board, badge "Court Warrior 🏆" | App | +100 XP |

**Tổng XP Ngày 2: 550 XP**
**FEI Trung bình ngày 2: 90.3/100**

---

### 📅 NGÀY 3 — Chủ Nhật, 15/06/2026 — "Recovery & Farewell"

| Thời gian | Hoạt động | Địa điểm | XP |
|---|---|---|---|
| 07:00 | **Bữa sáng FEI #7** — Bánh cuốn nhân tôm, sữa đậu nành nóng, trái cây tươi · FEI: 86/100 | Nhà hàng resort | +50 XP |
| 08:00 | **Buổi tập nhẹ cuối** — Cool-down session, kỹ thuật serve nâng cao, feedback từ HLV | Sân tennis | +100 XP |
| 09:30 | **Phiên feedback 1-1 với HLV** — Video phân tích kỹ thuật, lộ trình cải thiện NTRP | Phòng họp nhỏ | — |
| 10:30 | **Nhận Share Card** — App tự generate thẻ thành tích · Chia sẻ social | App | +100 XP |
| 11:00 | **Check-out & Kỷ niệm chương** — Ảnh nhóm · Tặng túi quà gồm: đặc sản Đà Nẵng, vợt mini kỷ niệm | Sảnh resort | — |
| 12:00 | **Bữa trưa chia tay FEI #8** — Bún bò Huế truyền thống, chè đậu xanh, nước chanh muối · FEI: 88/100 | Nhà hàng resort | +50 XP |
| 13:30 | **Xe đưa ra sân bay** | Sân bay Đà Nẵng | — |
| *(Trên xe)* | **App hiển thị: Hoàn thành tour + 500 XP + Voucher 10% rebook** | App | +500 XP |

**Tổng XP Ngày 3: 800 XP**
**FEI Trung bình ngày 3: 87/100**

---

### 📊 Tổng kết tour Đà Nẵng 3N2D

| Chỉ số | Kết quả |
|---|---|
| Tổng XP kiếm được | 1.900 XP |
| XP bắt đầu | 0 (khách mới) |
| Tier đạt được | 🥈 Silver |
| FEI tổng tour | 89.4/100 ✅ |
| Số buổi tập tennis | 3 buổi |
| Số trận đấu nội bộ | 2 trận |
| Số bữa FEI | 8 bữa |
| Spa sessions | 2 sessions |
| Badges nhận | 3 badges |
| Voucher rebook | 10% (30 ngày) |

---

## 4. Lịch trình chi tiết — Phú Quốc 4N3D (SBU 2 & 3)

### Thông tin chung
- **Điểm đến:** Phú Quốc
- **Resort đối tác:** InterContinental Phú Quốc Long Beach Resort (5 sao)
- **Sân tennis:** 3 sân ITF chuẩn trong khuôn viên resort
- **HLV chính:** Nguyễn Quốc Tuấn — 12 năm kinh nghiệm, cựu VĐV quốc gia
- **HLV phụ:** Lê Thị Mai (chuyên nữ)
- **Chef:** Phạm Văn Bình — Chuyên ẩm thực hải sản Phú Quốc, từng làm khách sạn 5 sao Singapore
- **Ngày tiêu biểu:** 20–23/06/2026 (Thứ Sáu → Thứ Hai)

---

### 📅 NGÀY 1 — Thứ Sáu, 20/06/2026 — "Island Arrival"

| Thời gian | Hoạt động | Địa điểm | XP |
|---|---|---|---|
| 10:00 | Đón tại sân bay Phú Quốc · Transfer bằng xe sang | Sân bay Phú Quốc | — |
| 11:00 | Check-in InterContinental · Welcome drink: nước dừa + chanh dây tươi | Resort | +150 XP |
| 12:00 | **Bữa trưa FEI #1** — Ghẹ hấp sả gừng Phú Quốc, rau biển xào, cơm gạo lứt · FEI: 90/100 | Nhà hàng Indochine Resort | +50 XP |
| 13:30 | **Orientation & NTRP re-assessment** — Đánh giá thực địa 30 phút | Sân tennis 1 | — |
| 14:30 | **Tập luyện buổi 1** — Footwork, baseline rally, HLV video record kỹ thuật | Sân tennis 1 | +100 XP |
| 16:30 | **Tự do** — Kayak, snorkeling, beach walk | Bãi biển resort | — |
| 18:00 | **Sunset cocktail + Team intro** — Giới thiệu HLV, đội bếp, lịch trình 4 ngày | Pool bar | — |
| 19:30 | **Bữa tối FEI #2** — Cá ngừ đại dương áp chảo, bạch tuộc nướng muối tiêu Phú Quốc, soup hải sản · FEI: 92/100 | Private beach dining | +50 XP |

**Tổng XP Ngày 1: 350 XP**

---

### 📅 NGÀY 2 — Thứ Bảy, 21/06/2026 — "Intensity Day"

| Thời gian | Hoạt động | Địa điểm | XP |
|---|---|---|---|
| 06:00 | **Bình minh yoga phục hồi** (tùy chọn) — 45 phút, tập trung hít thở | Bãi biển | — |
| 06:30 | **Bữa sáng FEI #3** — Cháo hải sản địa phương, trứng ốp la, nước ép cà rốt gừng · FEI: 88/100 | Nhà hàng resort | +50 XP |
| 07:30 | **Buổi tập cường độ cao** — Serving drills, volleys, HLV cá nhân 1-1 (60 phút/người) | Sân tennis 1 & 2 | +100 XP |
| 10:00 | **Mini Tournament vòng 1** — Thi đấu singles, Live score app | Sân tennis 3 | +200 XP |
| 12:00 | **Bữa trưa FEI #4** — Lẩu hải sản Phú Quốc (cua, tôm, mực), rau địa phương · FEI: 91/100 | Nhà hàng bản địa | +50 XP |
| 13:30 | **Workshop: Dinh dưỡng thể thao** — Chef Bình & HLV Tuấn hướng dẫn NPI (Nutrition Performance Index) | Bếp mở | +100 XP |
| 15:30 | **Spa Premium buổi 1** — Deep tissue massage 90 phút, tắm khoáng nóng | Spa InterContinental | — |
| 19:00 | **Bữa tối FEI #5** — Tôm hùm Alaska nướng bơ tỏi, salad rong nho Nhật, rượu vang đỏ nhẹ · FEI: 94/100 | Private dining room | +50 XP |

**Tổng XP Ngày 2: 550 XP**
**FEI Trung bình ngày 2: 91.6/100**

---

### 📅 NGÀY 3 — Chủ Nhật, 22/06/2026 — "The Grand Final"

| Thời gian | Hoạt động | Địa điểm | XP |
|---|---|---|---|
| 06:30 | **Bữa sáng FEI #6** — Bánh mì Phú Quốc nhân cá, sinh tố mãng cầu, trà hoa cúc · FEI: 87/100 | Nhà hàng resort | +50 XP |
| 07:30 | **Final Practice** — Video analysis buổi tối trước, điều chỉnh kỹ thuật | Sân tennis 1 | +100 XP |
| 09:00 | **🏆 GRAND FINAL TOURNAMENT** — Vòng bán kết + Chung kết · Live Score · ELO update | Sân tennis 1 | +300 XP (Chung kết) |
| 12:00 | **Lễ trao giải chính thức** — Cúp + medal + ảnh chuyên nghiệp · Đăng ELO lên MyLeague.vn | Sân resort | — |
| 13:00 | **Bữa trưa FEI #7 (Celebration)** — Tiệc nhẹ kiểu tapas · Nem nướng, chả giò tôm, cocktail trái cây · FEI: 90/100 | Pool side | +50 XP |
| 15:00 | **Trải nghiệm bản địa** — Tour câu cá ngoài khơi (2 giờ, thuyền nhỏ), chef nấu cá vừa câu | Ngoài khơi Phú Quốc | +100 XP |
| 18:00 | **Spa Premium buổi 2** — Hot stone massage, aromatherapy | Spa | — |
| 19:30 | **Bữa tối Gala FEI #8** — 7 món đầy đủ · Chef Bình storytelling từng nguyên liệu · FEI: 95/100 | Private beach restaurant | +50 XP |
| 21:00 | **Tổng kết trên app + Generate Share Card** | App | +100 XP |

**Tổng XP Ngày 3: 750 XP**

---

### 📅 NGÀY 4 — Thứ Hai, 23/06/2026 — "Recovery & Departure"

| Thời gian | Hoạt động | Địa điểm | XP |
|---|---|---|---|
| 07:00 | **Bữa sáng FEI #9** — Congee hải sản, dim sum nhẹ, trà xanh Phú Quốc · FEI: 89/100 | Nhà hàng resort | +50 XP |
| 08:00 | **Cool-down & Stretch session** — Yoga phục hồi 45 phút với HLV | Bãi biển | — |
| 09:00 | **1-1 Video debrief** — HLV phân tích video toàn tour, lộ trình NTRP tiếp theo | Phòng họp | — |
| 10:00 | **Nhận thẻ thành tích + Share Card** | App | +100 XP |
| 10:30 | **Buổi checkout & Kỷ niệm chương** — Quà lưu niệm: Tiêu Phú Quốc, nước mắm Hưng Thịnh, tập ảnh chuyên nghiệp | Sảnh resort | — |
| 12:00 | **Bữa trưa chia tay FEI #10** — Bún cá Kiên Giang, chè thưng, nước mía · FEI: 87/100 | Nhà hàng bản địa | +50 XP |
| 13:30 | Transfer ra sân bay | Sân bay Phú Quốc | — |
| *(Trên xe)* | **App: Hoàn thành tour + 500 XP + Voucher 10%** | App | +500 XP |

**Tổng XP Ngày 4: 700 XP**

---

### 📊 Tổng kết tour Phú Quốc 4N3D

| Chỉ số | Kết quả |
|---|---|
| Tổng XP kiếm được | 2.350 XP |
| Tier đạt được | 🥇 Gold |
| FEI tổng tour | 91.3/100 ✅ |
| Số buổi tập tennis | 4 buổi |
| Số trận đấu | 4 trận (2 vòng) |
| Số bữa FEI | 10 bữa |
| Spa sessions | 2 sessions premium |
| Badges nhận | 4–5 badges |
| ELO updated | +45 điểm |
| Voucher rebook | 10% (30 ngày) |

---

## 5. Mock Gamification Data

```typescript
const gamificationData = {
  tiers: [
    {
      name: "Bronze",
      icon: "🥉",
      xpMin: 0,
      xpMax: 999,
      perks: ["Welcome kit", "Voucher 5% off", "Newsletter priority"],
      color: "#b45309"
    },
    {
      name: "Silver",
      icon: "🥈",
      xpMin: 1000,
      xpMax: 2999,
      perks: ["Upgrade room (nếu có)", "Private chef 1 bữa", "Voucher 10% rebook"],
      color: "#6b7280",
      current: true // mock user đang ở đây
    },
    {
      name: "Gold",
      icon: "🥇",
      xpMin: 3000,
      xpMax: 6999,
      perks: ["Premium Vault access", "HLV Quốc tế 1 buổi", "Priority booking"],
      color: "#d97706"
    },
    {
      name: "Diamond",
      icon: "💎",
      xpMin: 7000,
      xpMax: 999999,
      perks: ["Outbound Tour unlock", "Concierge 24/7", "Bespoke tour design", "Invite-only events"],
      color: "#7c3aed"
    }
  ],
  xpActions: [
    { action: "Hoàn thành tour", xp: 500, icon: "🏁" },
    { action: "Điểm FEI >85", xp: 300, icon: "🍽️" },
    { action: "Refer bạn bè", xp: 800, icon: "👥" },
    { action: "Check-in ngày đầu", xp: 150, icon: "📍" },
    { action: "Hoàn thành buổi tập", xp: 100, icon: "🎾" },
    { action: "Thắng trận nội bộ", xp: 200, icon: "🏆" },
    { action: "Rate hoạt động ≥4 sao", xp: 30, icon: "⭐" },
    { action: "Chia sẻ Share Card", xp: 100, icon: "📤" },
    { action: "Workshop ẩm thực", xp: 100, icon: "👨‍🍳" }
  ],
  mockUserBadges: [
    {
      id: "first_serve",
      name: "First Serve",
      icon: "🎾",
      description: "Hoàn thành tour đầu tiên",
      earnedAt: "2026-06-13"
    },
    {
      id: "fei_master",
      name: "FEI Master",
      icon: "🍽️",
      description: "Đạt điểm FEI >85 toàn bộ bữa ăn",
      earnedAt: "2026-06-14"
    },
    {
      id: "court_warrior",
      name: "Court Warrior",
      icon: "🏆",
      description: "Thắng ít nhất 1 trận trong giải nội bộ",
      earnedAt: "2026-06-14"
    }
  ]
}
```

---

## 6. Mock FEI Score Data

```typescript
const feiScoreData = {
  subIndices: [
    { code: "NPI", name: "Nutrition Performance", score: 88, description: "Protein/carb-timing/electrolyte chuẩn ACSM" },
    { code: "LAI", name: "Local Authenticity", score: 92, description: "100% nguyên liệu trong bán kính 50km" },
    { code: "EII", name: "Experience Immersion", score: 87, description: "Khách trực tiếp tham gia nấu ăn, gặp Chef" },
    { code: "RWI", name: "Recovery & Wellness", score: 90, description: "Thực phẩm kháng viêm, sleep-support drinks" },
    { code: "LPI", name: "Luxury Personalization", score: 88, description: "Private dining, menu cá nhân hoá" }
  ],
  totalFEI: 89,
  targetFEI: 85,
  status: "PASSED" // ≥85 → Signature standard
}
```

---

## 7. Mock NTRP Quiz (5 câu)

```typescript
const ntrpQuiz = [
  {
    id: 1,
    question: "Bạn chơi tennis được bao lâu rồi?",
    options: [
      { label: "Chưa bao giờ chơi / mới bắt đầu", value: 1.0 },
      { label: "1–2 năm, chơi cuối tuần", value: 2.5 },
      { label: "3–5 năm, chơi đều đặn", value: 3.5 },
      { label: "5+ năm, thi đấu club", value: 4.5 }
    ]
  },
  {
    id: 2,
    question: "Cú serve của bạn như thế nào?",
    options: [
      { label: "Vẫn đang học cách serve đúng", value: 1.5 },
      { label: "Serve được nhưng chưa ổn định", value: 2.5 },
      { label: "Serve ổn định, có flat và slice", value: 3.5 },
      { label: "Serve mạnh, biến tấu được", value: 4.5 }
    ]
  },
  {
    id: 3,
    question: "Bạn có thể duy trì rally bao nhiêu cú?",
    options: [
      { label: "3–5 cú là lưới hoặc ra ngoài", value: 1.5 },
      { label: "6–10 cú ổn định", value: 2.5 },
      { label: "10–20 cú, có thể tấn công", value: 3.5 },
      { label: "20+ cú, điều hướng được", value: 4.5 }
    ]
  },
  {
    id: 4,
    question: "Bạn có thi đấu giải không?",
    options: [
      { label: "Chưa bao giờ", value: 1.0 },
      { label: "Chơi nội bộ club", value: 2.5 },
      { label: "Có thi giải địa phương", value: 3.5 },
      { label: "Thi giải thường xuyên, có ranking", value: 4.5 }
    ]
  },
  {
    id: 5,
    question: "Mục tiêu của bạn trong tour này là gì?",
    options: [
      { label: "Học kỹ thuật từ đầu", value: 1.5 },
      { label: "Cải thiện kỹ năng + thư giãn", value: 2.5 },
      { label: "Thi đấu nội bộ + networking", value: 3.5 },
      { label: "Nâng cao performance nghiêm túc", value: 4.5 }
    ]
  }
]

// NTRP Mapping
const ntrpLevels = {
  "1.0-1.5": { label: "Beginner", description: "Đang học kỹ thuật cơ bản", recommendedSBU: "sbu1" },
  "2.0-2.5": { label: "Novice", description: "Chơi được nhưng cần cải thiện", recommendedSBU: "sbu1" },
  "3.0-3.5": { label: "Intermediate", description: "Chơi đều, bắt đầu thi đấu được", recommendedSBU: "sbu2" },
  "4.0-4.5": { label: "Advanced", description: "Thi đấu club, kỹ thuật tốt", recommendedSBU: "sbu3" },
  "5.0+":    { label: "Expert", description: "Gần chuyên nghiệp", recommendedSBU: "sbu3" }
}
```

---

## 8. Mock Pricing — SBU 1 Đà Nẵng 3N2D

```typescript
const pricingBreakdown = {
  tourId: "sbu1_danang_3n2d",
  basePrice: 5800000, // VNĐ/người
  breakdown: {
    accommodation: { percent: 32, amount: 1856000, label: "Lưu trú resort 4–5 sao" },
    tennisCourt: { percent: 18, amount: 1044000, label: "Sân tennis + HLV" },
    feiFoodExperience: { percent: 15, amount: 870000, label: "Ẩm thực FEI 8 bữa" },
    operationsMarketing: { percent: 25, amount: 1450000, label: "Vận hành + Marketing" },
    grossProfit: { percent: 10, amount: 580000, label: "Lãi gộp" }
  },
  groupDiscount: {
    "5-9 người": "5%",
    "10-19 người": "10%",
    "20+ người": "15%"
  }
}
```
