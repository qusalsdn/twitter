"use client";

import { auth } from "@/src/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [loginCheck, setLoginCheck] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user === null) router.replace("/signIn");
    else setLoginCheck(true);
  }, [router]);

  const onClickLogout = () => {
    auth.signOut();
    router.replace("/signIn");
  };

  return <div>{loginCheck && <button onClick={onClickLogout}>로그아웃</button>}</div>;
}
