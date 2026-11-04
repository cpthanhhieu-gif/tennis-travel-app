"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, MessagesSquare, CalendarDays, ScanLine, ChartNoAxesCombined, Users, Settings2, ArrowUpRight, RefreshCw } from "lucide-react";
import DemoExploreEntry from "./DemoExploreEntry";
import {bookingSourceLabel} from "@/lib/booking-entry";
import JourneyTestControls from "./JourneyTestControls";
import SupportInbox from "./SupportInbox";
import CheckInDesk from "./CheckInDesk";
import PilotReport from "./PilotReport";
import DemoManager from "./DemoManager";
import DemoAccess from "./DemoAccess";
import { tours, formatVND } from "@/lib/mock-data";
import { journeyPhase } from "@/lib/journey";
import { requestBlocked } from "@/lib/request-flow";
import type { LocalOrder } from "@/lib/use-local-account";
import type { SupportSummary } from "@/lib/support-inbox";
import "./operations-dashboard.css";
const sections = [
  { id: "overview", label: "Tổng quan", group: "Quản lý", icon: LayoutDashboard, description: "Theo dõi câu hỏi khách và công việc vận hành cần xử lý." },
  { id: "inbox", label: "Hộp thư tư vấn", group: "Quản lý", icon: MessagesSquare, description: "Câu hỏi từ Ace, thông tin liên hệ và phản hồi của tư vấn viên." },
  { id: "bookings", label: "Booking & chuyến đi", group: "Vận hành", icon: CalendarDays, description: "Xử lý yêu cầu, phương án, thanh toán và điều phối chuyến đi." },
  { id: "checkin", label: "Check-in", group: "Vận hành", icon: ScanLine, description: "Tiếp nhận người tham gia bằng mã QR của chuyến đi." },
  { id: "reports", label: "Báo cáo pilot", group: "Vận hành", icon: ChartNoAxesCombined, description: "Theo dõi phản hồi FEI, NPS và dữ liệu thử nghiệm theo kịch bản." },
  { id: "scenarios", label: "Kịch bản khách hàng", group: "Thiết lập demo", icon: Users, description: "Chọn, tiếp tục hoặc đặt lại từng kịch bản để kiểm thử." },
  { id: "session", label: "Phiên demo", group: "Thiết lập demo", icon: Settings2, description: "Quản lý quyền truy cập, bối cảnh và kết nối thiết bị khách." },
] as const;
type Section = typeof sections[number]["id"];
const supportLabels = { new: "Mới", processing: "Đang xử lý", replied: "Đã trả lời" };
export default function OperationsDashboard() {
  const [section, setSection] = useState<Section>("overview");
  const [access, setAccess] = useState<{ admin: boolean; cloud: boolean; room: string; mode?:string } | null>(null);
  const [orders, setOrders] = useState<LocalOrder[] | null>(null);
  const [threads, setThreads] = useState<SupportSummary[] | null>(null);
  const [error, setError] = useState("");
  const [updated, setUpdated] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const refresh = useCallback(async () => {
    try {
      const r = await fetch("/api/demo-access", { cache: "no-store" });
      if (!r.ok) throw Error("Chưa kết nối được phần quản trị. Bạn thử tải lại nhé.");
      const a = await r.json(); setAccess(a);
      if (!a.admin) { setOrders(null); setThreads(null); return; }
      const results = await Promise.allSettled([fetch("/api/local", { cache: "no-store" }).then(async response => { const body = await response.json(); if (!response.ok) throw Error("Chưa tải được booking của kịch bản."); return body; }), fetch("/api/support?admin=1", { cache: "no-store" }).then(async response => { const body = await response.json(); if (!response.ok) throw Error("Chưa tải được hộp thư tư vấn."); return body; })]);
      const errors: string[] = [];
      if (results[0].status === "fulfilled") setOrders(results[0].value.orders); else { setOrders(null); errors.push("Chưa tải được booking của kịch bản."); }
      if (results[1].status === "fulfilled") setThreads(results[1].value.threads); else { setThreads(null); errors.push("Chưa tải được hộp thư tư vấn."); }
      setError(errors.join(" ")); setUpdated(new Date().toLocaleTimeString("vi-VN"));
    } catch (e) { setError(e instanceof Error ? e.message : "Chưa tải được dữ liệu."); }
  }, []);
  useEffect(() => { void refresh(); const timer = window.setInterval(() => { if (!document.hidden) void refresh(); }, 15000); return () => window.clearInterval(timer); }, [refresh]);
  useEffect(() => { const read = () => { const hash = window.location.hash.slice(1); setSection(sections.some(item => item.id === hash) ? hash as Section : "overview"); }; read(); window.addEventListener("hashchange", read); return () => window.removeEventListener("hashchange", read); }, []);
  function navigate(id: Section) { window.location.hash = id; setSection(id); }
  async function login(e: React.FormEvent) { e.preventDefault(); setBusy(true); setError(""); try { const r = await fetch("/api/demo-access", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "login", password }) }); const b = await r.json(); if (!r.ok) throw Error(b.error || "Chưa đăng nhập được."); setPassword(""); await refresh(); } catch (e) { setError(e instanceof Error ? e.message : "Chưa đăng nhập được."); } finally { setBusy(false); } }
  const current = sections.find(item => item.id === section)!;
  const newThreads = threads?.filter(t => t.status === "new").length;
  const pending = orders?.filter(o => !o.completedAt && !o.startedAt);
  const live = orders?.filter(o => o.startedAt && !o.completedAt);
  return <main className="ops-dashboard">
    <aside className="ops-sidebar"><Link href="/operations" className="ops-brand"><span>TA</span><div>Travel Ace<small>Không gian quản trị</small></div></Link><span className="ops-demo-tag">Bản demo sản phẩm</span><nav aria-label="Điều hướng quản trị">{["Quản lý", "Vận hành", "Thiết lập demo"].map(group => <div key={group} className="ops-nav-group"><p>{group}</p>{sections.filter(item => item.group === group).map(item => <button key={item.id} type="button" aria-current={section === item.id ? "page" : undefined} onClick={() => navigate(item.id)}><item.icon size={19}/><span>{item.label}</span>{item.id === "inbox" && !!newThreads && <b>{newThreads}</b>}</button>)}</div>)}</nav><Link className="ops-back" href="/">Mở ứng dụng khách <ArrowUpRight size={17}/></Link></aside>
    <div className="ops-workspace"><header className="ops-topbar"><p>Travel Ace <span>/ Quản trị demo</span></p><span className="ops-access">{access?.admin ? "Quản trị viên" : "Chưa đăng nhập"}</span></header>
      <div className="ops-body"><div className="ops-page-heading"><div><p className="ops-eyebrow">{current.group}</p><h1>{current.label}</h1><p>{current.description}</p></div><button className="ops-refresh" type="button" onClick={() => void refresh()}><RefreshCw size={16}/>Cập nhật</button></div>
      {error && <p className="ops-alert" role="alert">{error}</p>}
      {!access ? <section className="ops-panel"><p>Đang kết nối quản trị…</p></section> : !access.admin ? <section className="ops-panel ops-login"><h2>Đăng nhập quản trị</h2><p>Dùng tài khoản quản trị demo hiện có để xem hộp thư và xử lý chuyến đi.</p><form onSubmit={login}><label>Mật khẩu quản trị<input type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)}/></label><button disabled={busy} className="ds-cta">{busy ? "Đang đăng nhập…" : "Đăng nhập"}</button></form></section> : <>
      <div className="ops-scope"><span><b>Booking:</b> {access.mode==="explore"?"Khám phá tự do":"Kịch bản đang mở"}</span><DemoExploreEntry mode={access.mode==="explore"?"scenario":"explore"} dashboard/><span><b>Tư vấn:</b> toàn bản demo</span><small>{updated && `Cập nhật ${updated}`}</small></div>
      {section === "overview" && <>
        <div className="ops-metrics"><button onClick={() => navigate("inbox")}><MessagesSquare size={20}/><small>Câu hỏi mới</small><strong>{newThreads ?? "—"}</strong><span>Chờ phản hồi · Toàn demo</span></button><button onClick={() => navigate("bookings")}><CalendarDays size={20}/><small>Chuyến đang chuẩn bị</small><strong>{pending?.length ?? "—"}</strong><span>{access.mode==="explore"?"Khám phá tự do":"Kịch bản đang mở"}</span></button><button onClick={() => navigate("bookings")}><Users size={20}/><small>Chuyến đang diễn ra</small><strong>{live?.length ?? "—"}</strong><span>{access.mode==="explore"?"Khám phá tự do":"Kịch bản đang mở"}</span></button><button onClick={() => navigate("reports")}><ChartNoAxesCombined size={20}/><small>Chuyến đã hoàn thành</small><strong>{orders?.filter(o => o.completedAt).length ?? "—"}</strong><span>{access.mode==="explore"?"Khám phá tự do":"Kịch bản đang mở"}</span></button></div>
        <div className="ops-overview-grid"><section className="ops-panel"><div className="ops-panel-title"><h2>Hộp thư cần xử lý</h2><button onClick={() => navigate("inbox")}>Mở hộp thư ↗</button></div><p className="ops-caption">Trao đổi khách gửi qua Ace · Toàn bản demo</p>{threads === null ? <p>Chưa có dữ liệu hộp thư.</p> : !threads.some(t => t.status !== "replied") ? <div className="ops-empty">Chưa có câu hỏi đang chờ. Thử gửi một câu hỏi từ Ace trên ứng dụng khách.</div> : threads.filter(t => t.status !== "replied").slice(0, 5).map(t => <button className="ops-list-row" key={t.id} onClick={() => navigate("inbox")}><span className={`ops-status ${t.status}`}>{supportLabels[t.status]}</span><strong>{t.preview}</strong><small>{t.contact || "Chưa để lại liên hệ"}</small></button>)}</section>
        <section className="ops-panel"><div className="ops-panel-title"><h2>Booking gần đây</h2><button onClick={() => navigate("bookings")}>Mở vận hành ↗</button></div><p className="ops-caption">{access.mode==="explore"?"Booking khám phá tự do":"Booking của kịch bản đang mở"}</p>{orders === null ? <p>Chưa có dữ liệu booking.</p> : !orders.length ? <div className="ops-empty">Chưa có booking. Mở Kịch bản khách hàng để bắt đầu kiểm thử.</div> : [...orders].reverse().slice(0, 5).map(o => <button className="ops-list-row" key={o.id} onClick={() => navigate("bookings")}><span className="ops-status">{journeyPhase(o)}</span><strong>{o.name} · {tours.find(t => t.id === o.tourId)?.destinationName}</strong><small>{bookingSourceLabel(o.entrySource,o.originScenario)} · {requestBlocked(o) ? "Yêu cầu cần xử lý" : `${o.numPeople} khách · Đã nhận ${formatVND(o.paid)}`}</small></button>)}</section></div>
        <section className="ops-panel"><div className="ops-panel-title"><h2>Không gian làm việc</h2><span className="ops-caption">Chọn phần thông tin bạn muốn quản lý</span></div><div className="ops-shortcuts">{sections.filter(item => item.id !== "overview").map(item => <button key={item.id} onClick={() => navigate(item.id)}><item.icon size={22}/><strong>{item.label}</strong><span>{item.description}</span></button>)}</div></section>
      </>}
      <div className="ops-section-content">
        {section === "inbox" && <SupportInbox/>}
        {section === "bookings" && <JourneyTestControls/>}
        {section === "checkin" && <CheckInDesk/>}
        {section === "reports" && <PilotReport/>}
        {section === "scenarios" && <DemoManager scenariosOnly onOperations={() => navigate("bookings")}/>}
        {section === "session" && <DemoAccess sessionOnly/>}
      </div></>}
      </div><footer className="ops-footer">Travel Ace · Dashboard demo · Giao dịch và dữ liệu chuyến đi phục vụ kiểm thử</footer>
    </div>
  </main>;
}
