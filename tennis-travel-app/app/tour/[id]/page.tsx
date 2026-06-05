import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { leiEsgTours, type ESGTier } from "@/lib/mock-data";
import PageWrapper from "@/components/layout/PageWrapper";
import LEIScoreCard from "@/components/features/LEIScoreCard";
import ESGScoreCard from "@/components/features/ESGScoreCard";
import LocalProProfile from "@/components/ui/LocalProProfile";
import TourDetailBookingSection from "@/components/features/TourDetailBookingSection";

// ── ESG style helpers ────────────────────────────────────────────────────────
const ESG_BADGE: Record<ESGTier, { bg: string; text: string; emoji: string }> = {
  "Green Champion": { bg: "bg-success-light", text: "text-success",     emoji: "🟢" },
  "Eco Friendly":   { bg: "bg-yellow-light",  text: "text-yellow-dark", emoji: "🟡" },
  "Standard":       { bg: "bg-neutral-03",    text: "text-neutral-40",  emoji: "⚪" },
};

// ── Page ────────────────────────────────────────────────────────────────────
export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tour = leiEsgTours.find((t) => t.id === id);
  if (!tour) notFound();

  const badge = ESG_BADGE[tour.esg.tier];

  return (
    <PageWrapper>

      {/* ── Back navigation ── */}
      <div className="px-4 pt-4 pb-2 flex items-center gap-2">
        <Link
          href="/"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-03 hover:bg-neutral-05 transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 shrink-0"
          aria-label="Quay lại trang chủ"
        >
          <ArrowLeft size={18} className="text-neutral-90" aria-hidden="true" />
        </Link>
        <p className="text-sm font-semibold text-neutral-90 truncate">
          Tour Tennis Bản Địa
        </p>
      </div>

      {/* ── Hero image ── */}
      <div
        className="relative mx-4 rounded-xl overflow-hidden mb-4"
        style={{ height: "18rem" }}
      >
        <Image
          src={tour.image}
          alt={`Ảnh tour ${tour.name}`}
          fill
          className="object-cover"
          sizes="(max-width: 393px) 361px, 393px"
          priority
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-90/65 to-transparent" />

        {/* LEI + ESG badges nổi trên ảnh */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          {/* LEI */}
          <div className="flex items-center gap-1 bg-neutral-90/75 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-xs font-medium text-neutral-01/70">LEI</span>
            <span className="text-lg font-extrabold text-yellow-accent leading-none">
              {tour.lei.total}
            </span>
            <span className="text-xs text-neutral-01/50">/100</span>
          </div>
          {/* ESG tier */}
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${badge.bg}`}>
            <span className="text-xs leading-none" aria-hidden="true">{badge.emoji}</span>
            <span className={`text-xs font-semibold leading-none ${badge.text}`}>
              {tour.esg.tier}
            </span>
          </div>
        </div>
      </div>

      {/* ── Tour header ── */}
      <div className="px-4 mb-4">
        {/* Địa điểm */}
        <div className="flex items-center gap-1 mb-1">
          <MapPin size={12} className="text-neutral-30 shrink-0" aria-hidden="true" />
          <span className="text-xs text-neutral-30">{tour.location}</span>
        </div>

        {/* Tên tour */}
        <h1 className="text-xl font-bold text-neutral-90 leading-snug mb-2">
          {tour.name}
        </h1>

        {/* LEI badge label */}
        <span className="inline-flex items-center gap-1 bg-brand-tint text-brand-primary text-xs font-semibold px-2 py-0.5 rounded-full">
          ⭐ {tour.lei.badge}
        </span>
      </div>

      {/* ── Score cards + Local Pro ── */}
      <div className="px-4">
        <LEIScoreCard data={tour} />
        <ESGScoreCard data={tour} />
        <LocalProProfile data={tour} />
      </div>

      {/* ── Booking section ── */}
      <TourDetailBookingSection tour={tour} />

    </PageWrapper>
  );
}

// ── Static params cho build ────────────────────────────────────────────────
export function generateStaticParams() {
  return leiEsgTours.map((tour) => ({ id: tour.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tour = leiEsgTours.find((t) => t.id === id);
  return {
    title: tour
      ? `${tour.name} — Tennis Travel Experience`
      : "Tour không tồn tại",
  };
}
