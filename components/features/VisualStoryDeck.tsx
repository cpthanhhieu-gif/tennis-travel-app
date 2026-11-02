"use client";
import {useState} from "react";
import {ImageIcon,ArrowUpRight} from "lucide-react";
import Modal from "@/components/ui/Modal";
export type VisualStory={title:string;image:string;summary:string;detail:string};
export function PhotoSlot({label}:{label:string}){return <span className="premium-image-slot"><span className="premium-shape-circle"/><span className="premium-shape-court"/><ImageIcon size={28} aria-hidden="true"/><span>{label}</span><small>Ảnh minh hoạ sẽ bổ sung</small></span>}
export default function VisualStoryDeck({items,label}:{items:VisualStory[];label:string}){
 const [selected,setSelected]=useState<VisualStory|null>(null);
 return <div className="visual-story-deck"><p className="premium-swipe-hint">Vuốt xem thêm · Chạm để xem chi tiết</p><div className="premium-benefit-rail" role="region" aria-label={label} tabIndex={0}>{items.map(item=><button className="premium-benefit-card" type="button" key={item.title} onClick={()=>setSelected(item)} aria-haspopup="dialog"><PhotoSlot label={item.image}/><span className="premium-benefit-copy"><strong>{item.title}</strong><span>{item.summary}</span><span className="premium-benefit-more">Xem chi tiết <ArrowUpRight size={16}/></span></span></button>)}</div><Modal isOpen={!!selected} onClose={()=>setSelected(null)} title={selected?.title}>{selected&&<><PhotoSlot label={selected.image}/><p>{selected.detail}</p></>}</Modal></div>
}
