import DemoBanner from "./DemoBanner";
import ActiveNavigation from "./ActiveNavigation";

import ChatbotWidget from "@/components/features/ChatbotWidget";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageWrapper({ children, className = "" }: PageWrapperProps) {
  return (
    <>
      <ActiveNavigation />
      <main
        id="app-main"
        tabIndex={-1}
        className={`ds-main app-surface min-h-screen ${className}`}
        style={{ paddingBottom: "calc(6.4rem + env(safe-area-inset-bottom, 0px))" }}
      >
        <DemoBanner />
        {children}
      </main>
      <ActiveNavigation mobile />
      <ChatbotWidget />
    </>
  );
}
