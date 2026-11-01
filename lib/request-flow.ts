export type RequestEvent={key:string;label:string;at:string};
export type RequestIssue={type:"needsInfo"|"unavailable";reason:string;response?:string;respondedAt?:string};
type RequestState={paid:number;deposit:number;total:number;payment:string;balancePayment?:string;startedAt?:string;completedAt?:string;feiRating?:number;offer?:{acceptedAt?:string};issue?:RequestIssue};
export function requestBlocked(o:{issue?:RequestIssue}){return !!o.issue&&(o.issue.type==="unavailable"||!o.issue.response);}
export function addRequestEvent(o:{history?:RequestEvent[]},key:string,label:string){o.history??=[];if(!o.history.some(e=>e.key===key))o.history.push({key,label,at:new Date().toISOString()});}
export function balanceReminder(o:{paid:number;total:number;startedAt?:string;completedAt?:string}, departureDate?:string, now=new Date()){
 if(o.paid>=o.total)return "Đã thanh toán đủ.";
 if(o.completedAt)return "Liên hệ tư vấn viên để đối soát khoản còn lại.";
 if(o.startedAt)return "Vui lòng hoàn tất khoản còn lại và liên hệ tư vấn viên nếu cần hỗ trợ.";
 if(!departureDate)return "Kiểm tra hạn thanh toán với tư vấn viên.";
 const due=new Date(departureDate+"T00:00:00+07:00");due.setUTCDate(due.getUTCDate()-15);
 const date=due.toLocaleDateString("vi-VN",{timeZone:"Asia/Ho_Chi_Minh"});
 const today=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Ho_Chi_Minh",year:"numeric",month:"2-digit",day:"2-digit"}).format(now);
 const deadline=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Ho_Chi_Minh",year:"numeric",month:"2-digit",day:"2-digit"}).format(due);
 return today>deadline?`Đã quá hạn thanh toán ${date}. Vui lòng liên hệ tư vấn viên.`:`Hạn thanh toán phần còn lại: ${date} (D-15).`;
}
export function nextRequestAction(o:RequestState,packageId?:string,departureDate?:string){
 if(o.issue?.type==="unavailable")return {title:"Chọn lịch hoặc gói khác",body:o.issue.reason};
 if(requestBlocked(o))return {title:"Bổ sung thông tin yêu cầu",body:o.issue!.reason};
 if(o.completedAt)return {title:"Xem đánh giá và thẻ thành tích",body:"Hành trình đã hoàn thành. Bạn có thể xem lại thông tin bên dưới."};
 if(o.startedAt)return {title:o.paid<o.total?"Hoàn tất thanh toán còn lại":"Mở Tour Live",body:"Xem lịch và các hoạt động của chuyến đang đi."};
 if(o.paid>=o.deposit)return {title:o.paid<o.total?balanceReminder(o,departureDate):"Xem lịch trình và chuẩn bị",body:o.balancePayment==="failed"?"Thanh toán còn lại thất bại. Thử lại bên dưới; khoản cọc đã ghi nhận được giữ nguyên.":o.balancePayment==="cancelled"?"Đã hủy thanh toán còn lại. Có thể tiếp tục khi sẵn sàng.":"Chuyến đã được xác nhận. Checklist chuẩn bị được giữ theo booking."};
 if(packageId==="sbu1"||o.offer?.acceptedAt||o.payment!=="pending")return {title:"Hoàn tất đặt cọc",body:o.payment==="failed"?"Lần thanh toán trước thất bại. Có thể thử lại, booking vẫn được giữ.":o.payment==="cancelled"?"Bạn đã hủy thanh toán. Tiếp tục đặt cọc khi sẵn sàng.":"Kiểm tra số tiền cọc trước khi tiếp tục."};
 if(o.offer)return {title:"Xem và chấp thuận phương án/báo giá",body:"Kiểm tra lịch, số khách, tổng giá và tiền cọc bên dưới."};
 return {title:"Xem bước xử lý bên dưới",body:o.issue?.response?"Đã nhận thông tin bổ sung. Tiếp tục xem phương án theo lịch và giá đã chọn.":packageId==="sbu2"?"Yêu cầu báo giá đoàn được phản hồi trong 1 ngày làm việc.":"Yêu cầu Premium được xác nhận trong tối đa 24 giờ."};
}
export const requestExamples=[
 {packageId:"sbu3",type:"needsInfo" as const,name:"Premium · gia đình",people:3,reason:"Cần giờ đến dự kiến và lựa chọn phòng đôi/twin để sắp xếp đón đoàn theo gói."},
 {packageId:"sbu2",type:"needsInfo" as const,name:"Tournament · CLB cuối tuần",people:16,reason:"Cần tên CLB, đầu mối đại diện và thể thức đơn/đôi mong muốn để hoàn thiện báo giá đoàn."},
 {packageId:"sbu3",type:"unavailable" as const,name:"Premium · lịch chưa đáp ứng",people:2,reason:"Khung giờ sân và lịch HLV của ngày đã chọn chưa đáp ứng được phương án này. Bạn có thể xem lịch khác trong cùng gói."},
 {packageId:"sbu2",type:"unavailable" as const,name:"Tournament · đoàn doanh nghiệp",people:20,reason:"Chưa bố trí được khung sân liền mạch cho quy mô đoàn ở ngày đã chọn. Vui lòng chọn lịch khác hoặc xem gói thay thế."}
];
