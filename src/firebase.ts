import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyA_5eAWAjmjcUA0bijw4GIYQr8WgMiCVx4",
  authDomain: "grok-project-72.firebaseapp.com",
  projectId: "grok-project-72",
  storageBucket: "grok-project-72.firebasestorage.app",
  messagingSenderId: "748714350384",
  appId: "1:748714350384:web:98d0a8a5e9da58174adaf5"
};

// Initialize Firebase
console.log('Firebase: Initializing app with config', {
  apiKey: firebaseConfig.apiKey ? '***' : 'missing',
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId ? '***' : 'missing'
});
const app = initializeApp(firebaseConfig);
console.log('Firebase: App initialized successfully');

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

console.log('Firebase: All services initialized');