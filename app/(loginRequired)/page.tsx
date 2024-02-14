"use client";

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

  return <div>{loginCheck && <h1>Home</h1>}</div>;
}
