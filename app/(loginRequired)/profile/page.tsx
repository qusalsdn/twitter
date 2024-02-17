"use client";

import { ITweet } from "@/components/timeline";
import Tweet from "@/components/tweet";
import { db, storage } from "@/src/firebase";
import { Unsubscribe, getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import {
  collection,
  deleteField,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface FormData {
  userName: string;
  imageFile: any;
}

export default function Profile() {
  const router = useRouter();
  const { register, handleSubmit, setValue } = useForm<FormData>();
  const [loginCheck, setLoginCheck] = useState(false);
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  onAuthStateChanged(auth, (user) => {
    console.log(user?.photoURL);
    if (user) {
      setLoginCheck(true);
      setAvatar(user.photoURL);
    } else router.push("/signIn");
  });

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = async () => {
      try {
        setLoading(true);
        if (user) {
          const tweetsQuery = query(
            collection(db, "tweets"),
            where("userId", "==", user?.uid),
            orderBy("createdAt", "desc"),
            limit(25)
          );
          unsubscribe = onSnapshot(tweetsQuery, (snapshot) => {
            const tweets = snapshot.docs.map((doc) => {
              const { tweet, photo, userId, userName, createdAt, avatar } = doc.data();
              return { id: doc.id, tweet, photo, userId, userName, createdAt, avatar };
            });
            setTweets(tweets);
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchTweets();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [user]);

  const tweetsRefsReturn = async () => {
    if (!user) return;
    const tweetsQuery = query(collection(db, "tweets"), where("userId", "==", user.uid));
    const snapShop = await getDocs(tweetsQuery);
    const docRefs = snapShop.docs.map((doc) => {
      return doc.ref;
    });
    return docRefs;
  };

  const onChangeAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `avatar/${user.uid}-${user?.displayName}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      await updateProfile(user, { photoURL: avatarUrl });
      setAvatar(avatarUrl);
      const docRefs = await tweetsRefsReturn();
      if (docRefs)
        for (const ref of docRefs) {
          await updateDoc(ref, { avatar: avatarUrl });
        }
    }
  };

  const onSubmitUserNameChange = async (formData: FormData) => {
    if (!user) return;
    if (formData.userName.length > 15) return alert("15자 이하로 작성해주세요.");
    try {
      setLoading(true);
      await updateProfile(user, { displayName: formData.userName });
      // 아래는 트윗의 userName을 변경하기 위해 작성
      const docRefs = await tweetsRefsReturn();
      if (docRefs)
        for (const ref of docRefs) {
          await updateDoc(ref, { userName: formData.userName });
        }
      setInputVisible(false);
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const onClickAvatarDel = async () => {
    const ok = confirm("정말로 프로필 사진을 삭제하시겠습니까?");
    if (ok && user) {
      await updateProfile(user, { photoURL: "" });
      const docRefs = await tweetsRefsReturn();
      if (docRefs) {
        for (const ref of docRefs) {
          await updateDoc(ref, { avatar: deleteField() });
        }
      }
      const locationRef = ref(storage, `avatar/${user.uid}-${user?.displayName}`);
      deleteObject(locationRef);
    }
  };

  return (
    <div className="w-full">
      {loginCheck && (
        <div className="flex flex-col space-y-3 pr-36">
          <div className="flex flex-col items-center space-y-3">
            {Boolean(avatar) ? (
              <label htmlFor="avatar" className="cursor-pointer">
                <Image
                  src={`${avatar}`}
                  alt="avatar"
                  width={100}
                  height={100}
                  className="rounded-full w-20 h-20"
                />
              </label>
            ) : (
              <label htmlFor="avatar" className="cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className="w-14 h-14 p-3 rounded-full bg-[#0ea5e9]"
                >
                  <path
                    fill="#ffffff"
                    d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"
                  />
                </svg>
              </label>
            )}
            <input
              type="file"
              id="avatar"
              accept="image/*"
              className="hidden"
              {...register("imageFile", { onChange: onChangeAvatar })}
            />
            {user?.photoURL && (
              <button title="프로필 사진 삭제" onClick={onClickAvatarDel}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-6 h-6">
                  <path
                    fill="#ffffff"
                    d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"
                  />
                </svg>
              </button>
            )}
            {inputVisible ? (
              <form
                onSubmit={handleSubmit(onSubmitUserNameChange)}
                className="flex flex-col space-y-2 items-center"
              >
                <input
                  type="text"
                  {...register("userName")}
                  className="outline-none rounded-3xl text-black text-center py-2 font-bold pr-2"
                />
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <div className="space-x-3">
                    <button
                      type="button"
                      className="bg-red-500 py-2 px-5 rounded-3xl font-bold"
                      onClick={() => setInputVisible(false)}
                    >
                      취소
                    </button>
                    <button type="submit" className="bg-[#0ea5e9] py-2 px-5 rounded-3xl font-bold">
                      저장
                    </button>
                  </div>
                )}
              </form>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <p className="text-lg font-bold">{user?.displayName ?? "익명"}</p>
                <button
                  title="이름 변경"
                  onClick={() => {
                    setInputVisible(true);
                    user?.displayName ? setValue("userName", user.displayName) : "";
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5">
                    <path
                      fill="#ffffff"
                      d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
          <div className="space-y-10 h-[670px] scrollBar px-5">
            {loading ? (
              <h1>Loading...</h1>
            ) : (
              tweets.map((item) => <Tweet key={item.id} {...item} />)
            )}
          </div>
        </div>
      )}
    </div>
  );
}
