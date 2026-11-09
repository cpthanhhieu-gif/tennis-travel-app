export type AncillaryUnit = "room" | "hour" | "visit" | "player-session" | "vehicle";
export type AncillaryStatus = "priced-planning" | "provisional" | "inactive";

export type AncillaryService = {
  id: string;
  name: string;
  packageIds: string[];
  unit: AncillaryUnit;
  unitPrice: number;
  status: AncillaryStatus;
  maxPerGuest: number;
  changeCancellation: string;
  priceBasis: string;
  note?: string;
  durationLabel?: string;
  vehicleCapacity?: number;
};

// Catalog prices are VND. Provisional external estimates can be calculated;
// inactive entries are rejected until their price or itinerary is validated.
export const ancillaryCatalog: AncillaryService[] = [
  { id: "sbu1-single-room", name: "Phụ thu phòng đơn · Đà Lạt", packageIds: ["sbu1"], unit: "room", unitPrice: 1_200_000, status: "priced-planning", maxPerGuest: 1, changeCancellation: "Đề xuất: hủy/đổi trước 72 giờ không mất phí; 24–72 giờ thu 50%; dưới 24 giờ hoặc không đến thu 100%. Cần khớp điều kiện phòng và chính sách tour khi ký đối tác.", priceBasis: "Giá tham khảo theo phòng/tour." },
  { id: "sbu2-single-room", name: "Phụ thu phòng đơn · Đà Nẵng", packageIds: ["sbu2"], unit: "room", unitPrice: 2_400_000, status: "priced-planning", maxPerGuest: 1, changeCancellation: "Đề xuất: hủy/đổi trước 72 giờ không mất phí; 24–72 giờ thu 50%; dưới 24 giờ hoặc không đến thu 100%. Cần khớp điều kiện phòng và chính sách tour khi ký đối tác.", priceBasis: "Giá tham khảo theo phòng/tour." },
  { id: "sbu3-single-room", name: "Phụ thu phòng đơn · Phú Quốc", packageIds: ["sbu3"], unit: "room", unitPrice: 9_000_000, status: "priced-planning", maxPerGuest: 1, changeCancellation: "Đề xuất: hủy/đổi trước 72 giờ không mất phí; 24–72 giờ thu 50%; dưới 24 giờ hoặc không đến thu 100%. Cần khớp điều kiện phòng và chính sách tour khi ký đối tác.", priceBasis: "Giá tham khảo theo phòng/tour." },
  { id: "ambassador-one-to-one", name: "Buổi 1:1 với HLV đại sứ", packageIds: ["sbu3"], unit: "hour", unitPrice: 1_500_000, status: "priced-planning", maxPerGuest: 2, changeCancellation: "Đề xuất: đổi/hủy trước 72 giờ miễn phí; 24–72 giờ thu 50%; dưới 24 giờ hoặc không đến thu 100%. Đổi lịch phụ thuộc giờ HLV.", priceBasis: "Giá tham khảo: 1,5 triệu/giờ." },
  { id: "extra-spa-recovery", name: "Spa recovery bổ sung", packageIds: ["sbu3"], unit: "visit", unitPrice: 900_000, status: "priced-planning", maxPerGuest: 1, changeCancellation: "Đề xuất: đổi/hủy trước 72 giờ miễn phí; 24–72 giờ thu 50%; dưới 24 giờ hoặc không đến thu 100%. Đổi lịch phụ thuộc giờ cơ sở spa.", priceBasis: "Giá tham khảo: 900 nghìn/lần; không gồm một lần spa trong tour." },
  { id: "ace-lab-video", name: "Ace Lab 30 phút + video phân tích", packageIds: ["sbu3"], unit: "player-session", unitPrice: 800_000, status: "priced-planning", maxPerGuest: 1, changeCancellation: "Đề xuất: đổi/hủy trước 72 giờ miễn phí; 24–72 giờ thu 50%; dưới 24 giờ hoặc không đến thu 100%. Đổi lịch phụ thuộc thiết bị và khung sân.", priceBasis: "Giá tham khảo: 800 nghìn/người chơi." },
  { id: "pickleball-session", name: "Buổi pickleball", packageIds: ["sbu3"], unit: "player-session", unitPrice: 400_000, status: "priced-planning", maxPerGuest: 1, changeCancellation: "Đề xuất: đổi/hủy trước 72 giờ miễn phí; 24–72 giờ thu 50%; dưới 24 giờ hoặc không đến thu 100%. Đổi lịch phụ thuộc sân.", priceBasis: "Giá tham khảo: 400 nghìn/buổi; giới hạn tối đa một buổi/người cho lịch hiện tại." },
  { id: "phu-quoc-room-sea-view", name: "Nâng hạng phòng Deluxe Sea View", packageIds: ["sbu3"], unit: "room", unitPrice: 1_200_000, status: "provisional", maxPerGuest: 1, changeCancellation: "Đề xuất: đổi/hủy trước 72 giờ miễn phí; 24–72 giờ thu 50%; dưới 24 giờ hoặc không đến thu 100%. Giá và tồn phòng cần khớp resort trước khi thu tiền.", priceBasis: "Giá tham khảo công khai 2026, chênh khoảng 400 nghìn/phòng/đêm × 3 đêm; giá dự toán cho prototype, chưa có hợp đồng/đảm bảo tồn phòng.", note: "Chỉ áp dụng nếu chốt đúng hạng phòng Deluxe Garden làm phòng cơ sở và chọn đúng resort." },
  { id: "phu-quoc-room-junior-suite", name: "Nâng hạng phòng Junior Suite Garden", packageIds: ["sbu3"], unit: "room", unitPrice: 4_500_000, status: "provisional", maxPerGuest: 1, changeCancellation: "Đề xuất: đổi/hủy trước 72 giờ miễn phí; 24–72 giờ thu 50%; dưới 24 giờ hoặc không đến thu 100%. Giá và tồn phòng cần khớp resort trước khi thu tiền.", priceBasis: "Giá tham khảo công khai 2026, chênh khoảng 1,5 triệu/phòng/đêm × 3 đêm; giá dự toán cho prototype, chưa có hợp đồng/đảm bảo tồn phòng.", note: "Chỉ áp dụng nếu chốt đúng hạng phòng Deluxe Garden làm phòng cơ sở và chọn đúng resort." },
  { id: "ace-check-screening", name: "Ace Check · tầm soát trước tour", packageIds: ["sbu1", "sbu2", "sbu3"], unit: "visit", unitPrice: 4_900_000, status: "provisional", maxPerGuest: 1, changeCancellation: "Đề xuất: đổi/hủy trước 72 giờ miễn phí; 24–72 giờ thu 50%; dưới 24 giờ hoặc không đến thu 100%. Khám sàng lọc không thay thế chẩn đoán/điều trị.", priceBasis: "Ước tính sản phẩm, không phải báo giá của cơ sở y tế; dự toán cho prototype dựa trên mốc giá CPET công khai và khám sàng lọc cơ bản.", note: "Không gồm MRI, điều trị hoặc chỉ định phát sinh; đối tác y tế chịu trách nhiệm chuyên môn và khách cần đồng ý riêng với việc xử lý dữ liệu sức khỏe." },
  { id: "vinwonders-phu-quoc", name: "Vé VinWonders Phú Quốc · người lớn", packageIds: ["sbu3"], unit: "visit", unitPrice: 1_050_000, status: "inactive", maxPerGuest: 1, changeCancellation: "Vé ngày cố định thường không đổi/hoàn theo điều kiện nhà cung cấp; cần kiểm tra loại vé tại ngày bán.", priceBasis: "Giá niêm yết tham khảo 2026; cần cập nhật giá 2027 trước khi mở bán.", note: "Chưa khớp khung tự do 14:00–16:00 trong lịch tour hiện tại." },
  { id: "phu-quoc-snorkeling-adult", name: "Snorkeling Nam đảo · người lớn", packageIds: ["sbu3"], unit: "visit", unitPrice: 900_000, status: "inactive", maxPerGuest: 1, changeCancellation: "Theo điều kiện chuyến tàu/thời tiết của nhà cung cấp; chưa có điều khoản hợp đồng.", priceBasis: "Giá công khai tham khảo 2026; cần xác nhận giá 2027 và nhà cung cấp.", note: "Chuyến khoảng 6 giờ, không phù hợp khung tự do 14:00–16:00 hiện tại." },
];

export type AncillarySelection = { id: string; quantity: number };
export type AncillaryLine = { id: string; name: string; unit: AncillaryUnit; quantity: number; unitPrice: number; total: number };
export type AncillaryPricing = { lines: AncillaryLine[]; subtotal: number };

export function normalizeAncillarySelections(packageId: string, guests: number, value: readonly AncillarySelection[] | undefined): AncillarySelection[] {
  if (!value?.length) return [];
  const guestLimit = Number.isSafeInteger(guests) ? Math.max(0, guests) : 0;
  const quantities = new Map<string, number>();
  for (const selection of value) {
    const service = ancillaryCatalog.find(item => item.id === selection.id && item.packageIds.includes(packageId) && item.status !== "inactive");
    if (!service || !Number.isSafeInteger(selection.quantity) || selection.quantity < 1) continue;
    quantities.set(selection.id, (quantities.get(selection.id) ?? 0) + selection.quantity);
  }
  return [...quantities].flatMap(([id, quantity]) => {
    const service = ancillaryCatalog.find(item => item.id === id)!;
    const capped = Math.min(quantity, guestLimit * service.maxPerGuest);
    const normalized = service.unit === "vehicle" && service.vehicleCapacity ? Math.ceil(guestLimit / service.vehicleCapacity) : capped;
    return normalized > 0 ? [{ id, quantity: normalized }] : [];
  });
}

export function priceAncillaryServices(packageId: string, guests: number, value: unknown): AncillaryPricing {
  if (value === undefined) return { lines: [], subtotal: 0 };
  if (!Array.isArray(value) || value.length > ancillaryCatalog.length) throw new Error("Danh sách dịch vụ không hợp lệ.");
  const ids = new Set<string>();
  const lines: AncillaryLine[] = [];
  let vehicleCapacity = 0;
  for (const raw of value) {
    if (!raw || typeof raw !== "object") throw new Error("Thông tin dịch vụ không hợp lệ.");
    const { id, quantity } = raw as Partial<AncillarySelection>;
    if (typeof id !== "string" || ids.has(id) || !Number.isSafeInteger(quantity) || (quantity as number) < 1) throw new Error("Kiểm tra dịch vụ và số lượng.");
    ids.add(id);
    const service = ancillaryCatalog.find(item => item.id === id);
    if (!service || !service.packageIds.includes(packageId)) throw new Error("Dịch vụ không áp dụng cho tour đã chọn.");
    if (service.status === "inactive") throw new Error(`${service.name} chưa mở bán: ${service.note ?? "cần xác nhận điều kiện nhà cung cấp"}`);
    if ((quantity as number) > guests * service.maxPerGuest) throw new Error(`Số lượng ${service.name} vượt giới hạn ${guests * service.maxPerGuest}.`);
    if (service.unit === "vehicle") {
      if (vehicleCapacity || !service.vehicleCapacity) throw new Error("Chọn một loại xe đưa đón cho chuyến đi.");
      vehicleCapacity = service.vehicleCapacity * (quantity as number);
    }
    const total = service.unitPrice * (quantity as number);
    if (!Number.isSafeInteger(total)) throw new Error("Giá dịch vụ vượt giới hạn hợp lệ.");
    lines.push({ id, name: service.name, unit: service.unit, quantity: quantity as number, unitPrice: service.unitPrice, total });
  }
  if (vehicleCapacity > 0 && vehicleCapacity < guests) throw new Error("Số xe đưa đón chưa đủ chỗ cho cả đoàn.");
  return { lines, subtotal: lines.reduce((sum, line) => sum + line.total, 0) };
}
