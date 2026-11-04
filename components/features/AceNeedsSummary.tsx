"use client";
import {useId,useState} from "react";
import type {AcePreferences} from "@/lib/ace-conversation";
import {compactAceNeeds,type AceQuickEdit} from "@/lib/ace-quick-edit";
type Field=AceQuickEdit["field"];
const labels:Record<Field,string>={party:"Đổi số khách",goal:"Đổi mục tiêu",budget:"Đổi ngân sách",diet:"Đổi ăn uống"};
export default function AceNeedsSummary({preferences:p,busy,onSave,onEditGroup}:{preferences:AcePreferences;busy:boolean;onSave:(edit:AceQuickEdit)=>void;onEditGroup:()=>void}){
 const id=useId();const [editing,setEditing]=useState<Field|null>(null),[error,setError]=useState("");
 const [total,setTotal]=useState(""),[companions,setCompanions]=useState(""),[goal,setGoal]=useState<NonNullable<AcePreferences["goal"]>>("learn"),[amount,setAmount]=useState(""),[flexible,setFlexible]=useState(false),[diet,setDiet]=useState(""),[dietCount,setDietCount]=useState("");
 const known=!!(p.numPeople!==undefined||p.goal||p.budget||p.budgetFlexible||p.diet||p.groupNeeds);
 if(!known)return null;
 function open(field:Field){setEditing(field);setError("");setTotal(p.numPeople?.toString()??"");setCompanions(p.numCompanions?.toString()??"");setGoal(p.goal??"learn");setAmount(p.budget?.toString()??"");setFlexible(p.budgetFlexible===true);setDiet(p.diet??"");setDietCount(p.dietCount?.toString()??"");}
 function save(){try{let edit:AceQuickEdit;
  if(editing==="party"){if(!total||!companions)throw Error("Nhập tổng số khách và số người đi cùng (có thể là 0).");edit={field:"party",total:Number(total),companions:Number(companions)};}
  else if(editing==="goal")edit={field:"goal",goal};
  else if(editing==="budget")edit={field:"budget",amount:amount?Number(amount):undefined,flexible};
  else if(editing==="diet")edit={field:"diet",text:diet,count:dietCount?Number(dietCount):undefined};
  else return;
  onSave(edit);setEditing(null);setError("");
 }catch(e){setError(e instanceof Error?e.message:"Chưa cập nhật được nhu cầu.");}}
 const budget=p.budgetFlexible?"Linh hoạt":p.budget?`${p.budget.toLocaleString("vi-VN")} đ/người`:"Chưa xác định";
 return <section className="ace-needs-summary" aria-label="Nhu cầu của bạn"><details open><summary><strong>Nhu cầu của bạn</strong><span>{compactAceNeeds(p)||"Đã ghi nhận một phần nhu cầu"}</span><small>Ngân sách: {budget}</small>{p.diet&&<small>Ăn uống: {p.dietCount?`${p.dietCount} người · `:""}{p.diet}</small>}<small className="ace-needs-expand">Xem & sửa nhanh</small></summary>
 {!editing?<div className="ace-needs-actions">{p.groupNeeds?<><button type="button" disabled={busy} onClick={onEditGroup}>Sửa quy mô, mục tiêu & ăn uống</button><button type="button" disabled={busy} onClick={()=>open("budget")}>Đổi ngân sách</button></>:Object.entries(labels).map(([field,label])=><button type="button" key={field} disabled={busy} onClick={()=>open(field as Field)}>{label}</button>)}</div>:<form aria-label={labels[editing]} onSubmit={e=>{e.preventDefault();save();}}><fieldset disabled={busy}><legend>{labels[editing]}</legend>
 {editing==="party"&&<><label htmlFor={`${id}-total`}>Tổng số khách<input id={`${id}-total`} type="number" required min={1} max={20} value={total} onChange={e=>setTotal(e.target.value)}/></label><label htmlFor={`${id}-companions`}>Người đi cùng không chơi tennis<input id={`${id}-companions`} type="number" required min={0} max={Math.max(0,Number(total)-1)} value={companions} onChange={e=>setCompanions(e.target.value)}/></label><p>Người đi cùng nằm trong tổng số khách. Cần ít nhất 1 người chơi.</p></>}
 {editing==="goal"&&<label htmlFor={`${id}-goal`}>Ưu tiên chính<select id={`${id}-goal`} value={goal} onChange={e=>setGoal(e.target.value as typeof goal)}><option value="learn">Học kỹ thuật</option><option value="compete">Thi đấu & giao lưu</option><option value="relax">Nghỉ dưỡng & kết nối</option></select></label>}
 {editing==="budget"&&<><label className="ace-needs-check"><input type="checkbox" checked={flexible} onChange={e=>setFlexible(e.target.checked)}/>Ngân sách linh hoạt</label><label htmlFor={`${id}-budget`}>Tối đa mỗi người (đ)<input id={`${id}-budget`} type="number" inputMode="numeric" disabled={flexible} required={!flexible} min={100000} max={1e10} step={1} value={amount} onChange={e=>setAmount(e.target.value)}/></label><p>Ví dụ: 15000000 là 15 triệu đồng/người.</p></>}
 {editing==="diet"&&<><label htmlFor={`${id}-diet`}>Yêu cầu và người áp dụng<textarea id={`${id}-diet`} maxLength={500} required value={diet} onChange={e=>setDiet(e.target.value)} placeholder="Ví dụ: Vợ ăn chay, mình dị ứng tôm"/></label><button type="button" onClick={()=>{setDiet("Không có yêu cầu đặc biệt");setDietCount("");}}>Không có yêu cầu đặc biệt</button><label htmlFor={`${id}-diet-count`}>Số người có yêu cầu này (tùy chọn)<input id={`${id}-diet-count`} type="number" disabled={p.numPeople===undefined||diet.trim()==="Không có yêu cầu đặc biệt"} min={1} max={p.numPeople??20} value={dietCount} onChange={e=>setDietCount(e.target.value)}/></label><p>Để trống nếu chưa rõ hoặc mỗi người có yêu cầu khác nhau. Thực đơn cần đơn vị tổ chức xác nhận.</p></>}
 {error&&<p role="alert">{error}</p>}<div className="ace-needs-actions"><button type="submit">Cập nhật gợi ý</button><button type="button" onClick={()=>{setEditing(null);setError("");}}>Hủy sửa</button></div></fieldset></form>}
 </details></section>;
}
