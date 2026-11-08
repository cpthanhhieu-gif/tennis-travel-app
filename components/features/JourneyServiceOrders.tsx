"use client";

import Link from "next/link";
import { ArrowRight, BusFront, CarFront, Plane, TrainFront, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { formatTransportMoney, parseTransportOrders, TRANSPORT_ORDER_KEY, type TransportDemoOrder } from "@/lib/transport-order";
import type { TransportMode } from "@/lib/transport-catalog";

const modeNames: Record<TransportMode, string> = { train: "Tàu hỏa", bus: "Xe buýt", rental: "Thuê xe", airport: "Xe sân bay" };
const modeIcons = { train: TrainFront, bus: BusFront, rental: CarFront, airport: Plane };

export default function JourneyServiceOrders() {
  const [orders, setOrders] = useState<TransportDemoOrder[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try { setOrders(parseTransportOrders(sessionStorage.getItem(TRANSPORT_ORDER_KEY))); }
    catch { setOrders([]); }
    setLoaded(true);
  }, []);

  return <section className="journey-service-section" aria-labelledby="journey-service-title">
    <div className="journey-service-heading">
      <div><span className="ui-kicker">ĐƠN RIÊNG · KHÔNG GỘP VÀO BOOKING TOUR</span><h2 id="journey-service-title">Dịch vụ di chuyển</h2></div>
      <Link href="/transport">Tìm dịch vụ <ArrowRight size={16}/></Link>
    </div>
    {!loaded ? <p role="status">Đang tải đơn dịch vụ…</p> : !orders.length ? <div className="journey-service-empty"><p>Đơn di chuyển bạn đặt trong phiên này sẽ xuất hiện ở đây.</p><Link className="ds-link" href="/transport">Tìm phương tiện</Link></div> : <div className="journey-service-list">
      {orders.map(order => {
        const Icon = modeIcons[order.mode];
        return <article className="journey-service-card" key={order.id}>
          <div className="journey-service-card-top"><span className="journey-service-icon"><Icon size={20}/></span><span className="ui-badge">Đã thanh toán mô phỏng</span></div>
          <span className="ui-kicker">{modeNames[order.mode]} · {order.id}</span>
          <h3>{order.from || "Điểm đi"} → {order.to || "Điểm đến"}</h3>
          <p>{order.date} · {order.time} · <Users size={14}/> {order.passengers} khách</p>
          <div className="journey-service-card-bottom"><strong>{formatTransportMoney(order.grandTotal)}</strong><Link href={`/transport/order?id=${encodeURIComponent(order.id)}`}>Chi tiết đơn <ArrowRight size={15}/></Link></div>
          <small>Đơn demo trong phiên trình duyệt; chưa giữ chỗ với nhà cung cấp.</small>
        </article>;
      })}
    </div>}
  </section>;
}
