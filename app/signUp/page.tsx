"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

interface Inputs {
  name: string;
  email: string;
  password: string;
}

export default function SignUp() {
  const { register, handleSubmit } = useForm<Inputs>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = (formData: Inputs) => {
    setLoading(true);
    try {
      console.log(formData);
    } catch (error) {
      setError(setError.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-16 space-y-5">
      <h1 className="text-3xl">회원가입 👻</h1>
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
        <button type="submit" className="signUpInputs bg-white hover:opacity-80">
          {loading ? "로딩중..." : "회원가입"}
        </button>
      </form>
      {error !== "" && <p className="font-bold text-red-500">{error}</p>}
    </div>
  );
}
