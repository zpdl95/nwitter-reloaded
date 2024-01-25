// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  StorageReference,
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { ITweet } from '../components/timeline';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'nwitter-reloaded-9a028.firebaseapp.com',
  projectId: 'nwitter-reloaded-9a028',
  storageBucket: 'nwitter-reloaded-9a028.appspot.com',
  messagingSenderId: '503034122352',
  appId: '1:503034122352:web:762580ba16ef29bcb4a4b5',
  measurementId: 'G-QG0HVK2768',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// 인증 관련
export const auth = getAuth(app);
const githubProvider = new GithubAuthProvider();
const googleProvider = new GoogleAuthProvider();

export const createAccount = async (email: string, password: string) => {
  await createUserWithEmailAndPassword(auth, email, password);
};

export const onUserStateChange = (
  callback: React.Dispatch<React.SetStateAction<FirebaseUser | null>>
) => {
  // onAuthStateChanged 함수는 유저정보가 변하면 등록된 콜백함수를 자동으로 실행한다.
  onAuthStateChanged(auth, async (user) => {
    const updateUser = user;
    callback(updateUser);
  });
};

export const updateUserProfile = async (username?: string, avatar?: string) => {
  if (auth.currentUser === null) return;
  if (username) {
    await updateProfile(auth.currentUser, {
      displayName: username,
    });
  }
  if (avatar) {
    await updateProfile(auth.currentUser, {
      photoURL: avatar,
    });
  }
};

export const logout = async () => {
  await auth.signOut();
};

export const loginWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  await signInWithEmailAndPassword(auth, email, password);
};

export const loginWithGithub = async () => {
  await signInWithPopup(auth, githubProvider);
};

export const loginWithGoogle = async () => {
  await signInWithPopup(auth, googleProvider);
};

export const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

// 스토리지 관련
const storage = getStorage(app);

export const fileUpload = async ({
  userId,
  // username,
  docId,
  file,
}: {
  userId: string;
  username: string;
  docId: string;
  file: File;
}) => {
  const locationRef = ref(storage, `tweets/${userId}/${docId}`);
  return await uploadBytes(locationRef, file);
};

export const avatarUpload = async ({
  userId,
  file,
}: {
  userId: string;
  file: File;
}) => {
  const locationRef = ref(storage, `user-avatars/${userId}`);
  return await uploadBytes(locationRef, file);
};

export const bgUpload = async ({
  userId,
  file,
}: {
  userId: string;
  file: File;
}) => {
  const locationRef = ref(storage, `user-bgs/${userId}`);
  return await uploadBytes(locationRef, file);
};

export const getBGURL = async ({
  userId,
  callback,
}: {
  userId: string | undefined;
  callback: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  if (!userId) return;
  const locationRef = ref(storage, `user-bgs/${userId}`);

  try {
    const URL = await getDownloadURL(locationRef);
    callback(URL);
  } catch (e) {
    callback('');
  }
};

export const getFileURL = async (ref: StorageReference) => {
  return await getDownloadURL(ref);
};

export const deleteFile = async ({
  userId,
  tweetId,
}: {
  userId: string;
  tweetId: string;
}) => {
  const photoRef = ref(storage, `tweets/${userId}/${tweetId}`);
  await deleteObject(photoRef);
};

// 데이터 베이스 관련
const database = getFirestore(app);

export const createTweet = async (tweet: ITweet) => {
  return await addDoc(collection(database, 'tweets'), tweet);
};

export const updateTweet = async ({
  tweetId,
  tweet,
  createdAt,
  username,
  photo,
  avatar,
}: {
  tweetId: string;
  tweet?: string;
  createdAt?: number;
  username?: string;
  photo?: string;
  avatar?: string;
}) => {
  if (!tweetId) return;
  if (tweet && createdAt) {
    await updateDoc(doc(database, 'tweets', tweetId), {
      tweet,
      createdAt,
    });
  }
  if (username) {
    await updateDoc(doc(database, 'tweets', tweetId), {
      username,
    });
  }
  if (photo && createdAt) {
    await updateDoc(doc(database, 'tweets', tweetId), {
      photo,
      createdAt,
    });
  } else if (photo === '' && createdAt) {
    await updateDoc(doc(database, 'tweets', tweetId), {
      photo: deleteField(),
      createdAt,
    });
  }
  if (avatar) {
    await updateDoc(doc(database, 'tweets', tweetId), {
      avatar,
    });
  }
};

export const deleteTweet = async (tweetId: string) => {
  await deleteDoc(doc(database, 'tweets', tweetId));
};

export const fetchTweets = async ({
  callback1,
  callback2,
}: {
  callback1: React.Dispatch<React.SetStateAction<ITweet[]>>;
  callback2: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const tweetsQuery = query(
    collection(database, 'tweets'),
    orderBy('createdAt', 'desc'),
    limit(25) // 25개로 가져오는 트윗 제한
  );

  // 1번만 실행되는 getDocs
  // const snapshot = await getDocs(tweetsQuery);
  // const tweets = snapshot.docs.map((doc) => {
  //   const { tweet, createdAt, userId, username, photo } = doc.data();
  //   return { tweet, createdAt, userId, username, photo, id: doc.id };
  // });

  // 데이터가 변경되면 콜백함수를 자동으로 실행 시켜줌
  // 실시간으로 변경됨
  const unsubscribe = onSnapshot(tweetsQuery, (snapshot) => {
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createdAt, userId, username, photo, avatar } = doc.data();
      return {
        tweet,
        createdAt,
        userId,
        username,
        photo,
        tweetId: doc.id,
        avatar,
      };
    });

    callback1(tweets);
    callback2(false);
  });

  return unsubscribe;
};

export const fetchMyTweets = async ({
  userId,
  callback1,
  callback2,
}: {
  userId: string | undefined;
  callback1: React.Dispatch<React.SetStateAction<ITweet[] | undefined>>;
  callback2: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  if (!userId) return;
  const tweetsQuery = query(
    collection(database, 'tweets'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(25)
  );

  // const snapshot = await getDocs(tweetQuery);
  // const tweets: ITweet[] = snapshot.docs.map((doc) => {
  //   const { tweet, createdAt, userId, username, photo, avatar } = doc.data();
  //   return {
  //     tweet,
  //     createdAt,
  //     userId,
  //     username,
  //     photo,
  //     tweetId: doc.id,
  //     avatar,
  //   };
  // });

  // callback(tweets);

  const unsubscribe = onSnapshot(tweetsQuery, (snapshot) => {
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createdAt, userId, username, photo, avatar } = doc.data();
      return {
        tweet,
        createdAt,
        userId,
        username,
        photo,
        tweetId: doc.id,
        avatar,
      };
    });

    callback1(tweets);
    callback2(false);
  });

  return unsubscribe;
};
