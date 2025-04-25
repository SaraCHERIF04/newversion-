importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

let firebaseConfig = null;
let messaging = null;

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'FIREBASE_CONFIG') {
        firebaseConfig = event.data.config;
        initializeFirebase();
    }
});

function initializeFirebase() {
    if (!firebaseConfig) return;
    
    try {
        // Initialize Firebase
        const app = firebase.initializeApp(firebaseConfig);
        messaging = firebase.messaging(app);

        // Handle background messages
        messaging.onBackgroundMessage((payload) => {
            console.log('Received background message:', payload);

            const notificationTitle = payload.notification.title;
            const notificationOptions = {
                body: payload.notification.body,
                icon: '/favicon.ico',
                data: payload.data
            };

            self.registration.showNotification(notificationTitle, notificationOptions);
        });

        // Send a message back to the main thread to confirm initialization
        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({
                    type: 'FIREBASE_INITIALIZED',
                    status: 'success'
                });
            });
        });
    } catch (error) {
        console.error('Error initializing Firebase in service worker:', error);
        // Send error message back to main thread
        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({
                    type: 'FIREBASE_INITIALIZED',
                    status: 'error',
                    error: error.message
                });
            });
        });
    }
}

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.notification.data && event.notification.data.link) {
        event.waitUntil(
            clients.openWindow(event.notification.data.link)
        );
    }
}); 