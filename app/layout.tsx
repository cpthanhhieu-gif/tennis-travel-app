import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./design-system/next.css";
import { cookies } from "next/headers";
import { DESIGN_THEME_COOKIE, resolveDesignTheme } from "@/lib/design-theme";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Tennis Travel Experience — Ace & Taste Journey",
  description: "Sản phẩm Sportcation Signature đầu tiên tại Việt Nam kết hợp Tennis + Ẩm thực FEI + Nghỉ dưỡng 5 sao",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = resolveDesignTheme((await cookies()).get(DESIGN_THEME_COOKIE)?.value);
  return (
    <html lang="vi" className="h-full" data-design-theme={theme}>
      <body className="text-neutral-90">
        {children}
      </body>
    </html>
  );
}
