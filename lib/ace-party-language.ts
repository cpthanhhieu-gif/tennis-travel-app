/** Party grammar is independent of the utterance catalog. All patterns cover the whole clause. */
export type PartyReading={kind:"known";total:number;companions?:number}|{kind:"ask";reason:"negative"|"conditional"|"conflict"|"uncertain";candidate?:{total:number;companions?:number}};
export function partyText(text:string){return text.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[đĐ]/g,"d").toLowerCase().replace(/\b(?:ko|k|hok)\b/g,"khong").replace(/\bvs\b/g,"voi").replace(/\bvc\b/g,"vo chong").replace(/\b(?:tui|toi)\b/g,"toi").replace(/(\d)\s*ng\b/g,"$1 nguoi").replace(/[^a-z0-9]+/g," ").trim().replace(/(?: (?:nhe|nha|a|thoi|nua))+$/,"");}
const subject="(?:(?:ace oi )?(?:toi|minh|em|anh|chi|bon minh|tui minh|chung toi|chung minh|vo chong minh) )?";
const wish="(?:(?:chi |dang )?(?:muon|dinh|du dinh|se|du tinh|tinh|can|muon dang ky|muon dat tour|muon tham gia) )?";
const solo="(?:mot minh|1 minh|solo|rieng (?:mot|1) nguoi|(?:mot|1) (?:nguoi|khach)(?: choi tennis)?)";
const countWords:Record<string,number>={mot:1,hai:2,ba:3,bon:4,nam:5,sau:6,bay:7,tam:8,chin:9,muoi:10};
export function readPartyLanguage(text:string):PartyReading|undefined{
 const s=partyText(text);
 const relevant=/\b(?:mot minh|1 minh|solo|di cung|di voi|nguoi di cung|vo chong|ban gai|ban trai|gia dinh|nguoi nha)\b/.test(s)||/\b(?:di|dang ky|tham gia|co|gom) (?:\d+|mot|hai|ba|bon|nam|sau|bay|tam|chin|muoi) (?:nguoi|khach)\b/.test(s);
 if(!relevant&&!/^(?:(?:vo|chong)(?: minh| toi)?|co ay|anh ay) (?:khong (?:choi|danh)(?: tennis)?|chi nghi duong)$/.test(s)&&!/^(?:chi co|chi) (?:minh|toi|em) (?:di|tham gia)$/.test(s))return;
 const soloMention=/\b(?:mot minh|1 minh|solo)\b/.test(s);
 if(/\b(?:neu|gia su|gia nhu|truong hop|hoac|co the|chua chac|chua quyet|dang can nhac)\b/.test(s)||/\b(?:thi sao|duoc khong|co duoc khong|co on khong|co duoc|hay khong)\b/.test(s))return {kind:"ask",reason:"conditional"};
 // A negative travel statement must never become an affirmative party count.
 if(/\b(?:khong|chang|chua) (?:muon |dinh |se |phai )?(?:di|tham gia|dang ky|mot minh|1 minh|solo)\b/.test(s))return {kind:"ask",reason:"negative"};
 if(soloMention&&/\b(?:vo|chong|ban gai|ban trai|nguoi yeu|nguoi di cung|nguoi nha|them (?:\d+|mot|hai|ba|bon)|di cung|di voi)\b/.test(s))return {kind:"ask",reason:"conflict"};
 if(new RegExp(`^${subject}${wish}(?:chi )?(?:(?:di|tham gia|dang ky|dang ky cho|dat tour cho) )?${solo}$`).test(s)||/^(?:chi co|chi) (?:minh|toi|em) (?:di|tham gia)$/.test(s)||/^(?:cho|dang ky cho) (?:minh|toi|em) (?:di )?(?:mot|1) (?:nguoi|khach)$/.test(s))return {kind:"known",total:1,companions:0};
 const count=s.match(new RegExp(`^(?:(?:nhom|doan|clb)(?: minh| toi)? )?${subject}${wish}(?:(?:nhom|doan|clb)(?: minh| toi)? )?(?:co |gom |di |tham gia |dang ky cho |dang ky )?(\\d+|mot|hai|ba|bon|nam|sau|bay|tam|chin|muoi) (?:nguoi|khach)$`));
 if(count){const total=Number(count[1])||countWords[count[1]];return total>=1&&total<=20?{kind:"known",total,companions:total===1?0:undefined}:{kind:"ask",reason:"uncertain"};}
 if(new RegExp(`^${subject}${wish}(?:di|tham gia) (?:voi|cung) (?:vo|chong|ban gai|ban trai|nguoi yeu|mot nguoi ban|ban than)(?: minh| toi)?$`).test(s)||/^(?:hai|2) (?:vo chong|dua|nguoi|khach)(?: minh| toi)?(?: cung)?(?: di| tham gia)?$/.test(s)||/^vo chong (?:minh|toi)(?: muon| dinh| se)? di$/.test(s))return {kind:"known",total:2};
 if(/^(?:(?:hai|2) (?:vo chong|nguoi|dua)|(?:minh|toi|em) (?:va|voi) (?:vo|chong|ban gai|ban trai)) (?:deu |cung |ca hai deu )?(?:choi|danh)(?: tennis)?$/.test(s))return {kind:"known",total:2,companions:0};
 // Don't propose a candidate if unknown words could describe an additional person or request.
 if(new RegExp(`^${subject}${wish}(?:di )?${solo} (?:ma chua ro|khong biet nua|chua biet lam sao)$`).test(s))return {kind:"ask",reason:"uncertain",candidate:{total:1,companions:0}};
 return {kind:"ask",reason:"uncertain"};
}
