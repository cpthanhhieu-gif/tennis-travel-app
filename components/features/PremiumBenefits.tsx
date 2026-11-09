"use client";
import {useState} from "react";
import {ArrowUpRight} from "lucide-react";
import Modal from "@/components/ui/Modal";
import VisualStoryDeck, {PhotoSlot} from "./VisualStoryDeck";
type Benefit={title:string;summary:string;detail:string;image:string;imageSrc?:string};
const included:Benefit[]=[
{title:"Court Hours · 3 buổi sân",summary:"Chơi theo nhịp của bạn",image:"Sân tennis & người chơi",imageSrc:"/images/premium-included/court-hours.png",detail:"Ba buổi sân trong Court Hours; khung hiện tại dự kiến tổng 6,5 giờ. Sân, khung giờ và phương án khi thời tiết thay đổi được xác nhận trong phương án chuyến đi."},
{title:"HLV đại sứ · 1 buổi",summary:"Một buổi trong giá gói",image:"Chân dung HLV đại sứ",imageSrc:"/images/premium-included/ambassador-coach.png",detail:"Một buổi với HLV đại sứ nằm trong giá. Tên đại sứ và lịch tham gia chờ xác nhận. Buổi tập riêng 1-1 là dịch vụ mua thêm, không thay thế buổi này."},
{title:"Giải Ace Cup",summary:"Thi đấu & cùng nâng cúp",image:"Khoảnh khắc Ace Cup",imageSrc:"/images/premium-included/ace-cup.png",detail:"Giải Ace Cup theo chương trình; thể thức, trọng tài, sân và lịch thi đấu cần được làm rõ trong phương án. Suất Pro-Am và điểm xếp hạng còn phụ thuộc thỏa thuận đối tác."},
{title:"5 bữa FEI",summary:"Có 1 bữa private dining",image:"Bàn ăn private dining",detail:"Năm bữa FEI, gồm một private dining. Thực đơn và nhu cầu ăn uống được thống nhất trước chuyến. FEI là khung đánh giá trải nghiệm; chưa có bằng chứng xác nhận đạt FEI ≥85 cho lịch này."},
{title:"Spa recovery · 1 suất",summary:"Dành thời gian phục hồi",image:"Không gian spa recovery",detail:"Một suất spa recovery trong giá, chương trình hiện dự kiến 60 phút. Cơ sở, nội dung và giờ phục vụ xác nhận theo chuyến; spa thêm tính riêng."},
{title:"Recovery kit",summary:"Bộ vật phẩm đồng hành",image:"Bộ recovery kit",detail:"Recovery kit thuộc cấu hình gói. Danh sách vật phẩm, địa điểm và thời điểm nhận cần được xác nhận trước chuyến."},
{title:"Tennis Passport",summary:"Giữ lại dấu ấn chuyến đi",image:"Tennis Passport & dấu mùa",detail:"Tennis Passport thuộc cấu hình gói. Passport điện tử trong Cá nhân lưu dấu các booking đã được xác nhận hoàn thành và thanh toán đủ; chuyến cũ cần điều phối đối soát trước khi cấp dấu. Hình thức nhận Passport vật lý xác nhận theo chuyến."},
{title:"Bảo hiểm thể thao",summary:"Trong cấu hình giá gói",image:"Người chơi & đội hỗ trợ",detail:"Bảo hiểm thể thao thuộc cấu hình giá gói. Đơn vị bảo hiểm, phạm vi hoạt động, giới hạn và loại trừ phải được xác nhận trong phương án. Hiện chưa có chứng nhận bảo hiểm được cấp trên app."},
{title:"App & share card",summary:"Hành trình và thẻ kỷ niệm",image:"Khoảnh khắc đôi bạn sau tour",detail:"App hỗ trợ hành trình, chuẩn bị, check-in, phản hồi và thẻ chia sẻ sau chuyến hoàn thành. Các chức năng hiện ở mức trải nghiệm thử; thẻ công khai giới hạn thông tin theo đồng thuận."}
];
const extras:Benefit[]=[
{title:"Tập 1-1 với đại sứ",summary:"Tham khảo 1,5 triệu / giờ",image:"Buổi tập riêng",imageSrc:"/images/premium-extras/ambassador-training.png",detail:"Buổi riêng mua thêm, tách biệt một buổi đại sứ trong gói; phụ thuộc lịch đại sứ và báo giá xác nhận."},
{title:"Spa thêm & nâng phòng",summary:"Spa thêm tham khảo 900.000đ",image:"Spa & phòng nghỉ",imageSrc:"/images/premium-extras/spa.png",detail:"Nâng phòng báo giá riêng. Mọi khoản mua thêm chỉ ghi nhận sau khi có phương án và khách chấp thuận."},
{title:"Couple Mode",summary:"Tham khảo 22,9 triệu / người",image:"Hai người nghỉ dưỡng",imageSrc:"/images/premium-extras/couple-mode.png",detail:"Người đi cùng chung phòng, có lịch nghỉ dưỡng riêng; không gồm sân và HLV. Chọn số người đi cùng khi gửi yêu cầu."},
{title:"Trải nghiệm mua thêm",summary:"Xác nhận khả năng cung cấp",image:"Hoạt động ngoài sân",imageSrc:"/images/premium-extras/outdoor-activities.png",detail:"VinWonders/snorkeling theo giá niêm yết; pickleball 400.000đ/buổi; video kỹ thuật 800.000đ; Ace Lab 30 phút kèm video gộp gói 800.000đ; Ace Check theo giá cơ sở y tế; merchandise theo mùa từ G3. Chưa mở đặt các dịch vụ này trên app; cần xác nhận đối tác và báo giá, tránh cộng trùng video với gói Ace Lab."}
];
const personal:Benefit[]=[
{title:"Nhóm chơi & mục tiêu",summary:"NTRP · kỹ thuật · thi đấu · thư giãn",image:"Nhóm tập cùng HLV",imageSrc:"/images/premium-included/court-hours.png",detail:"Đã có tự đánh giá NTRP và điều phối nhóm thủ công. Nhu cầu mục tiêu tập và ngôn ngữ HLV Việt/Anh cần xác nhận trong phương án; chưa có tự động ghép nhóm."},
{title:"Ăn uống phù hợp",summary:"Nhu cầu cá nhân & dị ứng",image:"Chef chuẩn bị thực đơn",imageSrc:"/images/premium-included/ambassador-coach.png",detail:"Trao đổi nhu cầu ăn uống với đội phụ trách trước chuyến. Chưa có hệ thống tự động cá nhân hoá menu theo thể trạng."},
{title:"Đồng hành qua nhiều mùa",summary:"Ace Club & chuyến đi tiếp theo",image:"Cộng đồng Ace Club",imageSrc:"/images/premium-included/ace-cup.png",detail:"Đã có Ace Club thử nghiệm. Quyền lợi Member/Gold/Diamond cần đối chiếu Phụ lục D; gợi ý điểm đến theo lịch sử chưa được tự động hoá."}
];
const groups=[{label:"Trong giá",items:included},{label:"Mua thêm",items:extras},{label:"Cá nhân hoá",items:personal}];
export default function PremiumBenefits(){
 const [group,setGroup]=useState(0),[selected,setSelected]=useState<Benefit|null>(null);
 return <section className="premium-benefits" aria-labelledby="premium-benefits-title">
 <p className="ds-eyebrow">PREMIUM / QUYỀN LỢI CỦA BẠN</p><h2 id="premium-benefits-title">Chơi hết mình. Nghỉ thật sâu.</h2>
 <p>Dịch vụ cụ thể được xác nhận trong phương án trước khi đặt cọc.</p>
 <div className="premium-benefit-tabs" aria-label="Nhóm quyền lợi">{groups.map((g,i)=><button type="button" key={g.label} aria-pressed={group===i} aria-controls="premium-benefit-list" onClick={()=>setGroup(i)}>{g.label}<span>{g.items.length}</span></button>)}</div>
 <p className="premium-swipe-hint">Vuốt ngang để khám phá · Chạm thẻ để xem chi tiết</p>
 <div id="premium-benefit-list" className="premium-benefit-rail" role="region" aria-label={groups[group].label} tabIndex={0} key={group}>{groups[group].items.map(item=><button type="button" className="premium-benefit-card" key={item.title} onClick={()=>setSelected(item)} aria-haspopup="dialog">
 <PhotoSlot label={item.image} src={item.imageSrc}/>
 <span className="premium-benefit-copy"><small>{group===0?"Trong cấu hình gói":group===1?"Tuỳ chọn · báo giá riêng":"Theo hồ sơ & phương án"}</small><strong>{item.title}</strong><span>{item.summary}</span><span className="premium-benefit-more">Xem chi tiết <ArrowUpRight size={16}/></span></span>
 </button>)}</div>
 <p className="ds-caption">{group===0?"Đã liệt kê đủ 9 thành phần bắt buộc. Đối tác, lịch dịch vụ và điều kiện bảo hiểm còn chờ xác nhận theo chuyến.":group===1?"Giá tham khảo từ hồ sơ; chưa tự cộng vào booking.":"Mức độ hỗ trợ khác nhau theo từng nhu cầu; xem chi tiết trước khi gửi yêu cầu."}</p>
 <details className="premium-other-inclusions"><summary>Lưu trú, di chuyển & hỗ trợ đi kèm</summary><VisualStoryDeck label="Dịch vụ đồng hành" items={[
{title:"Nghỉ tại resort",image:"Resort & phòng nghỉ",summary:"3 đêm resort 5 sao · chung phòng",detail:"Loại phòng và resort cụ thể được xác nhận trong phương án theo chuyến."},
{title:"Di chuyển liền mạch",image:"Hành trình bay & xe đón",summary:"Bay SGN–Phú Quốc khứ hồi, xe theo lịch",detail:"Hãng, giờ bay, hành lý và lịch xe cần được xác nhận theo ngày khởi hành."},
{title:"Có người đồng hành",image:"Tour Manager đón khách",summary:"Tour Manager & hoạt động theo chương trình",detail:"Các bữa theo lịch, cooking class, yoga/stretching và Tour Manager theo chương trình. Nhà cung cấp, lịch và phạm vi hỗ trợ được xác nhận trong phương án."}
]}/></details>
 <Modal isOpen={!!selected} onClose={()=>setSelected(null)} title={selected?.title??"Quyền lợi"}>{selected&&<><PhotoSlot label={selected.image} src={selected.imageSrc}/><p className="ds-eyebrow">THÔNG TIN QUYỀN LỢI</p><p>{selected.detail}</p></>}</Modal>
 </section>
}
