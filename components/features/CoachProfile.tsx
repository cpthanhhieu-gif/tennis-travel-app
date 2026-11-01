import Image from "next/image";
import {Check,UserRound} from "lucide-react";
import {coachProfiles} from "@/lib/coach-profiles";
export default function CoachProfile({packageId}:{packageId:string}){
 const coach=coachProfiles[packageId as keyof typeof coachProfiles];if(!coach)return null;
 return <article className="coach-profile" aria-label={`Hồ sơ HLV mẫu ${coach.name}`}>
  <div className="coach-profile-photo"><Image src={coach.image} alt="Ảnh HLV do bạn cung cấp, dùng minh họa hồ sơ mẫu" fill sizes="(max-width: 767px) 100vw, 280px"/></div>
  <div className="coach-profile-content"><span className="ui-badge">Hồ sơ minh họa</span><p className="coach-profile-role">{coach.role}</p><h3>HLV {coach.name}</h3><p className="coach-profile-experience"><UserRound size={18} aria-hidden="true"/>{coach.experience}</p><p>Nhóm trình độ tham khảo: <strong>{coach.level}</strong></p><ul className="coach-profile-specialties">{coach.specialties.map(s=><li key={s}>{s}</li>)}</ul><p>{coach.approach}</p><details><summary>Vai trò trong chuyến đi</summary><ul className="coach-profile-duties">{coach.duties.map(d=><li key={d}><Check size={18} aria-hidden="true"/><span>{d}</span></li>)}</ul></details><small>Tên, kinh nghiệm và chuyên môn là dữ liệu giả lập. Ảnh do bạn cung cấp; hồ sơ không mô tả danh tính thật của người trong ảnh. HLV theo lịch khởi hành sẽ được xác nhận trong phương án.</small></div>
 </article>;
}
