import PageWrapper from "@/components/layout/PageWrapper";
import PreTourDashboard from "@/components/features/PreTourDashboard";

export const metadata = { title: "Pre-tour Dashboard — Tennis Travel Experience" };

export default function PreTourPage() {
  return (
    <PageWrapper>
      <PreTourDashboard />
    </PageWrapper>
  );
}
