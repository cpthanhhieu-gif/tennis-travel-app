"use client";

import Link from "next/link";
import { ArrowRight, BusFront, CarFront, Plane, TrainFront, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { formatTransportMoney, parseTransportOrders, TRANSPORT_ORDER_KEY, type TransportDemoOrder } from "@/lib/transport-order";
import type { TransportMode } from "@/lib/transport-catalog";

const modeNames: Record<TransportMode, string> = { train: "Tàu hỏa", bus: "Xe buýt", rental: "Thuê xe", airport: "Xe sân bay", private_car: "Xe riêng ngoài lịch đoàn" };
const modeIcons = { train: TrainFront, bus: BusFront, rental: CarFront, airport: Plane, private_car: CarFront };

export default function JourneyServiceOrders({ bookingId, compact = false }: { bookingId?: string; compact?: boolean }) {
  const [orders, setOrders] = useState<TransportDemoOrder[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadOrders = () => {
      try { setOrders(parseTransportOrders(sessionStorage.getItem(TRANSPORT_ORDER_KEY))); }
      catch { setOrders([]); }
      setLoaded(true);
    };
    loadOrders();
    window.addEventListener("travel-transport-orders-updated", loadOrders);
    window.addEventListener("focus", loadOrders);
    return () => {
      window.removeEventListener("travel-transport-orders-updated", loadOrders);
      window.removeEventListener("focus", loadOrders);
    };
  }, []);

  const visibleOrders = bookingId ? orders.filter(order => order.relatedTourBookingId === bookingId) : orders;

  if (compact && loaded && !visibleOrders.length) return <section className="journey-service-section"><div className="journey-service-heading"><div><span className="ui-kicker">DỊCH VỤ RIÊNG</span><h2>Dịch vụ xe liên quan</h2></div></div><p className="ds-caption">Đơn xe riêng đặt cho tour này sẽ xuất hiện tại đây; thanh toán tách khỏi giá tour.</p></section>;

  return <section className="journey-service-section" aria-labelledby={`journey-service-title-${bookingId ?? "all"}`}>
    <div className="journey-service-heading">
      <div><span className="ui-kicker">ĐƠN RIÊNG · KHÔNG GỘP VÀO BOOKING TOUR</span><h2 id={`journey-service-title-${bookingId ?? "all"}`}>{bookingId ? "Dịch vụ riêng của tour" : "Dịch vụ riêng"}</h2></div>
      {!compact && <Link href="/transport?mode=private_car">Đặt xe riêng <ArrowRight size={16}/></Link>}
    </div>
    {!loaded ? <p role="status">Đang tải đơn dịch vụ…</p> : !visibleOrders.length ? <div className="journey-service-empty"><p>{bookingId ? "Chưa có đơn xe riêng gắn với tour này." : "Đơn xe riêng bạn đặt trong phiên này sẽ xuất hiện ở đây."}</p>{!compact && <Link className="ds-link" href="/transport?mode=private_car">Đặt xe riêng</Link>}</div> : <div className="journey-service-list">
      {visibleOrders.map(order => {
        const Icon = modeIcons[order.mode];
        return <article className="journey-service-card" key={order.id}>
          <div className="journey-service-card-top"><span className="journey-service-icon"><Icon size={20}/></span><span className="ui-badge">{order.status === "simulated_paid" ? "Đã thanh toán mô phỏng" : "Đang xử lý"}</span></div>
          <span className="ui-kicker">{modeNames[order.mode]} · {order.id}</span>
          <h3>{order.from || "Điểm đi"} → {order.to || "Điểm đến"}</h3>
          <p>{order.date} · {order.time} · <Users size={14}/> {order.passengers} khách</p>
          <small>Mã dịch vụ: {order.rideId}{order.relatedTourId ? ` · Tour: ${order.relatedTourId}` : " · Đơn độc lập"}</small>
          <div className="journey-service-card-bottom"><strong>{formatTransportMoney(order.grandTotal)}</strong><Link href={`/transport/order?id=${encodeURIComponent(order.id)}`}>Chi tiết đơn <ArrowRight size={15}/></Link></div>
          {order.relatedTourBookingId && !bookingId && <Link className="ds-link" href={`/pre-tour?booking=${encodeURIComponent(order.relatedTourBookingId)}`}>Mở tour liên quan <ArrowRight size={14}/></Link>}
          <small>Đơn demo trong phiên trình duyệt; chưa giữ chỗ với nhà cung cấp.</small>
        </article>;
      })}
    </div>}
  </section>;
}
