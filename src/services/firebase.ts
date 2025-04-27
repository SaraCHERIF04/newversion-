import { initializeApp } from 'firebase/app';
import {
    Timestamp,

    getFirestore
} from 'firebase/firestore';
import { getMessaging, getToken, onMessage, MessagePayload } from 'firebase/messaging';
import { getRemoteConfig, getValue, fetchAndActivate } from 'firebase/remote-config';
import { toast } from '@/hooks/use-toast';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

console.log('Firebase Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const db = getFirestore(app,'(default)');
const remoteConfig = getRemoteConfig(app);

// Configure remote config settings
remoteConfig.settings = {
    minimumFetchIntervalMillis: 3600000, // 1 hour
    fetchTimeoutMillis: 60000, // 1 minute
};

// Default values for remote config
const defaultConfigValues = {
    enable_document_sharing: false,
    max_file_size_mb: 10,
    allowed_document_types: 'pdf,doc,docx,xls,xlsx,jpg,png',
    maintenance_mode: false,
    app_version: '1.0.0',
    feature_flags: JSON.stringify({
        enable_comments: true,
        enable_advanced_search: false,
        enable_document_preview: true
    })
};

// Apply default values
Object.entries(defaultConfigValues).forEach(([key, value]) => {
    remoteConfig.defaultConfig = {
        ...remoteConfig.defaultConfig,
        [key]: value
    };
});

// Function to initialize Remote Config
export const initializeRemoteConfig = async () => {
    try {
        // Fetch and activate remote config
        const activated = await fetchAndActivate(remoteConfig);
        console.log('Remote config activated:', activated);
        return activated;
    } catch (error) {
        console.error('Error initializing remote config:', error);
        return false;
    }
};

// Function to get a string value from Remote Config
export const getRemoteConfigString = (key: string): string => {
    try {
        const value = getValue(remoteConfig, key);
        return value.asString();
    } catch (error) {
        console.error(`Error getting remote config string for key ${key}:`, error);
        return defaultConfigValues[key]?.toString() || '';
    }
};

// Function to get a boolean value from Remote Config
export const getRemoteConfigBoolean = (key: string): boolean => {
    try {
        const value = getValue(remoteConfig, key);
        return value.asBoolean();
    } catch (error) {
        console.error(`Error getting remote config boolean for key ${key}:`, error);
        return Boolean(defaultConfigValues[key]) || false;
    }
};

// Function to get a number value from Remote Config
export const getRemoteConfigNumber = (key: string): number => {
    try {
        const value = getValue(remoteConfig, key);
        return value.asNumber();
    } catch (error) {
        console.error(`Error getting remote config number for key ${key}:`, error);
        return Number(defaultConfigValues[key]) || 0;
    }
};

// Function to get a JSON value from Remote Config
export const getRemoteConfigJSON = (key: string): any => {
    try {
        const value = getValue(remoteConfig, key);
        return JSON.parse(value.asString());
    } catch (error) {
        console.error(`Error getting remote config JSON for key ${key}:`, error);
        try {
            return JSON.parse(defaultConfigValues[key] || '{}');
        } catch {
            return {};
        }
    }
};

// Function to check if a feature is enabled
export const isFeatureEnabled = (featureName: string): boolean => {
    try {
        const featureFlags = getRemoteConfigJSON('feature_flags');
        return Boolean(featureFlags[featureName]);
    } catch (error) {
        console.error(`Error checking if feature ${featureName} is enabled:`, error);
        try {
            const defaultFlags = JSON.parse(defaultConfigValues.feature_flags);
            return Boolean(defaultFlags[featureName]);
        } catch {
            return false;
        }
    }
};

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
    read: boolean;
    createdAt: Timestamp;
    link?: string;
    userId: string;
}

// Request permission for notifications
export const requestNotificationPermission = async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error requesting notification permission:', error);
        return false;
    }
};

// Initialize service worker for notifications
export const initializeServiceWorker = async () => {
    try {
        if (!('serviceWorker' in navigator)) {
            console.error('Service workers are not supported in this browser');
            return null;
        }

        // Get the current registration
        const registration = await navigator.serviceWorker.getRegistration();
        
        // If there's no registration or the registration is for a different scope
        if (!registration || !registration.active) {
            console.log('Registering new service worker...');
            // Register the service worker
            const newRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
                scope: '/'
            });
            
            // Wait for the service worker to be ready
            await newRegistration.update();
            
            // Set Firebase configuration in the service worker
            const serviceWorker = newRegistration.active;
            if (serviceWorker) {
                serviceWorker.postMessage({
                    type: 'FIREBASE_CONFIG',
                    config: {
                        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
                        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
                        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
                        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
                        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
                        appId: import.meta.env.VITE_FIREBASE_APP_ID
                    }
                });
            }
            
            console.log('Service Worker registered:', newRegistration);
            return newRegistration;
        }
        
        return registration;
    } catch (error) {
        console.error('Error registering service worker:', error);
        return null;
    }
};

// Get FCM token
export const getFCMToken = async () => {
    try {
        // First check if we have permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            console.warn('Notification permission not granted');
            return null;
        }

        // Ensure service worker is registered
        const registration = await initializeServiceWorker();
        if (!registration) {
            console.error('Service worker registration failed');
            return null;
        }

        // Get the VAPID key from environment variables
        const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
        if (!vapidKey) {
            console.error('VAPID key is not configured');
            return null;
        }

        // Wait a moment to ensure service worker is fully initialized
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Get the current token
        const currentToken = await getToken(messaging, {
            vapidKey: vapidKey,
            serviceWorkerRegistration: registration
        });

        if (!currentToken) {
            console.warn('No registration token available. Request permission to generate one.');
            return null;
        }

        console.log('FCM Token:', currentToken);
        return currentToken;
    } catch (error) {
        console.error('Error getting FCM token:', error);
        return null;
    }
};

// Handle incoming messages when the app is in the foreground
export const setupMessageListener = () => {
    onMessage(messaging, (payload: MessagePayload) => {
        console.log('Message received:', payload);
        
        const notification = payload.notification;
        const data = payload.data;
        
        if (notification) {
            // Determine toast variant based on notification type
            const variant = data?.type === 'error' ? 'destructive' : 'default';
            
            toast({
                title: notification.title || 'Nouvelle notification',
                description: notification.body || '',
                variant: variant,
            });

            // If there's a link in the data, open it in a new tab
            if (data?.link) {
                window.open(data.link, '_blank');
            }
        }
    });
};

// Handle notification click
export const handleNotificationClick = (notification: any) => {
    if (notification.data?.link) {
        window.open(notification.data.link, '_blank');
    }
};

// Export the Firebase app instance
export { app, messaging, db, remoteConfig }; 