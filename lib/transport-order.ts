import { transportExperiences, type TransportMode } from "@/lib/transport-catalog";

export type TransportDraft = {
  version: 1;
  mode: TransportMode;
  from: string;
  to: string;
  date: string;
  rideId: string;
  rideName: string;
  time: string;
  passengers: number;
  unitPrice: number;
  unit: "person" | "vehicle";
  total: number;
  activityId?: string;
  activityCount?: number;
};

export type TransportDemoOrder = TransportDraft & {
  id: string;
  createdAt: string;
  paymentMethod: string;
  status: "simulated_paid";
  transportTotal: number;
  activityTotal: number;
  grandTotal: number;
  fingerprint: string;
};

export const TRANSPORT_DRAFT_KEY = "travel-ace-transport-draft-v1";
export const TRANSPORT_ORDER_KEY = "travel-ace-transport-order-v1";
export const TRANSPORT_ACTIVITY = transportExperiences[0];
export const TRANSPORT_ACTIVITY_PRICE = TRANSPORT_ACTIVITY.unitPrice;
export const formatTransportMoney = (amount: number) => `${amount.toLocaleString("vi-VN")} đ`;
export const transportAmount = (draft: TransportDraft) => draft.unit === "person" ? draft.unitPrice * draft.passengers : draft.unitPrice;
export const activityAmount = (draft: TransportDraft) => {
  const experience = transportExperiences.find(item => item.id === draft.activityId);
  return experience ? experience.unitPrice * (draft.activityCount ?? 0) : 0;
};
export const transportGrandTotal = (draft: TransportDraft) => transportAmount(draft) + activityAmount(draft);

export function isTransportDraft(value: unknown): value is TransportDraft {
  if (!value || typeof value !== "object") return false;
  const draft = value as Partial<TransportDraft>;
  return draft.version === 1 && ["train", "bus", "rental", "airport"].includes(draft.mode ?? "") &&
    typeof draft.from === "string" && typeof draft.to === "string" && typeof draft.date === "string" &&
    typeof draft.rideId === "string" && typeof draft.rideName === "string" && typeof draft.time === "string" &&
    Number.isInteger(draft.passengers) && (draft.passengers ?? 0) > 0 && Number.isFinite(draft.unitPrice) &&
    (draft.unit === "person" || draft.unit === "vehicle");
}

export function transportFingerprint(draft: TransportDraft) {
  return JSON.stringify([draft.mode, draft.from, draft.to, draft.date, draft.rideId, draft.time, draft.passengers, draft.unitPrice, draft.unit, draft.activityId ?? "", draft.activityCount ?? 0]);
}
