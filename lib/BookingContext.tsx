"use client";
import {type GroupRequest,type GroupQuote,validGroupRequest} from "@/lib/group-request";

import type {PremiumRequest} from "@/lib/premium-request";

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import {browserStorageKey} from "./demo-scope";
import {coupleTotal} from "./couple-pricing";
import { getNtrpLevel, tours } from "@/lib/mock-data";

export interface BookingState {
  submissionKey?: string;
  referralToken?: string;
  tourId: string;          // ví dụ "dn-sbu1"
  packageId: string;
  destination: string;
  departureDate: string;
  departureCode: string;   // mã chuyến Vietravel, ví dụ FESGN567-010-130626XE-H
  numPeople: number;
  numCompanions: number;
  ntrpLevel: number;
  ntrpLabel: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  groupRequest?:GroupRequest; groupQuote?:GroupQuote; groupPlanToken?:string; groupAdviceRequested?:boolean; premiumRequest?:PremiumRequest; offerRevision?:{reason:string;at:string};
  totalPrice: number;
}

export interface NtrpQuizState {
  answers: Record<number, number>;
  showResult: boolean;
  ntrpResult: ReturnType<typeof getNtrpLevel> | null;
  originalPackageId: string;
  packageDecision: boolean | null;
}

interface BookingContextType {
  booking: BookingState;
  step:number;
  setStep:(step:number)=>void;
  restoredDraft:boolean;
  clearDraft:()=>void;
  updateBooking: (updates: Partial<BookingState>) => void;
  resetBooking: () => void;
  ntrpQuizState: NtrpQuizState;
  updateNtrpQuizState: (updates: Partial<NtrpQuizState>) => void;
}

const defaultBooking: BookingState = {
  tourId: "dl-sbu1",
  packageId: "sbu1",
  destination: "dalat",
  departureDate: "2027-04-24",
  departureCode: "VTR-SIG-TNS-01-DL2-240427",
  numPeople: 2,
  numCompanions: 0,
  ntrpLevel: 0,
  ntrpLabel: "",
  name: "",
  phone: "",
  email: "",
  notes: "",
  totalPrice: 13800000,
};

const defaultNtrpQuizState: NtrpQuizState = {
  answers: {},
  showResult: false,
  ntrpResult: null,
  originalPackageId: "",
  packageDecision: null,
};

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [booking, setBooking] = useState<BookingState>(defaultBooking);
  const [ntrpQuizState, setNtrpQuizState] = useState<NtrpQuizState>(defaultNtrpQuizState);

  const [step,setStep]=useState(1),[hydrated,setHydrated]=useState(false),[restoredDraft,setRestoredDraft]=useState(false);
  const draftKey=useRef("");
  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    draftKey.current=browserStorageKey(`tennis-booking-draft-v1:${params.get("package")??"all"}:${params.get("destination")??"all"}:${params.get("ref")??"direct"}`);
    setBooking(prev=>({...prev,referralToken:params.get("ref")??""}));
    try{const raw=sessionStorage.getItem(draftKey.current);
    if(!raw&&browserStorageKey("scope").startsWith("demo:personal:")){setBooking(prev=>({...prev,numPeople:1,numCompanions:0}));}
    if(!raw&&browserStorageKey("scope").startsWith("demo:couple:")){
      const tour=tours.find(t=>t.packageId==="sbu3")!;const d=tour.departureSchedules[0];
      setBooking(prev=>({...prev,tourId:tour.id,packageId:tour.packageId,destination:tour.destinationId,departureCode:d.code,departureDate:d.date,numPeople:2,numCompanions:1,totalPrice:coupleTotal(tour.packageId,d.price,2,1)}));
    }
    if(raw){const saved=JSON.parse(raw);const t=tours.find(t=>t.id===saved.booking?.tourId);const schedule=t?.departureSchedules.find(d=>d.code===saved.booking?.departureCode);
      if(saved.version===1&&t&&schedule&&Number.isInteger(saved.booking.numPeople)&&saved.booking.numPeople>=1&&saved.booking.numPeople<=20){
        setBooking({...defaultBooking,...saved.booking,notes:"",tourId:t.id,packageId:t.packageId,destination:t.destinationId,departureCode:schedule.code,departureDate:schedule.date,numCompanions:Number.isInteger(saved.booking.numCompanions)&&saved.booking.numCompanions>=0&&saved.booking.numCompanions<saved.booking.numPeople?saved.booking.numCompanions:0,totalPrice:coupleTotal(t.packageId,schedule.price,saved.booking.numPeople,Number.isInteger(saved.booking.numCompanions)&&saved.booking.numCompanions>=0&&saved.booking.numCompanions<saved.booking.numPeople?saved.booking.numCompanions:0)});
        if(saved.quiz?.answers&&typeof saved.quiz.answers==="object")setNtrpQuizState({...defaultNtrpQuizState,...saved.quiz});
        if(Number.isInteger(saved.step)&&saved.step>=1&&saved.step<=4)setStep(t.packageId==="sbu2"&&saved.step===2?3:saved.step);
        setRestoredDraft(true);
      }
    }}catch{/* A malformed or unavailable draft does not block booking. */}setHydrated(true);
  },[]);
  useEffect(()=>{if(!hydrated)return;try{const {notes,...safeBooking}=booking;sessionStorage.setItem(draftKey.current,JSON.stringify({version:1,booking:safeBooking,quiz:ntrpQuizState,step}));}catch{/* Booking remains usable if storage is unavailable. */}},[booking,ntrpQuizState,step,hydrated]);
  const updateBooking=useCallback((updates:Partial<BookingState>)=>{
    setBooking(prev=>{const changed=Object.entries(updates).some(([k,v])=>prev[k as keyof BookingState]!==v);if(!changed)return prev;const realChange=Object.keys(updates).some(k=>k!=="submissionKey"&&prev[k as keyof BookingState]!==updates[k as keyof BookingState]);return {...prev,...updates,...(realChange?{submissionKey:""}:{})};});
  },[]);
  const updateNtrpQuizState=useCallback((updates:Partial<NtrpQuizState>)=>setNtrpQuizState(prev=>({...prev,...updates})),[]);
  const clearDraft=useCallback(()=>{try{sessionStorage.removeItem(draftKey.current);}catch{}},[]);
  const resetBooking=()=>{clearDraft();setBooking(defaultBooking);setNtrpQuizState(defaultNtrpQuizState);setStep(1);};
  if(!hydrated)return <p role="status">Đang chuẩn bị thông tin đặt gói…</p>;

  return (
    <BookingContext.Provider value={{ booking, updateBooking, resetBooking, ntrpQuizState, updateNtrpQuizState,step,setStep,restoredDraft,clearDraft }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking(): BookingContextType {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
