"use client";
import {PhotoSlot} from "./VisualStoryDeck";
export default function PremiumCouplePlan(){
 return <section className="premium-couple-plan" aria-label="Giá tham khảo Premium">
  <h2>Đi cùng người thân &amp; bạn bè</h2>
  <p className="premium-couple-total"><strong>29.900.000 đ</strong><span>/ 1 người chơi</span></p>
  <p className="premium-couple-breakdown">Giá tham khảo cho 1 người chơi. Người đi cùng không chơi: 22.900.000đ/người, chung phòng; chưa gồm phụ thu phòng đơn và dịch vụ mua thêm. Giá cuối cùng xác nhận theo lịch khởi hành.</p>
 </section>;
}
export function PremiumDayPlan(){const days=[["Ngày 1","Đánh giá NTRP, clinic","Nghỉ tại resort","Welcome dinner"],["Ngày 2","Drill, đánh đôi","Spa/nghỉ dưỡng theo phương án","Ẩm thực địa phương"],["Ngày 3","Ace Cup","Cooking class, nghỉ tự do; cổ vũ giải","Gala tối"],["Ngày 4","Yoga/stretching nhẹ","Yoga/stretching nhẹ","Brunch và kết thúc chuyến"]];return <><p className="premium-swipe-hint">Vuốt qua 4 ngày · Mỗi người một nhịp, cùng nhau trải nghiệm</p><div className="premium-couple-days">{days.map(([day,player,companion,shared])=><section key={day}><PhotoSlot label={shared}/><div className="couple-day-copy"><h3>{day}</h3><dl><div><dt>Người chơi</dt><dd>{player}</dd></div><div><dt>Người đi cùng</dt><dd>{companion}</dd></div><div><dt>Cùng tham gia</dt><dd>{shared}</dd></div></dl></div></section>)}<small>Lịch dự kiến; thứ tự và dịch vụ cụ thể xác nhận trong phương án.</small></div></>}
