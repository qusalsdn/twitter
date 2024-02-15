"use client";

import PostTweetForm from "@/components/post-tweet-form";
import { auth } from "@/src/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Edit({ params: { id } }: { params: { id: string } }) {
  const router = useRouter();
  const [loginCheck, setLoginCheck] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user === null) router.push("/signIn");
    else setLoginCheck(true);
  }, [router]);

  return (
    <div className="w-[1000px]">
      {loginCheck && (
        <div className="space-y-10">
          <PostTweetForm id={id} />
        </div>
      )}
    </div>
  );
}
