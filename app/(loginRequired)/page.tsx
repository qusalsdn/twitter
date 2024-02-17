"use client";

import Timeline from "@/components/timeline";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [loginCheck, setLoginCheck] = useState(false);

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) setLoginCheck(true);
    else router.push("/signIn");
  });

  return (
    <div className="w-full pr-36">
      {loginCheck && (
        <div className="space-y-10">
          <Timeline />
        </div>
      )}
    </div>
  );
}
