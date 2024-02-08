"use client";

import { auth } from "@/src/firebase";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const user = auth.currentUser;
  if (user === null) router.replace("/signIn");

  const onClickLogout = () => {
    auth.signOut();
  };

  return (
    <h1>
      <button onClick={onClickLogout}>로그아웃</button>
    </h1>
  );
}
