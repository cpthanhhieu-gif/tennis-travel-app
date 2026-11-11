export type RequestEvent={key:string;label:string;at:string};
export type RequestIssue={type:"needsInfo"|"unavailable";reason:string;response?:string;respondedAt?:string};
type RequestState={paid:number;deposit:number;total:number;payment:string;balancePayment?:string;startedAt?:string;completedAt?:string;feiRating?:number;offer?:{acceptedAt?:string};issue?:RequestIssue;history?:RequestEvent[];numPeople?:number;offerRevision?:{reason:string}};
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
export function nextRequestAction(o:RequestState,packageId?:string,departureDate?:string):{title:string;body:string;tab?:string;label?:string}{
 if(o.issue?.type==="unavailable")return {title:"Chọn lịch hoặc gói khác",body:o.issue.reason};
 if(requestBlocked(o))return {title:"Bổ sung thông tin yêu cầu",body:o.issue!.reason};
 if(o.completedAt)return {title:"Xem đánh giá và thẻ thành tích",body:"Hành trình đã hoàn thành. Bạn có thể xem lại thông tin bên dưới."};
 if(o.paid<o.total&&o.balancePayment==="awaiting_confirmation")return {title:"Chờ xác nhận phần còn lại",body:"Bạn đã báo chuyển tiền. Điều hành đang đối chiếu khoản nhận được; số tiền chỉ cập nhật sau khi xác nhận."};
 if(o.startedAt)return {title:o.paid<o.total?"Hoàn tất thanh toán còn lại":"Mở Tour Live",body:"Xem lịch và các hoạt động của chuyến đang đi."};
 if(o.paid>=o.deposit)return {title:o.paid<o.total?balanceReminder(o,departureDate):"Xem lịch trình và chuẩn bị",body:o.balancePayment==="failed"?"Thanh toán còn lại thất bại. Thử lại bên dưới; khoản cọc đã ghi nhận được giữ nguyên.":o.balancePayment==="cancelled"?"Đã hủy thanh toán còn lại. Có thể tiếp tục khi sẵn sàng.":"Chuyến đã được xác nhận. Checklist chuẩn bị được giữ theo booking."};
 if(o.payment==="awaiting_confirmation")return {title:"Chờ xác nhận nhận cọc",body:"Bạn đã báo chuyển cọc. Điều hành đang đối chiếu tiền; đăng ký chỉ hoàn tất sau khi xác nhận đã nhận cọc. Bạn chưa cần thao tác thêm."};
 if(packageId==="sbu1"||o.offer?.acceptedAt||o.payment!=="pending")return {title:"Thanh toán cọc để hoàn tất đăng ký",tab:"payment",label:"Tiếp tục thanh toán cọc",body:o.payment==="failed"?"Lần thanh toán trước thất bại. Có thể thử lại, booking vẫn được giữ.":o.payment==="cancelled"?"Bạn đã hủy thanh toán. Tiếp tục đặt cọc khi sẵn sàng.":"Kiểm tra số tiền cọc trước khi tiếp tục."};
 if(o.offerRevision)return {title:"Đang chờ điều chỉnh phương án",body:"Vietravel đang xử lý đề nghị điều chỉnh của bạn. Bạn chưa cần thanh toán hoặc chấp thuận phương án cũ."};
 if(o.offer)return {title:packageId==="sbu2"?"Xem báo giá đoàn":`Xem phương án cho ${o.numPeople??2} người`,body:"Kiểm tra lịch cho người chơi và người đi cùng, phòng chung, dịch vụ, phụ thu, tổng giá và tiền cọc trước khi chấp thuận.",tab:"payment",label:packageId==="sbu2"?"Xem và chấp thuận báo giá":"Xem và chấp thuận phương án"};
 return {title:o.issue?.response?"Đã nhận bổ sung · Đang chờ phản hồi":packageId==="sbu2"?"Đang chờ báo giá đoàn":"Đang chờ phương án chuyến đi",body:(packageId==="sbu2"?"Vietravel đang kiểm tra nhu cầu và chi phí đoàn. Phản hồi trong 1 ngày làm việc.":"Vietravel đang kiểm tra sân, HLV/đại sứ và phòng cho chuyến đi.")+" Bạn chưa cần thanh toán lúc này. Phương án sẽ xuất hiện tại đây khi điều hành gửi."};
}
export const requestExamples=[
 {packageId:"sbu3",type:"needsInfo" as const,name:"Premium · gia đình",people:3,reason:"Cần giờ đến dự kiến và lựa chọn phòng đôi/twin để sắp xếp đón đoàn theo gói."},
 {packageId:"sbu2",type:"needsInfo" as const,name:"Tournament · CLB cuối tuần",people:16,reason:"Cần tên CLB, đầu mối đại diện và thể thức đơn/đôi mong muốn để hoàn thiện báo giá đoàn."},
 {packageId:"sbu3",type:"unavailable" as const,name:"Premium · lịch chưa đáp ứng",people:2,reason:"Khung giờ sân và lịch HLV của ngày đã chọn chưa đáp ứng được phương án này. Bạn có thể xem lịch khác trong cùng gói."},
 {packageId:"sbu2",type:"unavailable" as const,name:"Tournament · đoàn doanh nghiệp",people:20,reason:"Chưa bố trí được khung sân liền mạch cho quy mô đoàn ở ngày đã chọn. Vui lòng chọn lịch khác hoặc xem gói thay thế."}
];
