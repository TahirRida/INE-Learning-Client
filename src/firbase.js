import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCMvkYU8j7H6NlNbc-R3t_yGt2bQs6V-bo",
  authDomain: "uploadingfile-4b22b.firebaseapp.com",
  projectId: "uploadingfile-4b22b",
  storageBucket: "uploadingfile-4b22b.appspot.com",
  messagingSenderId: "768405819945",
  appId: "1:768405819945:web:3b41a54d5b3824e07ac238"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);