import { useEffect, useState } from 'react';
import { fetchTweets } from '../api/firebase';
import Tweet from './tweet';
import { Unsubscribe } from 'firebase/firestore';

export interface ITweet {
  id?: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

export default function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    const fetchAndSetTweets = async () => {
      unsubscribe = await fetchTweets(setTweets);
    };

    fetchAndSetTweets();

    return () => {
      unsubscribe && unsubscribe(); // 구독 취소, 데이터 세이브
    };
  }, []);

  return (
    <ul>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </ul>
  );
}
