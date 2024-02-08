import Image from "next/image";
import githubLogo from "@/public/github-mark.svg";
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/src/firebase";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GithubBtn() {
  const router = useRouter();
  const [error, setError] = useState("");

  const onClickBtn = async () => {
    try {
      setError("");
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      router.replace("/");
    } catch (e) {
      console.log(e);
      setError("동일하게 가입한 이메일이 존재합니다.");
    }
  };

  return (
    <div>
      <button
        className="flex w-96 items-center justify-center bg-white text-black py-[10px] px-[20px] rounded-3xl font-bold hover:opacity-80"
        onClick={onClickBtn}
      >
        <Image src={githubLogo} alt="githubLogo" width={20} height={20} className="mr-2" /> 깃허브로
        로그인
      </button>
      {error !== "" && <p className="mt-5 text-center text-red-500 font-bold">{error}</p>}
    </div>
  );
}
