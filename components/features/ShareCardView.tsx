"use client";
import Link from "next/link";
import BookingShareCard from "./BookingShareCard";
import {useLocalAccount} from "@/lib/use-local-account";
import {tours} from "@/lib/mock-data";
function CompletedCards(){
 const {data,error,refresh}=useLocalAccount();const completed=data?.orders.filter(o=>o.completedAt)??[];
 return <div className="ds-container ds-profile"><p className="ds-eyebrow">THẺ THÀNH TÍCH</p><h1>Chọn hành trình đã hoàn thành</h1>{error&&<p role="alert">{error} <button className="ds-link" onClick={refresh}>Thử lại</button></p>}{!data&&!error&&<p role="status">Đang tải…</p>}{data&&!data.account?<section className="ds-quality"><p>Đăng nhập để xem thẻ thành tích của bạn.</p><Link className="ds-cta" href="/profile">Đăng nhập tại Cá nhân</Link></section>:data&&(!completed.length?<section className="ds-quality"><p>Bạn chưa có chuyến đã hoàn thành để tạo thẻ thành tích.</p><Link className="ds-cta" href="/pre-tour">Xem hành trình</Link></section>:completed.map(o=><article className="ds-summary my-[2.4rem]" key={o.id}><h2>{tours.find(t=>t.id===o.tourId)?.name}</h2><p>{o.name} · Hoàn thành {new Date(o.completedAt!).toLocaleDateString("vi-VN")}</p><Link className="ds-link" href={`/share-card?booking=${o.id}`}>Xem thẻ thành tích</Link></article>))}<Link className="ds-link mt-[1.6rem]" href="/">Khám phá gói tennis</Link></div>;
}
export default function ShareCardView({id=null}:{id?:string|null}){
 return id?<BookingShareCard key={id} id={id}/>:<CompletedCards/>;
}
