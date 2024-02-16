"use client";

import PostTweetForm from "@/components/post-tweet-form";
import Timeline from "@/components/timeline";
import { auth } from "@/src/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [loginCheck, setLoginCheck] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user === null) router.push("/signIn");
    else setLoginCheck(true);
  }, [router]);

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
