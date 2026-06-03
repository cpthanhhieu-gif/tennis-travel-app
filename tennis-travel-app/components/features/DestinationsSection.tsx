import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { destinations } from "@/lib/mock-data";
import { MapPin, Clock } from "lucide-react";

export default function DestinationsSection() {
  return (
    <section className="pt-10 pb-2 bg-neutral-03" aria-labelledby="destinations-title">
      {/* Header */}
      <div className="px-4 mb-4">
        <h2 id="destinations-title" className="text-[1.8rem] font-bold text-neutral-90">
          Điểm đến <span className="text-brand-primary">Pilot 2026</span>
        </h2>
        <p className="text-neutral-40 text-[1.3rem] mt-0.5">
          Ra mắt tháng 6/2026 · Đặt sớm nhận ưu đãi
        </p>
      </div>

      {/* Horizontal scroll */}
      <div className="px-4 overflow-hidden">
        <div className="flex gap-3 overflow-x-auto pb-5 snap-x snap-mandatory scroll-x-hidden">
          {destinations.map((dest) => (
            <article
              key={dest.id}
              className="snap-start flex-shrink-0 w-[27rem] rounded-xl overflow-hidden bg-neutral-01 border border-neutral-05 shadow-card flex flex-col"
            >
              {/* Image */}
              <div className="relative" style={{ height: "var(--destination-card-image-height)" }}>
                <Image
                  src={dest.image}
                  alt={`${dest.name} — điểm đến Tennis Travel Experience`}
                  fill
                  className="object-cover"
                  sizes="270px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-90/75 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <h3 className="text-[2rem] font-bold text-neutral-01 leading-tight">{dest.name}</h3>
                  <p className="text-yellow-accent text-[1.2rem]">{dest.resort}</p>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center gap-3 text-[1.2rem] text-neutral-40 mb-3">
                  <span className="flex items-center gap-1">
                    <Clock size={12} aria-hidden="true" />{dest.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} aria-hidden="true" />{dest.resort}
                  </span>
                </div>
                <ul className="space-y-1 mb-4 flex-1">
                  {dest.highlights.slice(0, 3).map((h) => (
                    <li key={h} className="text-[1.2rem] text-neutral-50 flex items-start gap-1.5">
                      <span className="text-brand-primary mt-0.5" aria-hidden="true">·</span>{h}
                    </li>
                  ))}
                </ul>
                <Link href={`/booking?destination=${dest.id}`}>
                  <Button variant="secondary" size="sm" className="w-full">Bắt đầu hành trình</Button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
