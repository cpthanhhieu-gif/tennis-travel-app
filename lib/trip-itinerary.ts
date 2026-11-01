import {tours} from "./mock-data";
export const preparation=["Vợt tennis","Giày tennis","Trang phục thể thao","Kem chống nắng","Bình nước"];
type Kind="court"|"clinic"|"cooking"|"fei"|"meal"|"recovery"|"explore"|"logistics"|"competition"|"social"|"feedback"|"free";
export type Activity={id:string;legacyId?:string;time:string;title:string;location:string;kind:Kind;optional?:boolean};
export type TripDay={day:number;date:string;title:string;activities:Activity[]};
type Item=[key:string,time:string,title:string,location:string,kind:Kind,legacyIndex?:number,optional?:boolean];
type Day={title:string;items:Item[]};
// Kế hoạch mẫu: quyền lợi neo theo v2.12 mục5.1/5.2; không xác nhận NCC hoặc kết quả FEI.
const leisure:Day[]=[
 {title:"Làm quen sân — hương vị cao nguyên",items:[
 ["arrival","08:30","Đón đoàn, gửi hành lý và nhận lịch hoạt động","Điểm đón Đà Lạt","logistics",1],
 ["clinic","09:30–10:30","Clinic nhập môn: tư thế, cầm vợt và di chuyển","Sân tennis đối tác","clinic",2],
 ["lunch","11:30","Bữa trưa với rau củ và đặc sản cao nguyên","Nhà hàng địa phương","meal"],
 ["room","13:00","Nhận phòng và nghỉ ngơi","@resort","free"],
 ["court1","14:30–16:00","Buổi sân 1: forehand, backhand và rally theo cặp","Sân tennis đối tác","court",3],
 ["stretch","16:00–16:20","Giãn cơ và hướng dẫn tự phục hồi sau tập","Khu sinh hoạt chung","recovery"],
 ["walk","16:45","Tản bộ hồ Xuân Hương, thời gian chụp ảnh","Hồ Xuân Hương","explore",undefined,true],
 ["dinner","18:30","Bữa tối kết nối nhóm và câu chuyện ẩm thực Đà Lạt","Nhà hàng địa phương","meal"]]},
 {title:"Chơi tự tin — vào bếp cùng nhau",items:[
 ["breakfast","06:30","Bữa sáng trước buổi tập","@resort","meal"],
 ["court2","07:30–09:00","Buổi sân 2: giao bóng cơ bản và đánh đôi giao lưu","Sân tennis đối tác","court",1],
 ["feedback","09:15","HLV tổng kết kỹ thuật và gợi ý bài tự tập","Khu sinh hoạt chung","feedback"],
 ["cooking","10:00–11:15","Cooking class: salad rau vườn và món ăn cao nguyên","Không gian bếp trải nghiệm","cooking",2],
 ["lunch","11:30","Bữa trưa từ thành phẩm lớp nấu ăn","Không gian bếp trải nghiệm","meal"],
 ["review","12:15","Góp ý trải nghiệm và xem lại khoảnh khắc của nhóm","App & khu sinh hoạt chung","feedback"],
 ["departure","13:00","Trả phòng và tiễn đoàn","@resort","logistics",3]]}
];
const tournament:Day[]=[
 {title:"Hội quân CLB — làm quen mặt sân",items:[
 ["arrival","08:00","Đón đoàn tại sân bay Đà Nẵng","Sân bay Đà Nẵng","logistics",1],
 ["welcome","09:00","Gửi hành lý, nhận welcome kit và lịch thi đấu","@resort","logistics",2],
 ["briefing","10:00","Họp kỹ thuật: thể thức, bốc thăm và ghép bảng theo trình độ","Phòng sinh hoạt đoàn","social"],
 ["lunch","11:30","Bữa trưa và thời gian nghỉ trước buổi sân","Nhà hàng đoàn","meal",6],
 ["court1","14:00–15:30","Buổi sân 1: warm-up, serve/return và làm quen mặt sân","Cụm sân thi đấu","court",5],
 ["recovery","15:30–16:00","Giãn cơ, bổ sung nước và nghỉ phục hồi","Khu nghỉ cạnh sân","recovery"],
 ["tactics","16:00","Trao đổi chiến thuật đánh đôi cùng đội trưởng","Khu sinh hoạt CLB","social"],
 ["dinner","18:30","Bữa tối giao lưu các đội và công bố lịch vòng bảng","Nhà hàng đoàn","meal",9]]},
 {title:"Round-robin — thi đấu và khám phá Đà Nẵng",items:[
 ["breakfast","06:00","Bữa sáng nhẹ trước giờ thi đấu","@resort","meal"],
 ["court2","06:45–08:45","Buổi sân 2: round-robin lượt 1 và đổi cặp","Cụm sân thi đấu","court"],
 ["rest","08:45–09:30","Nghỉ giữa lượt, ăn nhẹ và hồi phục","Khu nghỉ cạnh sân","recovery"],
 ["court3","09:30–11:00","Buổi sân 3: round-robin lượt 2 và xác định nhánh playoff","Cụm sân thi đấu","court"],
 ["lunch","11:30","Bữa trưa: món Quảng và lựa chọn rau, đạm phục hồi","Nhà hàng địa phương","meal"],
 ["rest2","12:30–14:30","Nghỉ trưa và thời gian cá nhân","@resort","free"],
 ["city","15:00–16:30","City tour ngắn: Bảo tàng Chăm và dạo bờ sông Hàn","Trung tâm Đà Nẵng","explore"],
 ["dinner","18:30","Bữa tối CLB, chia sẻ ảnh và chuẩn bị vòng quyết định","Nhà hàng đoàn","meal"]]},
 {title:"Playoff — trao giải và kết nối lần tới",items:[
 ["breakfast","06:00","Bữa sáng trước vòng quyết định","@resort","meal"],
 ["court4","06:45–09:00","Buổi sân 4: playoff, trận phân hạng và chung kết","Cụm sân thi đấu","court"],
 ["awards","09:15","Trao giải nội bộ và chụp ảnh tập thể","Khu trao giải CLB","social"],
 ["feedback","10:00","Tổng kết chiến thuật cùng HLV và nhận phản hồi chuyến đi","Phòng sinh hoạt đoàn","feedback"],
 ["lunch","11:30","Bữa trưa chia tay","Nhà hàng đoàn","meal"],
 ["departure","13:00","Trả phòng, đưa đoàn ra sân bay","@resort","logistics"]]}
];
const premium:Day[]=[
 {title:"Arrival & Warm-up — Taste the Story",items:[
 ["arrival","09:00","Đón tại resort, gửi hành lý và nhận recovery kit","@resort","logistics",1],
 ["fei1","11:30","FEI #1: hải sản Hàm Ninh và câu chuyện nguyên liệu đảo","Nhà hàng trải nghiệm địa phương","fei",2],
 ["assessment","14:00–15:00","Đánh giá NTRP thực địa và lập nhóm tập","Cụm sân tennis","clinic",3],
 ["court1","16:30–18:30","Buổi sân 1: clinic kỹ thuật theo nhóm trình độ","Cụm sân tennis","court",4],
 ["fei2","19:30","FEI #2: welcome dinner, câu chuyện nước mắm và tiêu Phú Quốc","Nhà hàng resort","fei",5]]},
 {title:"Play Hard — huấn luyện và phục hồi",items:[
 ["earlymeal","06:00","Bữa sáng nhẹ, chuẩn bị nước và điện giải","Nhà hàng resort","meal",1],
 ["court2","06:30–09:00","Buổi sân 2: drill nâng cao và đánh đôi theo NTRP","Cụm sân tennis","court",2],
 ["breakfast","09:30","Bữa sáng phục hồi theo nhịp tập","Nhà hàng resort","meal",3],
 ["spa","10:30–11:30","Spa recovery 60 phút","Spa resort","recovery",4],
 ["fei3","12:00","FEI #3: bữa trưa cân bằng sau tập","Nhà hàng resort","fei",5],
 ["free","14:00–16:00","Nghỉ ngơi, bơi nhẹ hoặc đọc sách","@resort","free"],
 ["optional","14:00–16:00","Tham quan Grand World trong thời gian tự do","Grand World","explore",undefined,true],
 ["court3","16:30–18:30","Buổi sân 3: mini Pro-Am cùng HLV/đại sứ theo lịch chuyến","Cụm sân tennis","court",6],
 ["fei4","19:30","FEI #4: đi chợ đêm cùng chef và trải nghiệm hải sản","Chợ đêm Dương Đông & nhà hàng","fei",7]]},
 {title:"Ace Day — Ace Cup và bếp bản địa",items:[
 ["cup1","06:30–09:30","Ace Cup: vòng bảng đánh đôi round-robin","Cụm sân thi đấu","competition",1],
 ["brunch","10:00","Brunch phục hồi sau vòng bảng","Nhà hàng resort","meal",2],
 ["cooking","11:30–13:00","Cooking class: bún quậy hoặc gỏi cá trích cùng chef","Bếp trải nghiệm","cooking",3],
 ["free","14:00–16:00","Nghỉ tự do trước vòng quyết định","@resort","free"],
 ["cup2","16:00–17:30","Ace Cup: bán kết, chung kết và trao giải","Cụm sân thi đấu","competition",4],
 ["fei5","19:00","FEI #5: gala private dining hoàng hôn","Không gian gala resort","fei",5]]},
 {title:"Recover & Return — đóng vòng trải nghiệm",items:[
 ["yoga","07:00–07:45","Yoga và stretching nhẹ","Không gian tập trong resort","recovery",1],
 ["breakfast","08:00","Bữa sáng trước khi trả phòng","Nhà hàng resort","meal",2],
 ["review","09:30","FEI rating, tổng kết trải nghiệm và kế hoạch tự tập","App & khu sinh hoạt chung","feedback",3],
 ["passport","10:15","Xem Tennis Passport, ảnh và thẻ thành tích sau chuyến","App","social"],
 ["departure","11:30","Trả phòng và di chuyển về sân bay","@resort","logistics",4]]}
];
export const packageBenefits={sbu1:"2 buổi sân · 1 clinic · 1 cooking class",sbu2:"4 buổi sân · round-robin & playoff · city tour ngắn",sbu3:"3 buổi sân · Ace Cup · 5 bữa FEI · spa recovery"};
function departureVariant(item:Item,pkg:string,alternate:boolean):Item{
 if(!alternate)return item;
 if(pkg==="sbu1"&&item[0]==="cooking")return [item[0],item[1],"Cooking class: bánh căn và rau củ địa phương",item[3],item[4],item[5],item[6]];
 if(pkg==="sbu1"&&item[0]==="walk")return [item[0],item[1],"Dạo khu phố trung tâm và khám phá cà phê Đà Lạt","Khu trung tâm Đà Lạt",item[4],item[5],item[6]];
 if(pkg==="sbu2"&&item[0]==="city")return [item[0],item[1],"City tour ngắn: bán đảo Sơn Trà và ngắm biển Mỹ Khê","Sơn Trà – Mỹ Khê",item[4],item[5],item[6]];
 if(pkg==="sbu2"&&item[0]==="tactics")return [item[0],item[1],"Workshop CLB: phối hợp lên lưới và xử lý bóng lob",item[3],item[4],item[5],item[6]];
 if(pkg==="sbu3"&&item[0]==="optional")return [item[0],item[1],"Tham quan không gian văn hóa địa phương trong giờ tự do","Khu tham quan Phú Quốc",item[4],item[5],item[6]];
 if(pkg==="sbu3"&&item[0]==="cooking")return [item[0],item[1],"Cooking class: gỏi cá trích và câu chuyện gia vị đảo",item[3],item[4],item[5],item[6]];
 return item;
}
export function tripItinerary(order:{tourId:string;departureCode:string}):TripDay[]{
 const t=tours.find(t=>t.id===order.tourId);const departure=t?.departureSchedules.find(d=>d.code===order.departureCode);
 if(!t||!departure)return [];
 const base=t.packageId==="sbu1"?leisure:t.packageId==="sbu2"?tournament:premium;
 const alternate=t.departureSchedules.findIndex(d=>d.code===departure.code)%2===1;
 return base.map((d,index)=>{const date=new Date(departure.date+"T12:00:00Z");date.setUTCDate(date.getUTCDate()+index);return {day:index+1,date:date.toISOString().slice(0,10),title:d.title,activities:d.items.map(raw=>{const a=departureVariant(raw,t.packageId,alternate);return {id:`${t.packageId}:v2:day${index+1}:${a[0]}`,legacyId:a[5]?`${t.packageId}:day${index+1}:item${a[5]}`:undefined,time:a[1],title:a[2],location:a[3]==="@resort"?t.resort:a[3],kind:a[4],optional:a[6]};})};});
}
export function validChecklistItem(order:{tourId:string;departureCode:string},id:string){return preparation.some((_,i)=>id===`prepare:${i}`)||tripItinerary(order).some(d=>d.activities.some(a=>a.id===id));}
