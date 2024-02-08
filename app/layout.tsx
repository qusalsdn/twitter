import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "twitter clone",
  description: "twitter clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="bg-black text-white font-sans box-border">{children}</body>
    </html>
  );
}
