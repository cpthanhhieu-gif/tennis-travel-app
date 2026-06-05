import { MapPin, CheckCircle, Leaf, Users } from "lucide-react";
import { LEIESGTour } from "@/lib/mock-data";

const CRITERIA = [
  { key: "localCourt" as const,     label: "Sân tennis địa phương", weight: "30%", icon: <MapPin size={12} /> },
  { key: "localPro" as const,       label: "HLV / Partner bản địa", weight: "30%", icon: <CheckCircle size={12} /> },
  { key: "localCulture" as const,   label: "Ẩm thực & văn hóa",    weight: "25%", icon: <Users size={12} /> },
  { key: "localTransport" as const, label: "Di chuyển bản địa",     weight: "15%", icon: <Leaf size={12} /> },
];

const CAPTIONS: Record<string, string> = {
  "dalat-local-tennis-4d":    "Sân cộng đồng 20 năm — không phải resort",
  "hoian-heritage-tennis-3d": "Phố cổ, người thật, trải nghiệm thật",
  "nhatrang-beach-tennis-3d": "Sân mặt biển với HLV địa phương lâu năm",
};

interface Props {
  data: LEIESGTour;
}

export default function LEIScoreCard({ data }: Props) {
  const { breakdown } = data.lei;
  const caption = CAPTIONS[data.id] ?? "Trải nghiệm bản địa đích thực";

  return (
    <div className="rounded-xl bg-brand-tint-light border border-brand-tint p-3 mb-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs font-semibold text-brand-primary uppercase tracking-wide">Chỉ số bản địa</p>
          <p className="text-sm font-bold text-neutral-90">LEI Score</p>
          <p className="text-xs text-neutral-40">Living Experience Index</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center shrink-0">
          <span className="text-xl font-extrabold text-neutral-01">{data.lei.total}</span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-2 mb-3">
        {CRITERIA.map((c) => (
          <div key={c.key} className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-brand-tint flex items-center justify-center text-brand-primary shrink-0">
              {c.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-neutral-90 truncate">{c.label}</p>
                <span className="text-xs text-neutral-30 ml-2 shrink-0">{c.weight}</span>
              </div>
              <div className="h-1 bg-brand-tint rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-primary rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${breakdown[c.key]}%` }}
                />
              </div>
            </div>
            <span className="text-xs font-bold text-brand-primary w-6 text-right shrink-0">
              {breakdown[c.key]}
            </span>
          </div>
        ))}
      </div>

      {/* Caption */}
      <div className="flex items-start gap-1 pt-2 border-t border-brand-tint">
        <span className="text-xs">💡</span>
        <p className="text-xs text-neutral-40 italic">"{caption}"</p>
      </div>
    </div>
  );
}
