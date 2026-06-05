import { CheckCircle } from "lucide-react";
import { LEIESGTour } from "@/lib/mock-data";

interface Props {
  data: LEIESGTour;
}

export default function LocalProProfile({ data }: Props) {
  const { localPro } = data;
  const initials = localPro.name
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="rounded-xl bg-neutral-03 border border-neutral-10 p-3 mb-3">
      <p className="text-xs font-semibold text-neutral-40 uppercase tracking-wide mb-2">
        HLV Bản Địa
      </p>

      <div className="flex items-start gap-3">
        {/* Avatar initials */}
        <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center shrink-0">
          <span className="text-sm font-bold text-neutral-01">{initials}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-0.5">
            <p className="text-sm font-bold text-neutral-90">{localPro.name}</p>
            {localPro.verified && (
              <CheckCircle size={14} className="text-success shrink-0" aria-label="Đã xác minh" />
            )}
          </div>
          <p className="text-xs text-neutral-40 mb-2">
            HLV local · {localPro.experience} năm kinh nghiệm
          </p>
          <p className="text-xs text-neutral-50 italic leading-relaxed">
            "{localPro.quote}"
          </p>
        </div>
      </div>
    </div>
  );
}
