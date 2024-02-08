"use client";

import { auth } from "@/src/firebase";
import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();
  const user = auth.currentUser;
  if (user === null) router.replace("/signIn");

  return <h1>Profile!</h1>;
}
