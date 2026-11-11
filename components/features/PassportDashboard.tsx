"use client";
import {useState} from "react";
import Link from "next/link";
import {useLocalAccount} from "@/lib/use-local-account";
import {validPassport} from "@/lib/passport";
import Modal from "@/components/ui/Modal";
import {PhotoSlot} from "./VisualStoryDeck";
import PilotSurvey from "./PilotSurvey";
import PostTripExperience from "./PostTripExperience";
export default function PassportDashboard(){
 const {data,error,busy,refresh,act}=useLocalAccount();const [year,setYear]=useState("all"),[selected,setSelected]=useState<string|null>(null);
 const eligible=(data?.orders??[]).filter(validPassport).sort((a,b)=>b.passportStamp!.departureDate.localeCompare(a.passportStamp!.departureDate));
 const years=[...new Set(eligible.map(o=>o.passportStamp!.departureDate.slice(0,4)))].sort().reverse();
 const shown=eligible.filter(o=>year==="all"||o.passportStamp!.departureDate.startsWith(year)),order=eligible.find(o=>o.id===selected);
 const pending=(data?.orders??[]).filter(o=>o.completedAt&&!validPassport(o)).length;
 return <div className="ds-container ds-profile passport-page"><Link className="ds-back" href="/profile">← Cá nhân</Link><p className="ds-eyebrow">TENNIS PASSPORT</p><h1>Mỗi hành trình, một dấu nhớ.</h1><p>Lưu dấu chuyến đi đã được điều phối xác nhận hoàn thành và thanh toán đủ.</p>
 {error&&<p role="alert">{error} <button className="ds-link" onClick={refresh}>Thử lại</button></p>}
 {!data&&!error&&<p role="status">Đang tải Passport…</p>}
 {data&&!data.account&&<Link className="ds-cta" href="/profile">Đăng nhập để mở Passport</Link>}
 {data?.account&&<><div className="passport-metrics"><div><strong>{eligible.length}</strong><span>hành trình có dấu</span></div><div><strong>{new Set(eligible.map(o=>o.passportStamp!.destination)).size}</strong><span>điểm đến</span></div></div>
 <p className="ds-caption">Passport riêng của tài khoản demo, ghi nhận theo booking; chưa phải chứng nhận thành tích thi đấu hoặc hồ sơ riêng của từng thành viên.</p>
 {pending>0&&<p role="status">{pending} chuyến hoàn thành đang chờ đối soát để cấp dấu.</p>}
 {eligible.length>0?<><div className="premium-benefit-tabs" aria-label="Lọc Passport theo năm khởi hành"><button aria-pressed={year==="all"} onClick={()=>setYear("all")}>Tất cả</button>{years.map(y=><button key={y} aria-pressed={year===y} onClick={()=>setYear(y)}>{y}</button>)}</div><div className="passport-grid">{shown.map(o=>{const s=o.passportStamp!;return <button type="button" className="passport-entry" key={s.id} aria-haspopup="dialog" onClick={()=>setSelected(o.id)}><PhotoSlot label={`Khoảnh khắc tại ${s.destination}`} src={s.destination==="Đà Lạt"?"/images/passport-da-lat.png":s.destination==="Phú Quốc"?"/images/passport-phu-quoc.webp":undefined}/><span className="passport-entry-copy"><span className="passport-seal">TENNIS PASSPORT · {s.departureDate.slice(0,4)}</span><strong>{s.destination}</strong><span>{s.tourName}</span><small>Khởi hành {new Date(s.departureDate+"T00:00:00+07:00").toLocaleDateString("vi-VN")} · Đã xác nhận hoàn thành</small><span className="ds-link">Mở kỷ niệm →</span></span></button>})}</div></>:<section className="ds-quality"><h2>Dấu đầu tiên đang chờ bạn</h2><p>Sau khi hành trình được xác nhận hoàn thành và thanh toán đủ, dấu điện tử sẽ được lưu tại đây.</p><Link className="ds-cta" href="/pre-tour">Xem hành trình</Link></section>}
 </>}
 <Modal wide isOpen={!!order} title="Kỷ niệm hành trình" onClose={()=>setSelected(null)}>{order&&<>{error&&<p role="alert">{error}</p>}<PostTripExperience key={order.id} order={order} busy={busy} act={act}/><PilotSurvey key={`survey-${order.id}`} order={order} busy={busy} act={act}/><p className="ds-caption">Dấu {order.passportStamp!.id.slice(0,8)} · Xác nhận {new Date(order.passportStamp!.verifiedAt).toLocaleString("vi-VN")}</p></>}</Modal>
 </div>
}
