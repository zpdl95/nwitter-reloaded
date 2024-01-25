import { useEffect, useState } from 'react';
import { fetchTweets } from '../api/firebase';
import Tweet from './tweet';
import { Unsubscribe } from 'firebase/firestore';
import { Loader } from '.';
import styled from 'styled-components';

export interface ITweet {
  tweetId?: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
  avatar?: string;
}

const Ul = styled.ul`
  & > div {
    display: flex;
    justify-content: center;
    margin-top: 50%;
  }
`;

export default function Timeline() {
  const [isLoading, setLoading] = useState(true);
  const [tweets, setTweets] = useState<ITweet[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    const fetchAndSetTweets = async () => {
      unsubscribe = await fetchTweets({
        callback1: setTweets,
        callback2: setLoading,
      });
    };

    fetchAndSetTweets();

    return () => {
      unsubscribe && unsubscribe(); // 구독 취소, 데이터 세이브
    };
  }, []);

  return (
    <Ul>
      {!isLoading ? (
        tweets.map((tweet) => <Tweet key={tweet.tweetId} {...tweet} />)
      ) : (
        <div>
          <Loader />
        </div>
      )}
    </Ul>
  );
}
