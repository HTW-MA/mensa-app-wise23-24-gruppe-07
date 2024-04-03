import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAu0VR7T-djlZmXJc7TdyCK0io6XnsRrpE",
    authDomain: "mealcraft-5706a.firebaseapp.com",
    projectId: "mealcraft-5706a",
    storageBucket: "mealcraft-5706a.appspot.com",
    messagingSenderId: "135918648926",
    appId: "1:135918648926:web:13a49b81f017bca2b07ecf",
    measurementId: "G-L339LKZKJ8"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const messaging = getMessaging(app);
export const auth = getAuth(app);
