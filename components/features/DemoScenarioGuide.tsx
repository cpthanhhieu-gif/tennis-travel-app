"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import {browserScenario,demoLabels,packageFlow} from "@/lib/demo-experience";
import type {ScenarioId} from "@/lib/demo-scope";
export default function DemoScenarioGuide({packageId}:{packageId?:string}){
 const [scenario,setScenario]=useState<ScenarioId>();
 const [open,setOpen]=useState(false);
 useEffect(()=>{if(new URLSearchParams(window.location.search).get("from")!=="ace")setScenario(browserScenario());},[]);
 if(!scenario||scenario==="returning")return null;
 return <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:"0.8rem",marginBlock:"1.2rem"}} aria-label="Kịch bản demo hiện tại"><span className="ui-badge">Demo: {demoLabels[scenario]}</span><button type="button" className="ds-link" aria-haspopup="dialog" onClick={()=>setOpen(true)}>Hướng dẫn</button><Modal isOpen={open} onClose={()=>setOpen(false)} title="Hướng dẫn trải nghiệm demo"><DemoGuideContent scenario={scenario} packageId={packageId}/><Link className="ds-link" href="/demo">Mở quản lý kịch bản demo</Link></Modal></div>;
}
export function DemoGuideContent({scenario,packageId}:{scenario:ScenarioId;packageId?:string}){
 const flow=packageId?packageFlow(packageId):undefined;
 return <section aria-label="Hướng dẫn kịch bản demo"><p className="ds-eyebrow">DEMO · {demoLabels[scenario]}</p><h2>{flow?.title??"Chọn gói để trải nghiệm"}</h2><p>{scenario==="personal"?"Mẫu ban đầu: 1 người chơi; bạn có thể đổi số khách hoặc đặt giúp.":scenario==="couple"?"Mẫu khách lẻ: 1 người chơi + 1 người đi cùng; bạn có thể đổi số người và vai trò trong giới hạn gói.":"Bạn là đại diện đoàn/CLB. Dùng Tournament để gửi yêu cầu đoàn; Leisure và Premium vẫn được xem và đăng ký theo hình thức khách lẻ của từng gói."}</p>{flow?<><p>{flow.steps}</p><p>{flow.note}</p></>:<><p>Cả 3 gói đều có thể khám phá. Kịch bản thay đổi dữ liệu mẫu; cách xác nhận và thanh toán theo từng gói.</p><ul>{["sbu1","sbu2","sbu3"].map(id=><li key={id}><Link href={`/tours/${id}`}>{id==="sbu1"?"Leisure":id==="sbu2"?"Tournament":"Premium"}</Link> · {id==="sbu1"?"Lịch cố định":id==="sbu2"?"Báo giá đoàn trong 1 ngày làm việc":"Phản hồi phương án trong 24 giờ"}</li>)}</ul>{scenario==="club"&&<Link className="ds-link" href="/pre-tour">Theo dõi yêu cầu đoàn mẫu 16 khách</Link>}</>}<p className="ds-caption">Số khách mẫu có thể chỉnh sửa. Các thao tác gửi yêu cầu, chấp thuận và thanh toán mô phỏng do bạn thực hiện.</p></section>;
}
