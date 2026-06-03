# OVERVIEW — Tennis Travel Experience App

## Tên sản phẩm
**Tennis Travel Experience — Ace & Taste Journey**
Tagline: *"Play Hard. Recover Well. Taste the Story."*
Thương hiệu: Vietravel

---

## Mục tiêu app
Đây là **Interactive Prototype Web App** mô phỏng hành trình khách hàng từ lúc khám phá → đặt tour → trải nghiệm → chia sẻ → rebook. Mục tiêu:
1. Demo hành trình 5 stage cho ban giám khảo Product to Lead 2026
2. Quay video thao tác để minh họa sản phẩm
3. Deploy lên Vercel để truy cập trực tiếp qua trình duyệt

---

## Tech Stack
| Layer | Công nghệ |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Icons | Lucide React |
| Charts | Recharts (cho FEI score, gamification) |
| Data | Mock data tĩnh (không cần backend) |
| Deploy | Vercel |
| Repo | GitHub |

---

## Phạm vi (Scope)
- **6 màn hình chính** (xem SCREENS.md)
- **Toàn bộ tiếng Việt**
- **Không cần authentication thật** — dùng mock user profile sẵn
- **Không cần payment gateway** — booking flow dừng ở màn xác nhận
- **Responsive**: Mobile-first, tối ưu cho màn hình 390px–1440px

---

## Thông tin sản phẩm gốc
- Tác giả: Nguyễn Thủy Tiên — Ban Nhân chính, Vietravel
- Cuộc thi: Product to Lead 2026 — Bảng 2 (New Product Creation)
- Định vị: Sản phẩm Signature đầu tiên tại VN kết hợp Tennis + Ẩm thực FEI + Nghỉ dưỡng 5 sao
- Pilot: Tháng 6/2026 (Đà Nẵng + Phú Quốc)

---

## Chỉ số chất lượng cần thể hiện trong app
| Chỉ số | Giá trị | Ý nghĩa |
|---|---|---|
| LEI (Living Experience Index) | 84/100 | Vượt chuẩn Premium ≥75 |
| ESG Score | 89/100 | Đủ điều kiện giải ESG Đột phá |
| FEI (Food Experience Index) | ≥88/100 | Chuẩn Signature ≥85 |

---

## Folder structure gợi ý cho Claude Code
```
tennis-travel-app/
├── app/
│   ├── page.tsx              # Home
│   ├── booking/page.tsx      # Booking Flow
│   ├── pre-tour/page.tsx     # Pre-tour Dashboard
│   ├── in-tour/page.tsx      # In-tour Live
│   ├── gamification/page.tsx # XP & Badges
│   └── share-card/page.tsx   # Share Card
├── components/
│   ├── ui/                   # Button, Card, Badge, etc.
│   ├── layout/               # Navbar, Footer, BottomNav
│   └── features/             # FEIScore, XPBar, TourCard, etc.
├── lib/
│   └── mock-data.ts          # Toàn bộ mock data
├── public/
│   └── images/               # Ảnh tour, food, resort
└── tailwind.config.ts
```
