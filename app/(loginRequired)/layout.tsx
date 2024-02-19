"use client";

import Navbar from "@/components/navbar";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [loginCheck, setLoginCheck] = useState(false);

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) setLoginCheck(true);
  });

  return (
    <div className="flex mt-16 space-x-16">
      {loginCheck && <Navbar />}
      {children}
    </div>
  );
}
