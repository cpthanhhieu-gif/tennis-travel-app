"use client";
import {useEffect,useRef} from "react";
import {useLocalAccount} from "@/lib/use-local-account";
import {formatVND,tours} from "@/lib/mock-data";
import {requestBlocked} from "@/lib/request-flow";
import RequestProgress from "./RequestProgress";
import OperationsDetails from "./OperationsDetails";
export default function BookingDeposit({id,onComplete}:{id:string;onComplete:()=>void}){
 const {data,error,busy,act,refresh}=useLocalAccount();const completed=useRef(false);
 const order=data?.orders.find(o=>o.id===id);
 useEffect(()=>{if(order&&order.paid>=order.deposit&&!completed.current){completed.current=true;onComplete();}},[order,onComplete]);
 if(!order)return <section className="ds-summary"><p role="status">{error||"Đang tải đăng ký…"}</p><button className="ds-link" onClick={refresh}>Tải lại</button></section>;
 const pkg=tours.find(t=>t.id===order.tourId)?.packageId;
 const ready=!requestBlocked(order)&&(pkg==="sbu1"||!!order.offer?.acceptedAt);
 return <section className="ds-summary"><h2>Thanh toán cọc để hoàn tất đăng ký</h2><p>Mã đăng ký: {id}</p><p role="status">Đăng ký chưa hoàn tất. Chỉ xác nhận đặt chuyến sau khi nhận đủ cọc.</p><RequestProgress order={order} packageId={pkg} busy={busy} act={act}/><OperationsDetails order={order}/>{order.offer&&!order.offer.acceptedAt&&!requestBlocked(order)&&<><p>Tổng phương án: {formatVND(order.offer.total)} · Cọc: {formatVND(order.offer.deposit)}</p><button className="ds-cta" disabled={busy||!!order.offerRevision} onClick={()=>act({action:"acceptOffer",id,offerId:order.offer!.id})}>Chấp thuận phương án / báo giá</button></>}<p>Tổng giá: {formatVND(order.total)}</p><p>Cọc cần thanh toán: <strong>{formatVND(order.deposit)}</strong></p><p>Đã nhận: {formatVND(order.paid)}</p><p>Phần còn lại: {formatVND(order.total-order.deposit)} · Thanh toán đủ trước ngày khởi hành 15 ngày.</p>{error&&<p role="alert">{error}</p>}{ready&&<><p>Thanh toán mô phỏng: báo đã chuyển cọc, sau đó điều hành xác nhận khoản tiền đã nhận.</p><button className="ds-cta" disabled={busy||order.payment==="awaiting_confirmation"} onClick={()=>act({action:"reportDeposit",id})}>{order.payment==="awaiting_confirmation"?"Chờ xác nhận thanh toán cọc":order.payment==="failed"||order.payment==="cancelled"?"Thử lại thanh toán cọc":"Tôi đã chuyển cọc"}</button></>}<p>Dữ liệu tự cập nhật mỗi 5 giây. Bạn có thể tiếp tục đăng ký này trong Hành trình nếu rời trang.</p></section>;
}
