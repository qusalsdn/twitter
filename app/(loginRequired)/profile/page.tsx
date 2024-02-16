"use client";

import { ITweet } from "@/components/timeline";
import Tweet from "@/components/tweet";
import { auth, db, storage } from "@/src/firebase";
import { updateProfile } from "firebase/auth";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function Profile() {
  const user = auth.currentUser;
  const router = useRouter();
  const { register, handleSubmit } = useForm();
  const [loginCheck, setLoginCheck] = useState(false);
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTweets = async () => {
    try {
      setLoading(true);
      const tweetsQuery = query(
        collection(db, "tweets"),
        where("userId", "==", user?.uid),
        orderBy("createdAt", "desc"),
        limit(25)
      );
      const snapShop = await getDocs(tweetsQuery);
      const tweets = snapShop.docs.map((doc) => {
        const { tweet, photo, userId, userName, createdAt } = doc.data();
        return { id: doc.id, tweet, photo, userId, userName, createdAt };
      });
      setTweets(tweets);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user === null) router.replace("/signIn");
    else setLoginCheck(true);
    fetchTweets();
  }, [router, user]);

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
            <p className="text-lg font-bold">{user?.displayName ?? "익명"}</p>
          </div>
          <div className="space-y-10 h-[700px] scrollBar px-5">
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
