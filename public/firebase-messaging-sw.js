importScripts('https://www.gstatic.com/firebasejs/7.13.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.13.1/firebase-messaging.js');

const config = {
    apiKey: "AIzaSyAj6edr6QdKTFY-GcpPuXdCaAPheoYPe50",
    authDomain: "subscription-chat-app.firebaseapp.com",
    projectId: "subscription-chat-app",
    storageBucket: "subscription-chat-app.appspot.com",
    messagingSenderId: "912423467723",
    appId: "1:912423467723:web:c1696e0ed56b2f4ab6f94e",
    measurementId: "G-1FNC1J8QMQ"
};
firebase.initializeApp(config);
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: '/logo192.png'
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});

self.addEventListener('notificationclick', event => {
  console.log(event)
  return event;
});