"use client";

import Navbar from "@/components/navbar";
import { auth } from "@/src/firebase";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const user = auth.currentUser;
  }, []);

  return (
    <div className="flex mt-16 space-x-16">
      <Navbar />
      {children}
    </div>
  );
}
