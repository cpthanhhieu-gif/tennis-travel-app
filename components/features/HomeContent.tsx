"use client";

import { useState } from "react";
import HeroSection from "@/components/features/HeroSection";
import ToursSection from "@/components/features/ToursSection";

export default function HomeContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSbu, setFilterSbu] = useState<string>("all");

  return (
    <>
      <HeroSection
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        filterSbu={filterSbu}
        onFilter={setFilterSbu}
      />
      <ToursSection searchQuery={searchQuery} filterSbu={filterSbu} />
    </>
  );
}
