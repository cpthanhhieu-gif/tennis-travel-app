import PageWrapper from "@/components/layout/PageWrapper";
import TransportDiscovery from "@/components/features/TransportDiscovery";

type Search = Record<string, string | string[] | undefined>;
const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;

export default async function TransportPage({ searchParams }: { searchParams: Promise<Search> }) {
  const params = await searchParams;
  const initialSearch = Object.fromEntries(["mode", "from", "to", "date", "passengers"].map(key => [key, first(params[key])]));
  return <PageWrapper><TransportDiscovery key={JSON.stringify(initialSearch)} initialSearch={initialSearch}/></PageWrapper>;
}
