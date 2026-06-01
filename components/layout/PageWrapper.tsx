import Navbar from "./Navbar";
import BottomNav from "./BottomNav";
import ChatbotWidget from "@/components/features/ChatbotWidget";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageWrapper({ children, className = "" }: PageWrapperProps) {
  return (
    <>
      <Navbar />
      <main
        className={`min-h-screen pt-0 md:pt-16 pb-16 md:pb-0 ${className}`}
      >
        {children}
      </main>
      <BottomNav />
      <ChatbotWidget />
    </>
  );
}
