import PageWrapper from "@/components/layout/PageWrapper";
import AceClubDashboard from "@/components/features/AceClubDashboard";

export const metadata = { title: "Ace Club & Ace Points — Tennis Travel Experience" };

export default function GamificationPage() {
  return (
    <PageWrapper>
      <AceClubDashboard />
    </PageWrapper>
  );
}
