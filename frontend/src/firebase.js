import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA_nL7dsSBtMyXStdUMkKu0ac4oQoi18ik",
  authDomain: "chitchat-6e581.firebaseapp.com",
  projectId: "chitchat-6e581",
  storageBucket: "chitchat-6e581.appspot.com",
  messagingSenderId: "622806231930",
  appId: "1:622806231930:web:5029d4d65058a5f9fcc4c3",
  measurementId: "G-T8W77WNSGF",
};

const app = initializeApp(firebaseConfig);
const StorageDB = getStorage(app);

export { StorageDB };
