"use client";

import { useState } from "react";
import HeroSection from "@/components/features/HeroSection";
import LEIToursSection from "@/components/features/LEIToursSection";
import PromoSection from "@/components/features/PromoSection";
import ToursSection from "@/components/features/ToursSection";
import MobileMenu from "@/components/features/MobileMenu";

export default function HomeContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSbu, setFilterSbu] = useState<string>("all");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <HeroSection
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        filterSbu={filterSbu}
        onFilter={setFilterSbu}
        onMenuOpen={() => setMenuOpen(true)}
      />
      <LEIToursSection />
      <PromoSection />
      <ToursSection searchQuery={searchQuery} filterSbu={filterSbu} />
    </>
  );
}
