"use client";
import { useId, type ReactNode } from "react";
import { CheckCircle2, Info, AlertTriangle, CircleAlert, Minus, Plus } from "lucide-react";

export function Notice({tone="info",children}:{tone?:"info"|"success"|"warning"|"error";children:ReactNode}) {
  const Icon={info:Info,success:CheckCircle2,warning:AlertTriangle,error:CircleAlert}[tone];
  return <div className={`vt-alert vt-alert-${tone}`} role={tone==="error"?"alert":"status"}><Icon size={20} aria-hidden="true"/><div>{children}</div></div>;
}
export function Toggle({checked,onChange,label,disabled=false}:{checked:boolean;onChange:(v:boolean)=>void;label:string;disabled?:boolean}) {
  return <button type="button" className="vt-switch" role="switch" aria-checked={checked} disabled={disabled} onClick={()=>onChange(!checked)}><span className="vt-switch-track" aria-hidden="true"/>{label}</button>;
}
export function NumberStepper({value,onChange,label,min=0,max=10,disabled=false}:{value:number;onChange:(v:number)=>void;label:string;min?:number;max?:number;disabled?:boolean}) {
  const id=useId();
  return <div className="vt-stepper" role="group" aria-label={label}><button type="button" disabled={disabled||value<=min} aria-label={`Giảm ${label}`} aria-controls={id} onClick={()=>onChange(Math.max(min,value-1))}><Minus size={20}/></button><output id={id} aria-live="polite" aria-label={label}>{value}</output><button type="button" disabled={disabled||value>=max} aria-label={`Tăng ${label}`} aria-controls={id} onClick={()=>onChange(Math.min(max,value+1))}><Plus size={20}/></button></div>;
}
