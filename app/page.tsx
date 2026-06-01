import PageWrapper from "@/components/layout/PageWrapper";
import HomeContent from "@/components/features/HomeContent";
import QualitySection from "@/components/features/QualitySection";
import DestinationsSection from "@/components/features/DestinationsSection";

export default function HomePage() {
  return (
    <PageWrapper>
      <h1 className="sr-only">Tennis Travel Experience — Ace & Taste Journey by Vietravel</h1>
      <HomeContent />
      <DestinationsSection />
      <QualitySection />
    </PageWrapper>
  );
}
