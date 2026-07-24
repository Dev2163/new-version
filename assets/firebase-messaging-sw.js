// Firebase Cloud Messaging Service Worker for ONE9 Nova AI
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Initialize Firebase App in Service Worker
// The client page registers this service worker and handles FCM payload.
firebase.initializeApp({
  messagingSenderId: "100000000000"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification ? payload.notification.title : 'ONE9 Nova AI Alert';
  const notificationOptions = {
    body: payload.notification ? payload.notification.body : 'New streetwear drop or order update!',
    icon: payload.notification && payload.notification.icon ? payload.notification.icon : 'https://cdn-icons-png.flaticon.com/512/3670/3670051.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
