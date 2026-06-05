import { Leaf, Users, Shield } from "lucide-react";
import { LEIESGTour, ESGTier } from "@/lib/mock-data";

const TIER_STYLE: Record<ESGTier, { bgClass: string; textClass: string; label: string }> = {
  "Green Champion": { bgClass: "bg-success",      textClass: "text-neutral-01", label: "🟢 Green Champion" },
  "Eco Friendly":   { bgClass: "bg-yellow-accent", textClass: "text-yellow-dark", label: "🟡 Eco Friendly" },
  "Standard":       { bgClass: "bg-neutral-10",   textClass: "text-neutral-50", label: "⚪ Standard" },
};

const PILLARS = [
  { key: "environmental" as const, label: "E — Môi trường", icon: <Leaf size={12} />,   barClass: "bg-success" },
  { key: "social" as const,        label: "S — Xã hội",    icon: <Users size={12} />,  barClass: "bg-brand-primary" },
  { key: "governance" as const,    label: "G — Quản trị",  icon: <Shield size={12} />, barClass: "bg-purple" },
];

interface Props {
  data: LEIESGTour;
}

export default function ESGScoreCard({ data }: Props) {
  const { esg } = data;
  const tier = TIER_STYLE[esg.tier];
  const { impact } = esg;

  return (
    <div className="rounded-xl bg-success-light border border-success/20 p-3 mb-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs font-semibold text-success uppercase tracking-wide">Chỉ số xanh</p>
          <p className="text-sm font-bold text-neutral-90">ESG Score</p>
          <p className="text-xs text-neutral-40">Environmental · Social · Governance</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="w-12 h-12 rounded-full bg-success flex items-center justify-center shrink-0">
            <span className="text-xl font-extrabold text-neutral-01">{esg.total}</span>
          </div>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tier.bgClass} ${tier.textClass}`}>
            {tier.label}
          </span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-2 mb-3">
        {PILLARS.map((p) => (
          <div key={p.key} className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-neutral-01/60 flex items-center justify-center text-success shrink-0">
              {p.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-neutral-90 truncate">{p.label}</p>
              </div>
              <div className="h-1 bg-neutral-01/60 rounded-full overflow-hidden">
                <div
                  className={`h-full ${p.barClass} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${esg.breakdown[p.key]}%` }}
                />
              </div>
            </div>
            <span className="text-xs font-bold text-success w-6 text-right shrink-0">
              {esg.breakdown[p.key]}
            </span>
          </div>
        ))}
      </div>

      {/* Impact Preview */}
      <div className="bg-neutral-01/70 rounded-lg px-3 py-2">
        <p className="text-xs font-semibold text-neutral-90 mb-2">Impact nếu bạn đặt tour này:</p>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          <div className="flex items-center gap-1">
            <span className="text-xs">🌱</span>
            <span className="text-xs text-neutral-50">tiết {impact.co2Saved} kg CO₂</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs">👨‍👩‍👧</span>
            <span className="text-xs text-neutral-50">{impact.localFamiliesSupported} gia đình local</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs">🎾</span>
            <span className="text-xs text-neutral-50">{impact.localProSessions} buổi HLV bản địa</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs">💰</span>
            <span className="text-xs text-neutral-50">{impact.localRevenuePercent}% về cộng đồng</span>
          </div>
        </div>
      </div>
    </div>
  );
}
