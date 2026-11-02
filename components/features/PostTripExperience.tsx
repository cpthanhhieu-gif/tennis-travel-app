"use client";
import {useState} from "react";
import Link from "next/link";
import type {LocalOrder} from "@/lib/use-local-account";
import {validPassport} from "@/lib/passport";
import VisualStoryDeck,{PhotoSlot} from "./VisualStoryDeck";
export default function PostTripExperience({order:o,busy,act}:{order:LocalOrder;busy:boolean;act:(b:object)=>Promise<boolean>}){
 const [note,setNote]=useState(o.postTrip?.note??""),[nextPackage,setNextPackage]=useState(o.postTrip?.nextPackage??""),[notice,setNotice]=useState("");
 if(!o.completedAt)return <p>Nội dung sau chuyến sẽ mở sau khi điều phối xác nhận hoàn thành.</p>;
 if(!validPassport(o))return <section className="premium-offer-summary"><h3>Đang đối soát Passport</h3><p>Chuyến đã có trạng thái hoàn thành nhưng chưa đủ xác nhận để cấp dấu điện tử. Điều phối cần kiểm tra ngày bắt đầu, kết thúc và thanh toán.</p></section>;
 const stamp=o.passportStamp!;
 return <section className="post-trip"><p className="ds-eyebrow">SAU CHUYẾN / DẤU ẤN CÒN LẠI</p><h2>Mang một chút hành trình về nhà.</h2>
 <div className="passport-stamp-summary"><PhotoSlot label="Khoảnh khắc đẹp nhất chuyến đi"/><div><span className="ui-badge">Đã có dấu Passport</span><h3>{stamp.destination}</h3><p>{stamp.tourName} · Khởi hành {new Date(stamp.departureDate+"T00:00:00+07:00").toLocaleDateString("vi-VN")}</p><p>Đã hoàn thành · {new Date(stamp.completedAt).toLocaleDateString("vi-VN")}</p><Link className="ds-link" href="/passport">Mở Tennis Passport</Link></div></div>
 <VisualStoryDeck label="Tiếp nối sau chuyến đi" items={[
 {title:"Giữ lại câu chuyện",image:"Khoảnh khắc khách cùng nhau",summary:"Một ghi chú cho lần trở lại",detail:"Bạn có thể lưu điều đáng nhớ, mục tiêu tập tiếp theo hoặc hoạt động muốn thử vào sổ kỷ niệm bên dưới. Ghi chú nằm trong tài khoản của phiên demo và không được đưa lên thẻ công khai."},
 {title:"Nhìn lại trải nghiệm",image:"Bữa ăn & câu chuyện cùng chef",summary:"Chia sẻ điều bạn thích và điều cần cải thiện",detail:"Hoàn thành đánh giá FEI và NPS trong phần Đánh giá bên dưới. Phản hồi được giữ theo hành trình, tách khỏi ghi chú cá nhân và thẻ chia sẻ."},
 {title:"Hẹn một hành trình khác",image:"Nhóm bạn hẹn ngày trở lại",summary:"Chọn trải nghiệm bạn muốn tìm hiểu",detail:"Lựa chọn bên dưới giúp lưu ý định của bạn. Chưa tạo booking, giữ chỗ, đồng ý tiếp thị hay tự động gửi tin nhắn. Khi sẵn sàng, bạn có thể xem gói và chủ động gửi yêu cầu."}
 ]}/>
 <form className="post-trip-notebook pilot-form" onSubmit={async e=>{e.preventDefault();setNotice("");if(await act({action:"savePostTrip",id:o.id,note,nextPackage}))setNotice("Đã lưu kỷ niệm và lựa chọn của bạn.");}}><fieldset disabled={busy}><legend>Sổ kỷ niệm của hành trình</legend><label>Một điều bạn muốn nhớ<textarea maxLength={500} rows={4} value={note} onChange={e=>setNote(e.target.value)} placeholder="Một pha bóng đẹp, một người bạn mới, một hương vị khó quên…"/></label><small>{note.length}/500 · Không nhập thông tin sức khoẻ hoặc liên hệ.</small><label>Lần tới bạn muốn tìm hiểu<select value={nextPackage} onChange={e=>setNextPackage(e.target.value)}><option value="">Chưa chọn</option><option value="sbu1">Leisure · chơi & thư giãn</option><option value="sbu2">Tournament · cùng CLB thi đấu</option><option value="sbu3">Premium · tennis & nghỉ dưỡng</option></select></label><p className="ds-caption">Ghi chú lưu trong tài khoản thử dùng chung của phiên demo. Không công khai hoặc tự gửi cho người khác.</p><button className="ds-cta">Lưu kỷ niệm</button><p role="status">{notice}</p></fieldset></form>
 <div className="post-trip-actions"><Link className="ds-cta" href={`/share-card?booking=${o.id}`}>Tạo thẻ chia sẻ</Link>{nextPackage&&<Link className="ds-link" href={`/tours/${nextPackage}`}>Khám phá gói đã chọn</Link>}</div>
 </section>
}
