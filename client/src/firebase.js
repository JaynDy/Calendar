import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { API_KEY } from "./constants/keyConstant";

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: "webcalendar-92d69.firebaseapp.com",
  projectId: "webcalendar-92d69",
  storageBucket: "webcalendar-92d69.appspot.com",
  messagingSenderId: "1051097816733",
  appId: "1:1051097816733:web:31686b8f7a60a558b43e74",
  measurementId: "G-9PRJGTVFTC",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
