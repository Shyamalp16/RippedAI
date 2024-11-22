import { initializeApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import {EXPO_API_KEY, EXPO_AUTH_DOMAIN, EXPO_PROJECT_ID, EXPO_STORAGE_BUCKET, EXPO_MESSAGING_SENDER_ID, EXPO_APP_ID, EXPO_MEASUREMENT_ID, EXPO_DATABASE_URL} from '@env';
import { getFirestore } from 'firebase/firestore';
import { getDatabase, ref, set } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.EXPO_API_KEY,
  authDomain: process.env.EXPO_AUTH_DOMAIN,
  projectId: process.env.EXPO_PROJECT_ID,
  storageBucket: process.env.EXPO_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_APP_ID,
  measurementId: process.env.EXPO_MEASUREMENT_ID,
  databaseURL: process.env.EXPO_DATABASE_URL
};

export const firebase_app = initializeApp(firebaseConfig);
export const firebase_auth = initializeAuth(firebase_app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = getFirestore(firebase_app)
export const realtimeDB = getDatabase(firebase_app);