"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {tourPackages,tours,formatVND} from "@/lib/mock-data";
import {packageBenefits,tripItinerary} from "@/lib/trip-itinerary";
import {assessAcePackage} from "@/lib/ace-recommendation";
import type {AcePreferences} from "@/lib/ace-conversation";
import type {AceSelection} from "@/lib/ace-session";
export default function ProductCard({ packageId, onNavigate, preferences, selection, onChoose, entryId }: { entryId: string; packageId: string; onNavigate: () => void; preferences?: AcePreferences; selection?: AceSelection; onChoose: (selection: AceSelection) => void }) {
  const p = tourPackages.find(item => item.id === packageId)!;
  const tour = tours.find(item => item.packageId === packageId)!;
  const [departureCode, setDepartureCode] = useState(selection?.packageId === packageId ? selection.departureCode : tour.departureSchedules[0]?.code ?? "");
  useEffect(() => { if (selection?.packageId === packageId) setDepartureCode(selection.departureCode); }, [selection, packageId]);
  const remember = () => onChoose({ packageId, departureCode });
  const departure = tour.departureSchedules.find(item => item.code === departureCode);
  const days = departure ? tripItinerary({ tourId: tour.id, departureCode }) : [];
  const assessment=preferences?assessAcePackage(preferences,p.id,departure?.code):undefined;
  const action = p.id === "sbu2" ? "Báo giá đoàn" : p.id === "sbu3" ? "Gửi yêu cầu" : "Chọn gói";
  const blocked=assessment&&!assessment.eligible;
  const importantGap=assessment?.gaps.find(item=>/Gói thiên về|ngoài khoảng tham khảo|người mới chơi/.test(item));
  const dietaryPending=preferences?.diet&&preferences.diet!=="Không có yêu cầu đặc biệt";
  return <article className="ace-product-card" aria-label={p.name}>
    <p className="ace-product-meta">{tour.destinationName} · {tour.duration}</p>
    <h3>{p.name}</h3>
    <p className="ace-product-price">{formatVND(departure?.price??p.priceRange.min)} <small>/ người chơi</small></p>
    <p className="ace-product-benefits">{packageBenefits[p.id as keyof typeof packageBenefits]}</p>
    {blocked&&<p className="ace-product-alert" role="status">{assessment.gaps.find(item=>/khách|quy mô|lịch|Cơ cấu/.test(item))??"Cần xác nhận điều kiện trước khi đăng ký."}</p>}
    {assessment&&!assessment.affordable&&<p className="ace-product-alert">Lịch này vượt ngân sách đã ghi nhận.</p>}
    {importantGap&&<p className="ace-product-caution">{importantGap}</p>}
    {dietaryPending&&<p className="ace-product-caution">Yêu cầu ăn uống cần đơn vị tổ chức xác nhận.</p>}
    {tour.departureSchedules.length>0?<label className="ace-product-date">Lịch khởi hành<select aria-label={`Lịch khởi hành ${p.name}`} value={departureCode} onChange={e=>{setDepartureCode(e.target.value);onChoose({packageId,departureCode:e.target.value});}}>{tour.departureSchedules.map(d=><option key={d.code} value={d.code}>{d.dateLabel} · {formatVND(d.price)}</option>)}</select></label>:<p>Chưa có lịch khởi hành.</p>}
    <div className="ace-product-actions"><Link className="ace-product-detail-link" onClick={()=>{remember();onNavigate();}} href={`/tours/${p.id}?from=ace&consultation=${encodeURIComponent(entryId)}`}>Chi tiết tour</Link>{!blocked&&departure&&<Link className="ace-product-primary" onClick={()=>{remember();onNavigate();}} href={`/booking?package=${p.id}&departure=${encodeURIComponent(departure.code)}&from=ace&consultation=${encodeURIComponent(entryId)}`}>{action} ↗</Link>}</div>
    <details className="ace-product-more"><summary>Vì sao phù hợp & quyền lợi</summary><p>{p.tagline} · {tour.ntrpLabel}</p>{assessment&&<><h4>Điểm phù hợp</h4><ul>{assessment.met.map((item,i)=><li key={i}>{item}</li>)}</ul><h4>Chưa đáp ứng / cần xác nhận</h4><ul>{assessment.gaps.map((item,i)=><li key={i}>{item}</li>)}</ul>{assessment.estimatedTotal!==undefined&&<p>Tổng giá cơ bản tham khảo: {formatVND(assessment.estimatedTotal)}; chưa gồm phụ thu/dịch vụ bổ sung.</p>}</>}{preferences?.diet&&<p>Ăn uống đã ghi nhận: {preferences.diet}</p>}<h4>Quyền lợi của gói</h4><ul>{p.highlights.map(item=><li key={item}>{item}</li>)}</ul>{days.length>0&&<details><summary>Lịch trình theo ngày</summary>{days.map(day=><section key={day.day}><h4>Ngày {day.day} · {day.title}</h4><ul>{day.activities.map(a=><li key={a.id}>{a.time} · {a.title}{a.optional?" (tùy chọn)":""}</li>)}</ul></section>)}</details>}</details>
  </article>;
}
