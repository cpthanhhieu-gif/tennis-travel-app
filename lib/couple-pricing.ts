export const companionRate=(packageId:string)=>({sbu1:5400000,sbu2:9900000,sbu3:22900000}[packageId]??0);
export function coupleTotal(packageId:string,playerRate:number,totalPeople:number,companions=0){return playerRate*(totalPeople-companions)+companionRate(packageId)*companions;}
