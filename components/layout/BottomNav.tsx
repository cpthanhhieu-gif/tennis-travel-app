"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MapPin, Trophy, CreditCard, Plus } from "lucide-react";

const tabs = [
  { href: "/", label: "Trang chủ", Icon: Home },
  { href: "/pre-tour", label: "Hành trình", Icon: MapPin },
  { href: "/gamification", label: "Thành tích", Icon: Trophy },
  { href: "/share-card", label: "Thẻ của tôi", Icon: CreditCard },
];

/**
 * BottomNav — Phase 4 redesign
 * - 4 tabs + FAB center (quick booking)
 * - Active state: pill bg highlight (không dùng border-top nữa)
 * - FAB: nổi lên trên nav bar
 */
export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Điều hướng nhanh"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-10 pb-safe shadow-[rgba(0,0,0,0.10)_0px_-4px_16px]"
    >
      <ul className="flex items-center relative" role="list">
        {/* Left 2 tabs */}
        {tabs.slice(0, 2).map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className="flex flex-col items-center justify-center gap-[0.3rem] py-[1rem] w-full focus:outline-none"
              >
                {/* Pill highlight khi active */}
                <span
                  className={`flex items-center justify-center w-[4rem] h-[2.8rem] rounded-full transition-all duration-200 ${
                    active ? "bg-brand-primary/12" : ""
                  }`}
                >
                  <Icon
                    size={20}
                    aria-hidden="true"
                    className={active ? "text-brand-primary" : "text-neutral-40"}
                  />
                </span>
                <span
                  className={`text-[1.0rem] font-semibold leading-none ${
                    active ? "text-brand-primary" : "text-neutral-40"
                  }`}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}

        {/* ── FAB center ── */}
        <li className="flex-shrink-0 flex items-center justify-center px-[1.2rem]">
          <Link
            href="/booking"
            aria-label="Đặt tour nhanh"
            className="relative -top-[1.6rem] w-[5.6rem] h-[5.6rem] rounded-full bg-brand-primary shadow-[rgba(0,80,200,0.40)_0px_6px_20px] flex items-center justify-center transition-transform active:scale-95"
          >
            <Plus size={26} className="text-white" strokeWidth={2.5} />
          </Link>
        </li>

        {/* Right 2 tabs */}
        {tabs.slice(2).map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className="flex flex-col items-center justify-center gap-[0.3rem] py-[1rem] w-full focus:outline-none"
              >
                <span
                  className={`flex items-center justify-center w-[4rem] h-[2.8rem] rounded-full transition-all duration-200 ${
                    active ? "bg-brand-primary/12" : ""
                  }`}
                >
                  <Icon
                    size={20}
                    aria-hidden="true"
                    className={active ? "text-brand-primary" : "text-neutral-40"}
                  />
                </span>
                <span
                  className={`text-[1.0rem] font-semibold leading-none ${
                    active ? "text-brand-primary" : "text-neutral-40"
                  }`}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
