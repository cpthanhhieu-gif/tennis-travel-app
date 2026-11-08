"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRight, BusFront, CarFront, MapPin, Plane, TrainFront, Users } from "lucide-react";
import { activityAmount, formatTransportMoney, parseTransportOrders, TRANSPORT_ACTIVITY, TRANSPORT_ORDER_KEY, transportAmount, transportGrandTotal, type TransportDemoOrder } from "@/lib/transport-order";

const modeNames = { train: "Tàu hỏa", bus: "Xe buýt", rental: "Thuê xe", airport: "Xe sân bay", private_car: "Xe riêng ngoài lịch đoàn" };
const modeIcons = { train: TrainFront, bus: BusFront, rental: CarFront, airport: Plane, private_car: CarFront };

export default function TransportOrderStatus() {
  const [order, setOrder] = useState<TransportDemoOrder | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const orders = parseTransportOrders(sessionStorage.getItem(TRANSPORT_ORDER_KEY));
      const requestedId = new URLSearchParams(window.location.search).get("id");
      const parsed = orders.find(item => item.id === requestedId) ?? (requestedId ? undefined : orders[0]);
      if (parsed) {
        const activityCount = parsed.mode === "private_car" ? 0 : Math.max(0, Math.min(parsed.passengers, Number.isInteger(parsed.activityCount) ? parsed.activityCount ?? 0 : 0));
        const draft = { ...parsed, activityId: activityCount ? parsed.activityId ?? TRANSPORT_ACTIVITY.id : undefined, activityCount };
        setOrder({ ...draft, transportTotal: transportAmount(draft), activityTotal: activityAmount(draft), grandTotal: transportGrandTotal(draft) });
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
      <Image className="transport-order-success-art" src="/images/transport-order-success.png" alt="Huy hiệu xác nhận màu tím bạc" width={160} height={160} priority/><h1 id="transport-order-status-title">Thanh toán mô phỏng hoàn tất</h1><p>Đơn đã được tạo trong phiên này. Chưa có giao dịch tiền thật và chưa giữ chỗ với nhà cung cấp.</p>
    </section>
    <div className="transport-order-view-layout">
      <section className="transport-order-view-card" aria-labelledby="transport-order-id-title">
        <div className="transport-order-view-top"><div><span className="ui-kicker">MÃ ĐƠN</span><h2 id="transport-order-id-title">{order.id}</h2></div><span className="transport-count-badge">{modeNames[order.mode]}</span></div>
        <div className="transport-order-view-route"><span>{order.from || "Điểm đi"}</span><ArrowRight size={17}/><span>{order.to || "Điểm đến"}</span></div>
        <div className="transport-order-view-meta"><span><MapPin size={15}/>{order.date}</span><span>{order.time}</span><span><Users size={15}/>{order.passengers} khách</span></div>
        <div className="transport-order-view-product"><span className="transport-results-icon"><Icon size={20}/></span><span><strong>{order.rideName}</strong><small>{order.unit === "person" ? `${order.passengers} khách` : "Giá theo xe"}</small></span><strong>{formatTransportMoney(transportTotal)}</strong></div>
        {activityTotal > 0 && <div className="transport-order-view-product"><span className="transport-results-icon"><MapPin size={20}/></span><span><strong>{TRANSPORT_ACTIVITY.name}</strong><small>{order.activityCount} khách · giá demo</small></span><strong>{formatTransportMoney(activityTotal)}</strong></div>}
        <div className="transport-order-view-total"><span>Tổng đơn</span><strong>{formatTransportMoney(transportGrandTotal(order))}</strong></div>
        <div className="transport-order-view-footer"><span>Phương thức thanh toán</span><strong>{order.paymentMethod}</strong><small>Mã dịch vụ: {order.rideId}</small><small>{order.relatedTourId ? `Mã tour liên quan: ${order.relatedTourId}` : "Đơn dịch vụ độc lập · không cần booking tour"}</small><small>Tạo lúc {createdAtLabel}</small>{order.relatedTourBookingId && <Link className="ds-link" href={`/pre-tour?booking=${encodeURIComponent(order.relatedTourBookingId)}`}>Mở tour liên quan</Link>}</div>
      </section>
    </div>
    <Link className="transport-order-back-home" href="/pre-tour">Về chuyến đi <ArrowRight size={17} aria-hidden="true"/></Link>
  </div>;
}
