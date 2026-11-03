"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {browserScenario,demoLabels,packageFlow} from "@/lib/demo-experience";
import type {ScenarioId} from "@/lib/demo-scope";
export default function DemoScenarioGuide({packageId}:{packageId?:string}){
 const [scenario,setScenario]=useState<ScenarioId>();
 useEffect(()=>{setScenario(browserScenario());},[]);
 if(!scenario||scenario==="returning")return null;
 const flow=packageId?packageFlow(packageId):undefined;
 return <section className="ds-quality" aria-label="Hướng dẫn kịch bản demo"><p className="ds-eyebrow">DEMO · {demoLabels[scenario]}</p><h2>{flow?.title??"Chọn gói để trải nghiệm"}</h2><p>{scenario==="personal"?"Mẫu ban đầu: 1 người chơi; bạn có thể đổi số khách hoặc đặt giúp.":scenario==="couple"?"Mẫu khách lẻ: 1 người chơi + 1 người đi cùng; bạn có thể đổi số người và vai trò trong giới hạn gói.":"Bạn là đại diện đoàn/CLB. Dùng Tournament để gửi yêu cầu đoàn; Leisure và Premium vẫn được xem và đăng ký theo hình thức khách lẻ của từng gói."}</p>{flow?<><p>{flow.steps}</p><p>{flow.note}</p></>:<><p>Cả 3 gói đều có thể khám phá. Kịch bản thay đổi dữ liệu mẫu; cách xác nhận và thanh toán theo từng gói.</p><ul>{["sbu1","sbu2","sbu3"].map(id=><li key={id}><Link href={`/tours/${id}`}>{packageFlow(id).title}</Link> · {id==="sbu1"?"Lịch cố định":id==="sbu2"?"Báo giá đoàn trong 1 ngày làm việc":"Phản hồi phương án trong 24 giờ"}</li>)}</ul>{scenario==="club"&&<Link className="ds-link" href="/pre-tour">Theo dõi yêu cầu đoàn mẫu 16 khách</Link>}</>}<p className="ds-caption">Số khách mẫu có thể chỉnh sửa. Các thao tác gửi yêu cầu, chấp thuận và thanh toán mô phỏng do bạn thực hiện.</p></section>;
}
