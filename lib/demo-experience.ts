import {isScenarioId,browserExploring,type ScenarioId} from "./demo-scope";
export function browserScenario():ScenarioId|undefined{
 if(typeof document==="undefined"||browserExploring())return;
 const value=document.cookie.split("; ").find(c=>c.startsWith("tt-scenario="))?.split("=")[1];
 return isScenarioId(value)?value:undefined;
}
export const demoLabels:Record<ScenarioId,string>={personal:"Cá nhân",couple:"Cặp đôi / người đi cùng",club:"Đại diện đoàn / CLB",returning:"Sau chuyến đi"};
export function demoParty(scenario:ScenarioId|undefined,packageId:string){
 if(packageId==="sbu2")return {numPeople:16,numCompanions:0};
 return {numPeople:scenario==="couple"?2:1,numCompanions:scenario==="couple"?1:0};
}
export function packageFlow(packageId:string){
 return packageId==="sbu2"?{title:"Tournament · Đoàn / CLB",steps:"Đại diện nhập quy mô và nhu cầu → Gửi yêu cầu báo giá → Nhận báo giá trong 1 ngày làm việc → Chấp thuận → Cọc 50% khi ký.",note:"Đây là hình thức đăng ký đoàn/CLB. Khách đi riêng hoặc đi cùng người thân cần tham gia qua đoàn; demo không mở bán lẻ độc lập cho gói này."}:packageId==="sbu3"?{title:"Premium · Khách lẻ theo yêu cầu",steps:"Chọn lịch và người tham gia → Đánh giá NTRP cho người chơi → Nhập liên hệ → Gửi yêu cầu → Nhận phương án để xem xét trước khi đặt cọc → Chấp thuận → Cọc 30%.",note:"Có thể đi một mình hoặc cùng người thân. Giá người đi cùng không gồm sân/HLV; nhu cầu phòng và phụ thu cần được xác nhận."}:{title:"Leisure · Khách lẻ, lịch cố định",steps:"Chọn lịch và người tham gia → Đánh giá NTRP cho người chơi → Nhập liên hệ → Xem lại → Đặt cọc 30% để xác nhận chỗ.",note:"Đăng ký theo lịch cố định. Có giá người đi cùng không chơi. Không áp dụng quy trình báo giá đoàn riêng cho gói này trong demo."};
}
