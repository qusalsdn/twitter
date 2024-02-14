import { auth, db } from "@/src/firebase";
import { addDoc, collection } from "firebase/firestore";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface Tweet {
  tweet: string;
  imageFile: any[];
}

export default function PostTweetForm() {
  const { register, handleSubmit, reset } = useForm<Tweet>();
  const [loading, setLoading] = useState(false);
  const [imageSrc, setImageSrc]: any = useState(null);

  const onUpload = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    return new Promise<void>((resolve) => {
      reader.onload = () => {
        setImageSrc(reader.result || null);
        resolve();
      };
    });
  };

  const onSubmit = async (formData: Tweet) => {
    console.log(formData);
    const user = auth.currentUser;
    if (!user || loading || formData.tweet === "" || formData.tweet.length > 256) return;
    try {
      setLoading(true);
      await addDoc(collection(db, "tweets"), {
        tweet: formData.tweet,
        createdAt: Date.now(),
        userName: user.displayName || "익명",
        userId: user.uid,
      });
      reset();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-3">
      <textarea
        placeholder="트윗을 입력해주세요."
        className="border-2 border-white p-5 rounded-3xl text-lg text-white bg-black w-full h-40 resize-none focus:outline-none focus:border-sky-500 duration-300"
        maxLength={256}
        {...register("tweet")}
      ></textarea>
      {imageSrc !== null && (
        <Image src={imageSrc !== null && imageSrc} alt="uploadImage" width={200} height={200} />
      )}
      <label
        htmlFor="file"
        className="py-5 text-sky-500 text-center border-solid border border-sky-500 rounded-3xl font-bold cursor-pointer"
      >
        이미지 추가
      </label>
      <input
        type="file"
        id="file"
        accept="image/*"
        className="hidden"
        {...register("imageFile", { onChange: onUpload })}
      />
      <button
        type="submit"
        className="bg-sky-500 text-white py-5 rounded-3xl font-bold hover:opacity-90 duration-300"
      >
        {loading ? "게시중..." : "트윗 게시"}
      </button>
    </form>
  );
}
