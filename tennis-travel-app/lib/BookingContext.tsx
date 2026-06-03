"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { getNtrpLevel } from "@/lib/mock-data";

export interface BookingState {
  tourId: string;          // ví dụ "dn-sbu1"
  packageId: string;
  destination: string;
  departureDate: string;
  departureCode: string;   // mã chuyến Vietravel, ví dụ FESGN567-010-130626XE-H
  numPeople: number;
  ntrpLevel: number;
  ntrpLabel: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
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
  updateBooking: (updates: Partial<BookingState>) => void;
  resetBooking: () => void;
  ntrpQuizState: NtrpQuizState;
  updateNtrpQuizState: (updates: Partial<NtrpQuizState>) => void;
}

const defaultBooking: BookingState = {
  tourId: "dn-sbu1",
  packageId: "sbu1",
  destination: "danang",
  departureDate: "2026-06-13",
  departureCode: "FESGN567-010-130626XE-H",
  numPeople: 2,
  ntrpLevel: 0,
  ntrpLabel: "",
  name: "",
  phone: "",
  email: "",
  notes: "",
  totalPrice: 0,
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

  const updateBooking = (updates: Partial<BookingState>) => {
    setBooking((prev) => ({ ...prev, ...updates }));
  };

  const updateNtrpQuizState = (updates: Partial<NtrpQuizState>) => {
    setNtrpQuizState((prev) => ({ ...prev, ...updates }));
  };

  const resetBooking = () => {
    setBooking(defaultBooking);
    setNtrpQuizState(defaultNtrpQuizState);
  };

  return (
    <BookingContext.Provider value={{ booking, updateBooking, resetBooking, ntrpQuizState, updateNtrpQuizState }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking(): BookingContextType {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
