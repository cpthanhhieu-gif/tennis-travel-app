"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";
import { activityAmount, formatTransportMoney, isTransportDraft, parseTransportOrders, TRANSPORT_ACTIVITY, TRANSPORT_DRAFT_KEY, TRANSPORT_ORDER_KEY, transportAmount, transportFingerprint, transportGrandTotal, type TransportDemoOrder, type TransportDraft } from "@/lib/transport-order";

function makeOrderId() {
  const suffix = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID().slice(0, 8).toUpperCase() : Math.random().toString(36).slice(2, 10).toUpperCase();
  return `TA-DI-${suffix}`;
}

export default function TransportPayment() {
  const router = useRouter();
  const [draft, setDraft] = useState<TransportDraft | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const raw: unknown = JSON.parse(sessionStorage.getItem(TRANSPORT_DRAFT_KEY) ?? "null");
      if (isTransportDraft(raw)) {
        const activityCount = raw.mode === "private_car" ? 0 : Math.max(0, Math.min(raw.passengers, Number.isInteger(raw.activityCount) ? raw.activityCount ?? 0 : 0));
        setDraft({ ...raw, activityId: activityCount ? raw.activityId ?? TRANSPORT_ACTIVITY.id : undefined, activityCount });
      }
    } catch { /* The empty state explains how to restart if storage is unavailable. */ }
    setLoaded(true);
  }, []);

  if (!loaded) return <main className="ds-container transport-payment-page" role="status">Đang tải thông tin đơn…</main>;
  if (!draft) return <div className="ds-container transport-payment-page"><section className="transport-payment-empty"><h1>Chưa có thông tin thanh toán</h1><p>Hãy chọn phương tiện trước khi tiếp tục.</p><Link className="ds-cta" href="/transport">Bắt đầu tìm chuyến</Link></section></div>;

  const activityTotal = activityAmount(draft);
  const transportTotal = transportAmount(draft);
  const grandTotal = transportGrandTotal(draft);

  function completePayment() {
    if (!draft || busy) return;
    setBusy(true);
    setError("");
    const fingerprint = transportFingerprint(draft);
    try {
      const orders = parseTransportOrders(sessionStorage.getItem(TRANSPORT_ORDER_KEY));
      const existing = orders.find(order => order.fingerprint === fingerprint);
      if (existing) {
        router.push(`/transport/order?id=${encodeURIComponent(existing.id)}`);
        return;
      }
      const order: TransportDemoOrder = {
        ...draft,
        id: makeOrderId(),
        createdAt: new Date().toISOString(),
        paymentMethod: "Thanh toán mô phỏng",
        status: "simulated_paid",
        transportTotal,
        activityTotal,
        grandTotal,
        fingerprint,
      };
      sessionStorage.setItem(TRANSPORT_ORDER_KEY, JSON.stringify([order, ...orders]));
      window.dispatchEvent(new Event("travel-transport-orders-updated"));
      router.push(`/transport/order?id=${encodeURIComponent(order.id)}`);
    } catch {
      setError("Không lưu được đơn trong phiên này. Hãy bật bộ nhớ trình duyệt hoặc thử lại.");
      setBusy(false);
    }
  }

  const backParams = new URLSearchParams({ mode: draft.mode, from: draft.from, to: draft.to, date: draft.date, passengers: String(draft.passengers), rideId: draft.rideId });
  if (draft.relatedTourBookingId) backParams.set("bookingId", draft.relatedTourBookingId);
  if (draft.relatedTourId) backParams.set("tourId", draft.relatedTourId);
  const backQuery = backParams.toString();

  return <div className="ds-container transport-payment-page">
    <header className="transport-review-heading"><div className="transport-step-progress" aria-label="Bước 3 trên 3"><div className="transport-step-progress-top"><Link href={`/transport/results?${backQuery}`}><ArrowLeft size={15}/> Về chọn chuyến</Link><strong>Bước 3 / 3</strong></div><div className="transport-step-progress-bars transport-step-progress-bars-three" aria-hidden="true"><i className="is-complete"/><i className="is-complete"/><i className="is-current"/></div></div></header>
    <div className="transport-payment-layout">
      <aside className="transport-payment-summary" aria-label="Chi tiết giá">
        <span className="ui-kicker">CHI TIẾT ĐƠN</span><h2>{draft.from} → {draft.to}</h2>
        <p className="transport-payment-meta">{draft.date} · {draft.time} · {draft.passengers} khách</p>
        <p className="transport-payment-meta">Mã dịch vụ: {draft.rideId}{draft.relatedTourId ? ` · Tour liên quan: ${draft.relatedTourId}` : " · Đặt độc lập, không cần booking tour"}</p>
        <div className="transport-payment-line"><span><strong>{draft.rideName}</strong><small>{draft.unit === "person" ? `${draft.passengers} khách × ${formatTransportMoney(draft.unitPrice)}` : "Giá theo xe"}</small></span><strong>{formatTransportMoney(transportTotal)}</strong></div>
        {activityTotal > 0 ? <div className="transport-payment-line"><span><strong>{TRANSPORT_ACTIVITY.name}</strong><small>{draft.activityCount} khách × {formatTransportMoney(TRANSPORT_ACTIVITY.unitPrice)}</small></span><strong>{formatTransportMoney(activityTotal)}</strong></div> : draft.mode !== "private_car" && <div className="transport-payment-line is-muted"><span><strong>Dịch vụ trải nghiệm</strong><small>Không chọn dịch vụ thêm</small></span><strong>—</strong></div>}
        <div className="transport-review-grand-total"><span>Tổng thanh toán</span><strong>{formatTransportMoney(grandTotal)}</strong></div>
        {error && <p className="transport-payment-error" role="alert">{error}</p>}
        <Button className="transport-review-continue" loading={busy} onClick={completePayment}>Xác nhận thanh toán mô phỏng</Button>
      </aside>
    </div>
  </div>;
}
