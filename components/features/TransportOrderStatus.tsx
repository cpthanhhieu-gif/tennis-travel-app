"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BusFront, CarFront, Check, CircleCheck, MapPin, Plane, TrainFront, Users } from "lucide-react";
import { activityAmount, formatTransportMoney, isTransportDraft, TRANSPORT_ACTIVITY, TRANSPORT_ORDER_KEY, transportAmount, transportGrandTotal, type TransportDemoOrder } from "@/lib/transport-order";

const modeNames = { train: "Tàu hỏa", bus: "Xe buýt", rental: "Thuê xe", airport: "Xe sân bay" };
const modeIcons = { train: TrainFront, bus: BusFront, rental: CarFront, airport: Plane };

export default function TransportOrderStatus() {
  const [order, setOrder] = useState<TransportDemoOrder | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const parsed: unknown = JSON.parse(sessionStorage.getItem(TRANSPORT_ORDER_KEY) ?? "null");
      if (isTransportDraft(parsed) && typeof (parsed as Partial<TransportDemoOrder>).id === "string" && typeof (parsed as Partial<TransportDemoOrder>).createdAt === "string" && typeof (parsed as Partial<TransportDemoOrder>).paymentMethod === "string" && typeof (parsed as Partial<TransportDemoOrder>).fingerprint === "string" && (parsed as Partial<TransportDemoOrder>).status === "simulated_paid") {
        const activityCount = Math.max(0, Math.min(parsed.passengers, Number.isInteger(parsed.activityCount) ? parsed.activityCount ?? 0 : 0));
        const draft = { ...parsed, activityId: activityCount ? parsed.activityId ?? TRANSPORT_ACTIVITY.id : undefined, activityCount };
        setOrder({ ...draft, id: (parsed as TransportDemoOrder).id, createdAt: (parsed as TransportDemoOrder).createdAt, paymentMethod: (parsed as TransportDemoOrder).paymentMethod, status: "simulated_paid", transportTotal: transportAmount(draft), activityTotal: activityAmount(draft), grandTotal: transportGrandTotal(draft), fingerprint: (parsed as TransportDemoOrder).fingerprint });
      }
    } catch { /* Render the empty state when local order storage cannot be read. */ }
    setLoaded(true);
  }, []);

  if (!loaded) return <div className="ds-container transport-order-page" role="status">Đang tải đơn…</div>;
  if (!order) return <div className="ds-container transport-order-page"><section className="transport-payment-empty"><h1>Chưa có đơn di chuyển</h1><p>Đơn sẽ xuất hiện ở đây sau khi hoàn tất bước thanh toán mô phỏng.</p><Link className="ds-cta" href="/transport">Tìm phương tiện</Link></section></div>;

  const Icon = modeIcons[order.mode] ?? BusFront;
  const activityTotal = activityAmount(order);
  const transportTotal = transportAmount(order);
  const createdAtLabel = new Date(order.createdAt).toLocaleString("vi-VN", { dateStyle: "medium", timeStyle: "short" });

  return <div className="ds-container transport-order-page">
    <section className="transport-order-success" aria-labelledby="transport-order-status-title">
      <span className="transport-order-success-icon"><CircleCheck size={34}/></span><span className="ui-kicker">ĐƠN DI CHUYỂN DEMO</span><h1 id="transport-order-status-title">Thanh toán mô phỏng hoàn tất</h1><p>Đơn đã được tạo trong phiên này. Chưa có giao dịch tiền thật và chưa giữ chỗ với nhà cung cấp.</p>
      <div className="transport-order-status-badge"><Check size={15}/> Đã hoàn tất · Mô phỏng</div>
    </section>
    <div className="transport-order-view-layout">
      <section className="transport-order-view-card" aria-labelledby="transport-order-id-title">
        <div className="transport-order-view-top"><div><span className="ui-kicker">MÃ ĐƠN</span><h2 id="transport-order-id-title">{order.id}</h2></div><span className="transport-count-badge">{modeNames[order.mode]}</span></div>
        <div className="transport-order-view-route"><span>{order.from || "Điểm đi"}</span><ArrowRight size={17}/><span>{order.to || "Điểm đến"}</span></div>
        <div className="transport-order-view-meta"><span><MapPin size={15}/>{order.date}</span><span>{order.time}</span><span><Users size={15}/>{order.passengers} khách</span></div>
        <div className="transport-order-view-product"><span className="transport-results-icon"><Icon size={20}/></span><span><strong>{order.rideName}</strong><small>{order.unit === "person" ? `${order.passengers} khách` : "Giá theo xe"}</small></span><strong>{formatTransportMoney(transportTotal)}</strong></div>
        {activityTotal > 0 && <div className="transport-order-view-product"><span className="transport-results-icon"><MapPin size={20}/></span><span><strong>{TRANSPORT_ACTIVITY.name}</strong><small>{order.activityCount} khách · giá demo</small></span><strong>{formatTransportMoney(activityTotal)}</strong></div>}
        <div className="transport-order-view-total"><span>Tổng đơn</span><strong>{formatTransportMoney(transportGrandTotal(order))}</strong></div>
        <div className="transport-order-view-footer"><span>Phương thức thanh toán</span><strong>{order.paymentMethod}</strong><small>Tạo lúc {createdAtLabel}</small></div>
      </section>
      <aside className="transport-order-next-step"><CircleCheck size={22}/><div><strong>Trạng thái hiện tại</strong><p>Hoàn tất mô phỏng. Dữ liệu chỉ lưu trong phiên trình duyệt này.</p></div></aside>
    </div>
    <Link className="transport-order-back-home" href="/transport">Tìm phương tiện khác <ArrowRight size={17}/></Link>
  </div>;
}
