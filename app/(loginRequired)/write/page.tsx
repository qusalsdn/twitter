"use client";

import PostTweetForm from "@/components/post-tweet-form";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Write() {
  const router = useRouter();
  const [loginCheck, setLoginCheck] = useState(false);

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) setLoginCheck(true);
    else router.push("/signIn");
  });

  return (
    <div className="w-[1000px]">
      {loginCheck && (
        <div className="space-y-10">
          <PostTweetForm />
        </div>
      )}
    </div>
  );
}
