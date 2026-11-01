"use client";
import {useEffect,useState} from "react";
import {usePathname} from "next/navigation";
import Link from "next/link";
import {demoScenarios} from "@/lib/demo-registry";
import {browserStorageKey} from "@/lib/demo-scope";
export default function DemoBanner(){const pathname=usePathname();const [name,setName]=useState("");useEffect(()=>{const signature=()=>document.cookie.split("; ").filter(c=>c.startsWith("tt-scenario=")||c.startsWith("tt-revision-")).sort().join(";");const initial=signature();const check=()=>{if(signature()!==initial)window.location.reload();};const timer=window.setInterval(check,1500);window.addEventListener("focus",check);return()=>{clearInterval(timer);window.removeEventListener("focus",check);};},[]);useEffect(()=>{const id=document.cookie.split("; ").find(c=>c.startsWith("tt-scenario="))?.split("=")[1];const s=demoScenarios.find(s=>s.id===id);setName(s?.name??"");if(s)try{sessionStorage.setItem(browserStorageKey("last-path"),window.location.pathname+window.location.search);}catch{}},[pathname]);return <div className="demo-banner">{name?<span>Demo: {name}</span>:<span>Trải nghiệm ứng dụng</span>}<Link href="/demo">Quản lý kịch bản →</Link></div>;}
