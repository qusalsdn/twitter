import { auth, db, storage } from "@/src/firebase";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface Tweet {
  tweet: string;
  imageFile: any;
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
    const user = auth.currentUser;
    if (!user || loading || formData.tweet === "" || formData.tweet.length > 256) return;
    if (formData.imageFile[0].size > 1024 ** 2)
      return alert("이미지 크기의 용량은 1MB 이하여야 합니다.");
    try {
      setLoading(true);
      const doc = await addDoc(collection(db, "tweets"), {
        tweet: formData.tweet,
        createdAt: Date.now(),
        userName: user.displayName || "익명",
        userId: user.uid,
      });
      if (formData.imageFile) {
        // 스토리지에 사진 저장
        const locationRef = ref(storage, `tweets/${user.uid}-${user.displayName}/${doc.id}`);
        // 저장된 사진의 결과값 result에 저장
        const result = await uploadBytes(locationRef, formData.imageFile[0]);
        // 저장된 사진의 url을 추출
        const url = await getDownloadURL(result.ref);
        // Firestore Database에 저장된 doc의 값을 url을 추가하여 업데이트
        await updateDoc(doc, { photo: url });
      }
      reset();
      setImageSrc(null);
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
        required
        {...register("tweet")}
      ></textarea>
      {imageSrc !== null && (
        <Image src={imageSrc !== null && imageSrc} alt="uploadImage" width={200} height={200} />
      )}
      <label
        htmlFor="file"
        className="py-5 text-sky-500 text-center border-solid border-2 border-sky-500 rounded-3xl font-bold cursor-pointer"
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
