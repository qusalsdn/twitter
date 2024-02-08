"use client";

import { auth } from "@/src/firebase";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const user = auth.currentUser;
  if (user !== null) router.replace("/");

  return <h1>Login!</h1>;
}
