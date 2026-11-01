"use client";
import {useState,type ReactNode} from "react";
import SectionTabs from "./SectionTabs";
export default function TourDetailTabs({overview,dates,conditions}:{overview:ReactNode;dates:ReactNode;conditions:ReactNode}){
 const [tab,setTab]=useState("overview");
 return <SectionTabs label="Thông tin tour" value={tab} onChange={setTab} items={[{id:"overview",label:"Tổng quan",content:overview},{id:"dates",label:"Lịch khởi hành",content:dates},{id:"conditions",label:"Điều kiện",content:conditions}]}/>;
}
