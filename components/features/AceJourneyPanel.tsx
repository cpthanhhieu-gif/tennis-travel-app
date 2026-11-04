"use client";
import Link from "next/link";
import type {LocalData} from "@/lib/use-local-account";
import type {AceJourneyContext} from "@/lib/ace-journey";
export default function AceJourneyPanel({context,data,onSelect,onNavigate,onExplore}:{context:AceJourneyContext;data:LocalData;onSelect:(id:string)=>void;onNavigate:()=>void;onExplore:()=>void}){
 return <section className="ace-journey-panel" aria-label="Việc tiếp theo theo hành trình"><strong>Chuyến đi của bạn</strong>{data.orders.length>1&&<label>Chọn chuyến<select aria-label="Chuyến Ace đang hỗ trợ" value={context.order.id} onChange={e=>onSelect(e.target.value)}>{data.orders.map(o=><option key={o.id} value={o.id}>{o.departureCode} · {o.status}</option>)}</select></label>}<p className="font-semibold">{context.title}</p><details><summary>Xem việc cần làm tiếp theo</summary><p>{context.text}</p></details><div className="ace-journey-actions">{context.actions.map(a=><Link key={a.href} href={a.href} onClick={onNavigate}>{a.label}</Link>)}<button type="button" onClick={onExplore}>Tìm chuyến mới</button></div></section>;
}
