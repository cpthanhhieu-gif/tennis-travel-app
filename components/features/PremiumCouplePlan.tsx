"use client";
import {browserScenario,demoParty} from "@/lib/demo-experience";
import {useState,useEffect} from "react";
import InfoPanel from "@/components/ui/InfoPanel";
import VisualStoryDeck,{PhotoSlot} from "./VisualStoryDeck";
export default function PremiumCouplePlan(){
 const [players,setPlayers]=useState(1),[companions,setCompanions]=useState(1);
 useEffect(()=>{const scenario=browserScenario();if(scenario){const party=demoParty(scenario,"sbu3");setPlayers(party.numPeople-party.numCompanions);setCompanions(party.numCompanions);}},[]);
 const total=players*29900000+companions*22900000;
 const setPlayerCount=(value:number)=>setPlayers(Math.max(1,Math.min(16-companions,value||1)));
 const setCompanionCount=(value:number)=>setCompanions(Math.max(0,Math.min(16-players,value||0)));
 return <section className="premium-couple-plan">
  <h2>Đi cùng người thân &amp; bạn bè</h2>
  <p className="premium-couple-total"><strong>{total.toLocaleString("vi-VN")} đ</strong><span>/ {players+companions} khách</span></p>
  <p className="premium-couple-breakdown">Người chơi: 29.900.000đ · Người đi cùng: 22.900.000đ. Giá tham khảo; xác nhận giá và phòng theo ngày khởi hành.</p>
  <InfoPanel title="Lịch người chơi & người đi cùng" description="4 ngày · chỉnh số khách và xem hoạt động chung">
   <section className="premium-party-controls" aria-label="Số khách tham gia">
    <h3>Số khách tham gia</h3>
    <p>Tối đa 16 khách gồm người chơi và người đi cùng. Phòng ở và phụ thu được tư vấn riêng.</p>
    <label>Người chơi tennis<input type="number" min={1} max={16-companions} value={players} onChange={e=>setPlayerCount(Number.parseInt(e.target.value,10))}/></label>
    <label>Người đi cùng không chơi<input type="number" min={0} max={16-players} value={companions} onChange={e=>setCompanionCount(Number.parseInt(e.target.value,10))}/></label>
    <p>{players+companions} khách · cần ít nhất một người chơi</p>
   </section>
   <PremiumDayPlan/>
   <details className="premium-couple-inclusions"><summary>Giá bao gồm gì, khoản nào tính thêm?</summary><VisualStoryDeck label="Quyền lợi người chơi và người đi cùng" items={[
{title:"Cùng nghỉ dưỡng",image:"Hai người tại resort",summary:"Chung phòng, bữa ăn & hoạt động theo phương án",detail:"Bao gồm dự kiến: lưu trú chung phòng, bữa ăn và hoạt động theo phương án. Resort, loại phòng và lịch cụ thể được xác nhận theo chuyến."},
{title:"Riêng một nhịp chơi",image:"Người chơi cùng HLV",summary:"Sân và HLV dành cho người chơi",detail:"Người đi cùng không có quyền lợi sân/HLV. Hai người có lịch riêng và các hoạt động chung trong ngày."},
{title:"Thêm theo sở thích",image:"Phòng nghỉ & trải nghiệm riêng",summary:"Nâng phòng, xe riêng, HLV riêng: báo giá thêm",detail:"Phòng đơn/nâng hạng, xe riêng, HLV riêng, nhóm riêng và hoạt động tuỳ chọn được báo giá riêng. Chưa cộng vào tổng trên."}
]}/></details>
  </InfoPanel>
 </section>;
}
export function PremiumDayPlan(){const days=[["Ngày 1","Đánh giá NTRP, clinic","Nghỉ tại resort","Welcome dinner"],["Ngày 2","Drill, đánh đôi","Spa/nghỉ dưỡng theo phương án","Ẩm thực địa phương"],["Ngày 3","Ace Cup","Cooking class, nghỉ tự do; cổ vũ giải","Gala tối"],["Ngày 4","Yoga/stretching nhẹ","Yoga/stretching nhẹ","Brunch và kết thúc chuyến"]];return <><p className="premium-swipe-hint">Vuốt qua 4 ngày · Mỗi người một nhịp, cùng nhau trải nghiệm</p><div className="premium-couple-days">{days.map(([day,player,companion,shared])=><section key={day}><PhotoSlot label={shared}/><div className="couple-day-copy"><h3>{day}</h3><dl><div><dt>Người chơi</dt><dd>{player}</dd></div><div><dt>Người đi cùng</dt><dd>{companion}</dd></div><div><dt>Cùng tham gia</dt><dd>{shared}</dd></div></dl></div></section>)}<small>Lịch dự kiến; thứ tự và dịch vụ cụ thể xác nhận trong phương án.</small></div></>}
