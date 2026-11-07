"use client";

import {useLocalAccount} from "@/lib/use-local-account";
import {FEI_CRITERIA,surveyMeals} from "@/lib/pilot";
import Link from "next/link";

export default function PilotReport(){
 const {data,error,refresh}=useLocalAccount();
 const allOrders=data?.orders??[];
 const completedOrders=allOrders.filter(order=>!!order.completedAt);
 const surveyOrders=allOrders.filter(order=>!!order.startedAt||!!order.completedAt);
 const referrals=allOrders.filter(order=>!!order.referral);
 const nps=completedOrders.flatMap(order=>order.npsResponses??[]);
 const fei=surveyOrders.flatMap(order=>order.feiResponses??[]);
 const npsPeople=completedOrders.reduce((sum,order)=>sum+order.numPeople,0);
 const expectedFei=surveyOrders.reduce((sum,order)=>sum+surveyMeals(order).length*order.numPeople,0);
 const score=nps.length?Math.round(100*(nps.filter(item=>item.score>=9).length-nps.filter(item=>item.score<=6).length)/nps.length):null;
 const feiAverage=fei.length?(fei.reduce((sum,item)=>sum+item.score,0)/fei.length).toFixed(1):null;
 const ongoing=allOrders.filter(order=>!order.completedAt).length;
 const download=()=>{const content=JSON.stringify({version:"pilot-export-v1",exportedAt:new Date().toISOString(),scope:{completedOrders:completedOrders.length,surveyOrders:surveyOrders.length},orders:allOrders.map(order=>({id:order.id,tourId:order.tourId,departureCode:order.departureCode,numPeople:order.numPeople,startedAt:order.startedAt??null,completedAt:order.completedAt??null,fei:order.feiResponses??[],nps:order.npsResponses??[]}))},null,2);const url=URL.createObjectURL(new Blob([content],{type:"application/json"}));const a=document.createElement("a");a.href=url;a.download="pilot-feedback.json";a.click();URL.revokeObjectURL(url);};
 return <main className="ds-container ds-profile pilot-report">
  <header className="pilot-report-header"><div><span className="ds-eyebrow">VẬN HÀNH</span><h1>Báo cáo pilot</h1><p>Phản hồi FEI, NPS và nguồn giới thiệu trong phạm vi dữ liệu hiện tại.</p></div><button className="ds-link" onClick={refresh}>Cập nhật</button></header>
  <p className="pilot-report-scope">Dữ liệu cục bộ của kịch bản đang mở. Số khách tính theo thành viên trong booking.</p>
  {error&&<p role="alert">{error}</p>}
  {!data?<p role="status">Đang tải báo cáo…</p>:!data.account?<section className="ds-quality"><p>Đăng nhập để xem báo cáo của kịch bản hiện tại.</p><Link href="/profile" className="ds-cta">Đăng nhập</Link></section>:<>
   <div className="pilot-report-kpis"><article><span>Chuyến hoàn thành</span><strong>{completedOrders.length}</strong></article><article><span>Booking chưa hoàn tất</span><strong>{ongoing}</strong></article><article><span>NPS</span><strong>{score===null?"—":score}</strong></article><article><span>FEI trung bình</span><strong>{feiAverage??"—"}</strong></article></div>
   <section className="pilot-report-section"><div className="pilot-report-title"><div><h2>NPS sau chuyến đi</h2><p>Chỉ tính chuyến đã hoàn thành.</p></div><span>{nps.length}/{npsPeople} phản hồi</span></div><p>{score===null?"Chưa có phản hồi NPS.":`NPS ${score} · ${npsPeople?Math.round(nps.length/npsPeople*100):0}% khách đã phản hồi.`} Công thức: % chấm 9–10 trừ % chấm 0–6; 7–8 là trung lập.</p></section>
   <section className="pilot-report-section"><div className="pilot-report-title"><div><h2>FEI theo bữa ăn</h2><p>Tính từ chuyến đã bắt đầu hoặc hoàn thành.</p></div><span>{fei.length}/{expectedFei} phiếu</span></div><p>Điểm FEI trung bình: {feiAverage??"Chưa có dữ liệu"}/100.</p><div className="pilot-report-criteria">{FEI_CRITERIA.map(criteria=>{const values=fei.map(response=>response.scores[criteria.key]);const average=values.length?(values.reduce((sum,value)=>sum+value,0)/values.length).toFixed(1):"—";return <article key={criteria.key}><strong>{criteria.key}</strong><span>{criteria.label}</span><b>{average}</b></article>;})}</div><small>Mỗi phiếu có trọng số bằng nhau. Mục tiêu tham khảo: FEI ≥80, NPS ≥60, phản hồi NPS ≥90%; chưa tự kết luận nghiệm thu.</small></section>
   <section className="pilot-report-section"><div className="pilot-report-title"><div><h2>Nguồn giới thiệu</h2><p>Ghi nhận link giới thiệu, chưa xác minh khách mới hoặc tính thưởng.</p></div><span>{referrals.length} yêu cầu</span></div><p>{referrals.filter(order=>order.paid>=order.deposit).length} đã cọc · {referrals.filter(order=>!!order.completedAt).length} đã hoàn thành.</p></section>
   <button className="ds-link" onClick={download}>Tải dữ liệu phản hồi JSON</button>
  </>}
 </main>;
}