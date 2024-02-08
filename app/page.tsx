"use client";

import { auth } from "@/src/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const user = auth.currentUser;
    if (user === null) router.replace("/signIn");
  }, [router]);

  const onClickLogout = () => {
    auth.signOut();
    router.replace("/signIn");
  };

  return (
    <h1>
      <button onClick={onClickLogout}>로그아웃</button>
    </h1>
  );
}
