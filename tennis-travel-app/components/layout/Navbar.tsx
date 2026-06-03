"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, User, Dumbbell } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { mockUser } from "@/lib/mock-data";

const navLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/booking", label: "Đặt tour" },
  { href: "/pre-tour", label: "Hành trình" },
  { href: "/in-tour", label: "Live Tour" },
  { href: "/gamification", label: "Thành tích" },
  { href: "/share-card", label: "Thẻ của tôi" },
];

/**
 * Navbar — Vietravel Design System
 * Desktop only (hidden on mobile — BottomNav takes over)
 * Height: 56px, white bg, border-bottom neutral-10
 */
export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Điều hướng chính"
      className="hidden md:flex fixed top-0 left-0 right-0 z-[200] bg-neutral-01 border-b border-neutral-10 h-[56px] items-center px-6 lg:px-8 shadow-[rgba(0,0,0,0.08)_0px_2px_8px]"
    >
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-[0.8rem] mr-[3.2rem] focus:outline-none focus:ring-2 focus:ring-brand-primary rounded-[0.8rem] p-1"
        aria-label="Tennis Travel Experience — Trang chủ"
      >
        <Dumbbell size={22} className="text-brand-primary" aria-hidden="true" />
        <span className="text-[1.4rem] font-bold text-brand-primary leading-tight">
          Tennis Travel
          <span className="block text-neutral-40 font-medium text-[1.1rem]">
            by Vietravel
          </span>
        </span>
      </Link>

      {/* Nav links */}
      <ul className="flex items-center gap-1 flex-1" role="list">
        {navLinks.map((link) => {
          const active = pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`px-[1.2rem] py-[0.8rem] rounded-[0.8rem] text-[1.4rem] font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary min-h-[44px] flex items-center ${
                  active
                    ? "text-brand-primary bg-brand-tint font-bold"
                    : "text-neutral-50 hover:text-brand-primary hover:bg-brand-tint-light"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* User info */}
      <div className="flex items-center gap-[1.2rem]">
        <Badge variant="tier" tier="Silver">
          <Trophy size={12} aria-hidden="true" />
          Silver
        </Badge>
        <div className="flex items-center gap-[0.8rem] px-[1.2rem] py-[0.6rem] rounded-[0.8rem] bg-neutral-03 border border-neutral-10">
          <User size={16} className="text-brand-primary" aria-hidden="true" />
          <span className="text-[1.4rem] text-neutral-90 font-medium">{mockUser.firstName}</span>
          <Badge variant="brand">{mockUser.xp.toLocaleString("vi-VN")} XP</Badge>
        </div>
      </div>
    </nav>
  );
}
