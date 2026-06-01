import type { Metadata, Viewport } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";
import IPhoneFrame from "@/components/layout/IPhoneFrame";

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Tennis Travel Experience — Ace & Taste Journey",
  description: "Sản phẩm Sportcation Signature đầu tiên tại Việt Nam kết hợp Tennis + Ẩm thực FEI + Nghỉ dưỡng 5 sao",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${mulish.variable} h-full`}>
      <body className="text-neutral-90">
        <IPhoneFrame>
          {children}
        </IPhoneFrame>
      </body>
    </html>
  );
}
