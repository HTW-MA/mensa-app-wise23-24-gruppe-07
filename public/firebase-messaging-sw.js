// This is firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.10.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyAu0VR7T-djlZmXJc7TdyCK0io6XnsRrpE",
    authDomain: "mealcraft-5706a.firebaseapp.com",
    projectId: "mealcraft-5706a",
    storageBucket: "mealcraft-5706a.appspot.com",
    messagingSenderId: "135918648926",
    appId: "1:135918648926:web:13a49b81f017bca2b07ecf",
    measurementId: "G-L339LKZKJ8"
});

const messaging = firebase.messaging();
