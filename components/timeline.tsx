import { db } from "@/src/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import Tweet from "./tweet";

export interface ITweet {
  id: string;
  tweet: string;
  photo?: string;
  userId: string;
  userName: string;
  createdAt: number;
}

export default function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTweets = async () => {
    try {
      setLoading(true);
      const tweetsQuery = query(collection(db, "tweets"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(tweetsQuery);
      const tweets = querySnapshot.docs.map((doc) => {
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
    fetchTweets();
  }, []);

  return (
    <div className="space-y-10">
      {loading ? <h1>Loading...</h1> : tweets.map((item) => <Tweet key={item.id} {...item} />)}
    </div>
  );
}
