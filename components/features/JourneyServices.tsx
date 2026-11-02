"use client";
import {useState} from "react";
import type {LocalOrder} from "@/lib/use-local-account";
import {SERVICE_RIGHTS} from "@/lib/service-plan";
import {participants} from "@/lib/pilot";
import VisualStoryDeck from "./VisualStoryDeck";
type Props={order:LocalOrder;busy:boolean;act:(body:object)=>Promise<boolean>};
export default function JourneyServices({order:o,busy,act}:Props){
 const [person,setPerson]=useState(""),[self,setSelf]=useState(false);const plan=o.servicePlan;
 if(!plan)return <section className="premium-offer-summary"><h3>Lịch & quyền lợi theo chuyến</h3><p>Điều phối chưa gửi bản xác nhận lịch, quyền lợi, bảo hiểm và nhận kit. Chương trình giới thiệu vẫn là dự kiến.</p></section>;
 const people=participants(o).filter(p=>p.player),selected=people.find(p=>p.id===person),handover=o.kitHandovers?.find(k=>k.participant===person);
 return <section className="premium-offer-summary"><p className="ds-eyebrow">QUYỀN LỢI THEO CHUYẾN</p><h3>{o.offer?.acceptedAt?"Phương án đã chấp thuận":"Bản xác nhận từ điều phối"}</h3><p>Cập nhật {new Date(plan.publishedAt).toLocaleString("vi-VN")}. Áp dụng cho booking này.</p>
 <VisualStoryDeck label="Lịch, bảo hiểm và nhận kit" items={[
 {title:"Lịch đã xác nhận",image:"Sân tennis & lịch trải nghiệm",summary:"Xem lịch cụ thể theo chuyến",detail:plan.schedule},
 {title:"Bảo hiểm thể thao",image:"Người chơi & đội hỗ trợ",summary:o.insuranceIssue?"Đã ghi nhận chứng từ":"Đã có điều kiện · chờ cấp chứng từ",detail:`Đơn vị: ${plan.insurance.provider}\nPhạm vi: ${plan.insurance.coverage}\nGiới hạn: ${plan.insurance.limits}\nLoại trừ: ${plan.insurance.exclusions}\nHỗ trợ: ${plan.insurance.contact}`},
 {title:"Recovery kit",image:"Bộ kit trao tận tay khách",summary:plan.kitPickup,detail:`Vật phẩm: ${plan.kitContents}\nCách nhận: ${plan.kitPickup}`}
 ]}/>
 <details><summary>Đủ 9 quyền lợi trong giá</summary><ul>{SERVICE_RIGHTS.map(([key,label])=><li key={key}><strong>{label}</strong><p>{plan.rights.find(r=>r.key===key)?.detail}</p></li>)}</ul></details>
 <div className="service-fulfillment"><h4>Chứng từ bảo hiểm</h4>{o.insuranceIssue?<><p>Số chứng nhận: {o.insuranceIssue.reference}</p><a className="ds-link" href={o.insuranceIssue.documentUrl} target="_blank" rel="noopener noreferrer">Mở chứng từ bảo hiểm</a><p className="ds-caption">Do điều phối cung cấp; kiểm tra danh sách người được bảo hiểm và thời hạn trên chứng từ.</p></>:<p>Chưa ghi nhận cấp chứng từ. Có điều kiện bảo hiểm trong phương án chưa đồng nghĩa bảo hiểm đã có hiệu lực.</p>}</div>
 <div className="service-fulfillment"><h4>Nhận recovery kit</h4><label>Người chơi nhận kit<select value={person} onChange={e=>{setPerson(e.target.value);setSelf(false);}}><option value="">Chọn người nhận</option>{people.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}</select></label>{selected&&(handover?<><p>Điều phối đã bàn giao cho {handover.recipient} lúc {new Date(handover.deliveredAt).toLocaleString("vi-VN")}.</p>{handover.receivedAt?<p>Đã xác nhận nhận kit lúc {new Date(handover.receivedAt).toLocaleString("vi-VN")}.</p>:<><label className="pilot-check"><input type="checkbox" checked={self} onChange={e=>setSelf(e.target.checked)}/>Tôi là người nhận này và đã kiểm tra đủ vật phẩm.</label><button className="ds-cta" disabled={busy||!self} onClick={()=>act({action:"receiveKit",id:o.id,participant:person,self:true})}>Xác nhận đã nhận kit</button></>}</>:<p>Chờ điều phối bàn giao. Vật phẩm: {plan.kitContents}. {plan.kitPickup}</p>)}<p className="ds-caption">Mỗi người xác nhận phần của mình. Phiên demo dùng chung tài khoản, chưa xác minh danh tính cá nhân.</p></div>
 </section>
}
