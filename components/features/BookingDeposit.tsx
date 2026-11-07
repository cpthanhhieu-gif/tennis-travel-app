"use client";
import {useEffect,useRef,useState} from "react";
import {useLocalAccount} from "@/lib/use-local-account";
import {tours} from "@/lib/mock-data";
import {requestBlocked} from "@/lib/request-flow";
import BookingPriceSummary from "./BookingPriceSummary";
import AncillaryOrderSummary from "./AncillaryOrderSummary";

import JourneyServices from "./JourneyServices";
import OperationsDetails from "./OperationsDetails";
export default function BookingDeposit({id,onComplete}:{id:string;onComplete:()=>void}){
 const [reviewedPlan,setReviewedPlan]=useState("");
 const {data,error,busy,act,refresh}=useLocalAccount();const completed=useRef(false);
 const order=data?.orders.find(o=>o.id===id);
 useEffect(()=>{if(order&&order.paid>=order.deposit&&!completed.current){completed.current=true;onComplete();}},[order,onComplete]);
 if(!order)return <section className="ds-summary"><p role="status">{error||"Đang tải đăng ký…"}</p><button className="ds-link" onClick={refresh}>Tải lại</button></section>;
 const pkg=tours.find(t=>t.id===order.tourId)?.packageId;
 const ready=!requestBlocked(order)&&(pkg==="sbu1"||!!order.offer?.acceptedAt);
 return <div className="booking-deposit-wrap"><section className="ds-summary"><h2>{ready?"Thanh toán cọc để hoàn tất đăng ký":order.offerRevision?"Đang chờ điều chỉnh phương án":order.offer?"Xem và chấp thuận báo giá / phương án":pkg==="sbu2"?"Đã gửi yêu cầu báo giá đoàn":"Đã gửi yêu cầu phương án"}</h2><p>Mã đăng ký: {id}</p><AncillaryOrderSummary order={order} packageId={pkg}/>{pkg==="sbu3"&&<JourneyServices order={order} busy={busy} act={act}/>}<OperationsDetails order={order}/>{order.offer&&!order.offer.acceptedAt&&!requestBlocked(order)&&<>{pkg==="sbu3"&&<label className="pilot-check"><input type="checkbox" disabled={!order.servicePlan} checked={!!order.servicePlan&&reviewedPlan===order.servicePlan.id} onChange={e=>setReviewedPlan(e.target.checked?order.servicePlan!.id:"")}/>Tôi đã xem lịch, quyền lợi, điều kiện bảo hiểm và cách nhận kit.</label>}<button className="ds-cta" disabled={busy||!!order.offerRevision||(pkg==="sbu3"&&(!order.servicePlan||reviewedPlan!==order.servicePlan.id||order.offer.servicePlanId!==order.servicePlan.id))} onClick={()=>act({action:"acceptOffer",id,offerId:order.offer!.id,planId:reviewedPlan})}>Chấp thuận phương án / báo giá</button></>}<BookingPriceSummary order={order} packageId={pkg}/>{error&&<p role="alert">{error}</p>}{ready&&<><p>Thanh toán mô phỏng: báo đã chuyển cọc, sau đó điều hành xác nhận khoản tiền đã nhận.</p><button className="ds-cta" disabled={busy||order.payment==="awaiting_confirmation"} onClick={()=>act({action:"reportDeposit",id})}>{order.payment==="awaiting_confirmation"?"Chờ xác nhận thanh toán cọc":order.payment==="failed"||order.payment==="cancelled"?"Thử lại thanh toán cọc":"Tôi đã chuyển cọc"}</button></>}</section><p className="booking-deposit-note">Dữ liệu tự cập nhật mỗi 5 giây. Bạn có thể tiếp tục đăng ký này trong Hành trình nếu rời trang.</p></div>;
}
