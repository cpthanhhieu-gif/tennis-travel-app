import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { destinations } from "@/lib/mock-data";
import { MapPin, Clock } from "lucide-react";

export default function DestinationsSection() {
  return (
    <section className="pt-[2.4rem] pb-[0.8rem] bg-neutral-03" aria-labelledby="destinations-title">
      {/* Header */}
      <div className="px-[1.6rem] mb-[1.6rem]">
        <h2 id="destinations-title" className="text-[1.8rem] font-bold text-neutral-90">
          Điểm đến <span className="text-brand-primary">Pilot 2026</span>
        </h2>
        <p className="text-neutral-40 text-[1.3rem] mt-[0.3rem]">
          Ra mắt tháng 6/2026 · Đặt sớm nhận ưu đãi
        </p>
      </div>

      {/* Horizontal scroll */}
      <div className="px-[1.6rem] overflow-hidden">
      <div
        className="flex gap-[1.2rem] overflow-x-auto pb-[2rem] snap-x snap-mandatory"
        style={{ scrollbarWidth: "none" }}
      >
        {destinations.map((dest) => (
          <article
            key={dest.id}
            className="snap-start flex-shrink-0 w-[27rem] rounded-[1.2rem] overflow-hidden bg-neutral-01 border border-neutral-05 shadow-[rgba(0,0,0,0.08)_0px_2px_8px]"
          >
            {/* Image */}
            <div className="relative h-[16rem]">
              <Image
                src={dest.image}
                alt={`${dest.name} — điểm đến Tennis Travel Experience`}
                fill
                className="object-cover"
                sizes="270px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,14,26,0.75)] to-transparent" />
              <div className="absolute bottom-[1.2rem] left-[1.2rem]">
                <h3 className="text-[2rem] font-bold text-white leading-tight">{dest.name}</h3>
                <p className="text-[#FFDA00] text-[1.2rem]">{dest.resort}</p>
              </div>
            </div>

            {/* Body */}
            <div className="p-[1.4rem]">
              <div className="flex items-center gap-[1.2rem] text-[1.2rem] text-neutral-40 mb-[1.2rem]">
                <span className="flex items-center gap-[0.3rem]">
                  <Clock size={12} aria-hidden="true" />{dest.duration}
                </span>
                <span className="flex items-center gap-[0.3rem]">
                  <MapPin size={12} aria-hidden="true" />{dest.dates}
                </span>
              </div>
              <ul className="space-y-[0.4rem] mb-[1.4rem]">
                {dest.highlights.slice(0, 3).map((h) => (
                  <li key={h} className="text-[1.2rem] text-neutral-50 flex items-start gap-[0.6rem]">
                    <span className="text-brand-primary mt-[0.1rem]">·</span>{h}
                  </li>
                ))}
              </ul>
              <Link href={`/booking?destination=${dest.id}`}>
                <Button variant="secondary" size="sm" className="w-full">Đặt ngay</Button>
              </Link>
            </div>
          </article>
        ))}
      </div>
      </div>
    </section>
  );
}
