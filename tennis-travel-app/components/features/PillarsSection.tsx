import { Zap, UtensilsCrossed, Building2 } from "lucide-react";

const pillars = [
  {
    icon: Zap,
    title: "Tennis cùng HLV Vietravel",
    description: "HLV Vietravel đồng hành, sân ITF chuẩn quốc tế — phân loại NTRP để bạn thi đấu đúng trình độ.",
    iconColor: "text-brand-primary",
    accent: "bg-brand-tint",
    tag: "HLV chuyên nghiệp",
  },
  {
    icon: UtensilsCrossed,
    title: "Ẩm thực FEI",
    description: "Menu FEI thiết kế riêng cho vận động viên — ăn ngon mà vẫn phục hồi tốt sau mỗi buổi thi đấu.",
    iconColor: "text-success",
    accent: "bg-success-light",
    tag: "FEI ≥85",
  },
  {
    icon: Building2,
    title: "Nghỉ dưỡng 5★",
    description: "Resort cao cấp, spa phục hồi sau thi đấu — Vietravel lo từng chi tiết để bạn tận hưởng trọn vẹn.",
    iconColor: "text-purple",
    accent: "bg-purple-light",
    tag: "5 sao",
  },
];

export default function PillarsSection() {
  return (
    <section className="pt-[2.4rem] pb-[0.8rem] bg-neutral-03" aria-labelledby="pillars-title">
      {/* Header */}
      <div className="px-[1.6rem] mb-[1.6rem]">
        <h2 id="pillars-title" className="text-[1.8rem] font-bold text-neutral-90">
          Ba trụ cột <span className="text-brand-primary">Signature</span>
        </h2>
        <p className="text-neutral-40 text-[1.3rem] mt-[0.3rem]">
          Hành trình tennis trọn vẹn — Vietravel lo từ A đến Z
        </p>
      </div>

      {/* Horizontal scroll */}
      <div className="px-[1.6rem] overflow-hidden">
      <div
        className="flex gap-[1.2rem] overflow-x-auto pb-[2rem] snap-x snap-mandatory scroll-x-hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {pillars.map(({ icon: Icon, title, description, iconColor, accent, tag }) => (
          <article
            key={title}
            className="snap-start flex-shrink-0 w-[19rem] bg-neutral-01 rounded-[1.2rem] border border-neutral-05 shadow-[rgba(0,0,0,0.06)_0px_2px_8px] p-[1.6rem]"
          >
            <div className={`inline-flex items-center justify-center w-[4.8rem] h-[4.8rem] rounded-[1rem] ${accent} mb-[1.2rem]`}>
              <Icon size={24} className={iconColor} aria-hidden="true" />
            </div>
            <span className={`inline-block text-[1.0rem] font-bold px-[0.8rem] py-[0.2rem] rounded-full ${accent} ${iconColor} mb-[0.8rem]`}>
              {tag}
            </span>
            <h3 className="text-[1.5rem] font-bold text-neutral-90 mb-[0.6rem] leading-tight">
              {title}
            </h3>
            <p className="text-neutral-50 text-[1.3rem] leading-relaxed">
              {description}
            </p>
          </article>
        ))}
      </div>
      </div>
    </section>
  );
}
