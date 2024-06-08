import { initializeApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyBoROcFJyx6g_jMbHSQ9zuAkhDdZkSZLrU",
  authDomain: "rippedai-aafef.firebaseapp.com",
  projectId: "rippedai-aafef",
  storageBucket: "rippedai-aafef.appspot.com",
  messagingSenderId: "336209469116",
  appId: "1:336209469116:web:2afcd430f578378ff0fab9",
  measurementId: "G-EQ13M6WS47"
};

export const firebase_app = initializeApp(firebaseConfig);
export const firebase_auth = initializeAuth(firebase_app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
