import PageWrapper from "@/components/layout/PageWrapper";
import TransportResults from "@/components/features/TransportResults";

type Search = Record<string, string | string[] | undefined>;
const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;

export default async function TransportResultsPage({ searchParams }: { searchParams: Promise<Search> }) {
  const params = await searchParams;
  const initialSearch = Object.fromEntries(["mode", "from", "to", "date", "rideId", "passengers", "bookingId", "tourId"].map(key => [key, first(params[key])]));
  return <PageWrapper><TransportResults initialSearch={initialSearch}/></PageWrapper>;
}
