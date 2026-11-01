export type JourneyPhase = "Chờ xử lý" | "Sắp đi" | "Đang đi" | "Đã hoàn thành";
export function journeyPhase(order:{paid:number;deposit:number;startedAt?:string;completedAt?:string}):JourneyPhase{
 if(order.completedAt)return "Đã hoàn thành";
 if(order.startedAt)return "Đang đi";
 return order.paid>=order.deposit?"Sắp đi":"Chờ xử lý";
}
