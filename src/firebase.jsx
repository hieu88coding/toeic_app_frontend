// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"


const firebaseConfig = {
    apiKey: "AIzaSyBOgpx3twAQqnj4z4T_UGRh_V4vZQmhNdM",
    authDomain: "hieu88toeicapp.firebaseapp.com",
    projectId: "hieu88toeicapp",
    storageBucket: "hieu88toeicapp.appspot.com",
    messagingSenderId: "198351817960",
    appId: "1:198351817960:web:54c417ecd8c0b4f20d8d5d",
    measurementId: "G-TV2LWRQ42S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app)