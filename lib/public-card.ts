import {readDocument} from "./cloud-store";
export type PublicCard={alias:string;packageId:string;tourName:string;completedAt:string;expiresAt:string};
export async function getPublicCard(token:string):Promise<PublicCard|null>{if(!/^[a-f0-9-]{36}$/.test(token))return null;const card=await readDocument<PublicCard>(`global/cards/${token}`);return card&&Date.parse(card.expiresAt)>Date.now()?card:null;}
