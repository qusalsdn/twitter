"use client";

import GithubBtn from "@/components/github-btn";
import { FirebaseError } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface Inputs {
  email: string;
  password: string;
}

export default function SignIn() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<Inputs>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginCheck, setLoginCheck] = useState(false);

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) router.push("/");
    else setLoginCheck(true);
  });

  const onSubmit = async (formData: Inputs) => {
    if (loading || formData.email === "" || formData.password === "") return;
    try {
      setLoading(true);
      setError("");
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      router.replace("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError("아이디 혹은 비밀번호가 일치하지 않습니다...😥");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loginCheck && (
        <div className="flex flex-col items-center mt-16 space-y-5">
          <h1 className="text-3xl font-bold">로그인 👻</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="text-black flex flex-col items-center justify-center w-96 space-y-4"
          >
            <input
              type="email"
              placeholder="이메일"
              required
              {...register("email", { required: true })}
              className="signUpInputs"
            />
            <input
              type="password"
              placeholder="비밀번호"
              required
              {...register("password", { required: true })}
              className="signUpInputs"
            />
            <button
              type="submit"
              className="signUpInputs bg-[#1d9bf0] hover:opacity-80 font-bold text-white"
            >
              {loading ? "로딩중..." : "로그인"}
            </button>
          </form>
          {error !== "" && <p className="font-bold text-red-500">{error}</p>}
          <Link href={"/signUp"} className="font-bold">
            계정이 없으신가요? &rarr;
          </Link>
          <GithubBtn />
        </div>
      )}
    </div>
  );
}
