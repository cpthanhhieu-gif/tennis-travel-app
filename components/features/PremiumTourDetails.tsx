"use client";
import ResponsiveDetail from "@/components/ui/ResponsiveDetail";
import PremiumValueDetails from "./PremiumValueDetails";
import {CalendarDays,Utensils,Users,ListChecks,ShieldCheck} from "lucide-react";
import InfoPanel from "@/components/ui/InfoPanel";
import { tours } from "@/lib/mock-data";
import { tripItinerary } from "@/lib/trip-itinerary";

export default function PremiumTourDetails() {
  const tour = tours.find(t => t.packageId === "sbu3")!;
  const days = tripItinerary({ tourId: tour.id, departureCode: tour.departureSchedules[0].code });
  return <div className="premium-details"><PremiumValueDetails/>
    <ResponsiveDetail title="Chương trình Premium 4N3D" description="Giờ sân, Ace Cup, ẩm thực & phục hồi"><section className="ds-section" aria-labelledby="premium-program">
      <p className="ds-eyebrow">4 NGÀY 3 ĐÊM / PHÚ QUỐC</p>
      <h2 id="premium-program">Một nhịp chơi, nghỉ và thưởng vị.</h2>
      <p>Lịch dự kiến theo hồ sơ sản phẩm. Giờ bay, thời tiết, sân và HLV có thể làm thay đổi thứ tự hoạt động; phương án theo ngày khởi hành sẽ được gửi để bạn xem và chấp thuận.</p>
      <ul className="premium-facts">
        <li><strong>3 buổi sân · 6,5 giờ</strong><span>Clinic theo nhóm 2 giờ, drill và đánh đôi 2,5 giờ, mini Pro-Am 2 giờ.</span></li>
        <li><strong>1 giờ đánh giá NTRP</strong><span>Đánh giá thực địa và ghép nhóm; không phải gói huấn luyện riêng 1-1.</span></li>
        <li><strong>Ace Cup · ngày 3</strong><span>Vòng bảng 3 giờ; bán kết, chung kết và trao giải 1,5 giờ. Tách khỏi ba buổi sân.</span></li>
        <li><strong>5 bữa FEI · spa 60 phút</strong><span>Kết hợp ẩm thực bản địa, nghỉ phục hồi và yoga/stretching ngày cuối.</span></li>
      </ul>
      <InfoPanel icon={<CalendarDays size={22}/>} title="Lịch trình 4 ngày" description="Xem giờ chơi, bữa ăn và thời gian nghỉ từng ngày">      <div className="premium-days">{days.map(day => <details key={day.day} open={day.day === 1}>
        <summary>Ngày {day.day} · {day.title}</summary>
        <ol className="premium-activities">{day.activities.map(a => <li key={a.id}>
          <time>{a.time}</time><div><strong>{a.title}</strong><p>{a.location}{a.optional ? " · Tùy chọn, báo giá riêng trước khi đăng ký." : " · Dự kiến trong chương trình."}</p></div>
        </li>)}</ol>
      </details>)}</div>
</InfoPanel>
      <p className="ds-caption">Thời lượng trên là khung chương trình, có thể điều chỉnh vì an toàn hoặc điều kiện vận hành. Tên HLV/đại sứ, đối tác và giờ sân được xác nhận trong phương án chuyến đi.</p>
    </section></ResponsiveDetail>
    <InfoPanel icon={<Utensils size={22}/>} title="Năm bữa FEI" description="Hương vị địa phương, thực đơn và nhịp phục hồi">    <section className="ds-section" aria-labelledby="premium-food">
      <h2 id="premium-food">Năm bữa FEI có gì?</h2>
      <p>Thực đơn dự kiến theo nhịp vận động. Món ăn và lựa chọn theo nhu cầu ăn uống được thống nhất trước chuyến; FEI là khung đánh giá trải nghiệm, chưa phải điểm chất lượng đã đạt.</p>
      <ol className="premium-list">
        <li><strong>Ngày 1 · Trưa — FEI #1:</strong> hải sản Hàm Ninh và câu chuyện nguyên liệu đảo.</li>
        <li><strong>Ngày 1 · Tối — FEI #2:</strong> welcome dinner, nước mắm và tiêu Phú Quốc.</li>
        <li><strong>Ngày 2 · Trưa — FEI #3:</strong> bữa ăn cân bằng sau buổi tập.</li>
        <li><strong>Ngày 2 · Tối — FEI #4:</strong> trải nghiệm chợ đêm cùng chef và hải sản địa phương; có phương án trong resort khi thời tiết không phù hợp.</li>
        <li><strong>Ngày 3 · Tối — FEI #5:</strong> gala private dining hoàng hôn với thực đơn cá nhân hóa.</li>
      </ol>
      <p>Bữa sáng, brunch và thành phẩm cooking class là các bữa khác trong lịch, không tính thêm vào năm bữa FEI.</p>
    </section></InfoPanel>
    <InfoPanel icon={<Users size={22}/>} title="Người đi cùng không chơi" description="Lịch nghỉ dưỡng và giá Couple Mode">    <section className="ds-section" aria-labelledby="premium-companion">
      <h2 id="premium-companion">Đi cùng người không chơi tennis</h2>
      <p>Couple Mode dự kiến dành cho người đi cùng chung phòng: nghỉ dưỡng, spa, ẩm thực và tham quan theo phương án; không bao gồm sân và HLV.</p>
      <ul className="premium-list">
        <li><strong>Ngày 1:</strong> nghỉ tại resort trong giờ đánh giá/tập; cùng tham gia welcome dinner.</li>
        <li><strong>Ngày 2:</strong> spa và nghỉ dưỡng; có thể yêu cầu tham quan trong giờ tự do. VinWonders, snorkeling và hoạt động mua thêm được báo giá riêng.</li>
        <li><strong>Ngày 3:</strong> cooking class, nghỉ tự do và gala; có thể cổ vũ Ace Cup.</li>
        <li><strong>Ngày 4:</strong> yoga/stretching nhẹ và cùng đoàn kết thúc chuyến.</li>
      </ul>
      <p>Giá tham khảo trong hồ sơ: <strong>22,9 triệu đồng/người đi cùng</strong>, chung phòng. Chọn số người chơi và người đi cùng ở bước đặt tour để xem tổng dự kiến. Lịch hoạt động, phòng ở và phụ thu được xác nhận trong phương án chuyến đi.</p>
    </section></InfoPanel>
    <InfoPanel icon={<ListChecks size={22}/>} title="Giá gồm gì?" description="Quyền lợi bao gồm và các khoản tính riêng">    <section className="ds-section" aria-labelledby="premium-inclusions">
      <h2 id="premium-inclusions">Giá gồm gì, khoản nào tính riêng?</h2>
      <p>Quyền lợi dưới đây là cấu hình dự kiến của gói người chơi, cần đối chiếu với phương án và báo giá của chuyến bạn chọn.</p>
      <div className="premium-columns"><div><h3>Dự kiến bao gồm</h3><ul className="premium-list">
        <li>Chặng bay SGN–Phú Quốc khứ hồi và xe theo chương trình; hãng, giờ bay và điều kiện hành lý xác nhận theo chuyến.</li>
        <li>3 đêm resort 5 sao, phòng Deluxe/garden view, ở ghép đôi/twin; resort cụ thể chờ xác nhận.</li>
        <li>Đánh giá NTRP, ba buổi sân theo nhóm, Ace Cup theo chương trình, recovery kit và Tennis Passport.</li>
        <li>Năm bữa FEI và các bữa theo lịch, cooking class, spa recovery 60 phút, yoga/stretching.</li>
        <li>Tour Manager hỗ trợ theo chương trình.</li>
      </ul></div><div><h3>Không gồm trong giá cơ bản</h3><ul className="premium-list">
        <li>Buổi 1-1 với đại sứ: dự kiến 1,5 triệu đồng/giờ, tùy lịch xác nhận.</li>
        <li>Spa thêm: dự kiến 900.000đ; ảnh chuyên nghiệp cả giải: dự kiến 500.000đ/khách.</li>
        <li>VinWonders, snorkeling và các hoạt động tham quan tùy chọn: báo giá riêng.</li>
        <li>Nâng hạng phòng, phòng đơn, phụ thu xuất phát Hà Nội/cao điểm và hành lý thể thao phát sinh: xác nhận trong báo giá.</li>
        <li>Chi tiêu cá nhân và dịch vụ ngoài phương án đã chấp thuận.</li>
      </ul></div></div>
      <p className="ds-caption">Giá tùy chọn là mức tham khảo từ hồ sơ v2.12, chưa phải báo giá còn hiệu lực. Không tự cộng vào tổng booking.</p>
    </section></InfoPanel>
    <InfoPanel icon={<ShieldCheck size={22}/>} title="Xác nhận dịch vụ" description="Đối tác, phương án và điều kiện trước khi cọc">    <section className="ds-section" aria-labelledby="premium-confirmation">
      <h2 id="premium-confirmation">Dịch vụ được xác nhận như thế nào?</h2>
      <p><strong>Hiện trạng: chương trình dự kiến.</strong> Chưa có xác nhận nhà cung cấp được công bố trên trang này.</p>
      <ul className="premium-list">
        <li><strong>Chờ xác nhận theo chuyến:</strong> resort và loại phòng, chuyến bay, khung giờ sân, tên HLV, thực đơn và các hoạt động mua thêm.</li>
        <li><strong>Phụ thuộc hợp tác:</strong> đại sứ/Pro-Am, bảo trợ VTF, MyLeague và điểm xếp hạng chỉ được cung cấp khi có thỏa thuận và khả năng tích hợp tương ứng. Chưa cam kết huấn luyện 1-1 với HLV quốc tế hoặc chef nổi tiếng.</li>
        <li><strong>Trước khi đặt cọc:</strong> nhận phương án cho ngày đã chọn, kiểm tra quyền lợi, dịch vụ thay thế và tổng giá; chấp thuận phương án rồi tiếp tục thanh toán. Yêu cầu Premium được phản hồi trong tối đa 24 giờ.</li>
      </ul>
    </section></InfoPanel>
  </div>;
}
