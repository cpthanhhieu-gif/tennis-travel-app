"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Home, MapPin, Trophy, CreditCard, Tag, Settings } from "lucide-react";
import { mockUser } from "@/lib/mock-data";

const TIER_COLOR: Record<string, string> = {
  Bronze: "bg-amber-700",
  Silver: "bg-slate-400",
  Gold:   "bg-yellow-500",
  Diamond:"bg-cyan-400",
};

const NAV_ITEMS = [
  { href: "/",           label: "Trang chủ",   Icon: Home },
  { href: "/pre-tour",   label: "Hành trình",  Icon: MapPin },
  { href: "/gamification",label: "Thành tích", Icon: Trophy },
  { href: "/share-card", label: "Thẻ của tôi", Icon: CreditCard },
];

const SECONDARY_ITEMS = [
  { href: "/#promo",     label: "Ưu đãi",      Icon: Tag },
  { href: "/settings",   label: "Cài đặt",     Icon: Settings },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({ open, onClose }: Props) {
  const pathname = usePathname();
  const tierBg = TIER_COLOR[mockUser.tier] ?? "bg-brand-primary";

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-90/50"
        onClick={onClose}
        aria-hidden
      />

      {/* Drawer panel */}
      <nav
        role="dialog"
        aria-modal="true"
        aria-label="Menu điều hướng"
        className="relative w-[80%] max-w-[300px] h-full bg-neutral-01 flex flex-col shadow-elevated animate-in slide-in-from-left duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-14 pb-5 border-b border-neutral-05">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-neutral-01 font-bold text-base ${tierBg}`}>
              {mockUser.firstName.charAt(0)}
            </div>
            <div>
              <p className="text-neutral-90 font-bold text-sm leading-tight">{mockUser.name}</p>
              <span className={`inline-flex items-center gap-1 ${tierBg} text-neutral-01 text-[0.65rem] font-bold px-2 py-0.5 rounded-full mt-0.5`}>
                <Trophy size={9} /> {mockUser.tier}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng menu"
            className="w-9 h-9 rounded-full bg-neutral-03 flex items-center justify-center text-neutral-50 hover:bg-neutral-05 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            <X size={16} aria-hidden />
          </button>
        </div>

        {/* Primary nav */}
        <ul className="flex flex-col px-3 pt-4 gap-1" role="list">
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-primary ${
                    active
                      ? "bg-brand-tint text-brand-primary"
                      : "text-neutral-50 hover:bg-neutral-03"
                  }`}
                >
                  <Icon size={18} aria-hidden />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Divider */}
        <div className="mx-5 my-3 border-t border-neutral-05" />

        {/* Secondary nav */}
        <ul className="flex flex-col px-3 gap-1" role="list">
          {SECONDARY_ITEMS.map(({ href, label, Icon }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-primary ${
                    active
                      ? "bg-brand-tint text-brand-primary"
                      : "text-neutral-50 hover:bg-neutral-03"
                  }`}
                >
                  <Icon size={18} aria-hidden />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Version */}
        <p className="mt-auto px-5 pb-8 text-neutral-30 text-xs">
          Vietravel Tennis Travel v1.0
        </p>
      </nav>
    </div>
  );
}
