export function ancillaryImage(id:string){
 if(id.includes("room")||id.includes("single"))return "/images/before-booking/resort-court.png";
 if(id.includes("spa")||id.includes("snorkeling")||id.includes("vinwonders"))return "/images/post-trip/lake-memory.png";
 if(id.includes("ambassador"))return "/images/coaches/coach-premium.png";
 if(id.includes("pickleball"))return "/images/coaches/coach-leisure.png";
 return "/images/before-booking/coach-guidance.png";
}
