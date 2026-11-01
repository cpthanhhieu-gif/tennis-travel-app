"use client";
import {useEffect,useState,type ReactNode} from "react";
import InfoPanel from "./InfoPanel";
export default function ResponsiveDetail({title,description,children}:{title:string;description:string;children:ReactNode}){const [mobile,setMobile]=useState(false);useEffect(()=>{const q=window.matchMedia('(max-width: 767px)');const sync=()=>setMobile(q.matches);sync();q.addEventListener('change',sync);return()=>q.removeEventListener('change',sync);},[]);return mobile?<InfoPanel title={title} description={description}>{children}</InfoPanel>:<>{children}</>}
