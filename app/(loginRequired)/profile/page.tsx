"use client";

import { auth } from "@/src/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Profile() {
  const router = useRouter();
  const [loginCheck, setLoginCheck] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user === null) router.replace("/signIn");
    else setLoginCheck(true);
  }, [router]);

  return <div>{loginCheck && <h1>Profile!</h1>}</div>;
}
