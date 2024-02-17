"use client";

import PostTweetForm from "@/components/post-tweet-form";
import { auth } from "@/src/firebase";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Edit({ params: { id } }: { params: { id: string } }) {
  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;
  const [loginCheck, setLoginCheck] = useState(false);

  useEffect(() => {
    if (user === null) router.push("/signIn");
    else setLoginCheck(true);
  }, [router, user]);

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
