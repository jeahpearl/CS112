import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyAlzSIbHty73o-eGxr8KYJ8gzymPjjkSzc",
  authDomain: "casestudy112-9d913.firebaseapp.com",
  projectId: "casestudy112-9d913",
  storageBucket: "casestudy112-9d913.firebasestorage.app",
  messagingSenderId: "173822378352",
  appId: "1:173822378352:web:bb2073fca95e73c2188fb5",
  measurementId: "G-R76KJZQFHN"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
// eslint-disable-next-line
const analytics = getAnalytics(app);
// Initialize Firestore
const db = getFirestore(app);

export { db };