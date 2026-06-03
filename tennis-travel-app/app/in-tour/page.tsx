import PageWrapper from "@/components/layout/PageWrapper";
import InTourLive from "@/components/features/InTourLive";

export const metadata = { title: "In-tour Live — Tennis Travel Experience" };

export default function InTourPage() {
  return (
    <PageWrapper>
      <InTourLive />
    </PageWrapper>
  );
}
