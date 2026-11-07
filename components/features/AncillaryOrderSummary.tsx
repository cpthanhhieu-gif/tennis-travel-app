import type {LocalOrder} from "@/lib/use-local-account";
import {formatVND} from "@/lib/mock-data";

export default function AncillaryOrderSummary({order,packageId}:{order:LocalOrder;packageId?:string}){
 if(!order.serviceLines?.length)return null;
 const status=order.offerRevision?"Đang chờ cập nhật báo giá":order.offer&&!order.offer.acceptedAt?"Đang chờ bạn xem phương án":order.paid>=order.deposit&&order.deposit>0?"Đã nhận tiền cọc":order.offer?.acceptedAt?"Đã chấp thuận · chờ đặt cọc":packageId==="sbu1"?"Chờ đặt cọc": "Đã gửi kèm yêu cầu tour";
 const isConfirmed=packageId==="sbu1"||!!order.offer?.acceptedAt;
 return <section className="ancillary-order" aria-label="Dịch vụ đã chọn và trạng thái" aria-live="polite">
  <header><div><span className="ds-eyebrow">DỊCH VỤ ĐÃ CHỌN</span><h3>Chi tiết dịch vụ</h3></div><span className="ancillary-order-status">{status}</span></header>
  <ul>{order.serviceLines.map(line=><li key={line.id}><span>{line.name}<small>{line.quantity} × {formatVND(line.unitPrice)}</small></span><strong>{formatVND(line.total)}</strong></li>)}</ul>
  <div className="ancillary-order-total"><span>Phần dịch vụ</span><strong>{formatVND(order.serviceSubtotal??order.serviceLines.reduce((sum,line)=>sum+line.total,0))}</strong></div>
  {isConfirmed&&<div className="ancillary-order-total is-grand"><span>Tổng đơn gồm tour và dịch vụ</span><strong>{formatVND(order.total)}</strong></div>}
  {!isConfirmed&&<p className="ancillary-order-note">Dịch vụ đã được lưu cùng yêu cầu. Tổng cuối cùng được cập nhật khi báo giá tour được gửi.</p>}
 </section>;
}
