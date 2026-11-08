"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BusFront, CarFront, Check, MapPin, Minus, Plane, Plus, Star, TrainFront, Users } from "lucide-react";
import Button from "@/components/ui/Button";
import { activityAmount, formatTransportMoney, isTransportDraft, TRANSPORT_ACTIVITY, TRANSPORT_DRAFT_KEY, transportAmount, transportGrandTotal, type TransportDraft } from "@/lib/transport-order";
import { transportRidesByMode } from "@/lib/transport-catalog";
const modeLabels = { train: "Tàu hỏa", bus: "Xe buýt", rental: "Thuê xe", airport: "Xe sân bay", private_car: "Xe riêng ngoài lịch đoàn" };
const modeIcons = { train: TrainFront, bus: BusFront, rental: CarFront, airport: Plane, private_car: CarFront };

export default function TransportReview() {
  const router = useRouter();
  const [draft, setDraft] = useState<TransportDraft | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const parsed: unknown = JSON.parse(sessionStorage.getItem(TRANSPORT_DRAFT_KEY) ?? "null");
      if (isTransportDraft(parsed)) {
        const activityCount = parsed.mode === "private_car" ? 0 : Math.max(0, Math.min(parsed.passengers, Number.isInteger(parsed.activityCount) ? parsed.activityCount ?? 0 : 0));
        setDraft({ ...parsed, activityId: activityCount ? parsed.activityId ?? TRANSPORT_ACTIVITY.id : undefined, activityCount });
      }
    } catch { /* Keep the empty state if browser storage is unavailable. */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded || !draft) return;
    try { sessionStorage.setItem(TRANSPORT_DRAFT_KEY, JSON.stringify(draft)); } catch { /* The review remains usable if storage is blocked. */ }
  }, [draft, loaded]);

  const total = useMemo(() => {
    if (!draft) return 0;
    return transportGrandTotal(draft);
  }, [draft]);

  if (!loaded) return <div className="ds-container transport-review-page" role="status">Đang tải lựa chọn…</div>;
  if (!draft) return <div className="ds-container transport-review-page"><section className="transport-review-empty"><h1>Chưa có chuyến được chọn</h1><p>Hãy chọn chuyến hoặc xe trước khi xem lại đơn.</p><Link className="ds-cta" href="/transport">Tìm phương tiện</Link></section></div>;

  const ModeIcon = modeIcons[draft.mode] ?? BusFront;
  const activityCount = draft.activityCount ?? 0;
  const transportTotal = transportAmount(draft);
  const selectedRide = transportRidesByMode[draft.mode].find(ride => ride.id === draft.rideId);
  const canAddLocalActivity = draft.mode !== "private_car";

  function updateActivity(count: number) {
    setDraft(current => {
      if (!current) return current;
      const activityCount = Math.max(0, Math.min(current.passengers, count));
      return { ...current, activityId: activityCount ? TRANSPORT_ACTIVITY.id : undefined, activityCount };
    });
  }

  const backParams = new URLSearchParams({ mode: draft.mode, from: draft.from, to: draft.to, date: draft.date, passengers: String(draft.passengers), rideId: draft.rideId });
  if (draft.relatedTourBookingId) backParams.set("bookingId", draft.relatedTourBookingId);
  if (draft.relatedTourId) backParams.set("tourId", draft.relatedTourId);
  const backQuery = backParams.toString();

  return <div className="ds-container transport-review-page">
    <Link className="transport-back-link" href={`/transport/results?${backQuery}`}><ArrowLeft size={17}/> Về chọn chuyến</Link>
    <header className="transport-review-heading"><span className="ui-kicker">BƯỚC 4 · RÀ SOÁT ĐƠN RIÊNG</span><h1>{draft.mode === "private_car" ? "Xem lại xe riêng" : "Xem lại lựa chọn"}</h1><p>{draft.mode === "private_car" ? "Kiểm tra giá và điều kiện xe riêng trước khi thanh toán độc lập." : "Kiểm tra phương tiện và thêm trải nghiệm cho chuyến đi."}</p></header>

    <section className="transport-review-layout">
      <div className="transport-review-main">
        <section className="transport-order-card" aria-labelledby="transport-order-title">
          <div className="transport-order-card-heading"><span className="transport-results-icon"><ModeIcon size={21}/></span><div><span className="ui-kicker">{modeLabels[draft.mode] ?? "Di chuyển"}</span><h2 id="transport-order-title">{draft.rideName}</h2></div><span className="transport-count-badge">Đã chọn</span></div>
          <div className="transport-order-route"><strong>{draft.from || "Điểm đi"}</strong><span aria-hidden="true">→</span><strong>{draft.to || "Điểm đến"}</strong></div>
          <div className="transport-order-meta"><span><MapPin size={15}/>{draft.date}</span><span>{draft.time}</span><span><Users size={15}/>{draft.passengers} khách</span></div>
          <div className="transport-order-price"><span>Phương tiện</span><strong>{formatTransportMoney(transportTotal)}</strong></div>
        </section>

        {draft.mode === "private_car" && <section className="transport-order-card" aria-labelledby="transport-private-terms-title"><span className="ui-kicker">GIÁ & ĐIỀU KIỆN DEMO</span><h2 id="transport-private-terms-title">Xe riêng ngoài lịch đoàn</h2><p><strong>{formatTransportMoney(transportTotal)}</strong> / xe · {selectedRide?.duration ?? "thời lượng theo lựa chọn"} · {selectedRide?.detail ?? "Dịch vụ ngoài lịch đoàn"}.</p><ul><li>Không thay thế xe đã gồm trong tour.</li><li>Giá, sức chứa và giờ xe chưa xác nhận với nhà cung cấp; chưa xác nhận tình trạng còn xe.</li><li>Điều kiện đổi, hủy và hoàn tiền chưa được nhà cung cấp xác nhận.</li></ul><p className="ds-caption">Thanh toán ở bước tiếp theo cũng là mô phỏng; chưa thu tiền hoặc giữ chỗ.</p></section>}

        {canAddLocalActivity && <section className="transport-activity-section" aria-labelledby="transport-activity-heading">
          <header><div><span className="ui-kicker">GỢI Ý THEO ĐIỂM ĐẾN</span><h2 id="transport-activity-heading">Thêm trải nghiệm cho chuyến đi</h2><p>Có thể thêm hoặc bỏ bất cứ lúc nào trước khi tiếp tục.</p></div><span className="transport-count-badge">{TRANSPORT_ACTIVITY.destinationName}</span></header>
          <article className={`transport-activity-card${activityCount ? " is-added" : ""}`}>
            <div className="transport-activity-image"><Image src={TRANSPORT_ACTIVITY.image} alt={`Ảnh minh họa điểm đến ${TRANSPORT_ACTIVITY.destinationName}`} fill sizes="(max-width:767px) 92vw, 420px"/></div>
            <div className="transport-activity-copy"><span className="transport-activity-scope"><MapPin size={13}/> {TRANSPORT_ACTIVITY.destinationName} · Hoạt động địa phương</span><h3>{TRANSPORT_ACTIVITY.name}</h3><span className="transport-activity-rating"><Star size={15} fill="currentColor"/> {TRANSPORT_ACTIVITY.rating} <small>({TRANSPORT_ACTIVITY.ratingLabel})</small></span><div className="transport-activity-bottom"><strong>{formatTransportMoney(TRANSPORT_ACTIVITY.unitPrice)} <small>/ khách · giá demo</small></strong>{activityCount === 0 ? <Button variant="secondary" size="sm" onClick={() => updateActivity(1)}><Plus size={16}/> Thêm</Button> : <div className="transport-activity-quantity" aria-label="Số khách tham gia trải nghiệm"><button type="button" aria-label="Bỏ một khách" disabled={activityCount <= 1} onClick={() => updateActivity(activityCount - 1)}><Minus size={15}/></button><strong>{activityCount}</strong><button type="button" aria-label="Thêm một khách" disabled={activityCount >= draft.passengers} onClick={() => updateActivity(activityCount + 1)}><Plus size={15}/></button><button type="button" className="transport-activity-remove" onClick={() => updateActivity(0)}>Bỏ</button></div>}</div>
              {activityCount > 0 && <p className="transport-activity-subtotal"><Check size={15}/> {activityCount} khách · {formatTransportMoney(activityAmount(draft))}</p>}
            </div>
          </article>
          <p className="transport-review-disclaimer">Giá và hình ảnh dịch vụ là dữ liệu demo/tham khảo, chưa xác nhận nhà cung cấp, lịch hoạt động hoặc tình trạng chỗ.</p>
        </section>}
      </div>

      <aside className="transport-review-total-card" aria-label="Tổng kết đơn">
        <span className="ui-kicker">TÓM TẮT ĐƠN</span><h2>Chi phí dự kiến</h2>
        <div className="transport-total-line"><span>{draft.rideName}</span><strong>{formatTransportMoney(transportTotal)}</strong></div>
        {activityCount > 0 && <div className="transport-total-line"><span>{TRANSPORT_ACTIVITY.name} · {activityCount} khách</span><strong>{formatTransportMoney(activityAmount(draft))}</strong></div>}
        <div className="transport-review-grand-total"><span>Tổng cộng</span><strong>{formatTransportMoney(total)}</strong></div>
        <Button className="transport-review-continue" onClick={() => router.push("/transport/payment")}>Tiếp tục thanh toán</Button>
        <p className="transport-review-payment-note">Thanh toán tại bước sau là mô phỏng; chưa thu tiền hay giữ chỗ thật.</p>
      </aside>
    </section>
  </div>;
}
