import PageWrapper from "@/components/layout/PageWrapper";
import ShareCardView from "@/components/features/ShareCardView";
export const metadata = { title: "Thẻ thành tích — Tennis Travel Experience" };
export default async function ShareCardPage({searchParams}:{searchParams:Promise<{booking?:string|string[]}>}){
 const {booking}=await searchParams;
 return <PageWrapper><ShareCardView id={typeof booking==="string"&&booking?booking:null}/></PageWrapper>;
}
