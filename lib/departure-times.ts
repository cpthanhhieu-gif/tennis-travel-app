export const departureTimeSlots=["08:00–10:00","14:00–16:00","18:00–20:00"] as const;
export type DepartureTime=typeof departureTimeSlots[number];
export const isDepartureTime=(value:string|null):value is DepartureTime=>departureTimeSlots.some(slot=>slot===value);
