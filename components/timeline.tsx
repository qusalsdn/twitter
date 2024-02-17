import { db } from "@/src/firebase";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import Tweet from "./tweet";
import { Unsubscribe } from "firebase/auth";

export interface ITweet {
  id: string;
  tweet: string;
  photo?: string;
  userId: string;
  userName: string;
  createdAt: number;
  avatar?: string;
}

export default function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = async () => {
      try {
        setLoading(true);
        const tweetsQuery = query(
          collection(db, "tweets"),
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
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchTweets();
    // 아래와 같이 코드를 작성하면 사용자가 컴포넌트를 보고 있을 때만 snapshot 이벤트를 발생시킨다.
    // useEffect 훅은 더 이상 해당 컴포넌트가 사용되지 않을 때 아래 함수를 호출한다.
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <div className="space-y-10 h-[830px] scrollBar px-5">
      {loading ? <h1>Loading...</h1> : tweets.map((item) => <Tweet key={item.id} {...item} />)}
    </div>
  );
}
