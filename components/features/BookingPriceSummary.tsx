import type {LocalOrder} from "@/lib/use-local-account";
import {formatVND} from "@/lib/mock-data";
export default function BookingPriceSummary({order,packageId}:{order:LocalOrder;packageId?:string}){
 const direct=packageId==="sbu1";
 if(!direct&&!order.offer?.acceptedAt){
  if(order.offerRevision)return <section className="ds-quality"><h3>Đang chờ điều chỉnh phương án</h3><p>Giá và tiền cọc sẽ được cập nhật trong phương án mới. Bạn chưa cần thanh toán.</p></section>;
  if(order.offer)return <section className="ds-quality"><h3>{packageId==="sbu2"?"Báo giá đoàn để xem xét":"Phương án để xem xét"}</h3><p>Tổng giá đề xuất: {formatVND(order.offer.total)}</p><p>Cọc theo đề xuất: {formatVND(order.offer.deposit)}</p><p>Kiểm tra số khách, lịch, quyền lợi, phụ thu và điều kiện trong phương án. Chỉ thanh toán sau khi chấp thuận.</p></section>;
  return <section className="ds-quality"><h3>{packageId==="sbu2"?"Đang chờ báo giá đoàn":"Đang chờ phương án"}</h3>{packageId==="sbu3"&&<><p>Chi phí gói cơ bản tham khảo: {formatVND(order.total)}</p><p>Chưa gồm dịch vụ bổ sung, phụ thu phòng; giá cuối cùng theo phương án được xác nhận.</p></>}<p>Chưa cần thanh toán. Tổng giá, khoản cọc và điều kiện sẽ được gửi cùng báo giá/phương án.</p></section>;
 }
 return <section aria-label="Chi phí đã xác nhận"><div className="ds-summary-row"><span>{direct?"Tổng giá gói đã chọn":"Tổng giá đã chấp thuận"}</span><strong>{formatVND(order.total)}</strong></div><div className="ds-summary-row"><span>Cọc theo {direct?"gói":"phương án"}</span><strong>{formatVND(order.deposit)}</strong></div><p>Cọc còn cần thanh toán: {formatVND(Math.max(0,order.deposit-order.paid))}</p><p>Đã nhận: {formatVND(order.paid)}</p><p>Tổng còn phải thanh toán: {formatVND(Math.max(0,order.total-order.paid))}</p></section>;
}
