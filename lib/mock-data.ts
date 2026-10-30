export const mockUser = {
  id: "user_001",
  name: "Nguyễn Minh Khoa",
  firstName: "Khoa",
  age: 32,
  segment: "A",
  ntrpLevel: 3.5,
  ntrpLabel: "Intermediate",
  tier: "Member" as const,
  acePoints: 1240,
  pointsToNextTier: 6000,
  email: "minhkhoa@gmail.com",
  phone: "0901 234 567",
  tourBooked: "pq-sbu3",
};

export type TierType = "Member" | "Gold" | "Diamond";

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
    duration: ["2N1D"],
    priceRange: { min: 6900000, max: 6900000 },
    targetSegment: "White Collar (25–40 tuổi)",
    highlights: [
      "Huấn luyện tennis cơ bản với HLV",
      "Ẩm thực FEI bản địa",
      "Nghỉ dưỡng tại Đà Lạt",
    ],
    destinations: ["dalat"],
    margin: "10%",
    color: "#1e3a5f",
    image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80",
    sbu: 1,
  },
  {
    id: "sbu2",
    name: "Tournament Travel",
    tagline: "Thi đấu – Cạnh tranh – Kết nối",
    duration: ["3N2D"],
    priceRange: { min: 12900000, max: 12900000 },
    targetSegment: "CLB Semi-Pro (25–45 tuổi, nhóm 8–20 người)",
    highlights: [
      "Tổ chức giải đấu nội bộ có tính điểm ELO",
      "Live score + bảng xếp hạng realtime",
      "Ảnh chuyên nghiệp trận đấu",
      "Tích hợp MyLeague.vn",
    ],
    destinations: ["danang"],
    margin: "18%",
    color: "#b45309",
    image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&q=80",
    sbu: 2,
  },
  {
    id: "sbu3",
    name: "Sportcation Premium",
    tagline: "Khổ luyện – Phục hồi – Luxury",
    duration: ["4N3D"],
    priceRange: { min: 29900000, max: 29900000 },
    targetSegment: "Doanh nhân HNWIs (30–55 tuổi)",
    highlights: [
      "HLV quốc tế 1-1",
      "Private dining với Chef nổi tiếng",
      "Resort 5 sao đối tác độc quyền",
      "Spa phục hồi chuyên sâu",
      "Concierge 24/7",
    ],
    destinations: ["phuquoc"],
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
      { time: "20:30", activity: "Check-in app + Ace Points ngày 1 — Nhận badge \"First Serve 🎾\"", location: "App", xp: 50, status: "done" },
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
      { time: "21:00", activity: "Tổng kết ngày 2 — Ace Points, badge \"Court Warrior 🏆\"", location: "App", xp: 100, status: "upcoming" },
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
  pointsMin: number;
  pointsMax: number;
  perks: string[];
  color: string;
  current?: boolean;
}

export const tiers: Tier[] = [
  { name: "Member", pointsMin: 0, pointsMax: 5999, perks: ["Tích điểm mọi hành trình", "Ưu đãi thành viên", "Nhận thông tin tour sớm"], color: "#2563eb", current: true },
  { name: "Gold", pointsMin: 6000, pointsMax: 14999, perks: ["Ưu tiên đặt chỗ", "Đặc quyền nâng hạng", "Ưu đãi tái đặt tour"], color: "#d97706" },
  { name: "Diamond", pointsMin: 15000, pointsMax: 999999, perks: ["Concierge 24/7", "Thiết kế tour riêng", "Sự kiện giới hạn"], color: "#7c3aed" },
];

export const pointActions = [
  { action: "Đánh giá trải nghiệm FEI", points: 20, icon: "UtensilsCrossed", earned: true },
  { action: "Chia sẻ thẻ thành tích", points: 10, icon: "Flag", earned: true },
  { action: "Hoàn thành đánh giá NTRP mới", points: 50, icon: "Trophy", earned: true },
  { action: "Giới thiệu bạn bè thành công", points: 300, icon: "Users", earned: false },
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
    id: "dalat",
    name: "Đà Lạt",
    tourName: "Đà Lạt – Leisure & Learning",
    tourCode: "VTR-SIG-TNS-01-DL2",
    resort: "Resort đối tác Vietravel tại Đà Lạt",
    duration: "2N1D",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80",
    highlights: ["Huấn luyện tennis", "Ẩm thực FEI bản địa", "Khí hậu cao nguyên"],
    departureSchedules: [
      { date: "2027-04-24", dateLabel: "24/04/2027", dayOfWeek: "Thứ Bảy", price: 6900000, code: "VTR-SIG-TNS-01-DL2-240427" },
      { date: "2027-05-08", dateLabel: "08/05/2027", dayOfWeek: "Thứ Bảy", price: 6900000, code: "VTR-SIG-TNS-01-DL2-080527" },
    ],
  },
  {
    id: "danang",
    name: "Đà Nẵng",
    tourName: "Đà Nẵng – Tournament Travel",
    tourCode: "VTR-SIG-TNS-02-DN3",
    resort: "Resort đối tác Vietravel tại Đà Nẵng",
    duration: "3N2D",
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80",
    highlights: ["Giải đấu nội bộ", "Live score", "Kết nối cộng đồng tennis"],
    departureSchedules: [
      { date: "2027-05-07", dateLabel: "07/05/2027", dayOfWeek: "Thứ Sáu", price: 12900000, code: "VTR-SIG-TNS-02-DN3-070527" },
      { date: "2027-05-21", dateLabel: "21/05/2027", dayOfWeek: "Thứ Sáu", price: 12900000, code: "VTR-SIG-TNS-02-DN3-210527" },
    ],
  },
  {
    id: "phuquoc",
    name: "Phú Quốc",
    tourName: "Phú Quốc – Sportcation Premium",
    tourCode: "VTR-SIG-TNS-03-PQ4",
    resort: "Resort 5 sao đối tác Vietravel tại Phú Quốc",
    duration: "4N3D",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    highlights: ["HLV quốc tế 1-1", "Spa phục hồi", "Private dining"],
    departureSchedules: [
      { date: "2027-05-20", dateLabel: "20/05/2027", dayOfWeek: "Thứ Năm", price: 29900000, code: "VTR-SIG-TNS-03-PQ4-200527" },
      { date: "2027-06-03", dateLabel: "03/06/2027", dayOfWeek: "Thứ Năm", price: 29900000, code: "VTR-SIG-TNS-03-PQ4-030627" },
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
  {
    id: "dl-sbu1",
    name: "Đà Lạt – Leisure & Learning",
    destinationId: "dalat",
    destinationName: "Đà Lạt",
    packageId: "sbu1",
    tourCode: "VTR-SIG-TNS-01-DL2",
    resort: "Resort đối tác Vietravel tại Đà Lạt",
    duration: "2N1D",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80",
    highlights: ["Huấn luyện với HLV", "Ẩm thực FEI bản địa", "Nghỉ dưỡng cao nguyên"],
    ntrpRange: "1.5 – 3.5",
    ntrpLabel: "Người mới – Trung cấp",
    badge: "Phổ biến",
    departureSchedules: destinations[0].departureSchedules,
  },
  {
    id: "dn-sbu2",
    name: "Đà Nẵng – Tournament Travel",
    destinationId: "danang",
    destinationName: "Đà Nẵng",
    packageId: "sbu2",
    tourCode: "VTR-SIG-TNS-02-DN3",
    resort: "Resort đối tác Vietravel tại Đà Nẵng",
    duration: "3N2D",
    image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&q=80",
    highlights: ["Giải đấu nội bộ ELO", "Live score realtime", "Ảnh chuyên nghiệp", "Resort 5★"],
    ntrpRange: "3.0 – 4.5",
    ntrpLabel: "CLB – Nâng cao",
    badge: "Hot",
    departureSchedules: destinations[1].departureSchedules,
  },
  {
    id: "pq-sbu3",
    name: "Phú Quốc – Sportcation Premium",
    destinationId: "phuquoc",
    destinationName: "Phú Quốc",
    packageId: "sbu3",
    tourCode: "VTR-SIG-TNS-03-PQ4",
    resort: "Resort 5 sao đối tác Vietravel tại Phú Quốc",
    duration: "4N3D",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    highlights: ["HLV quốc tế 1-1", "Private dining Chef", "Spa phục hồi chuyên sâu", "Concierge 24/7"],
    ntrpRange: "4.0 – 5.0+",
    ntrpLabel: "Nâng cao – Chuyên nghiệp",
    badge: "Còn ít chỗ",
    departureSchedules: destinations[2].departureSchedules,
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
