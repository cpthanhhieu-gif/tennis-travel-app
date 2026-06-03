import { Dumbbell } from "lucide-react";
import VietravelIcon from "@/components/ui/VietravelIcon";

export default function HomeFooter() {
  return (
    <footer className="bg-neutral-90 py-[4.8rem] px-[1.6rem] md:px-[2.4rem] lg:px-[3.2rem]">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[3.2rem] mb-[3.2rem]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-[0.8rem] mb-[1.2rem]">
              <Dumbbell size={26} className="text-[#FFDA00]" aria-hidden="true" />
              <div>
                <p className="font-bold text-[1.6rem] text-[#FFDA00]">
                  Tennis Travel Experience
                </p>
                <p className="text-white/50 text-[1.2rem]">by Vietravel</p>
              </div>
            </div>
            <p className="text-white/60 text-[1.4rem] leading-relaxed">
              Nâng tầm giá trị cuộc sống qua hành trình tennis trọn vẹn — Tennis, Ẩm thực FEI và Nghỉ dưỡng 5 sao.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-[1.6rem] text-white mb-[1.2rem]">
              Liên kết nhanh
            </h3>
            <ul className="space-y-[0.8rem] text-[1.4rem] text-white/60">
              {[
                { href: "/", label: "Trang chủ" },
                { href: "/booking", label: "Bắt đầu hành trình" },
                { href: "/pre-tour", label: "Trước hành trình" },
                { href: "/gamification", label: "Tích điểm XP" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="hover:text-brand-tint transition-colors focus:outline-none focus:text-brand-tint"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-[1.6rem] text-white mb-[1.2rem]">
              Liên hệ
            </h3>
            <ul className="space-y-[0.8rem] text-[1.4rem] text-white/60">
              <li className="flex items-center gap-[0.8rem]"><VietravelIcon id="call-bold" size={14} /> 1800 5888</li>
              <li className="flex items-center gap-[0.8rem]"><VietravelIcon id="email-bold" size={14} /> tennisexperience@vietravel.com</li>
              <li className="flex items-center gap-[0.8rem]"><VietravelIcon id="location-bold" size={14} /> 190 Pasteur, Q3, TP.HCM</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-[2.4rem] flex flex-col md:flex-row justify-between items-center gap-[1.6rem]">
          <p className="text-white/40 text-[1.2rem]">
            © 2026 Vietravel. Tennis Travel Experience — Spec v1.0 · Product to Lead 2026
          </p>
          <p className="text-white/40 text-[1.2rem]">
            Thiết kế bởi Nguyễn Thủy Tiên — Ban Nhân chính, Vietravel
          </p>
        </div>
      </div>
    </footer>
  );
}
