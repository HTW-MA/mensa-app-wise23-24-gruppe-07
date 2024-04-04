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
/*
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    // Customize the UI for the notification
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon
    };

    // Show the notification
    self.registration.showNotification(notificationTitle,
        notificationOptions);
});


 */
self.addEventListener('push', function(event) {
    const options = {
        body: event.data.text(),
        //icon: '/path/to/icon.png',
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        //data: {
        //    url: 'https://example.com/page-to-open-on-click'
        //}
    };
    event.waitUntil(
        self.registration.showNotification('Notification Title', options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
