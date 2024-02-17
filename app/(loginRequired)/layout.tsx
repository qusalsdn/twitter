"use client";

import Navbar from "@/components/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex mt-16 space-x-16">
      <Navbar />
      {children}
    </div>
  );
}
