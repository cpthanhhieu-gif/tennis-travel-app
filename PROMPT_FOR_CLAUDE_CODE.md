# PROMPT FOR CLAUDE CODE
# Copy toàn bộ nội dung bên dưới và paste vào Claude Code

---

## PROMPT

Bạn là một senior full-stack developer. Hãy build cho tôi một **Interactive Prototype Web App** tên là **"Tennis Travel Experience — Ace & Taste Journey"** dựa trên toàn bộ spec files trong thư mục này.

### Đọc spec theo thứ tự sau (BẮT BUỘC trước khi code):
1. `OVERVIEW.md` — Tổng quan, tech stack, scope
2. `REQUIREMENTS_RULES.md` — Các rule bắt buộc phải tuân thủ
3. `UI_STANDARDS.md` — Tiêu chuẩn UI quốc tế
4. `DESIGN.md` — Color palette, typography, component specs
5. `SCREENS.md` — 6 màn hình cần build
6. `USER_FLOW.md` — Hành trình 5 stage của khách hàng
7. `MOCK_DATA.md` — Toàn bộ mock data và lịch trình chi tiết

---

### Yêu cầu build:

**Tech stack:**
- Next.js 14 với App Router
- TypeScript (bắt buộc, không dùng `any`)
- Tailwind CSS
- Framer Motion (animations)
- Lucide React (icons)
- Recharts (FEI score chart, XP bar)

**6 Routes cần tạo:**
- `/` — Trang chủ
- `/booking` — Booking flow 4 bước
- `/pre-tour` — Pre-tour dashboard
- `/in-tour` — In-tour live tracking
- `/gamification` — XP và badges
- `/share-card` — Thẻ thành tích và Auto-Loop

**Màu sắc chính:** Navy (#1e3a5f) + Gold (#d4af37)

**Mock user:** Nguyễn Minh Khoa · NTRP 3.5 · Silver tier · 1.240 XP · Tour Đà Nẵng 3N2D (13–15/06/2026)

---

### Quy trình build (làm theo thứ tự):

**Bước 1:** Setup project
```bash
npx create-next-app@latest tennis-travel-app --typescript --tailwind --app --src-dir=false
cd tennis-travel-app
npm install framer-motion lucide-react recharts
```

**Bước 2:** Config Tailwind với custom colors từ DESIGN.md

**Bước 3:** Tạo `lib/mock-data.ts` với toàn bộ data từ MOCK_DATA.md

**Bước 4:** Tạo primitive components trong `components/ui/`:
- Button (primary/secondary/ghost variants)
- Card
- Badge (tier, live, xp variants)
- ProgressBar
- Input
- Modal
- Toast (XP notification)

**Bước 5:** Tạo layout components:
- `components/layout/Navbar.tsx` (desktop)
- `components/layout/BottomNav.tsx` (mobile, 5 tabs)
- `components/layout/PageWrapper.tsx`

**Bước 6:** Build 6 pages theo thứ tự từ SCREENS.md (từ Home → Share Card)

**Bước 7:** Kết nối navigation flow theo USER_FLOW.md

**Bước 8:** Kiểm tra CHECKLIST trong REQUIREMENTS_RULES.md

**Bước 9:** Chạy `npm run build` — sửa hết errors

**Bước 10:** Báo xong + hướng dẫn push lên GitHub và deploy Vercel

---

### Lưu ý đặc biệt:

1. **Ảnh:** Dùng ảnh từ Unsplash với URL trực tiếp (không cần download). Ví dụ:
   - Sân tennis: `https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800`
   - Resort: `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800`
   - Ẩm thực: `https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800`
   Tìm thêm với keyword phù hợp trên unsplash.com

2. **Font:** Dùng Google Fonts "Be Vietnam Pro" qua `next/font/google`

3. **XP animation:** Khi vào màn Gamification, số XP phải đếm từ 0 lên 1.240 (duration 1.5s)

4. **Live badge:** Thẻ "LIVE 🔴" trong In-tour phải nhấp nháy (`animate-pulse`)

5. **Share Card:** Generate thẻ thành tích có thể tải về dưới dạng PNG (dùng `html2canvas` hoặc CSS print)

6. **Booking flow state:** Dùng React Context để giữ state booking khi chuyển bước

7. **NTRP Quiz:** Sau khi chọn xong 5 câu, tính average → map sang NTRP level → hiển thị kết quả với animation

8. **Voucher:** Ở Share Card screen, voucher 10% phải có countdown 30 ngày (tính từ thời điểm xem)

---

### Tiêu chí "Xong" (Definition of Done):

- [ ] `npm run build` thành công, zero errors
- [ ] `npm run dev` chạy tại localhost:3000
- [ ] Happy path Home → Share Card hoàn chỉnh, không broken link
- [ ] Responsive đúng ở 390px, 768px, 1440px
- [ ] Không có TypeScript errors
- [ ] Tất cả số liệu khớp với tài liệu gốc (xem REQUIREMENTS_RULES.md C3)

---

### Sau khi build xong — Deploy lên Vercel:

```bash
# 1. Push lên GitHub
git init
git add .
git commit -m "feat: Tennis Travel Experience prototype"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/tennis-travel-app.git
git push -u origin main

# 2. Deploy Vercel
# Truy cập vercel.com → Import từ GitHub → Deploy
# Hoặc dùng CLI:
npm install -g vercel
vercel --prod
```

---

*Spec version: 1.0 · Created: 2026-05-27 · Product: Tennis Travel Experience by Vietravel*
