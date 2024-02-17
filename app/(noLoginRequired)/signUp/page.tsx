"use client";

import GithubBtn from "@/components/github-btn";
import GoogleBtn from "@/components/google-btn";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface Inputs {
  name: string;
  email: string;
  password: string;
}

const errors: any = {
  "auth/email-already-in-use": "이미 존재하는 이메일입니다.",
  "auth/weak-password": "비밀번호는 적어도 6글자 이상이어야 합니다.",
};

export default function SignUp() {
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
    if (loading || formData.name === "" || formData.email === "" || formData.password === "")
      return;
    try {
      setLoading(true);
      setError("");
      const credentials = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      await updateProfile(credentials.user, {
        displayName: formData.name,
      });
      router.replace("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        for (const key in errors) {
          if (key === e.code) {
            setError(errors[key]);
            break;
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loginCheck && (
        <div className="flex flex-col items-center mt-16 space-y-5">
          <h1 className="text-3xl font-bold">회원가입 👻</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="text-black flex flex-col items-center justify-center w-96 space-y-4"
          >
            <input
              type="text"
              placeholder="이름"
              required
              {...register("name", { required: true })}
              className="signUpInputs"
            />
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
              {loading ? "로딩중..." : "회원가입"}
            </button>
          </form>
          {error !== "" && <p className="font-bold text-red-500">{error}</p>}
          <Link href={"/signIn"} className="font-bold">
            이미 계정이 있으신가요? &rarr;
          </Link>
          <GoogleBtn />
          <GithubBtn />
        </div>
      )}
    </div>
  );
}
