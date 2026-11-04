"use client";
import {type GroupRequest,type GroupQuote,validGroupRequest} from "@/lib/group-request";

import type {PremiumRequest} from "@/lib/premium-request";

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";
import {browserScenario} from "./demo-experience";
import {readAceSession} from "./ace-session";
import {consultationSignature} from "./ace-booking";
import {initializeBooking,bookingDraftName} from "./booking-initialization";
import type {BookingSource} from "./booking-entry";
import {browserStorageKey,browserExploring} from "./demo-scope";
import {coupleTotal} from "./couple-pricing";
import { getNtrpLevel, tours } from "@/lib/mock-data";

import type {BookingParticipant} from "./booking-participants";
export interface BookingState {
  participants?:BookingParticipant[];
  contactParticipates?:boolean;
  submissionKey?: string;
  entrySource?: BookingSource;
  originScenario?: string;
  groupRequestEdited?: boolean;
  referralToken?: string;
  tourId: string;          // ví dụ "dn-sbu1"
  packageId: string;
  destination: string;
  departureDate: string;
  departureCode: string;   // mã chuyến Vietravel, ví dụ FESGN567-010-130626XE-H
  numPeople: number;
  numCompanions: number;
  ntrpDeferred?: boolean;
  ntrpLevel: number;
  ntrpLabel: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  aceConsultation?: { signature: string; summary: string };
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
  const [draftConflict,setDraftConflict]=useState<ReturnType<typeof initializeBooking>["draftConflict"]>();
  const draftKey=useRef("");
  const [storageVersion,setStorageVersion]=useState(0);
  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    draftKey.current=browserStorageKey(bookingDraftName(params));
    let raw:string|null=null;try{
      raw=sessionStorage.getItem(draftKey.current);
      if(!raw){const legacy=sessionStorage.getItem(browserStorageKey(`tennis-booking-draft-v1:${params.get("package")??"all"}:${params.get("destination")??"all"}:${params.get("ref")??"direct"}`));if(params.get("from")!=="ace")raw=legacy;else{const prior=JSON.parse(legacy??"null"),session=readAceSession();if(session&&prior?.booking?.aceConsultation?.signature===consultationSignature(session.state.preferences))raw=legacy;}}
    }catch{}
    const initialized=initializeBooking(params,browserExploring(),browserScenario(),defaultBooking,raw);
    setDraftConflict(initialized.draftConflict);
    setBooking(initialized.booking);setStep(initialized.step);setRestoredDraft(initialized.restored);
    if(initialized.quiz)setNtrpQuizState({...defaultNtrpQuizState,...initialized.quiz});
    setHydrated(true);
    const rekey=()=>setStorageVersion(v=>v+1);window.addEventListener("demo:mode",rekey);
    return()=>window.removeEventListener("demo:mode",rekey);
  },[]);
  useEffect(()=>{if(!hydrated||draftConflict)return;try{draftKey.current=browserStorageKey(bookingDraftName(new URLSearchParams(window.location.search)));sessionStorage.setItem(draftKey.current,JSON.stringify({version:1,booking,quiz:ntrpQuizState,step}));}catch{}},[booking,ntrpQuizState,step,hydrated,storageVersion,draftConflict]);
  const updateBooking=useCallback((updates:Partial<BookingState>)=>{
    setBooking(prev=>{const changed=Object.entries(updates).some(([k,v])=>prev[k as keyof BookingState]!==v);if(!changed)return prev;const realChange=Object.keys(updates).some(k=>k!=="submissionKey"&&prev[k as keyof BookingState]!==updates[k as keyof BookingState]);return {...prev,...updates,...(realChange?{submissionKey:""}:{})};});
  },[]);
  const updateNtrpQuizState=useCallback((updates:Partial<NtrpQuizState>)=>setNtrpQuizState(prev=>({...prev,...updates})),[]);
  const clearDraft=useCallback(()=>{try{sessionStorage.removeItem(draftKey.current);}catch{}},[]);
  const resetBooking=()=>{clearDraft();setBooking(defaultBooking);setNtrpQuizState(defaultNtrpQuizState);setStep(1);};
  if(!hydrated)return <p role="status">Đang chuẩn bị thông tin đặt gói…</p>;

  if(draftConflict)return <section className="ds-container ds-booking ds-quality" role="region" aria-label="Chọn lịch đặt chuyến"><h1>Bạn muốn tiếp tục lịch nào?</h1><p>Bản nháp đang đặt lịch {draftConflict.savedDate}. Bạn vừa chọn lịch {draftConflict.requestedDate}.</p><button className="ds-cta" onClick={()=>setDraftConflict(undefined)}>Tiếp tục bản nháp · {draftConflict.savedDate}</button><button className="ds-link" onClick={()=>{try{const previous=sessionStorage.getItem(draftKey.current);if(previous)sessionStorage.setItem(`${draftKey.current}:archive:${Date.now()}`,previous);}catch{}const fresh=initializeBooking(new URLSearchParams(window.location.search),browserExploring(),browserScenario(),defaultBooking,null);setBooking(fresh.booking);setStep(1);setNtrpQuizState(defaultNtrpQuizState);setRestoredDraft(false);setDraftConflict(undefined);}}>Đặt lịch mới · {draftConflict.requestedDate}</button><p>Chọn lịch mới sẽ bắt đầu thông tin đặt chuyến mới; bản nháp cũ được lưu dự phòng trong phiên này.</p></section>;

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
