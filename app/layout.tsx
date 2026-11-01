import type { Metadata, Viewport } from "next";
import "./globals.css";

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
    <html lang="vi" className="h-full">
      <body className="text-neutral-90">
        {children}
      </body>
    </html>
  );
}
