export type TransportMode = "train" | "bus" | "rental" | "airport";

export type TransportRide = {
  id: string;
  name: string;
  time: string;
  duration: string;
  detail: string;
  price: number;
  unit: "person" | "vehicle";
  maxPassengers?: number;
};

export const transportRidesByMode: Record<TransportMode, TransportRide[]> = {
  train: [
    { id: "train-0600", name: "Tàu tiêu chuẩn", time: "06:00", duration: "3 giờ 45 phút", detail: "Ghế mềm · Có điều hòa", price: 240000, unit: "person" },
    { id: "train-0930", name: "Tàu nhanh", time: "09:30", duration: "3 giờ 20 phút", detail: "Ghế mềm · Có điều hòa", price: 315000, unit: "person" },
    { id: "train-1400", name: "Tàu tiêu chuẩn", time: "14:00", duration: "3 giờ 45 phút", detail: "Ghế mềm · Có điều hòa", price: 240000, unit: "person" },
  ],
  bus: [
    { id: "bus-0730", name: "Xe giường nằm", time: "07:30", duration: "4 giờ 15 phút", detail: "Điều hòa · Hành lý xách tay", price: 185000, unit: "person" },
    { id: "bus-1230", name: "Limousine", time: "12:30", duration: "3 giờ 50 phút", detail: "Ghế ngả · Wifi", price: 265000, unit: "person" },
    { id: "bus-1900", name: "Xe giường nằm", time: "19:00", duration: "4 giờ 15 phút", detail: "Điều hòa · Hành lý xách tay", price: 185000, unit: "person" },
  ],
  rental: [
    { id: "rental-4", name: "Xe tự lái 4 chỗ", time: "08:00", duration: "Theo ngày", detail: "Tối đa 4 khách · Tự lái", price: 950000, unit: "vehicle", maxPassengers: 4 },
    { id: "rental-7", name: "Xe tự lái 7 chỗ", time: "08:00", duration: "Theo ngày", detail: "Tối đa 7 khách · Tự lái", price: 1250000, unit: "vehicle", maxPassengers: 7 },
    { id: "rental-16", name: "Xe tự lái 16 chỗ", time: "08:00", duration: "Theo ngày", detail: "Tối đa 16 khách · Tự lái", price: 2100000, unit: "vehicle", maxPassengers: 16 },
  ],
  airport: [
    { id: "airport-4", name: "Xe đưa đón 4 chỗ", time: "08:00", duration: "Một chiều", detail: "Tối đa 3 khách · 2 kiện hành lý", price: 350000, unit: "vehicle", maxPassengers: 3 },
    { id: "airport-7", name: "Xe đưa đón 7 chỗ", time: "08:00", duration: "Một chiều", detail: "Tối đa 6 khách · 4 kiện hành lý", price: 480000, unit: "vehicle", maxPassengers: 6 },
    { id: "airport-16", name: "Xe đưa đón 16 chỗ", time: "08:00", duration: "Một chiều", detail: "Tối đa 12 khách · 10 kiện hành lý", price: 950000, unit: "vehicle", maxPassengers: 12 },
  ],
};

export type TransportExperience = {
  id: string;
  destinationId: string;
  destinationName: string;
  name: string;
  image: string;
  rating: number;
  ratingLabel: string;
  unitPrice: number;
  unit: "person";
};

export const transportExperiences: TransportExperience[] = [
  {
    id: "dalat-datanla-coaster",
    destinationId: "dalat",
    destinationName: "Đà Lạt",
    name: "Đi Xe Trượt Thác Datanla New Alpine Tại Đà Lạt",
    image: "/images/passport-da-lat.png",
    rating: 4.8,
    ratingLabel: "2.3K · dữ liệu tham khảo",
    unitPrice: 240100,
    unit: "person",
  },
];
