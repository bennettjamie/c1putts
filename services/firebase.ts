/**
 * Firebase Configuration
 * 
 * This file initializes Firebase services for C100%.
 * You'll need to replace the config values with your own Firebase project.
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration (c1putts project)
const firebaseConfig = {
    apiKey: "AIzaSyA6jF3_Q2Mq4q0TlnL7prA6rE_7maid6Pk",
    authDomain: "c1putts.firebaseapp.com",
    projectId: "c1putts",
    storageBucket: "c1putts.firebasestorage.app",
    messagingSenderId: "870356982398",
    appId: "1:870356982398:web:dca80096989e58764ed62f",
    measurementId: "G-QRG1DDPSB6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
