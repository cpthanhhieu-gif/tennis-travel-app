export const mockUser = {
  id: "user_001",
  name: "Nguyễn Thủy Tiên",
  firstName: "Tiên",
  age: 32,
  segment: "A",
  ntrpLevel: 3.5,
  ntrpLabel: "Intermediate",
  tier: "Silver" as const,
  xp: 1240,
  xpToNextTier: 3000,
  email: "minhkhoa@gmail.com",
  phone: "0901 234 567",
  tourBooked: "tour_danang_3n2d_001",
};

export type TierType = "Bronze" | "Silver" | "Gold" | "Diamond";

export interface TourPackage {
  id: string;
  name: string;
  tagline: string;
  duration: string[];
  priceRange: { min: number; max: number };
  targetSegment: string;
  highlights: string[];
  destinations: string[];
  margin: string;
  color: string;
  image: string;
  sbu: number;
}

export const tourPackages: TourPackage[] = [
  {
    id: "sbu1",
    name: "Khám phá & Tận hưởng",
    tagline: "Hành trình tennis trọn vẹn cho người mới bắt đầu",
    duration: ["2N1D", "3N2D"],
    priceRange: { min: 4000000, max: 8000000 },
    targetSegment: "White Collar (25–40 tuổi)",
    highlights: [
      "HLV Vietravel đồng hành từ buổi đầu tiên",
      "8 bữa ăn FEI thiết kế riêng cho vận động viên",
      "Nghỉ dưỡng resort 4 sao · Phục hồi hoàn toàn",
    ],
    destinations: ["danang", "phuquoc"],
    margin: "10%",
    color: "#1e3a5f",
    image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80",
    sbu: 1,
  },
  {
    id: "sbu2",
    name: "Chinh phục & Kết nối",
    tagline: "Thi đấu có điểm số · Kết nối cộng đồng tennis toàn quốc",
    duration: ["3N2D", "4N3D"],
    priceRange: { min: 8000000, max: 18000000 },
    targetSegment: "CLB Semi-Pro (25–45 tuổi, nhóm 8–20 người)",
    highlights: [
      "Giải đấu nội bộ có điểm ELO — kỷ niệm đáng nhớ",
      "Live score trực tiếp trên app · Bảng xếp hạng realtime",
      "Ảnh chuyên nghiệp trận đấu",
      "Tích hợp MyLeague.vn",
    ],
    destinations: ["danang", "phuquoc"],
    margin: "18%",
    color: "#b45309",
    image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&q=80",
    sbu: 2,
  },
  {
    id: "sbu3",
    name: "Đẳng cấp & Trọn vẹn",
    tagline: "Trải nghiệm tennis 5 sao · Vietravel lo từ A đến Z",
    duration: ["4N3D", "5N4D"],
    priceRange: { min: 25000000, max: 60000000 },
    targetSegment: "Doanh nhân HNWIs (30–55 tuổi)",
    highlights: [
      "HLV quốc tế 1-1",
      "Private dining với Chef nổi tiếng",
      "Resort 5 sao đối tác độc quyền",
      "Spa phục hồi chuyên sâu",
      "Concierge Vietravel 24/7 · Không lo một điều gì",
    ],
    destinations: ["danang", "phuquoc"],
    margin: "25%",
    color: "#7c3aed",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    sbu: 3,
  },
];

export interface DayActivity {
  time: string;
  activity: string;
  location: string;
  xp: number;
  status: "done" | "live" | "upcoming";
  isLive?: boolean;
}

export interface TourDay {
  day: number;
  date: string;
  dateLabel: string;
  title: string;
  activities: DayActivity[];
  totalXp: number;
  avgFei: number;
}

export const danangItinerary: TourDay[] = [
  {
    day: 1,
    date: "2026-06-13",
    dateLabel: "Thứ Sáu, 13/06/2026",
    title: "Đến nơi, cảm nhận Đà Nẵng",
    activities: [
      { time: "08:00", activity: "Xe đón tại sân bay Đà Nẵng (biển tên riêng)", location: "Sân bay Đà Nẵng", xp: 0, status: "done" },
      { time: "09:00", activity: "Check-in Resort · Welcome kit (vợt, khăn, nước điện giải)", location: "Fusion Maia Resort", xp: 150, status: "done" },
      { time: "09:30", activity: "Bữa sáng FEI #1 — Bánh mì Đà Nẵng, trứng luộc, sinh tố xoài · FEI: 87/100", location: "Nhà hàng resort", xp: 50, status: "done" },
      { time: "10:30", activity: "Orientation session — HLV giới thiệu chương trình, đánh giá NTRP thực địa", location: "Sân tennis 1", xp: 0, status: "done" },
      { time: "11:30", activity: "Tập luyện buổi 1 — Warm-up, forehand/backhand cơ bản", location: "Sân tennis 1", xp: 100, status: "done" },
      { time: "13:00", activity: "Bữa trưa FEI #2 — Mỳ Quảng chay phục hồi, gỏi bưởi tôm thịt · FEI: 89/100", location: "Nhà hàng bản địa", xp: 50, status: "done" },
      { time: "15:30", activity: "Buổi tập 2 — Serve & return drills, match play thử", location: "Sân tennis 2", xp: 100, status: "done" },
      { time: "17:30", activity: "Spa phục hồi buổi 1 — Massage cơ bắp 60 phút", location: "Spa Fusion", xp: 0, status: "done" },
      { time: "19:00", activity: "Private Dining FEI #3 — Cá biển nướng muối ớt, rau địa phương · FEI: 91/100", location: "Bãi biển riêng resort", xp: 50, status: "done" },
      { time: "20:30", activity: "Check-in app + XP tổng kết ngày 1 — Nhận badge \"First Serve 🎾\"", location: "App", xp: 50, status: "done" },
    ],
    totalXp: 550,
    avgFei: 89,
  },
  {
    day: 2,
    date: "2026-06-14",
    dateLabel: "Thứ Bảy, 14/06/2026",
    title: "Ngày chinh phục sân đấu",
    activities: [
      { time: "06:30", activity: "Bữa sáng FEI #4 — Phở bò local, trứng protein, trà gừng · FEI: 88/100", location: "Nhà hàng resort", xp: 50, status: "done" },
      { time: "07:30", activity: "Warm-up buổi sáng — Dynamic stretching cùng HLV", location: "Sân tennis 1", xp: 0, status: "done" },
      { time: "08:00", activity: "GIẢI ĐẤU NỘI BỘ — Vòng tròn đơn nam/nữ · Live score trên app", location: "Sân tennis 1 & 2", xp: 200, status: "live", isLive: true },
      { time: "11:00", activity: "Lễ trao giải nội bộ — Ảnh chuyên nghiệp", location: "Sân tennis", xp: 0, status: "upcoming" },
      { time: "11:30", activity: "Bữa trưa FEI #5 — Cơm niêu bản địa, canh chua cá tươi · FEI: 90/100", location: "Nhà hàng bản địa", xp: 50, status: "upcoming" },
      { time: "13:00", activity: "Workshop ẩm thực — Cùng Chef Thanh học nấu 1 món FEI", location: "Bếp mở resort", xp: 100, status: "upcoming" },
      { time: "17:00", activity: "Spa phục hồi buổi 2 — Hydrotherapy, foot massage", location: "Spa Fusion", xp: 0, status: "upcoming" },
      { time: "19:30", activity: "Bữa tối FEI #6 (Gala) — Set menu 5 món · FEI: 93/100", location: "Nhà hàng chính", xp: 50, status: "upcoming" },
      { time: "21:00", activity: "Tổng kết ngày 2 — XP board, badge \"Court Warrior 🏆\"", location: "App", xp: 100, status: "upcoming" },
    ],
    totalXp: 550,
    avgFei: 90.3,
  },
  {
    day: 3,
    date: "2026-06-15",
    dateLabel: "Chủ Nhật, 15/06/2026",
    title: "Kết nối & Lên đường",
    activities: [
      { time: "07:00", activity: "Bữa sáng FEI #7 — Bánh cuốn nhân tôm, sữa đậu nành · FEI: 86/100", location: "Nhà hàng resort", xp: 50, status: "upcoming" },
      { time: "08:00", activity: "Buổi tập nhẹ cuối — Cool-down, kỹ thuật serve nâng cao", location: "Sân tennis", xp: 100, status: "upcoming" },
      { time: "09:30", activity: "Phiên feedback 1-1 với HLV — Video phân tích kỹ thuật", location: "Phòng họp nhỏ", xp: 0, status: "upcoming" },
      { time: "10:30", activity: "Nhận Share Card — App tự generate thẻ thành tích", location: "App", xp: 100, status: "upcoming" },
      { time: "12:00", activity: "Bữa trưa chia tay FEI #8 — Bún bò Huế truyền thống · FEI: 88/100", location: "Nhà hàng resort", xp: 50, status: "upcoming" },
      { time: "13:30", activity: "Xe đưa ra sân bay", location: "Sân bay Đà Nẵng", xp: 0, status: "upcoming" },
    ],
    totalXp: 800,
    avgFei: 87,
  },
];

export const feiScoreData = {
  subIndices: [
    { code: "NPI", name: "Nutrition Performance", score: 88, description: "Protein/carb-timing/electrolyte chuẩn ACSM" },
    { code: "LAI", name: "Local Authenticity", score: 92, description: "100% nguyên liệu trong bán kính 50km" },
    { code: "EII", name: "Experience Immersion", score: 87, description: "Khách trực tiếp tham gia nấu ăn, gặp Chef" },
    { code: "RWI", name: "Recovery & Wellness", score: 90, description: "Thực phẩm kháng viêm, sleep-support drinks" },
    { code: "LPI", name: "Luxury Personalization", score: 88, description: "Private dining, menu cá nhân hoá" },
  ],
  totalFEI: 89,
  targetFEI: 85,
  status: "PASSED" as const,
};

export const ntrpQuiz = [
  {
    id: 1,
    question: "Bạn chơi tennis được bao lâu rồi?",
    options: [
      { label: "Chưa bao giờ chơi / mới bắt đầu", value: 1.0 },
      { label: "1–2 năm, chơi cuối tuần", value: 2.5 },
      { label: "3–5 năm, chơi đều đặn", value: 3.5 },
      { label: "5+ năm, thi đấu club", value: 4.5 },
    ],
  },
  {
    id: 2,
    question: "Cú serve của bạn như thế nào?",
    options: [
      { label: "Vẫn đang học cách serve đúng", value: 1.5 },
      { label: "Serve được nhưng chưa ổn định", value: 2.5 },
      { label: "Serve ổn định, có flat và slice", value: 3.5 },
      { label: "Serve mạnh, biến tấu được", value: 4.5 },
    ],
  },
  {
    id: 3,
    question: "Bạn có thể duy trì rally bao nhiêu cú?",
    options: [
      { label: "3–5 cú là lưới hoặc ra ngoài", value: 1.5 },
      { label: "6–10 cú ổn định", value: 2.5 },
      { label: "10–20 cú, có thể tấn công", value: 3.5 },
      { label: "20+ cú, điều hướng được", value: 4.5 },
    ],
  },
  {
    id: 4,
    question: "Bạn có thi đấu giải không?",
    options: [
      { label: "Chưa bao giờ", value: 1.0 },
      { label: "Chơi nội bộ club", value: 2.5 },
      { label: "Có thi giải địa phương", value: 3.5 },
      { label: "Thi giải thường xuyên, có ranking", value: 4.5 },
    ],
  },
  {
    id: 5,
    question: "Mục tiêu của bạn trong tour này là gì?",
    options: [
      { label: "Học kỹ thuật từ đầu", value: 1.5 },
      { label: "Cải thiện kỹ năng + thư giãn", value: 2.5 },
      { label: "Thi đấu nội bộ + networking", value: 3.5 },
      { label: "Nâng cao performance nghiêm túc", value: 4.5 },
    ],
  },
];

export const ntrpLevels: Record<string, { label: string; description: string; recommendedSBU: string }> = {
  "1.0-1.5": { label: "Beginner", description: "Mới bắt đầu — HLV sẽ đồng hành từng bước", recommendedSBU: "sbu1" },
  "2.0-2.5": { label: "Novice", description: "Đang phát triển — phù hợp tour cơ bản đến trung cấp", recommendedSBU: "sbu1" },
  "3.0-3.5": { label: "Intermediate", description: "Sẵn sàng thi đấu — phù hợp giải nội bộ", recommendedSBU: "sbu2" },
  "4.0-4.5": { label: "Advanced", description: "Kỹ thuật vững — phù hợp Đẳng cấp & Trọn vẹn", recommendedSBU: "sbu3" },
  "5.0+": { label: "Expert", description: "Đỉnh cao — trải nghiệm HLV quốc tế 1-1", recommendedSBU: "sbu3" },
};

export function getNtrpLevel(avg: number): { level: number; label: string; description: string; recommendedSBU: string } {
  if (avg <= 1.5) return { level: 1.5, label: "Beginner", description: "Mới bắt đầu — HLV sẽ đồng hành từng bước", recommendedSBU: "sbu1" };
  if (avg <= 2.5) return { level: 2.5, label: "Novice", description: "Đang phát triển — phù hợp tour cơ bản đến trung cấp", recommendedSBU: "sbu1" };
  if (avg <= 3.5) return { level: 3.5, label: "Intermediate", description: "Sẵn sàng thi đấu — phù hợp giải nội bộ", recommendedSBU: "sbu2" };
  if (avg <= 4.5) return { level: 4.5, label: "Advanced", description: "Kỹ thuật vững — phù hợp Đẳng cấp & Trọn vẹn", recommendedSBU: "sbu3" };
  return { level: 5.0, label: "Expert", description: "Đỉnh cao — trải nghiệm HLV quốc tế 1-1", recommendedSBU: "sbu3" };
}

export interface Tier {
  name: TierType;
  xpMin: number;
  xpMax: number;
  perks: string[];
  color: string;
  current?: boolean;
}

export const tiers: Tier[] = [
  { name: "Bronze", xpMin: 0, xpMax: 999, perks: ["Welcome kit Vietravel", "Ưu đãi 5% tour tiếp theo", "Nhận bản tin hành trình ưu tiên"], color: "#b45309" },
  { name: "Silver", xpMin: 1000, xpMax: 2999, perks: ["Nâng hạng phòng (tuỳ availability)", "1 bữa Private Chef riêng", "Voucher 10% đặt lại hành trình"], color: "#6b7280", current: true },
  { name: "Gold", xpMin: 3000, xpMax: 6999, perks: ["Truy cập Premium Vault", "1 buổi HLV Quốc tế 1-1", "Ưu tiên đặt chỗ mọi tour"], color: "#d97706" },
  { name: "Diamond", xpMin: 7000, xpMax: 999999, perks: ["Mở khoá tour quốc tế độc quyền", "Concierge Vietravel 24/7", "Thiết kế hành trình riêng theo yêu cầu", "Sự kiện invite-only"], color: "#7c3aed" },
];

export const xpActions = [
  { action: "Hoàn thành hành trình Đà Nẵng", xp: 500, icon: "Flag", earned: true },
  { action: "Trải nghiệm ẩm thực FEI đạt chuẩn", xp: 300, icon: "UtensilsCrossed", earned: true },
  { action: "Bắt đầu hành trình tại Đà Nẵng", xp: 150, icon: "MapPin", earned: true },
  { action: "Chinh phục giải đấu nội bộ", xp: 200, icon: "Trophy", earned: true },
  { action: "Khám phá bếp ăn bản địa cùng Chef", xp: 100, icon: "ChefHat", earned: true },
  { action: "Rủ bạn bè cùng nâng tầm hành trình", xp: 800, icon: "Users", earned: false },
];

export const badges = [
  { id: "first_serve",      name: "First Serve",           icon: "Zap",             description: "Khởi đầu hành trình tennis cùng Vietravel",    earnedAt: "13/06/2026" },
  { id: "fei_master",       name: "FEI Master",            icon: "UtensilsCrossed", description: "Tận hưởng trọn vẹn ẩm thực FEI đạt chuẩn",    earnedAt: "14/06/2026" },
  { id: "court_warrior",    name: "Court Warrior",         icon: "Trophy",          description: "Chinh phục sân đấu · Ghi dấu kỷ niệm",          earnedAt: "14/06/2026" },
  { id: "local_explorer",   name: "Local Tennis Explorer", icon: "MapPin",          description: "Trải nghiệm sân tennis bản địa LEI > 70 lần đầu", earnedAt: "04/06/2026" },
  { id: "green_player",     name: "Green Player",          icon: "Leaf",            description: "Chọn tour ESG > 80 — du lịch có trách nhiệm",    earnedAt: "04/06/2026" },
];

export const pricingBreakdown = {
  tourId: "sbu1_danang_3n2d",
  basePrice: 5800000,
  breakdown: {
    accommodation: { percent: 32, amount: 1856000, label: "Lưu trú resort 4–5 sao" },
    tennisCourt: { percent: 18, amount: 1044000, label: "Sân tennis + HLV" },
    feiFoodExperience: { percent: 15, amount: 870000, label: "Ẩm thực FEI 8 bữa" },
    operationsMarketing: { percent: 25, amount: 1450000, label: "Vận hành + Marketing" },
    grossProfit: { percent: 10, amount: 580000, label: "Lãi gộp" },
  },
  groupDiscount: {
    "5-9 người": "5%",
    "10-19 người": "10%",
    "20+ người": "15%",
  },
};

export interface DepartureSchedule {
  date: string;          // ISO: "2026-06-13"
  dateLabel: string;     // "13/06/2026"
  dayOfWeek: string;     // "Thứ Sáu"
  price: number;
  code: string;          // mã chuyến Vietravel
}

export interface Destination {
  id: string;
  name: string;
  tourName: string;      // tên tour đầy đủ theo Vietravel
  tourCode: string;      // mã tour gốc
  resort: string;
  duration: string;
  image: string;
  highlights: string[];
  departureSchedules: DepartureSchedule[];
}

export const destinations: Destination[] = [
  {
    id: "danang",
    name: "Đà Nẵng",
    tourName: "Đà Nẵng – Hội An – Bà Nà Hills",
    tourCode: "FESGN567",
    resort: "Fusion Maia Resort Đà Nẵng",
    duration: "3N2D",
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80",
    highlights: ["Bãi biển Mỹ Khê", "Phố cổ Hội An", "Sân tennis ITF chuẩn"],
    departureSchedules: [
      { date: "2026-06-13", dateLabel: "13/06/2026", dayOfWeek: "Thứ Sáu",   price: 5800000, code: "FESGN567-010-130626XE-H" },
      { date: "2026-06-20", dateLabel: "20/06/2026", dayOfWeek: "Thứ Sáu",   price: 5800000, code: "FESGN567-012-200626XE-H" },
      { date: "2026-07-04", dateLabel: "04/07/2026", dayOfWeek: "Thứ Bảy",   price: 6200000, code: "FESGN567-013-040726XE-H" },
      { date: "2026-07-11", dateLabel: "11/07/2026", dayOfWeek: "Thứ Bảy",   price: 6200000, code: "FESGN567-014-110726XE-H" },
      { date: "2026-07-18", dateLabel: "18/07/2026", dayOfWeek: "Thứ Sáu",   price: 5800000, code: "FESGN567-015-180726XE-H" },
    ],
  },
  {
    id: "phuquoc",
    name: "Phú Quốc",
    tourName: "Phú Quốc – Vinpearl Safari – Đảo Thiên Đường",
    tourCode: "FESGN891",
    resort: "InterContinental Phú Quốc Long Beach Resort",
    duration: "4N3D",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    highlights: ["Biển đảo nguyên sơ", "Hải sản tươi sống", "3 sân tennis ITF"],
    departureSchedules: [
      { date: "2026-06-19", dateLabel: "19/06/2026", dayOfWeek: "Thứ Sáu",   price: 9800000, code: "FESGN891-008-190626XE-H" },
      { date: "2026-06-26", dateLabel: "26/06/2026", dayOfWeek: "Thứ Sáu",   price: 9800000, code: "FESGN891-009-260626XE-H" },
      { date: "2026-07-10", dateLabel: "10/07/2026", dayOfWeek: "Thứ Sáu",   price: 10500000, code: "FESGN891-011-100726XE-H" },
      { date: "2026-07-17", dateLabel: "17/07/2026", dayOfWeek: "Thứ Sáu",   price: 10500000, code: "FESGN891-012-170726XE-H" },
    ],
  },
];

export type TourBadge = "Phổ biến" | "Còn ít chỗ" | "Mới" | "Hot";

export interface Tour {
  id: string;
  name: string;            // "Đà Nẵng – Hội An – Leisure & Learning"
  destinationId: string;   // "danang"
  destinationName: string; // "Đà Nẵng"
  packageId: string;       // "sbu1"
  tourCode: string;        // mã gốc Vietravel
  resort: string;
  duration: string;        // "3N2D"
  image: string;
  highlights: string[];
  ntrpRange: string;       // "1.5 – 3.5"
  ntrpLabel: string;       // "Người mới – Trung cấp"
  badge?: TourBadge;
  departureSchedules: DepartureSchedule[];
}

export const tours: Tour[] = [
  // ── ĐÀ NẴNG ──────────────────────────────────────────────────────────────
  {
    id: "dn-sbu1",
    name: "Đà Nẵng – Hội An – Bà Nà Hills",
    destinationId: "danang",
    destinationName: "Đà Nẵng",
    packageId: "sbu1",
    tourCode: "FESGN567",
    resort: "Fusion Maia Resort Đà Nẵng",
    duration: "3N2D",
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80",
    highlights: ["Huấn luyện với HLV", "Sân tennis ITF chuẩn", "Ẩm thực FEI bản địa", "Resort 4★"],
    ntrpRange: "1.5 – 3.5",
    ntrpLabel: "Người mới – Trung cấp",
    badge: "Phổ biến",
    departureSchedules: [
      { date: "2026-06-13", dateLabel: "13/06/2026", dayOfWeek: "Thứ Sáu",  price: 5800000,  code: "FESGN567-010-130626XE-H" },
      { date: "2026-06-20", dateLabel: "20/06/2026", dayOfWeek: "Thứ Sáu",  price: 5800000,  code: "FESGN567-012-200626XE-H" },
      { date: "2026-07-04", dateLabel: "04/07/2026", dayOfWeek: "Thứ Bảy",  price: 6200000,  code: "FESGN567-013-040726XE-H" },
      { date: "2026-07-11", dateLabel: "11/07/2026", dayOfWeek: "Thứ Bảy",  price: 6200000,  code: "FESGN567-014-110726XE-H" },
      { date: "2026-07-18", dateLabel: "18/07/2026", dayOfWeek: "Thứ Sáu",  price: 5800000,  code: "FESGN567-015-180726XE-H" },
    ],
  },
  {
    id: "dn-sbu2",
    name: "Đà Nẵng – Tournament Travel",
    destinationId: "danang",
    destinationName: "Đà Nẵng",
    packageId: "sbu2",
    tourCode: "FESGN568",
    resort: "InterContinental Danang Sun Peninsula",
    duration: "4N3D",
    image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&q=80",
    highlights: ["Giải đấu nội bộ ELO", "Live score realtime", "Ảnh chuyên nghiệp", "Resort 5★"],
    ntrpRange: "3.0 – 4.5",
    ntrpLabel: "CLB – Nâng cao",
    badge: "Hot",
    departureSchedules: [
      { date: "2026-06-14", dateLabel: "14/06/2026", dayOfWeek: "Thứ Bảy",  price: 9500000,  code: "FESGN568-005-140626XE-H" },
      { date: "2026-06-28", dateLabel: "28/06/2026", dayOfWeek: "Chủ Nhật", price: 9500000,  code: "FESGN568-007-280626XE-H" },
      { date: "2026-07-12", dateLabel: "12/07/2026", dayOfWeek: "Chủ Nhật", price: 10200000, code: "FESGN568-009-120726XE-H" },
      { date: "2026-07-26", dateLabel: "26/07/2026", dayOfWeek: "Chủ Nhật", price: 10200000, code: "FESGN568-011-260726XE-H" },
    ],
  },
  {
    id: "dn-sbu3",
    name: "Đà Nẵng – Sportcation Premium",
    destinationId: "danang",
    destinationName: "Đà Nẵng",
    packageId: "sbu3",
    tourCode: "FESGN569",
    resort: "Fusion Maia Resort Đà Nẵng – Private Wing",
    duration: "5N4D",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    highlights: ["HLV quốc tế 1-1", "Private dining Chef", "Spa phục hồi chuyên sâu", "Concierge 24/7"],
    ntrpRange: "4.0 – 5.0+",
    ntrpLabel: "Nâng cao – Chuyên nghiệp",
    badge: "Còn ít chỗ",
    departureSchedules: [
      { date: "2026-06-22", dateLabel: "22/06/2026", dayOfWeek: "Thứ Hai",  price: 28000000, code: "FESGN569-002-220626XE-H" },
      { date: "2026-07-06", dateLabel: "06/07/2026", dayOfWeek: "Thứ Hai",  price: 28000000, code: "FESGN569-003-060726XE-H" },
      { date: "2026-07-20", dateLabel: "20/07/2026", dayOfWeek: "Thứ Hai",  price: 30000000, code: "FESGN569-004-200726XE-H" },
    ],
  },

  // ── PHÚ QUỐC ─────────────────────────────────────────────────────────────
  {
    id: "pq-sbu1",
    name: "Phú Quốc – Vinpearl Safari – Đảo Thiên Đường",
    destinationId: "phuquoc",
    destinationName: "Phú Quốc",
    packageId: "sbu1",
    tourCode: "FESGN891",
    resort: "InterContinental Phú Quốc Long Beach Resort",
    duration: "4N3D",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    highlights: ["Biển đảo nguyên sơ", "Hải sản tươi sống", "3 sân tennis ITF", "Resort 5★"],
    ntrpRange: "1.5 – 3.5",
    ntrpLabel: "Người mới – Trung cấp",
    badge: "Phổ biến",
    departureSchedules: [
      { date: "2026-06-19", dateLabel: "19/06/2026", dayOfWeek: "Thứ Sáu",  price: 9800000,  code: "FESGN891-008-190626XE-H" },
      { date: "2026-06-26", dateLabel: "26/06/2026", dayOfWeek: "Thứ Sáu",  price: 9800000,  code: "FESGN891-009-260626XE-H" },
      { date: "2026-07-10", dateLabel: "10/07/2026", dayOfWeek: "Thứ Sáu",  price: 10500000, code: "FESGN891-011-100726XE-H" },
      { date: "2026-07-17", dateLabel: "17/07/2026", dayOfWeek: "Thứ Sáu",  price: 10500000, code: "FESGN891-012-170726XE-H" },
    ],
  },
  {
    id: "pq-sbu2",
    name: "Phú Quốc – Tournament Travel",
    destinationId: "phuquoc",
    destinationName: "Phú Quốc",
    packageId: "sbu2",
    tourCode: "FESGN892",
    resort: "InterContinental Phú Quốc Long Beach Resort",
    duration: "4N3D",
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80",
    highlights: ["Giải đấu đảo nhiệt đới", "Live score + ELO", "Snorkeling sau giải", "Resort 5★"],
    ntrpRange: "3.0 – 4.5",
    ntrpLabel: "CLB – Nâng cao",
    departureSchedules: [
      { date: "2026-06-21", dateLabel: "21/06/2026", dayOfWeek: "Chủ Nhật", price: 12000000, code: "FESGN892-004-210626XE-H" },
      { date: "2026-07-05", dateLabel: "05/07/2026", dayOfWeek: "Chủ Nhật", price: 12000000, code: "FESGN892-006-050726XE-H" },
      { date: "2026-07-19", dateLabel: "19/07/2026", dayOfWeek: "Chủ Nhật", price: 13000000, code: "FESGN892-008-190726XE-H" },
    ],
  },

  // ── NHA TRANG ─────────────────────────────────────────────────────────────
  {
    id: "nt-sbu1",
    name: "Nha Trang – Vịnh Biển Xanh",
    destinationId: "nhatrang",
    destinationName: "Nha Trang",
    packageId: "sbu1",
    tourCode: "FENHA431",
    resort: "Vinpearl Resort & Spa Nha Trang Bay",
    duration: "3N2D",
    image: "https://images.unsplash.com/photo-1570366583862-f91883984fde?w=800&q=80",
    highlights: ["Sân tennis mặt biển", "Lặn san hô", "Ẩm thực FEI bản địa", "Resort 4★"],
    ntrpRange: "1.5 – 3.5",
    ntrpLabel: "Người mới – Trung cấp",
    badge: "Mới",
    departureSchedules: [
      { date: "2026-06-15", dateLabel: "15/06/2026", dayOfWeek: "Thứ Hai",  price: 5200000, code: "FENHA431-001-150626XE-H" },
      { date: "2026-06-29", dateLabel: "29/06/2026", dayOfWeek: "Thứ Hai",  price: 5200000, code: "FENHA431-002-290626XE-H" },
      { date: "2026-07-13", dateLabel: "13/07/2026", dayOfWeek: "Thứ Hai",  price: 5600000, code: "FENHA431-003-130726XE-H" },
      { date: "2026-07-27", dateLabel: "27/07/2026", dayOfWeek: "Thứ Hai",  price: 5600000, code: "FENHA431-004-270726XE-H" },
    ],
  },
  {
    id: "nt-sbu2",
    name: "Nha Trang – Tournament Travel",
    destinationId: "nhatrang",
    destinationName: "Nha Trang",
    packageId: "sbu2",
    tourCode: "FENHA432",
    resort: "Vinpearl Resort & Spa Nha Trang Bay",
    duration: "4N3D",
    image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&q=80",
    highlights: ["Giải đấu view biển", "Live score ELO", "Island tour sau trận", "Resort 4★"],
    ntrpRange: "3.0 – 4.5",
    ntrpLabel: "CLB – Nâng cao",
    badge: "Mới",
    departureSchedules: [
      { date: "2026-06-18", dateLabel: "18/06/2026", dayOfWeek: "Thứ Năm",  price: 8800000, code: "FENHA432-001-180626XE-H" },
      { date: "2026-07-02", dateLabel: "02/07/2026", dayOfWeek: "Thứ Năm",  price: 8800000, code: "FENHA432-002-020726XE-H" },
      { date: "2026-07-16", dateLabel: "16/07/2026", dayOfWeek: "Thứ Năm",  price: 9400000, code: "FENHA432-003-160726XE-H" },
    ],
  },

  // ── PHAN THIẾT ────────────────────────────────────────────────────────────
  {
    id: "ptg-sbu1",
    name: "Phan Thiết – Mũi Né Sóng Gió",
    destinationId: "phanthiet",
    destinationName: "Phan Thiết",
    packageId: "sbu1",
    tourCode: "FEPTG211",
    resort: "The Sailing Bay Beach Resort Mũi Né",
    duration: "2N1D",
    image: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800&q=80",
    highlights: ["Sân tennis ven biển", "Kitesurfing trải nghiệm", "Hải sản nướng tươi", "Resort 4★"],
    ntrpRange: "1.5 – 3.0",
    ntrpLabel: "Người mới – Cơ bản",
    badge: "Mới",
    departureSchedules: [
      { date: "2026-06-14", dateLabel: "14/06/2026", dayOfWeek: "Thứ Bảy",  price: 4800000, code: "FEPTG211-001-140626XE-H" },
      { date: "2026-06-21", dateLabel: "21/06/2026", dayOfWeek: "Thứ Bảy",  price: 4800000, code: "FEPTG211-002-210626XE-H" },
      { date: "2026-07-05", dateLabel: "05/07/2026", dayOfWeek: "Thứ Bảy",  price: 5100000, code: "FEPTG211-003-050726XE-H" },
      { date: "2026-07-12", dateLabel: "12/07/2026", dayOfWeek: "Thứ Bảy",  price: 5100000, code: "FEPTG211-004-120726XE-H" },
    ],
  },
];

// ── LEI / ESG Tour Data ───────────────────────────────────────────────────

export type ESGTier = "Green Champion" | "Eco Friendly" | "Standard";

export interface LEIBreakdown {
  localCourt: number;
  localPro: number;
  localCulture: number;
  localTransport: number;
}

export interface ESGBreakdown {
  environmental: number;
  social: number;
  governance: number;
}

export interface ESGImpact {
  co2Saved: number;
  localFamiliesSupported: number;
  localProSessions: number;
  localRevenuePercent: number;
}

export interface LEIESGTour {
  id: string;
  name: string;
  location: string;
  image: string;
  bookingDestinationId: string;
  bookingTourId: string;
  lei: {
    total: number;
    badge: string;
    breakdown: LEIBreakdown;
  };
  esg: {
    total: number;
    tier: ESGTier;
    breakdown: ESGBreakdown;
    impact: ESGImpact;
  };
  localPro: {
    name: string;
    experience: number;
    verified: boolean;
    quote: string;
  };
}

export const leiEsgTours: LEIESGTour[] = [
  {
    id: "dalat-local-tennis-4d",
    name: "Đà Lạt Local Tennis Experience",
    location: "Đà Lạt",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    bookingDestinationId: "danang",
    bookingTourId: "dn-sbu1",
    lei: {
      total: 92,
      badge: "True Local",
      breakdown: { localCourt: 95, localPro: 98, localCulture: 88, localTransport: 85 },
    },
    esg: {
      total: 82,
      tier: "Green Champion",
      breakdown: { environmental: 85, social: 88, governance: 72 },
      impact: { co2Saved: 12.4, localFamiliesSupported: 2, localProSessions: 4, localRevenuePercent: 70 },
    },
    localPro: { name: "Thầy Hùng", experience: 15, verified: true, quote: "Biết từng góc sân, từng gió buổi sáng trên cao nguyên" },
  },
  {
    id: "hoian-heritage-tennis-3d",
    name: "Hội An Heritage Tennis",
    location: "Hội An",
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80",
    bookingDestinationId: "danang",
    bookingTourId: "dn-sbu1",
    lei: {
      total: 85,
      badge: "Local Explorer",
      breakdown: { localCourt: 82, localPro: 90, localCulture: 88, localTransport: 78 },
    },
    esg: {
      total: 76,
      tier: "Eco Friendly",
      breakdown: { environmental: 78, social: 80, governance: 68 },
      impact: { co2Saved: 9.2, localFamiliesSupported: 2, localProSessions: 3, localRevenuePercent: 60 },
    },
    localPro: { name: "Thầy Bình", experience: 10, verified: true, quote: "Phố cổ Hội An là sân nhà — tôi biết từng đường bóng, từng cơn gió chiều" },
  },
  {
    id: "nhatrang-beach-tennis-3d",
    name: "Nha Trang Beach Tennis",
    location: "Nha Trang",
    image: "https://images.unsplash.com/photo-1570366583862-f91883984fde?w=800&q=80",
    bookingDestinationId: "nhatrang",
    bookingTourId: "nt-sbu1",
    lei: {
      total: 74,
      badge: "Local Starter",
      breakdown: { localCourt: 70, localPro: 78, localCulture: 72, localTransport: 76 },
    },
    esg: {
      total: 69,
      tier: "Eco Friendly",
      breakdown: { environmental: 65, social: 74, governance: 68 },
      impact: { co2Saved: 7.1, localFamiliesSupported: 1, localProSessions: 3, localRevenuePercent: 55 },
    },
    localPro: { name: "Thầy Nam", experience: 8, verified: true, quote: "Sân biển Nha Trang — không đâu có ánh nắng và gió biển như ở đây" },
  },
  {
    id: "sapa-mountain-tennis-4d",
    name: "Sapa Mountain Tennis Retreat",
    location: "Sapa",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    bookingDestinationId: "hanoi",
    bookingTourId: "dn-sbu1",
    lei: {
      total: 88,
      badge: "True Local",
      breakdown: { localCourt: 90, localPro: 92, localCulture: 85, localTransport: 82 },
    },
    esg: {
      total: 86,
      tier: "Green Champion",
      breakdown: { environmental: 90, social: 85, governance: 80 },
      impact: { co2Saved: 15.2, localFamiliesSupported: 3, localProSessions: 5, localRevenuePercent: 78 },
    },
    localPro: { name: "Thầy Tuấn", experience: 12, verified: true, quote: "Sân cao nguyên Sapa — mỗi buổi sáng tập trong mây là trải nghiệm không nơi nào có" },
  },
  {
    id: "muine-wind-tennis-2d",
    name: "Mũi Né Wind Tennis Weekend",
    location: "Mũi Né",
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
    bookingDestinationId: "nhatrang",
    bookingTourId: "nt-sbu1",
    lei: {
      total: 62,
      badge: "Local Starter",
      breakdown: { localCourt: 60, localPro: 65, localCulture: 60, localTransport: 62 },
    },
    esg: {
      total: 55,
      tier: "Standard",
      breakdown: { environmental: 52, social: 60, governance: 54 },
      impact: { co2Saved: 4.8, localFamiliesSupported: 1, localProSessions: 2, localRevenuePercent: 42 },
    },
    localPro: { name: "Thầy Khoa", experience: 5, verified: true, quote: "Gió Mũi Né là bài test thật sự cho kỹ thuật của bạn" },
  },
  {
    id: "hanoi-oldquarter-tennis-3d",
    name: "Hà Nội Old Quarter Tennis",
    location: "Hà Nội",
    image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80",
    bookingDestinationId: "hanoi",
    bookingTourId: "dn-sbu1",
    lei: {
      total: 79,
      badge: "Local Explorer",
      breakdown: { localCourt: 76, localPro: 82, localCulture: 80, localTransport: 75 },
    },
    esg: {
      total: 72,
      tier: "Eco Friendly",
      breakdown: { environmental: 70, social: 76, governance: 70 },
      impact: { co2Saved: 8.3, localFamiliesSupported: 2, localProSessions: 3, localRevenuePercent: 58 },
    },
    localPro: { name: "Thầy Long", experience: 11, verified: true, quote: "Phố cổ Hà Nội — tôi biết từng sân bóng ẩn mình sau những con ngõ nhỏ" },
  },
];

export const qualityIndices = {
  lei: { value: 84, max: 100, label: "LEI", fullName: "Living Experience Index", threshold: 75 },
  esg: { value: 89, max: 100, label: "ESG", fullName: "ESG Score", threshold: 80 },
  fei: { value: 89, max: 100, label: "FEI", fullName: "Food Experience Index", threshold: 85 },
};

export const esgBreakdown = {
  total: 89,
  e: { score: 29, max: 35, label: "E — Môi trường", items: ["Bù carbon mỗi tour", "Sân tennis đèn LED", "Không nhựa 1 lần"] },
  s: { score: 32, max: 35, label: "S — Xã hội", items: ["100% HLV/Chef địa phương", "ATTP chuẩn FEI", "Bảo hiểm tour đầy đủ"] },
  g: { score: 28, max: 30, label: "G — Quản trị", items: ["Hợp đồng minh bạch", "Công bố điểm LEI/ESG/FEI", "Tuân thủ chuẩn Vietravel"] },
};

export const marketStats = {
  vnPlayers: "1,5 triệu",
  globalPlayers: "106 triệu",
  vnCourts: "264 sân",
  femalePercent: "40%",
  growthRate: "+30%/5 năm",
  roi: "186%",
  breakEvenMonth: "Tháng 5 sau ra mắt",
};

export const questMapNodes = [
  { id: "danang", name: "Đà Nẵng", status: "completed" as const, xpEarned: 500,
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400&q=80",
    position: { x: 35, y: 55 } },
  { id: "phuquoc", name: "Phú Quốc", status: "locked" as const, xpRequired: 1000,
    position: { x: 20, y: 70 } },
  { id: "nhatrang", name: "Nha Trang", status: "locked" as const, xpRequired: 2000,
    position: { x: 55, y: 45 } },
  { id: "hanoi", name: "Hà Nội", status: "locked" as const, xpRequired: 3000,
    position: { x: 45, y: 18 } },
];

export const dailyTasks = [
  { id: "checkin", name: "Check-in app", icon: "MapPin", xpReward: 50, completed: true },
  { id: "book", name: "Đặt tour mới", icon: "Calendar", xpReward: 100, completed: false, timeLeft: "22h" },
  { id: "review", name: "Review ẩm thực", icon: "Star", xpReward: 75, completed: false, timeLeft: "1h" },
];

export const dailyStreak = { current: 2, target: 5, reward: "200 XP Bonus" };

export const avatarLevel = { level: 3, currentXp: 1240, nextLevelXp: 2000 };

export type PromoCat = "tour" | "resort" | "fei" | "member";

export interface PromoCoupon {
  id: string;
  category: PromoCat;
  badge?: "Sắp hết mã" | "Mới" | "Độc quyền";
  title: string;
  condition: string;
  code: string;
  expiry?: string;
  discountType: "percent" | "fixed" | "none";
  discountValue: number;
}

export const promoCoupons: PromoCoupon[] = [
  // Tour
  { id: "p1", category: "tour", badge: "Sắp hết mã", title: "Giảm 10% tour Khám phá & Tận hưởng", condition: "Đặt từ 2 khách · Tour SBU1 tháng 6–7/2026", code: "TOUR10", expiry: "31/07/2026", discountType: "percent", discountValue: 10 },
  { id: "p2", category: "tour", badge: "Mới", title: "Giảm 500k tour Chinh phục & Kết nối", condition: "Đặt trước 30/06/2026 · Tour SBU2", code: "CLUB500", expiry: "30/06/2026", discountType: "fixed", discountValue: 500000 },
  { id: "p3", category: "tour", badge: "Sắp hết mã", title: "Giảm 18% tour nhóm từ 10 người", condition: "Áp dụng mọi SBU · Tối thiểu 10 khách", code: "GROUP18", expiry: "15/07/2026", discountType: "percent", discountValue: 18 },
  { id: "p4", category: "tour", title: "Miễn phí upgrade SBU1 → SBU2", condition: "Đặt tour Đà Nẵng hoặc Phú Quốc", code: "UPGRADESBU", expiry: "31/08/2026", discountType: "none", discountValue: 0 },
  // Resort
  { id: "p5", category: "resort", badge: "Độc quyền", title: "Nâng hạng phòng miễn phí tại Fusion Maia", condition: "Đặt tour SBU1 Đà Nẵng · Tuỳ availability", code: "FUSIONUP", expiry: "31/07/2026", discountType: "none", discountValue: 0 },
  { id: "p6", category: "resort", badge: "Sắp hết mã", title: "Giảm 5% lưu trú InterContinental Phú Quốc", condition: "Booking trực tiếp qua app Vietravel", code: "RESORT5", expiry: "20/07/2026", discountType: "percent", discountValue: 5 },
  { id: "p7", category: "resort", title: "Late check-out 14:00 miễn phí", condition: "Áp dụng tất cả resort đối tác", code: "LATECO", expiry: "31/12/2026", discountType: "none", discountValue: 0 },
  // FEI
  { id: "p8", category: "fei", badge: "Độc quyền", title: "1 bữa Private Chef miễn phí (+FEI 93/100)", condition: "Đặt tour SBU2 hoặc SBU3", code: "CHEFVIP", expiry: "31/08/2026", discountType: "none", discountValue: 0 },
  { id: "p9", category: "fei", badge: "Mới", title: "Giảm 200k Workshop ẩm thực FEI", condition: "Đăng ký thêm trong hành trình", code: "FEI200", expiry: "31/07/2026", discountType: "fixed", discountValue: 200000 },
  { id: "p10", category: "fei", title: "Tặng bộ Electrolyte Kit phục hồi", condition: "Đặt bất kỳ tour có ẩm thực FEI", code: "FEIKIT", expiry: "31/12/2026", discountType: "none", discountValue: 0 },
  // Thành viên
  { id: "p11", category: "member", badge: "Sắp hết mã", title: "Giảm 10% dành cho thành viên Silver", condition: "Áp dụng 1 lần · Tài khoản Silver trở lên", code: "SILVER10", expiry: "30/06/2026", discountType: "percent", discountValue: 10 },
  { id: "p12", category: "member", badge: "Độc quyền", title: "Giảm 15% ưu tiên thành viên Gold", condition: "Chỉ dành cho thành viên Gold & Diamond", code: "GOLD15", expiry: "31/12/2026", discountType: "percent", discountValue: 15 },
  { id: "p13", category: "member", badge: "Mới", title: "Tặng 500 XP khi đặt tour đầu tiên", condition: "Thành viên Bronze mới đăng ký", code: "WELCOME500", expiry: "31/08/2026", discountType: "none", discountValue: 0 },
];

export function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
}

export function formatVNDShort(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
}
