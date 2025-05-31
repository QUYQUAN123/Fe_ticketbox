import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCfwiJ0MwT_TeTprwYFA2UELohd7bPjCUQ",
  authDomain: "phonestore-9f5a8.firebaseapp.com",
  projectId: "phonestore-9f5a8",
  storageBucket: "phonestore-9f5a8.appspot.com",
  messagingSenderId: "426833281747",
  appId: "1:426833281747:web:77bc1f6608b63f38f44a26"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const storage = getStorage(app);
export { storage, analytics };
