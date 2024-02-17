"use client";

import Timeline from "@/components/timeline";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;
  const [loginCheck, setLoginCheck] = useState(false);

  useEffect(() => {
    if (user === null) router.push("/signIn");
    else setLoginCheck(true);
  }, [router, user]);

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
