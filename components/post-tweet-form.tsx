import { auth, db, storage } from "@/src/firebase";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface Tweet {
  tweet: string;
  imageFile: any;
}

export default function PostTweetForm({ id }: any) {
  const router = useRouter();
  const { register, handleSubmit, setValue } = useForm<Tweet>();
  const [loading, setLoading] = useState(false);
  const [imageSrc, setImageSrc]: any = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (id) {
      const docRef = doc(db, "tweets", id);
      const fetchTweet = async () => {
        const data = (await getDoc(docRef)).data();
        setValue("tweet", data?.tweet);
        // setValue("imageFile", data?.photo);
        if (data?.photo) setImageSrc(data?.photo);
      };
      fetchTweet();
    }
  }, [id, setValue]);

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

  const storageInsert = async (file: any, doc: any, id: string) => {
    // 스토리지에 사진 저장
    const locationRef = ref(storage, `tweets/${user?.uid}-${user?.displayName}/${id}`);
    // 저장된 사진의 결과값 result에 저장
    const result = await uploadBytes(locationRef, file);
    // 저장된 사진의 url을 추출
    const url = await getDownloadURL(result.ref);
    // Firestore Database에 저장된 doc의 값을 url을 추가하여 업데이트
    await updateDoc(doc, { photo: url });
  };

  const onSubmit = async (formData: Tweet) => {
    const user = auth.currentUser;
    if (!user || loading || formData.tweet === "" || formData.tweet.length > 256) return;
    if (formData.imageFile.length !== 0)
      if (formData.imageFile[0].size > 1024 ** 2)
        return alert("이미지 크기의 용량은 1MB 이하여야 합니다.");
    try {
      setLoading(true);
      if (id) {
        const docRef = doc(db, "tweets", id);
        await updateDoc(docRef, { tweet: formData.tweet });
        if (formData.imageFile.length !== 0) {
          const photoRef = ref(storage, `tweets/${user.uid}-${user.displayName}/${id}`);
          await deleteObject(photoRef);
          storageInsert(formData.imageFile[0], docRef, id);
        }
      } else {
        const tweetDoc = await addDoc(collection(db, "tweets"), {
          tweet: formData.tweet,
          createdAt: Date.now(),
          userName: user.displayName || "익명",
          userId: user.uid,
        });
        if (user.photoURL)
          await updateDoc(doc(db, "tweets", tweetDoc.id), { avatar: user.photoURL });
        if (formData.imageFile.length !== 0) {
          storageInsert(formData.imageFile[0], tweetDoc, tweetDoc.id);
        }
      }
      router.replace("/");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-3">
      {imageSrc !== null && (
        <div className="text-center">
          <Image
            src={imageSrc !== null && imageSrc}
            alt="uploadImage"
            width={300}
            height={300}
            className="rounded-3xl"
          />
        </div>
      )}
      <textarea
        placeholder="트윗을 입력해주세요."
        className="border-2 border-white p-5 rounded-3xl text-lg text-white bg-black w-full h-40 resize-none focus:outline-none focus:border-sky-500 duration-300"
        maxLength={256}
        required
        {...register("tweet")}
      ></textarea>
      <label
        htmlFor="file"
        className="py-5 text-sky-500 text-center border-solid border-2 border-sky-500 rounded-3xl font-bold cursor-pointer"
      >
        {id ? "이미지 수정" : "이미지 추가"}
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
        {loading ? "게시중..." : id ? "트윗 수정" : "트윗 게시"}
      </button>
    </form>
  );
}
