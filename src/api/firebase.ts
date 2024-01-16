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

export const updateUserProfile = async (name: string) => {
  if (auth.currentUser === null) return;
  await updateProfile(auth.currentUser, {
    displayName: name,
  });
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
