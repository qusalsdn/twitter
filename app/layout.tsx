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
      <body className="bg-slate-700 text-white font-sans box-border">
        <h1>Layout</h1>
        {children}
      </body>
    </html>
  );
}
