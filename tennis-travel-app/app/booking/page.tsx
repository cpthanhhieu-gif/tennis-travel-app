import { BookingProvider } from "@/lib/BookingContext";
import BookingFlow from "@/components/features/BookingFlow";
import PageWrapper from "@/components/layout/PageWrapper";

export const metadata = { title: "Đặt Tour — Tennis Travel Experience" };

export default function BookingPage() {
  return (
    <PageWrapper>
      <BookingProvider>
        <BookingFlow />
      </BookingProvider>
    </PageWrapper>
  );
}
