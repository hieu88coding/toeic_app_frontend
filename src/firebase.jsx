// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"


const firebaseConfig = {
    apiKey: "AIzaSyCE_kX1Ql8zOeZMLQSDENd4RsfAmecZrms",
    authDomain: "shipping-59464.firebaseapp.com",
    projectId: "shipping-59464",
    storageBucket: "shipping-59464.appspot.com",
    messagingSenderId: "95379749020",
    appId: "1:95379749020:web:06515d6f43ee13806ed559"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)