export const mockUser = {
  id: "user_001",
  name: "Nguyễn Minh Khoa",
  firstName: "Khoa",
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
    name: "Leisure & Learning",
    tagline: "Học - Chơi - Khám phá",
    duration: ["2N1D", "3N2D"],
    priceRange: { min: 4000000, max: 8000000 },
    targetSegment: "White Collar (25–40 tuổi)",
    highlights: [
      "Huấn luyện tennis cơ bản với HLV",
      "Ẩm thực FEI bản địa",
      "Nghỉ dưỡng resort 4 sao",
    ],
    destinations: ["danang", "phuquoc"],
    margin: "10%",
    color: "#1e3a5f",
    image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80",
    sbu: 1,
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
      "Concierge 24/7",
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
    title: "Arrival & First Serve",
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
    title: "The Tournament Day",
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
    title: "Recovery & Farewell",
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
  "1.0-1.5": { label: "Beginner", description: "Đang học kỹ thuật cơ bản", recommendedSBU: "sbu1" },
  "2.0-2.5": { label: "Novice", description: "Chơi được nhưng cần cải thiện", recommendedSBU: "sbu1" },
  "3.0-3.5": { label: "Intermediate", description: "Chơi đều, bắt đầu thi đấu được", recommendedSBU: "sbu2" },
  "4.0-4.5": { label: "Advanced", description: "Thi đấu club, kỹ thuật tốt", recommendedSBU: "sbu3" },
  "5.0+": { label: "Expert", description: "Gần chuyên nghiệp", recommendedSBU: "sbu3" },
};

export function getNtrpLevel(avg: number): { level: number; label: string; description: string; recommendedSBU: string } {
  if (avg <= 1.5) return { level: 1.5, label: "Beginner", description: "Đang học kỹ thuật cơ bản", recommendedSBU: "sbu1" };
  if (avg <= 2.5) return { level: 2.5, label: "Novice", description: "Chơi được nhưng cần cải thiện", recommendedSBU: "sbu1" };
  if (avg <= 3.5) return { level: 3.5, label: "Intermediate", description: "Chơi đều, bắt đầu thi đấu được", recommendedSBU: "sbu2" };
  if (avg <= 4.5) return { level: 4.5, label: "Advanced", description: "Thi đấu club, kỹ thuật tốt", recommendedSBU: "sbu3" };
  return { level: 5.0, label: "Expert", description: "Gần chuyên nghiệp", recommendedSBU: "sbu3" };
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
  { name: "Bronze", xpMin: 0, xpMax: 999, perks: ["Welcome kit", "Voucher 5% off", "Newsletter priority"], color: "#b45309" },
  { name: "Silver", xpMin: 1000, xpMax: 2999, perks: ["Upgrade room (nếu có)", "Private chef 1 bữa", "Voucher 10% rebook"], color: "#6b7280", current: true },
  { name: "Gold", xpMin: 3000, xpMax: 6999, perks: ["Premium Vault access", "HLV Quốc tế 1 buổi", "Priority booking"], color: "#d97706" },
  { name: "Diamond", xpMin: 7000, xpMax: 999999, perks: ["Outbound Tour unlock", "Concierge 24/7", "Bespoke tour design", "Invite-only events"], color: "#7c3aed" },
];

export const xpActions = [
  { action: "Hoàn thành tour Đà Nẵng", xp: 500, icon: "Flag", earned: true },
  { action: "Điểm FEI >85", xp: 300, icon: "UtensilsCrossed", earned: true },
  { action: "Check-in ngày đầu", xp: 150, icon: "MapPin", earned: true },
  { action: "Thắng trận nội bộ", xp: 200, icon: "Trophy", earned: true },
  { action: "Workshop ẩm thực", xp: 100, icon: "ChefHat", earned: true },
  { action: "Refer bạn bè", xp: 800, icon: "Users", earned: false },
];

export const badges = [
  { id: "first_serve", name: "First Serve", icon: "Zap", description: "Hoàn thành tour đầu tiên", earnedAt: "13/06/2026" },
  { id: "fei_master", name: "FEI Master", icon: "UtensilsCrossed", description: "Đạt điểm FEI >85 toàn bộ bữa ăn", earnedAt: "14/06/2026" },
  { id: "court_warrior", name: "Court Warrior", icon: "Trophy", description: "Thắng ít nhất 1 trận trong giải nội bộ", earnedAt: "14/06/2026" },
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

export function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
}

export function formatVNDShort(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
}
