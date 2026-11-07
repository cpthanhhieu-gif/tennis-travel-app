"use client";
import {useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {ArrowLeft,Heart,Images,Share2,X} from "lucide-react";

export default function TourHeroActions({src,alt}:{src:string;alt:string}){
 const [saved,setSaved]=useState(false),[galleryOpen,setGalleryOpen]=useState(false);
 const share=async()=>{const url=window.location.href;try{if(navigator.share){await navigator.share({title:document.title,url});return;}await navigator.clipboard.writeText(url);}catch{}}
 return <>
  <div className="app-tour-hero-actions">
   <Link href="/" aria-label="Quay về khám phá"><ArrowLeft size={21}/></Link>
   <div><button type="button" aria-label={saved?"Bỏ lưu trải nghiệm":"Lưu trải nghiệm"} aria-pressed={saved} onClick={()=>setSaved(value=>!value)}><Heart size={20} fill={saved?"currentColor":"none"}/></button><button type="button" aria-label="Chia sẻ trải nghiệm" onClick={()=>void share()}><Share2 size={20}/></button></div>
  </div>
  <button className="app-tour-gallery-button" type="button" onClick={()=>setGalleryOpen(true)}><Images size={16}/> Thư viện ảnh</button>
  {galleryOpen&&<div className="app-tour-gallery" role="dialog" aria-modal="true" aria-label="Thư viện ảnh" onClick={()=>setGalleryOpen(false)}><button type="button" aria-label="Đóng thư viện ảnh" onClick={()=>setGalleryOpen(false)}><X size={22}/></button><Image src={src} alt={alt} fill sizes="100vw" onClick={event=>event.stopPropagation()}/></div>}
 </>;
}
